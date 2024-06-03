# 日志和索引相关问题

## 两阶段提交的不同瞬间，MySQL 如果发生异常重启，是怎么保证数据完整性的？

![image](/pictures/mysql/chap13/1.png)

- 如果图中 A 时刻的地方（写入 redo log 处于 prepare 阶段之后、写 binlog 之前），发生了崩溃（crash），由于此时 binlog 还没写，redo log 也还没提交，所以崩溃恢复的时候，这个**事务会回滚**。
- 如果时刻 B（ binlog 写完，redo log 还没 commit 前）发生 crash，MySQL 的处理：
  1. 如果 redo log 里面的事务是完整的，也就是已经有了 commit 标识，则直接提交；
  2. 如果 redo log 里面的事务只有完整的 prepare，则判断对应的事务 binlog 是否存在并完整：
     a. 如果是，则提交事务；
     b. 否则，回滚事务。

### MySQL 如何知道 binlog 是完整的

一个事务的 binlog 是有完整格式的：

- statement 格式的 binlog，最后会有 COMMIT；
- row 格式的 binlog，最后会有一个 XID event。
- 另外，在 MySQL 5.6.2 版本以后，还引入了 binlog-checksum 参数，用来验证 binlog 内容的正确性。
- 对于 binlog 日志由于磁盘原因，可能会在日志中间出错的情况，MySQL 可以通过校验 checksum 的结果来发现。

### redo log 和 binlog 是怎么关联起来的?

它们有一个共同的数据字段，叫 XID。崩溃恢复的时候，会按顺序扫描 redo log：

- 如果碰到既有 prepare、又有 commit 的 redo log，就直接提交；
- 如果碰到只有 parepare、而没有 commit 的 redo log，就拿着 XID 去 binlog 找对应的事务。

### 处于 prepare 阶段的 redo log 加上完整 binlog，重启就能恢复，MySQL 为什么要这么设计?

在时刻 B，也就是 binlog 写完以后 MySQL 发生崩溃，这时候 binlog 已经写入了，之后就会被从库（或者用这个 binlog 恢复出来的库）使用。所以，在主库上也要提交这个事务。采用这个策略，主库和备库的数据就保证了一致性。

### 如果这样的话，为什么还要两阶段提交呢？干脆先 redo log 写完，再写 binlog。崩溃恢复的时候，必须得两个日志都完整才可以。是不是一样的逻辑？

- 对于 InnoDB 引擎来说，如果 redo log 提交完成了，事务就不能回滚（如果这还允许回滚，就可能覆盖掉别的事务的更新）。
- 如果 redo log 直接提交，然后 binlog 写入的时候失败，InnoDB 又回滚不了，数据和 binlog 日志又不一致了。
- 两阶段提交就是**为了给所有人一个机会，当每个人都说“我 ok”的时候，再一起提交**。

### 只用 binlog 来支持崩溃恢复，又能支持归档，是否可行？

binlog 不支持崩溃恢复。如下是只用 binlog 来实现崩溃恢复的示意图：

![image](/pictures/mysql/chap13/2.png)

在图中 crash 的位置，即 binlog2 写完了，但是整个事务还没有 commit 的时候，MySQL 发生了 crash。

- 重启后，引擎内部事务 2 会回滚，然后应用 binlog2 可以补回来；
- 但是对于事务 1 来说，系统已经认为提交完成了，不会再应用一次 binlog1。
- 由于 InnoDB 引擎使用的是 WAL 技术，要依赖于日志来恢复数据页。因此，事务 1 也是可能丢失了的，而且是数据页级的丢失。此时，binlog 里面并没有记录数据页的更新细节，是补不回来的。

### 若只用 redo log，不要 binlog?

binlog 有 redo log 无法替代的功能

- 归档：redo log 是循环写，**写到末尾是要回到开头继续写的**。这样历史日志没法保留，redo log 也就起不到归档的作用。
- MySQL 系统依赖于 binlog：binlog 作为 MySQL 一开始就有的功能，被用在了很多地方。其中，MySQL 系统高可用的基础，就是 binlog 复制。

### 正常运行中的实例，数据写入后的最终落盘，是从 redo log 更新过来的还是从 buffer pool 更新过来的呢？

实际上，redo log 并没有记录数据页的完整数据，所以它并没有能力自己去更新磁盘数据页，也就不存在“数据最终落盘，是由 redo log 更新过去”的情况。

- 如果是正常运行的实例的话，数据页被修改以后，跟磁盘的数据页不一致，称为脏页。最终数据落盘，就是把内存中的数据页写盘。这个过程，甚至与 redo log 毫无关系。
- 在崩溃恢复场景中，InnoDB 如果判断到一个数据页可能在崩溃恢复的时候丢失了更新，就会将它读到内存，然后让 redo log 更新内存内容。更新完成后，内存页变成脏页，就回到了第一种情况的状态。

### redo log buffer 是什么？是先修改内存，还是先写 redo log 文件？

redo log buffer 是在内存中，用于先存放 redo 日志的。

- 真正把日志写到 redo log 文件（文件名是 ib_logfile+ 数字），是在**执行 commit 语句**的时候做的。
- 单独执行一个更新语句的时候，InnoDB 会自己启动一个事务，在语句执行完成的时候提交。

## 业务设计问题

有关索引的业务：（问题：并发场景下，同时有两个人，设置为关注对方，就可能导致无法成功加为朋友关系。）

![image](/pictures/mysql/chap13/3.png)

- 由于一开始 A 和 B 之间没有关注关系，所以两个事务里面的 select 语句查出来的结果都是空。
- 因此，session 1 的逻辑就是“既然 B 没有关注 A，那就只插入一个单向关注关系”。session 2 也同样是这个逻辑。所以出现 bug

### 解决方案

首先给“like”表增加一个字段，比如叫作 relation_ship，并设为整型，取值 1、2、3。 - 值是 1 的时候，表示 user_id 关注 liker_id; - 值是 2 的时候，表示 liker_id 关注 user_id; - 值是 3 的时候，表示互相关注。

当 A 关注 B 时，逻辑为：

1. 比较 A 和 B 的大小，如果 A < B，则执行：

```sql
mysql> begin; /* 启动事务 */
insert into `like`(user_id, liker_id, relation_ship) values(A, B, 1) on duplicate key update relation_ship=relation_ship | 1;
select relation_ship from `like` where user_id=A and liker_id=B;
/* 代码中判断返回的 relation_ship，
  如果是 1，事务结束，执行 commit
  如果是 3，则执行下面这两个语句：
  */
insert ignore into friend(friend_1_id, friend_2_id) values(A,B);
commit;
```

2. 如果 A>B，则执行:

```sql
mysql> begin; /* 启动事务 */
insert into `like`(user_id, liker_id, relation_ship) values(B, A, 2) on duplicate key update relation_ship=relation_ship | 2;
select relation_ship from `like` where user_id=B and liker_id=A;
/* 代码中判断返回的 relation_ship，
  如果是 2，事务结束，执行 commit
  如果是 3，则执行下面这两个语句：
*/
insert ignore into friend(friend_1_id, friend_2_id) values(B,A);
commit;
```

这样的设计中，like”表里的数据保证 user_id < liker_id，这样不论是 A 关注 B，还是 B 关注 A，在操作“like”表的时候，<mark>如果反向的关系已经存在，就会出现行锁冲突。</mark>

- insert … on duplicate 语句: 确保了在事务内部，执行了这个 SQL 语句后，就强行占住了这个行锁，之后的 select 判断 relation_ship 这个逻辑时就确保了是在行锁保护下的读操作。
- 操作符 “|” 是按位或，连同最后一句 insert 语句里的 ignore，是为了保证重复调用时的幂等性。
