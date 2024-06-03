# 如何正确显示随机消息

示例：英语学习 App 首页有一个随机显示单词的功能，从单词表中随机选出三个单词。那么相应的建表语句和初始数据如下所示：

```sql
mysql> CREATE TABLE `words` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `word` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
delimiter ;;
create procedure idata()
begin
  declare i int;
  set i=0;
  while i<10000 do
    insert into words(word) values(concat(char(97+(i div 1000)), char(97+(i % 1000 div 100)), char(97+(i % 100 div 10)), char(97+(i % 10))));
    set i=i+1;
  end while;
end;;
delimiter ;
call idata();
```

## 内存临时表

采用`order by rand() `实现随机选取的逻辑：

```sql
mysql> select word from words order by rand() limit 3;
```

explain 命令下该语句的执行情况如下所示：

![image](/pictures/mysql/chap16/1.png)

- Extra 字段显示 Using temporary，表示的是需要使用临时表;
- Using filesort，表示的是需要执行排序操作

那么这种情况下，会采用全字段排序或者 rowid 排序。

- 对于 InnoDB 表来说，执行全字段排序会减少磁盘访问，因此会被优先选择。
- 对于内存表，回表过程只是简单地根据数据行的位置，直接访问内存得到数据，根本不会导致多访问磁盘。因此，优化器会优先考虑用于排序的行越少越好，选择 rowid 排序

因此，该语句的执行流程如下：

1. 创建一个临时表。这个临时表使用的是 memory 引擎，表里有两个字段，第一个字段是 double 类型，为了后面描述方便，记为字段 R，第二个字段是 varchar(64) 类型，记为字段 W。并且，这个表没有建索引。
2. 从 words 表中，<mark>按主键顺序取出所有的 word 值</mark>。对于每一个 word 值，调用 rand() 函数生成一个大于 0 小于 1 的随机小数，并把这个随机小数和 word 分别存入临时表的 R 和 W 字段中，到此，**扫描行数是 10000**。
3. 现在临时表有 10000 行数据了，接下来你要在这个没有索引的内存临时表上，按照字段 R 排序。
4. 初始化 sort_buffer，包含两个字段，一个是 double 类型，另一个是整型。
5. 从内存临时表中一行一行地取出 R 值和位置信息，并分别存入 sort_buffer 中的两个字段里。这个过程要对内存临时表做全表扫描，**此时扫描行数增加 10000，变成了 20000**。
6. 在 sort_buffer 中根据 R 的值进行排序。（不会增加扫描行数）
7. 排序完成后，取出前三个结果的位置信息，依次到内存临时表中取出 word 值，返回给客户端。(访问了表的三行数据，总扫描行变为 20003)

对应的排序流程图如下所示：

![image](/pictures/mysql/chap16/2.png)

图中的 pos 为位置信息，用来定位”一行数据“。

实际上，rowid 表示的是每个引擎用来唯一标识数据行的信息。

- 对于有主键的 InnoDB 表来说，这个 rowid 就是主键 ID；
- 对于没有主键的 InnoDB 表来说，这个 rowid 就是由系统生成的；
- MEMORY 引擎不是索引组织表。在这个例子里面，你可以认为它就是一个数组,因此，这个 rowid 其实就是数组的下标。

## 磁盘临时表

- `tmp_table_size` 这个配置限制了内存临时表的大小，默认值是 16M。如果临时表大小超过了 tmp_table_size，那么内存临时表就会转成磁盘临时表。
- 磁盘临时表使用的引擎默认是 InnoDB，是由参数 `internal_tmp_disk_storage_engine` 控制的
- 当使用磁盘临时表时，对应一个没有显式索引的 InnoDB 表的排序过程

执行如下语句来查看`OPTIMIZER_TRACE`结果:

```sql
set tmp_table_size=1024;
set sort_buffer_size=32768;
set max_length_for_sort_data=16;
/* 打开 optimizer_trace，只对本线程有效 */
SET optimizer_trace='enabled=on';
/* 执行语句 */
select word from words order by rand() limit 3;
/* 查看 OPTIMIZER_TRACE 输出 */
SELECT * FROM `information_schema`.`OPTIMIZER_TRACE`\G
```

![image](/pictures/mysql/chap16/3.png)

- `max_length_for_sort_data`设置成 16，小于 word 字段的长度定义，所以`sort_mode` 里面显示的是 rowid 排序，且参与排序的是随机值 R 字段和 rowid 字段组成的行。
- 该 SQL 语句的排序没有用到临时文件，因为采用了优先队列排序算法，而不是归并排序算法。

没有采用归并排序算法的原因：因为采用该算法，会将所有 10000 行数据都进行排序，而最终只要求取三个值，剩下的数据不要求是否有序，因此会浪费计算资源。

优先队列算法的执行流程如下：

1. 对于这 10000 个准备排序的 `(R,rowid)`，先取前三行，构造成一个**堆**(最大堆)；
2. 取下一个行 `(R’,rowid’)`，跟当前堆里面最大的 R 比较，如果 R’小于 R，把这个 (R,rowid) 从堆中去掉，换成 (R’,rowid’)；
3. 重复第 2 步，直到第 10000 个 (R’,rowid’) 完成比较。

相应的示意图如下所示：

![image](/pictures/mysql/chap16/4.png)

- 整个排序过程中，为了最快地拿到当前堆的最大值，总是保持最大值在堆顶，因此这是一个**最大堆**。
- `OPTIMIZER_TRACE` 结果中，`filesort_priority_queue_optimization` 这个部分的 `chosen=true`，就表示使用了优先队列排序算法，这个过程不需要临时文件，因此对应的 `number_of_tmp_files` 是 0。

总的来说，<mark>不论是使用哪种类型的临时表，order by rand() 这种写法都会让计算过程非常复杂，需要大量的扫描行数，因此排序过程的资源消耗也会很大。</mark>

## 随机排序方法

为了得到严格随机的结果，可采取如下方法：

1. 取得整个表的行数，并记为 C。
2. 取得 `Y = floor(C * rand())`。 floor 函数在这里的作用，就是取整数部分。
3. 再用 `limit Y,1` 取得一行。

对应的 SQL 语句为：

```sql
mysql> select count(*) into @C from t;
set @Y = floor(@C * rand());
set @sql = concat("select * from t limit ", @Y, ",1");
prepare stmt from @sql;
execute stmt;
DEALLOCATE prepare stmt;
```

MySQL 处理 limit Y,1 的做法就是按顺序一个一个地读出来，丢掉前 Y 个，然后把下一个记录作为返回结果，因此这一步需要扫描 Y+1 行。再加上，第一步扫描的 C 行，总共需要扫描 C+Y+1 行，执行代价比随机算法 1 的代价要高。

因此，随机取三个 word 值得流程如下：

1. 取得整个表的行数，并记为 C。
2. 根据相同的随机方法得到 Y1、Y2、Y3；
3. 再执行三个 limit Y, 1 语句得到三行数据。

对应的 SQL 语句为：

```sql
mysql> select count(*) into @C from t;
set @Y1 = floor(@C * rand());
set @Y2 = floor(@C * rand());
set @Y3 = floor(@C * rand());
select * from t limit @Y1，1； // 在应用代码里面取 Y1、Y2、Y3 值，拼出 SQL 后执行
select * from t limit @Y2，1；
select * from t limit @Y3，1；
```
