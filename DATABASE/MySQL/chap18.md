# 为什么查询一行的语句，执行也会很慢

举例说明：表 t 有两个字段`id`和`c`，相应的 SQL 语句如下所示：

```sql
mysql> CREATE TABLE `t` (
 `id` int(11) NOT NULL,
 `c` int(11) DEFAULT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB;
// 插入语句
delimiter ;;
create procedure idata()
begin
 declare i int;
 set i=1;
 while(i<=100000) do
 insert into t values(i,i);
 set i=i+1;
 end while;
end;;
delimiter ;
call idata();
```

## 查询长时间不返回

这种情况下，首先执行 show processlist 命令，看看当前语句处于什么状态。

### 等 MDL 锁

![image](/pictures/mysql/chap18/1.png)

以上是 show processlist 命令查看 Waiting for table metadata lock 的示意图。

此时表示：**现在有一个线程正在表 t 上请求或者持有 MDL 写锁，把 select 语句堵住了**。

处理方式：找到哪个线程持有 MDL 写锁，并将其 kill。

可通过查询`sys.schema_table_lock_waits` 这张表， 可以直接找出造成阻塞的 process id，把这个连接用 kill 命令断开即可：

![image](/pictures/mysql/chap18/2.png)

### 等 flush

当线程出现 Waiting for table flush，表示现在有一个线程正要对表 t 做 flush 操作。

对于 MySQL 来说，对表进行 flush 操作的用法 有两种：

```sql
flush tables t with read lock;

flush tables with read lock;
```

如果指定表 t 的话，代表的是只关闭表 t；如果没有指定具体的表名，则表示关闭 MySQL 里所有打开的表。（这两个语句执行很快，除非被其他线程阻塞了）

因此，出现这种情况的原因是：有一个 flush tables 命令被别的语句堵住了，然后它又堵住了我们的 select 语句。示意图如下所示：

![image](/pictures/mysql/chap18/3.png)

### 等行锁

执行如下语句：

```sql
mysql> select * from t where id=1 lock in share mode;
```

由于访问 id=1 这个记录时要加读锁，如果这时候已经有一个事务在这行记录上持有一个写锁，select 语句就会被堵住。

这种情况的复现步骤如下：

![image](/pictures/mysql/chap18/4.png)

因此，需要查找出哪个线程占有写锁，以下是通过 sys.innodb_lock_waits 表查询的结果：

![image](/pictures/mysql/chap18/5.png)

因此，可以看出是 4 号线程占有写锁，因此需要 KILL 4。

- `KILL QUERY 4` 表示停止 4 号线程当前正在执行的语句，而这个方法其实是没有用的。因为占有行锁的是 update 语句，这个语句已经是之前执行完成了的，现在执行 KILL QUERY，无法让这个事务去掉 id=1 上的行锁。
- `KILL 4` 才有效，也就是说直接断开这个连接。隐含的逻辑是：连接被断开的时候，会自动回滚这个连接里面正在执行的线程，也就释放了 id=1 上的行锁。

## 查询慢

### 字段无索引

执行以下 SQL 语句时：

```sql
mysql> select * from t where c=50000 limit 1;
```

由于字段 c 上没有索引，这个语句只能走 id 主键顺序扫描，因此需要扫描 5 万行。

### 一致性读和当前读

分别执行如下 SQL 语句时：

```sql
mysql> select * from t where id=1；

mysql>select * from t where id=1 lock in share mode
```

- 第一个语句虽然只扫描了 1 行，但其执行时间长达 800 ms
- 第二个同样扫描了 1 行，但执行时间是 0.2 ms

相应的复现步骤如下所示：

![image](/pictures/mysql/chap18/6.png)

相应地，session B 执行完 100 万次 update 语句后，查询 id=1 这一行处于什么状态：

![image](/pictures/mysql/chap18/7.png)

- session B 更新完 100 万次，生成了 100 万个回滚日志 (undo log)。
- 带 lock in share mode 的 SQL 语句，是<mark>当前读</mark>，因此会直接读到 1000001 这个结果，所以速度很快
- select \* from t where id=1 这个语句，是<mark>一致性读</mark>，因此需要从 1000001 开始，依次执行 undo log，执行了 100 万次以后，才将 1 这个结果返回。
