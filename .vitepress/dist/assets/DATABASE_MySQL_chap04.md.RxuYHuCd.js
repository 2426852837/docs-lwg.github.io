import{_ as a,c as e,o as r,a1 as t}from"./chunks/framework.C70_P7hw.js";const n=""+new URL("image.Byuw52R8.png",import.meta.url).href,o=""+new URL("image1.DaO-OQFg.png",import.meta.url).href,p=""+new URL("image2.CGguV9Fm.png",import.meta.url).href,l=""+new URL("image3.BVi7kTBu.png",import.meta.url).href,i=""+new URL("image4.BdItdCR3.png",import.meta.url).href,b=JSON.parse('{"title":"索引","description":"","frontmatter":{},"headers":[],"relativePath":"DATABASE/MySQL/chap04.md","filePath":"DATABASE/MySQL/chap04.md"}'),s={name:"DATABASE/MySQL/chap04.md"},g=t('<h1 id="索引" tabindex="-1">索引 <a class="header-anchor" href="#索引" aria-label="Permalink to &quot;索引&quot;">​</a></h1><p>索引的出现其实就是为了提高数据查询的效率，就像书的目录一样</p><h2 id="索引的常见模型" tabindex="-1">索引的常见模型 <a class="header-anchor" href="#索引的常见模型" aria-label="Permalink to &quot;索引的常见模型&quot;">​</a></h2><p>三种常见、简单的数据结构：哈希表、有序数组和搜索树</p><h3 id="哈希表" tabindex="-1">哈希表 <a class="header-anchor" href="#哈希表" aria-label="Permalink to &quot;哈希表&quot;">​</a></h3><p>一种以键-值（key-value）存储数据的结构，我们只要输入待查找的值即key，就可以找到其对应的值即Value。对于冲突的情况，采用拉链法来处理。</p><p><img src="'+n+'" alt="image.png"></p><p><strong>优点</strong>：增加新记录时速度快，只需要往后追加</p><p><strong>缺点</strong>：因为不是有序的，所以哈希索引做区间查询的速度是很慢的</p><p><strong>适用场景</strong>：适用于只有等值查询的场景</p><h2 id="有序数组" tabindex="-1">有序数组 <a class="header-anchor" href="#有序数组" aria-label="Permalink to &quot;有序数组&quot;">​</a></h2><p>在等值查询和范围查询场景中的性能非常优秀。</p><p>缺点：在需要更新数据的时候，往中间插入一个记录就必须得挪动后面所有的记录，<strong>成本太高</strong></p><p><strong>适用场景</strong>：只适用于静态存储引擎</p><h2 id="二叉搜索树" tabindex="-1">二叉搜索树 <a class="header-anchor" href="#二叉搜索树" aria-label="Permalink to &quot;二叉搜索树&quot;">​</a></h2><p>为了维持O(log(N))的查询复杂度，你就需要保持这棵树是平衡二叉树。为了做这个保证，更新的时间复杂度也是O(log(N))。</p><ul><li><p>二叉树是搜索效率最高的，但是实际上大多数的数据库存储却并不使用二叉树。其原因是，索引不止存在内存中，还要写到磁盘上</p></li><li><p>为了让一个查询尽可能少地读磁盘，就需要让查询过程访问尽量少的数据块——使用“N叉”树，“N”取决于数据块的大小</p></li><li><p>以<strong>InnoDB的一个整数字段索引</strong>为例，这个N差不多是1200。这棵树高是4的时候，就可以存1200的3次方个值，这已经17亿了。考虑到树根的数据块总是在内存中的，一个10亿行的表上一个整数字段的索引，查找一个值最多只需要访问3次磁盘。其实，树的第二层也有很大概率在内存中，那么访问磁盘的平均次数就更少了。</p></li></ul><h2 id="innodb的索引模型" tabindex="-1">InnoDB的索引模型 <a class="header-anchor" href="#innodb的索引模型" aria-label="Permalink to &quot;InnoDB的索引模型&quot;">​</a></h2><p>在InnoDB中，表都是根据主键顺序以索引的形式存放的，这种存储方式的表称为<strong>索引组织表</strong>。数据都是存储在B+树中。</p><ul><li>每一个索引在InnoDB里对应一颗B+树</li></ul><p><strong>举例说明：有一个主键列为ID的表，表中有字段k，并且在k上有索引。</strong></p><p><img src="'+o+'" alt="image.png"></p><p>根据叶子节点的内容，索引类型分为<strong>主键索引和非主键索引</strong></p><ul><li><p>主键索引的叶子节点存的是<strong>整行数据</strong>。在InnoDB里，主键索引也被称为<strong>聚簇索引</strong>（clustered index）</p></li><li><p>非主键索引的叶子节点内容是主键的值。在InnoDB里，非主键索引也被称为<strong>二级索引</strong>（secondary index）</p></li></ul><p><strong>基于主键索引和普通索引的查询有什么区别？</strong></p><ul><li><p>如果语句是select * from T where ID=500，即主键查询方式，则只需要搜索ID这棵B+树；</p></li><li><p>如果语句是select * from T where k=5，即普通索引查询方式，则需要先搜索k索引树，得到ID的值为500，再到ID索引树搜索一次。这个过程称为回表。</p></li></ul><h2 id="索引维护" tabindex="-1">索引维护 <a class="header-anchor" href="#索引维护" aria-label="Permalink to &quot;索引维护&quot;">​</a></h2><p><strong>动机</strong>：</p><ul><li><p>如果新插入的ID值为400，就相对麻烦了，需要逻辑上挪动后面的数据，空出位置</p></li><li><p>如果R5所在的数据页已经满了，根据B+树的算法，这时候需要申请一个新的数据页，然后挪动部分数据过去。这个过程称为页分裂：除了性能外，页分裂操作还影响数据页的利用率。原本放在一个页的数据，现在分到两个页中，整体空间利用率降低大约50%。</p></li><li><p>当相邻两个页由于删除了数据，利用率很低之后，会将数据页做合并。合并的过程，可以认为是分裂过程的逆过程。</p></li></ul><p><strong>索引维护过程：</strong></p><ul><li><p>自增主键是指自增列上定义的主键，在建表语句中一般是这么定义的： NOT NULL PRIMARY KEY AUTO_INCREMENT</p></li><li><p>插入新记录的时候可以不指定ID的值，系统会获取当前ID最大值加1作为下一条记录的ID值</p></li><li><p>有业务逻辑的字段做主键，则往往不容易保证有序插入，这样写数据成本相对较高</p></li><li><p><strong>显然，主键长度越小，普通索引的叶子节点就越小，普通索引占用的空间也就越小</strong></p></li></ul><p><strong>什么场景适合用业务字段直接做主键的?</strong></p><ul><li><p>只有一个索引</p></li><li><p>该索引必须是唯一索引</p></li></ul><h2 id="覆盖索引" tabindex="-1">覆盖索引 <a class="header-anchor" href="#覆盖索引" aria-label="Permalink to &quot;覆盖索引&quot;">​</a></h2><p><strong>回表</strong>：回到主键索引树搜索的过程</p><p>如何避免回表过程？</p><p>如果执行的语句是select ID from T where k between 3 and 5，这时只需要查ID的值，而ID的值已经在k索引树上了，因此可以直接提供查询结果，不需要回表。也就是说，在这个查询里面，索引k已经“覆盖了”我们的查询需求，我们称为覆盖索引</p><ul><li><p><strong>由于覆盖索引可以减少树的搜索次数，显著提升查询性能，所以使用覆盖索引是一个常用的性能优化手段</strong></p></li><li><p>在示例中，引擎内部使用覆盖索引在索引k上其实读了三个记录，R3~R5（对应的索引k上的记录项），但是对于MySQL的Server层来说，它就是找引擎拿到了两条记录，因此<strong>MySQL认为扫描行数是2</strong></p></li></ul><h2 id="最左前缀原则" tabindex="-1">最左前缀原则 <a class="header-anchor" href="#最左前缀原则" aria-label="Permalink to &quot;最左前缀原则&quot;">​</a></h2><p>动机：为每一个查询来设计一个索引会造成资源的浪费</p><p><strong>B+树这种索引结构，可以利用索引的“最左前缀”，来定位记录</strong></p><p>举例说明：</p><p><img src="'+p+'" alt="image.png"></p><p>对于以上的联合索引，索引项是按照索引定义里面出现的字段顺序排序的</p><p>如果你要查的是所有名字第一个字是“张”的人，你的SQL语句的条件是&quot;where name like ‘张%’&quot;。这时，你也能够用上这个索引，查找到第一个符合条件的记录是ID3，然后向后遍历，直到不满足条件为止</p><ul><li><p>只要满足最左前缀，就可以利用索引来加速检索</p></li><li><p>这个最左前缀可以是联合索引的最左N个字段，也可以是字符串索引的最左M个字符</p></li></ul><h3 id="在建立联合索引的时候-如何安排索引内的字段顺序-索引的复用能力" tabindex="-1"><strong>在建立联合索引的时候，如何安排索引内的字段顺序（<strong>索引的复用能力</strong>）</strong> <a class="header-anchor" href="#在建立联合索引的时候-如何安排索引内的字段顺序-索引的复用能力" aria-label="Permalink to &quot;**在建立联合索引的时候，如何安排索引内的字段顺序（**索引的复用能力**）**&quot;">​</a></h3><ul><li><p>第一原则是，如果通过调整顺序，可以少维护一个索引，那么这个顺序往往就是需要优先考虑采用的</p></li><li><p>如果既有联合查询，又有基于a、b各自的查询，需考虑空间大小的问题。例如，在市民表中，name字段是比age字段大的 ，所以创建一个（name,age)的联合索引和一个(age)的单字段索引</p></li></ul><h2 id="索引下推" tabindex="-1">索引下推 <a class="header-anchor" href="#索引下推" aria-label="Permalink to &quot;索引下推&quot;">​</a></h2><p>动机：最左前缀可以用于在索引中定位记录，但对于不符合其规则的部分，需要回表才能找出相应的数据行。</p><p><strong>MySQL 5.6 引入的索引下推优化</strong>（index condition pushdown)， 可以在索引遍历过程中，对索引中包含的字段先做判断，直接过滤掉不满足条件的记录，减少回表次数。</p><p><strong>无索引下推的执行流程</strong>：</p><p><img src="'+l+'" alt="image.png"></p><p>InnoDB只是按顺序把“name第一个字是’张’”的记录一条条取出来回表。因此，需要回表4次。</p><p><strong>索引下推的执行流程</strong>：</p><p><img src="'+i+'" alt="image.png"></p><p>InnoDB在(name,age)索引内部就判断了age是否等于10，对于不等于10的记录，直接判断并跳过。因此，只需要对ID4、ID5这两条记录回表取数据判断，就只需要回表2次。</p>',57),h=[g];function c(u,m,d,_,D,I){return r(),e("div",null,h)}const k=a(s,[["render",c]]);export{b as __pageData,k as default};
