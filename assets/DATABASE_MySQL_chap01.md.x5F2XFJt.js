import{_ as a,c as e,o as t,a1 as r}from"./chunks/framework.DCKU21so.js";const o="/assets/chap1_1.BVu4zhle.png",y=JSON.parse('{"title":"MySQL基础架构","description":"","frontmatter":{},"headers":[],"relativePath":"DATABASE/MySQL/chap01.md","filePath":"DATABASE/MySQL/chap01.md"}'),n={name:"DATABASE/MySQL/chap01.md"},p=r('<h1 id="mysql基础架构" tabindex="-1">MySQL基础架构 <a class="header-anchor" href="#mysql基础架构" aria-label="Permalink to &quot;MySQL基础架构&quot;">​</a></h1><h2 id="mysql逻辑架构图" tabindex="-1">MySQL逻辑架构图 <a class="header-anchor" href="#mysql逻辑架构图" aria-label="Permalink to &quot;MySQL逻辑架构图&quot;">​</a></h2><p><img src="'+o+'" alt="image.png"></p><ul><li><p><strong>Server层</strong>：包括连接器、查询缓存、分析器、优化器、执行器等，涵盖MySQL的大多数核心服务功能，以及所有的内置函数（如日期、时间、数学和加密函数等），所有跨存储引擎的功能都在这一层实现，比如存储过程、触发器、视图等</p></li><li><p><strong>存储引擎</strong>：负责数据的存储和提取。其架构模式是插件式的，支持InnoDB、MyISAM、Memory等多个存储引擎。 最常用的为InnoDB</p></li></ul><h3 id="连接器" tabindex="-1">连接器 <a class="header-anchor" href="#连接器" aria-label="Permalink to &quot;连接器&quot;">​</a></h3><p>连接器负责跟客户端建立连接、获取权限、维持和管理连接</p><p>1、输入用户密码，连接器认证身份</p><p>2、认证成功后，连接器到权限表里面查出拥有的权限</p><p>一个用户成功建立连接后，即使用管理员账号对这个用户的权限做了修改，也不会影响已经存在连接的权限。修改完成后，只有再新建的连接才会使用新的权限设置</p><p>3、连接完成后，如果你没有后续的动作，这个连接就处于空闲状态，如果太长时间没动静，连接器就会自动将它断开。</p><p>4、如果在连接被断开之后，客户端再次发送请求的话，就会收到一个错误提醒： Lost connection to MySQL server during query</p><p>注：数据库里面，<strong>长连接</strong>是指连接成功后，如果客户端持续有请求，则一直使用同一个连接。<strong>短连接</strong>则是指每次执行完很少的几次查询就断开连接，下次查询再重新建立一个。</p><h4 id="长连接出现的问题" tabindex="-1">长连接出现的问题 <a class="header-anchor" href="#长连接出现的问题" aria-label="Permalink to &quot;长连接出现的问题&quot;">​</a></h4><p>全部使用长连接后，你可能会发现，有些时候MySQL占用内存涨得特别快，这是因为MySQL在执行过程中临时使用的内存是管理在连接对象里面的。这些资源会在连接断开的时候才释放。所以如果长连接累积下来，可能导致内存占用太大，被系统强行杀掉（OOM），从现象看就是MySQL异常重启了</p><p><strong>解决方案</strong>：</p><p>1、定期断开长连接。使用一段时间，或者程序里面判断执行过一个占用内存的大查询后，断开连接，之后要查询再重连</p><p>2、用的是MySQL 5.7或更新版本，可以在每次执行一个比较大的操作后，通过执行 mysql_reset_connection来重新初始化连接资源。这个过程不需要重连和重新做权限验证，但是会将连接恢复到刚刚创建完时的状态。</p><h2 id="查询缓存" tabindex="-1">查询缓存 <a class="header-anchor" href="#查询缓存" aria-label="Permalink to &quot;查询缓存&quot;">​</a></h2><p>MySQL拿到一个查询请求后，会先到查询缓存看看，之前是不是执行过这条语句。之前执行过的语句及其结果可能会以key-value对的形式，被直接缓存在内存中。key是查询的语句，value是查询的结果。如果你的查询能够直接在这个缓存中找到key，那么这个value就会被直接返回给客户端</p><p><strong>注</strong>：查询缓存往往弊大于利——查询缓存的失效非常频繁</p><h2 id="分析器" tabindex="-1">分析器 <a class="header-anchor" href="#分析器" aria-label="Permalink to &quot;分析器&quot;">​</a></h2><p>分析器对SQL语句进行语法分析，判断SQL语句是否满足MySQL语法。</p><h2 id="优化器" tabindex="-1">优化器 <a class="header-anchor" href="#优化器" aria-label="Permalink to &quot;优化器&quot;">​</a></h2><p>优化器是在表里面有多个索引的时候，决定使用哪个索引；或者在一个语句有多表关联（join）的时候，决定各个表的连接顺序。在SQL语句执行之前，需经过优化器的处理</p><p>优化器的作用就是选择语句执行的方法。</p><h2 id="执行器" tabindex="-1">执行器 <a class="header-anchor" href="#执行器" aria-label="Permalink to &quot;执行器&quot;">​</a></h2><p>（1）开始执行的时候，要先判断一下你对这个表T有没有执行查询的权限，如果没有，就会返回没有权限的错误（在工程实现上，如果命中查询缓存，会在查询缓存放回结果的时候，做权限验证。查询也会在优化器之前调用precheck验证权限）</p><p>（2）如果有权限，就打开表继续执行。打开表的时候，执行器就会根据表的引擎定义，去使用这个引擎提供的接口；</p><p>1、调用InnoDB引擎接口取这个表的第一行，判断ID值是不是10，如果不是则跳过，如果是则将这行存在结果集中；</p><p>2、调用引擎接口取“下一行”，重复相同的判断逻辑，直到取到这个表的最后一行；</p><p>3、执行器将上述遍历过程中所有满足条件的行组成的记录集作为结果集返回给客户端。</p>',31),s=[p];function l(i,h,c,d,_,u){return t(),e("div",null,s)}const m=a(n,[["render",l]]);export{y as __pageData,m as default};
