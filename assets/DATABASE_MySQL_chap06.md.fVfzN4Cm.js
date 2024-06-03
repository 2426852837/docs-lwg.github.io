import{_ as a,c as t,o as e,a1 as o}from"./chunks/framework.BzbwRryB.js";const i="/docs-lwg.github.io/assets/image.CVsqkQJj.png",n="/docs-lwg.github.io/assets/image1.BSyZ-RA4.png",A=JSON.parse('{"title":"行锁","description":"","frontmatter":{},"headers":[],"relativePath":"DATABASE/MySQL/chap06.md","filePath":"DATABASE/MySQL/chap06.md"}'),s={name:"DATABASE/MySQL/chap06.md"},p=o('<h1 id="行锁" tabindex="-1">行锁 <a class="header-anchor" href="#行锁" aria-label="Permalink to &quot;行锁&quot;">​</a></h1><p>MySQL的行锁是在引擎层中由各个引擎自己实现的，并不是所有的引擎都支持行锁</p><p><strong>行锁就是针对数据表中行记录的锁</strong></p><h2 id="两阶段锁" tabindex="-1">两阶段锁 <a class="header-anchor" href="#两阶段锁" aria-label="Permalink to &quot;两阶段锁&quot;">​</a></h2><p><img src="'+i+'" alt="image.png"></p><p>事务B的update语句会被阻塞，直到事务A执行commit之后，事务B才能继续执行</p><p>说明：<strong>在InnoDB事务中，行锁是在需要的时候才加上的，但并不是不需要了就立刻释放，而是要等到事务结束时才释放，这个就是两阶段锁协议</strong></p><ul><li><p>如果你的事务中需要锁多个行，要把最可能造成锁冲突、最可能影响并发度的锁尽量往后放</p></li><li><p>安排合理的语句顺序可以最大程度地减少事务之间的锁等待，提升了并发度</p></li></ul><h3 id="场景-如果这个影院做活动-可以低价预售一年内所有的电影票-而且这个活动只做一天-在活动时间开始的时候-你的mysql就挂了。你登上服务器一看-cpu消耗接近100-但整个数据库每秒就执行不到100个事务。这是什么原因呢" tabindex="-1">场景：如果这个影院做活动，可以低价预售一年内所有的电影票，而且这个活动只做一天，在活动时间开始的时候，你的MySQL就挂了。你登上服务器一看，CPU消耗接近100%，但整个数据库每秒就执行不到100个事务。这是什么原因呢？ <a class="header-anchor" href="#场景-如果这个影院做活动-可以低价预售一年内所有的电影票-而且这个活动只做一天-在活动时间开始的时候-你的mysql就挂了。你登上服务器一看-cpu消耗接近100-但整个数据库每秒就执行不到100个事务。这是什么原因呢" aria-label="Permalink to &quot;场景：如果这个影院做活动，可以低价预售一年内所有的电影票，而且这个活动只做一天，在活动时间开始的时候，你的MySQL就挂了。你登上服务器一看，CPU消耗接近100%，但整个数据库每秒就执行不到100个事务。这是什么原因呢？&quot;">​</a></h3><h2 id="死锁和死锁检测" tabindex="-1">死锁和死锁检测 <a class="header-anchor" href="#死锁和死锁检测" aria-label="Permalink to &quot;死锁和死锁检测&quot;">​</a></h2><p>当并发系统中不同线程出现循环资源依赖，涉及的线程都在等待别的线程释放资源时，就会导致这几个线程都进入无限等待的状态，称为死锁</p><p><img src="'+n+'" alt="image.png"></p><p>事务A在等待事务B释放id=2的行锁，而事务B在等待事务A释放id=1的行锁。 事务A和事务B在互相等待对方的资源释放，就是进入了死锁状态。两种解决策略：</p><ul><li><p>直接进入等待，直到超时。这个超时时间可以通过参数innodb_lock_wait_timeout来设置</p></li><li><p>发起死锁检测，发现死锁后，主动回滚死锁链条中的某一个事务，让其他事务得以继续执行。将参数innodb_deadlock_detect设置为on，表示开启这个逻辑</p></li></ul><p>第一种策略中，在InnoDB中，innodb_lock_wait_timeout的默认值是50s，意味着如果采用第一个策略，当出现死锁以后，第一个被锁住的线程要过50s才会超时退出，然后其他线程才有可能继续执行。但是不可能将时间设置为一个很小的值，这样当出现死锁的时候，确实很快就可以解开，但如果不是死锁，而是简单的锁等待，因此会出现错误。</p><p>主动死锁检测在发生死锁的时候，是能够快速发现并进行处理的，但是它也是有<strong>额外负担</strong>的</p><p>如果同样是热点行更新的业务，这种方法还是会消耗大量的CPU资源来判断每个线程的加入是否导致了死锁。</p><h3 id="如何解决" tabindex="-1">如何解决？ <a class="header-anchor" href="#如何解决" aria-label="Permalink to &quot;如何解决？&quot;">​</a></h3><ul><li><p><strong>如果你能确保这个业务一定不会出现死锁，可以临时把死锁检测关掉。</strong> 但是这种操作本身带有一定的风险，因为业务设计的时候一般不会把死锁当做一个严重错误，毕竟出现死锁了，就回滚，然后通过业务重试一般就没问题了，这是业务无损的。而关掉死锁检测意味着可能会出现大量的超时，这是业务有损的。</p></li><li><p><strong>控制并发度。</strong> 如果并发能够控制住，比如同一行同时最多只有10个线程在更新，那么死锁检测的成本很低，就不会出现这个问题。一般来说，并发控制要做在数据库服务端，而不是在客户端进行。如果你有中间件，可以考虑在中间件实现；如果你的团队有能修改MySQL源码的人，也可以做在MySQL里面。</p></li></ul>',19),r=[p];function l(c,d,_,h,m,u){return e(),t("div",null,r)}const S=a(s,[["render",l]]);export{A as __pageData,S as default};