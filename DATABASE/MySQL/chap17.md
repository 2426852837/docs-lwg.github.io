# 为什么 SQL 语句逻辑相同，但性能却差异巨大？

## 案例一：条件字段函数操作

假设需维护一个交易系统，其中交易记录表 tradelog 包含交易流水号（tradeid）、交易员 id（operator）、交易时间（t_modified）等字段。建表语句如下所示：

```sql
mysql> CREATE TABLE `tradelog` (
 `id` int(11) NOT NULL,
 `tradeid` varchar(32) DEFAULT NULL,
 `operator` int(11) DEFAULT NULL,
 `t_modified` datetime DEFAULT NULL,
 PRIMARY KEY (`id`),
 KEY `tradeid` (`tradeid`),
 KEY `t_modified` (`t_modified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

假设需统计所有年份中 7 月份的交易记录总数，相应的 SQL 语句如下：

```sql
mysql> select count(*) from tradelog where month(t_modified)=7;
```

而这行语句执行时执行时间很长，因为对字段做了函数计算，就用不上索引。

`t_modified` 对应的索引示意图如下所示，方框上面的数字就是 `month()` 函数对应的值。

![image](/pictures/mysql/chap17/1.png)

若 SQL 语句使用的条件为 `where t_modified='2018-7-1’`，引擎会按照图中绿色箭头的路线，快速定位到` t_modified='2018-7-1’` 需要的结果。

- 实际上，B+ 树提供的这个快速定位能力，来源于同一层兄弟节点的有序性。
- 但如果计算 month()函数时，<mark>即对索引字段做函数操作，可能会破坏索引值的有序性，因此优化器就决定放弃走树搜索功能。</mark>

而实际上，这条 SQL 语句在执行时，优化器虽然放弃了树搜索功能，但可以选择遍历主键索引或索引 t_modified，而在对比索引大小后发现索引 t_modified 更小，遍历这个索引比遍历主键索引来得更快。因此优化器最终还是会选择索引 t_modified。

explain 命令的结果如下所示：

![image](/pictures/mysql/chap17/2.png)

- key="t_modified"表示的是，使用了 t_modified 这个索引
- rows=100335，说明这条语句扫描了整个索引的所有值
- Extra 字段的 Using index，表示的是使用了覆盖索引。

因此，为了能够用上索引的快速定位能力，需要将 SQL 语句拆分为基于字段本身的范围查询，相应的 SQL 语句如下所示：

```sql
mysql> select count(*) from tradelog where
 -> (t_modified >= '2016-7-1' and t_modified<'2016-8-1') or
 -> (t_modified >= '2017-7-1' and t_modified<'2017-8-1') or
 -> (t_modified >= '2018-7-1' and t_modified<'2018-8-1');
```

## 案例二：隐式类型转换

示例 SQL 语句如下：

```sql
mysql> select * from tradelog where tradeid=110717;
```

出现的问题：

- 交易编号 tradeid 这个字段上，本来就有索引，但是 explain 的结果却显示，这条语句需要走全表扫描；
- tradeid 的字段类型是 varchar(32)，而输入的参数却是整型，所以需要做类型转换

对于 MySQL 来说，<mark>字符串和数字进行比较，会将字符串转换为数字</mark>

对于示例 SQL 语句来说，对于优化器来说实际上相当于：

```sql
mysql> select * from tradelog where CAST(tradid AS signed int) = 110717;
```

那么该语句触发了案例一的结论：**对索引字段做函数操作，优化器会放弃走树搜索功能**。

## 案例三：隐式字符编码转换

假设系统里还有另外一个表 trade_detail，用于记录交易的操作细节。建表操作和添加数据操作相应的 SQL 语句如下所示：

```sql
mysql> CREATE TABLE `trade_detail` (
 `id` int(11) NOT NULL,
 `tradeid` varchar(32) DEFAULT NULL,
 `trade_step` int(11) DEFAULT NULL, /*操作步骤*/
 `step_info` varchar(32) DEFAULT NULL, /*步骤信息*/
 PRIMARY KEY (`id`),
 KEY `tradeid` (`tradeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
insert into tradelog values(1, 'aaaaaaaa', 1000, now());
insert into tradelog values(2, 'aaaaaaab', 1000, now());
insert into tradelog values(3, 'aaaaaaac', 1000, now());
insert into trade_detail values(1, 'aaaaaaaa', 1, 'add');
insert into trade_detail values(2, 'aaaaaaaa', 2, 'update');
insert into trade_detail values(3, 'aaaaaaaa', 3, 'commit');
insert into trade_detail values(4, 'aaaaaaab', 1, 'add');
insert into trade_detail values(5, 'aaaaaaab', 2, 'update');
insert into trade_detail values(6, 'aaaaaaab', 3, 'update again');
insert into trade_detail values(7, 'aaaaaaab', 4, 'commit');
insert into trade_detail values(8, 'aaaaaaac', 1, 'add');
insert into trade_detail values(9, 'aaaaaaac', 2, 'update');
insert into trade_detail values(10, 'aaaaaaac', 3, 'update again');
insert into trade_detail values(11, 'aaaaaaac', 4, 'commit');
```

如果要查询 id=2 的交易的所有操作步骤信息，SQL 语句可以这么写：

```sql
mysql> select d.* from tradelog l, trade_detail d where d.tradeid=l.tradeid and l.id=2; /*语句Q1*/
```

- 优化器会先在交易记录表 tradelog 上查到 id=2 的行，这个步骤用上了主键索引，rows=1 表示只扫描一行；
- `key=NULL`，表示没有用上交易详情表 trade_detail 上的 tradeid 索引，进行了全表扫描。

该语句中，从 tradelog 表中取 tradeid 字段，再去 trade_detail 表里查询匹配字段。因此，我们把 tradelog 称为**驱动表**，把 trade_detail 称为**被驱动表**，把 tradeid 称为关联字段。相应的执行流程如下所示：

![image](/pictures/mysql/chap17/3.png)

1. 根据 id 在 tradelog 表里找到 L2 这一行；
2. 从 L2 中取出 tradeid 字段的值；
3. 根据 tradeid 值到 trade_detail 表中查找条件匹配的行。该过程是通过遍历主键索引的方式，一个一个地判断 tradeid 的值是否匹配。（无法使用 tradeid 索引）

### 无法使用 tradeid 索引的原因

- 首先两个表的字符集不同，一个是 utf8，一个是 utf8mb4。（主要原因）

- 如果将第三步进行更改，相应的 SQL 语句为：

```sql
mysql> select * from trade_detail where tradeid=$L2.tradeid.value;
```

- 此时，两个类型的字符串由于字符集不同，MySQL 内部需要进行隐式字符编码转换，将 utf8 转换为 utf8mb4（字符集 utf8mb4 是 utf8 的超集），等同于：

```sql
select * from trade_detail where CONVERT(traideid USING utf8mb4)=$L2.tradeid.value;
```

- 因此，触发了原则：用 CONVERT 函数来对索引字段进行操作，**优化器会放弃走树搜索功能**。

因此，<mark>连接过程中要求在被驱动表的索引字段上加函数操作，是直接导致对被驱动表做全表扫描的原因。</mark>

### 优化

“查找 trade_detail 表里 id=4 的操作，对应的操作者是谁” 对应的 SQL 语句：

```sql
mysql>select l.operator from tradelog l , trade_detail d where d.tradeid=l.tradeid and d.id=4;
```

![image](/pictures/mysql/chap17/4.png)

从执行结果看，trade_detail 表成了驱动表，但是 explain 结果的第二行显示，这次的查询操作用上了被驱动表 tradelog 里的索引 (tradeid)，扫描行数是 1。

- 假设驱动表 trade_detail 里 id=4 的行记为 R4，那么在连接时，被驱动表 tradelog 上执行的就是类似这样的 SQL 语句：

```sql
select operator from tradelog where traideid =$R4.tradeid.value;
```

- 此时，$R4.tradeid.value 的字符集为 utf8，需要进行转换，因此该过程相当于：

```sql
select operator from tradelog where traideid =CONVERT($R4.tradeid.value USING utf8mb4);
```

- 由于 CONVERT 函数时作用于输入参数，所以可以使用被驱动表的 traideid 索引。

因此，通常有两种优化方式：

1. 比较常见的优化方法是，把 trade_detail 表上的 tradeid 字段的字符集也改成 utf8mb4，这样就没有字符集转换的问题了
2. 如果能够修改字段的字符集的话，是最好不过了。但如果数据量比较大， 或者业务上暂时不能做这个 DDL 的话，那就只能采用修改 SQL 语句的方法：

```sql
mysql> select d.* from tradelog l , trade_detail d where d.tradeid=CONVERT(l.tradeid USING utf8) and l.id=2;
```
