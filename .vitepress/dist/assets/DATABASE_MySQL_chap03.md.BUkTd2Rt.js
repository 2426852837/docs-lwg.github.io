import{_ as a,c as l,o as i,a1 as e}from"./chunks/framework.DCKU21so.js";const t="/assets/chap3_1.DfW_CEis.png",p="/assets/chap3_2.BT6XQ0UR.png",b=JSON.parse('{"title":"事务隔离","description":"","frontmatter":{},"headers":[],"relativePath":"DATABASE/MySQL/chap03.md","filePath":"DATABASE/MySQL/chap03.md"}'),o={name:"DATABASE/MySQL/chap03.md"},r=e('<h1 id="事务隔离" tabindex="-1">事务隔离 <a class="header-anchor" href="#事务隔离" aria-label="Permalink to &quot;事务隔离&quot;">​</a></h1><p>事务就是要保证一组数据库操作，要么全部成功，要么全部失败。</p><ul><li><p>在MySQL中，事务支持是在引擎层实现的</p></li><li><p>MySQL是一个支持多引擎的系统，但并不是所有的引擎都支持事务。比如MySQL原生的MyISAM引擎就不支持事务</p></li></ul><h2 id="隔离性与隔离级别" tabindex="-1">隔离性与隔离级别 <a class="header-anchor" href="#隔离性与隔离级别" aria-label="Permalink to &quot;隔离性与隔离级别&quot;">​</a></h2><p><strong>动机</strong>：当数据库上有多个事务同时执行的时候，就可能出现脏读（dirty read）、不可重复读（non-repeatable read）、幻读（phantom read）的问题</p><p>SQL标准的事务隔离级别包括：读未提交（read uncommitted）、读提交（read committed）、可重复读（repeatable read）和串行化（serializable ）</p><ul><li><p>读未提交是指，一个事务还没提交时，它做的变更就能被别的事务看到</p></li><li><p>读提交是指，一个事务提交之后，它做的变更才会被其他事务看到</p></li><li><p>可重复读是指，一个事务执行过程中看到的数据，总是跟这个事务在启动时看到的数据是一致的。当然在可重复读隔离级别下，未提交变更对其他事务也是不可见的</p></li><li><p>串行化，顾名思义是对于同一行记录，“写”会加“写锁”，“读”会加“读锁”。当出现读写锁冲突的时候，后访问的事务必须等前一个事务执行完成，才能继续执行</p></li></ul><h3 id="举例说明-假设数据表t中只有一列-其中一行的值为1" tabindex="-1">举例说明：假设数据表T中只有一列，其中一行的值为1 <a class="header-anchor" href="#举例说明-假设数据表t中只有一列-其中一行的值为1" aria-label="Permalink to &quot;举例说明：假设数据表T中只有一列，其中一行的值为1&quot;">​</a></h3><p><img src="'+t+'" alt="image.png"></p><ul><li><p>若隔离级别是“<strong>读未提交</strong>”， 则V1的值就是2。这时候事务B虽然还没有提交，但是结果已经被A看到了。因此，V2、V3也都是2。</p></li><li><p>若隔离级别是“<strong>读提交</strong>”，则V1是1，V2的值是2。事务B的更新在提交后才能被A看到。所以， V3的值也是2。</p></li><li><p>若隔离级别是“<strong>可重复读</strong>”，则V1、V2是1，V3是2。之所以V2还是1，遵循的就是这个要求：事务在执行期间看到的数据前后必须是一致的。</p></li><li><p>若隔离级别是“<strong>串行化</strong>”，则在事务B执行“将1改成2”的时候，会被锁住。直到事务A提交后，事务B才可以继续执行。所以从A的角度看， V1、V2值是1，V3的值是2。</p></li></ul><p>而在实现上，数据库里面会创建一个视图，访问的时候以视图的逻辑结果为准：</p><ul><li><p>在“可重复读”隔离级别下，这个视图是在事务启动时创建的，整个事务存在期间都用这个视图</p></li><li><p>在“读提交”隔离级别下，这个视图是在每个SQL语句开始执行的时候创建的</p></li><li><p>读未提交”隔离级别下直接返回记录上的最新值，没有视图概念</p></li><li><p>串行化”隔离级别下直接用加锁的方式来避免并行访问</p></li></ul><p><strong>注</strong>：Oracle数据库的默认隔离级别其实就是“读提交”，因此对于一些从Oracle迁移到MySQL的应用，为保证数据库隔离级别的一致，你一定要记得将MySQL的隔离级别设置为“读提交”</p><h2 id="事务隔离的实现" tabindex="-1">事务隔离的实现 <a class="header-anchor" href="#事务隔离的实现" aria-label="Permalink to &quot;事务隔离的实现&quot;">​</a></h2><p>MySQL中，实际上每条记录在更新的时候都会同时记录一条回滚操作，即记录上的最新值，通过回滚操作，都可以得到前一个状态的值。 示例：</p><p><img src="'+p+'" alt="image.png"></p><p>当前值是4，但是在查询这条记录的时候，不同时刻启动的事务会有不同的read-view。对于read-view A，要得到1，就必须将当前值依次执行图中所有的回滚操作得到。</p><p>同一条记录在系统中可存在多个版本，数据库的多版本并发控制（MVCC）</p><p><strong>不使用长事务的原因：</strong></p><ul><li><p>长事务意味着系统里面会存在很老的事务视图</p></li><li><p>由于这些事务随时可能访问数据库里面的任何数据，所以这个事务提交之前，数据库里面它可能用到的回滚记录都必须保留，这就会导致大量占用存储空间</p></li><li><p>长事务还占用锁资源，也可能拖垮整个库</p></li></ul><h2 id="事务的启动方式" tabindex="-1">事务的启动方式 <a class="header-anchor" href="#事务的启动方式" aria-label="Permalink to &quot;事务的启动方式&quot;">​</a></h2><p>MySQL的事务启动方式：</p><ul><li><p>显式启动事务语句， begin 或 start transaction。配套的提交语句是commit，回滚语句是rollback。</p></li><li><p>set autocommit=0，这个命令会将这个线程的自动提交关掉。意味着如果你只执行一个select语句，这个事务就启动了，而且并不会自动提交。这个事务持续存在直到你主动执行commit 或 rollback 语句，或者断开连接。</p></li><li><p>因此，使用set autocommit=1, 通过显式语句的方式来启动事务</p></li><li><p>在autocommit为1的情况下，用begin显式启动的事务，如果执行commit则提交事务。如果执行 commit work and chain，则是提交事务并自动启动下一个事务，这样也省去了再次执行begin语句的开销。</p></li></ul><h3 id="如何避免长事务对业务的影像" tabindex="-1">如何避免长事务对业务的影像 <a class="header-anchor" href="#如何避免长事务对业务的影像" aria-label="Permalink to &quot;如何避免长事务对业务的影像&quot;">​</a></h3><p>从应用开发端的角度：</p><ul><li><p>确认是否使用了set autocommit=0。这个确认工作可以在测试环境中开展，把MySQL的general_log开起来，然后随便跑一个业务逻辑，通过general_log的日志来确认。一般框架如果会设置这个值，也就会提供参数来控制行为，你的目标就是把它改成1。</p></li><li><p>确认是否有不必要的只读事务。有些框架会习惯不管什么语句先用begin/commit框起来。我见过有些是业务并没有这个需要，但是也把好几个select语句放到了事务中。这种只读事务可以去掉。</p></li><li><p>业务连接数据库的时候，根据业务本身的预估，通过SET MAX_EXECUTION_TIME命令，来控制每个语句执行的最长时间，避免单个语句意外执行太长时间。</p></li></ul><p>从数据库端的角度：</p><ul><li><p>监控 information_schema.Innodb_trx表，设置长事务阈值，超过就报警/或者kill;</p></li><li><p>Percona的pt-kill这个工具不错，推荐使用;</p></li><li><p>在业务功能测试阶段要求输出所有的general_log，分析日志行为提前发现问题;</p></li><li><p>如果使用的是MySQL 5.6或者更新版本，把innodb_undo_tablespaces设置成2（或更大的值）。如果真的出现大事务导致回滚段过大，这样设置后清理起来更方便</p></li></ul>',28),n=[r];function s(c,d,m,h,_,u){return i(),l("div",null,n)}const S=a(o,[["render",s]]);export{b as __pageData,S as default};
