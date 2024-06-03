import{_ as i,c as o,o as l,a1 as s}from"./chunks/framework.DCKU21so.js";const a="/assets/chap2_1.Df9QX1uo.png",_=JSON.parse('{"title":"MySQL日志系统","description":"","frontmatter":{},"headers":[],"relativePath":"DATABASE/MySQL/chap02.md","filePath":"DATABASE/MySQL/chap02.md"}'),n={name:"DATABASE/MySQL/chap02.md"},e=s('<h1 id="mysql日志系统" tabindex="-1">MySQL日志系统 <a class="header-anchor" href="#mysql日志系统" aria-label="Permalink to &quot;MySQL日志系统&quot;">​</a></h1><p>举例：一条更新语句的执行流程，SQL语句：</p><div class="language-SQL vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">SQL</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">update</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> T </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">set</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> c</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">c</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> where</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ID</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>两个重要的日志模块：**redo log（重做日志）**和 <strong>binlog（归档日志）</strong></p><h2 id="redo-log-重做日志" tabindex="-1"><strong>redo log（重做日志）</strong> <a class="header-anchor" href="#redo-log-重做日志" aria-label="Permalink to &quot;**redo log（重做日志）**&quot;">​</a></h2><p><strong>动机</strong>：每一次的更新操作都需要写进磁盘，然后磁盘也要找到对应的那条记录，然后再更新，整个过程IO成本、查找成本都很高</p><p>MySQL用到的WAL技术，全称：Write-Ahead Logging，关键点就是先写日志，再写磁盘，也就是先写粉板，等不忙的时候再写账本。</p><p>具体来说，当有一条记录需要更新的时候，InnoDB引擎就会先把记录写到redo log（粉板）里面，并更新内存，这个时候更新就算完成了。同时，InnoDB引擎会在适当的时候，将这个操作记录更新到磁盘里面，而这个更新往往是在系统比较空闲的时候做，这就像打烊以后掌柜做的事。</p><ul><li>InnoDB的redo log是固定大小的，比如可以配置为一组4个文件，每个文件的大小是1GB，那么这块“粉板”总共就可以记录4GB的操作，如下所示：</li></ul><p><img src="'+a+'" alt="image.png"></p><ul><li><p>write pos是当前记录的位置，一边写一边后移，写到第3号文件末尾后就回到0号文件开头。</p></li><li><p>checkpoint是当前要擦除的位置，也是往后推移并且循环的，擦除记录前要把记录更新到数据文件。</p></li><li><p>write pos和checkpoint之间的是“粉板”上还空着的部分，可以用来记录新的操作；若write pos追上checkpoint则表示“粉板”满了，需进行擦除才能执行新的更新操作</p></li></ul><h2 id="binlog-归档日志" tabindex="-1"><strong>binlog（归档日志）</strong> <a class="header-anchor" href="#binlog-归档日志" aria-label="Permalink to &quot;**binlog（归档日志）**&quot;">​</a></h2><p>Server层有自己的日志——<strong>binlog（归档日志）</strong></p><p>redo log与binlog的<strong>不同：</strong></p><ul><li><p>redo log是InnoDB引擎特有的；binlog是MySQL的Server层实现的，所有引擎都可以使用</p></li><li><p>redo log是物理日志，记录的是“在某个数据页上做了什么修改”；binlog是逻辑日志，记录的是这个语句的原始逻辑，比如“给ID=2这一行的c字段加1 ”</p></li><li><p>redo log是循环写的，空间固定会用完；binlog是可以追加写入的。“追加写”是指binlog文件写到一定大小后会切换到下一个，并不会覆盖以前的日志</p></li></ul><p>执行器和InnoDB引擎在执行这个简单的update语句时的<strong>内部流程</strong></p><ul><li><p>执行器先找引擎取ID=2这一行(引擎直接用树搜索找到这一行)，如果ID=2这一行所在的数据页本来就在内存中，就直接返回给执行器；否则，需要先从磁盘读入内存，然后再返回；</p></li><li><p>执行器拿到引擎给的行数据，把这个值加上1，比如原来是N，现在就是N+1，得到新的一行数据，再调用引擎接口写入这行新数据；</p></li><li><ol><li>引擎将这行新数据更新到内存中，同时将这个更新操作记录到redo log里面，此时redo log处于prepare状态。然后告知执行器执行完成了，随时可以提交事务。</li></ol></li><li><p>执行器生成这个操作的binlog，并将binlong写入磁盘中</p></li><li><p>执行器调用引擎的提交事务接口，引擎把刚刚写入的redo log改成提交（commit）状态，更新完成</p></li></ul><p>其中，redo log的写入拆成了两个步骤：prepare和commit，即两阶段提交</p><h2 id="两阶段提交" tabindex="-1">两阶段提交 <a class="header-anchor" href="#两阶段提交" aria-label="Permalink to &quot;两阶段提交&quot;">​</a></h2><p>为什么需要这样的操作？</p><p>如果不用两阶段提交，要么是先写完redo log再写binlog，或者采用反过来的顺序。</p><ul><li><p><strong>先写redo log后写binlog:</strong> 假设在redo log写完，binlog还没有写完的时候，MySQL进程异常重启。由于我们前面说过的，redo log写完之后，系统即使崩溃，仍然能够把数据恢复回来，所以恢复后这一行c的值是1。但是由于binlog没写完就crash了，这时候binlog里面就没有记录这个语句。因此，之后备份日志的时候，存起来的binlog里面就没有这条语句。 然后你会发现，如果需要用这个binlog来恢复临时库的话，由于这个语句的binlog丢失，这个临时库就会少了这一次更新，恢复出来的这一行c的值就是0，与原库的值不同。</p></li><li><p><strong>先写binlog后写redo log:</strong> 如果在binlog写完之后crash，由于redo log还没写，崩溃恢复以后这个事务无效，所以这一行c的值是0。但是binlog里面已经记录了“把c从0改成1”这个日志。所以，在之后用binlog来恢复的时候就多了一个事务出来，恢复出来的这一行c的值就是1，与原库的值不同。</p></li></ul><p>由此可见，如果不使用“两阶段提交”，那么数据库的状态就有可能和用它的日志恢复出来的库的状态不一致；redo log和binlog都可以用于表示事务的提交状态，而两阶段提交就是让这两个状态保持逻辑上的一致。</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>1、redo log用于保证crash-safe能力。innodb_flush_log_at_trx_commit这个参数设置成1的时候，表示每次事务的redo log都直接<strong>持久化到磁盘</strong>。这个参数我建议你设置成1，这样可以保证MySQL异常重启之后数据不丢失。</p><p>2、sync_binlog这个参数设置成1的时候，表示每次事务的binlog都<strong>持久化到磁盘</strong>。这个参数我也建议你设置成1，这样可以保证MySQL异常重启之后binlog不丢失。</p>',26),t=[e];function r(p,g,h,d,c,k){return l(),o("div",null,t)}const u=i(n,[["render",r]]);export{_ as __pageData,u as default};
