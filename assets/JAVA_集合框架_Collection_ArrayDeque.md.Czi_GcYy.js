import{_ as e,c as t,o as a,a1 as r}from"./chunks/framework.DCKU21so.js";const p=JSON.parse('{"title":"Stack & Queue (采用 ArrayDeque 实现)","description":"","frontmatter":{},"headers":[],"relativePath":"JAVA/集合框架/Collection_ArrayDeque.md","filePath":"JAVA/集合框架/Collection_ArrayDeque.md"}'),u={name:"JAVA/集合框架/Collection_ArrayDeque.md"},d=r('<h1 id="stack-queue-采用-arraydeque-实现" tabindex="-1">Stack &amp; Queue (采用 ArrayDeque 实现) <a class="header-anchor" href="#stack-queue-采用-arraydeque-实现" aria-label="Permalink to &quot;Stack &amp; Queue (采用 ArrayDeque 实现)&quot;">​</a></h1><p>Java 里有一个叫做 Stack 的类，却没有叫做 Queue 的类(它是个接口名字)。当需要使用栈时，Java 已不推荐使用 Stack，而是推荐使用更高效的 ArrayDeque；既然 Queue 只是一个接口，当需要使用队列时也就首选 ArrayDeque 了(次选是 LinkedList)。</p><h2 id="queue" tabindex="-1">Queue <a class="header-anchor" href="#queue" aria-label="Permalink to &quot;Queue&quot;">​</a></h2><p>与 LinkedList 实现方式类似，ArrayDeque 实现了 Queue 的六个方法，一组是抛出异常的实现；另外一组是返回值的实现(没有则返回 null)。</p><table><thead><tr><th></th><th>抛出异常</th><th>返回值</th></tr></thead><tbody><tr><td>插入</td><td>add(e)</td><td>offer(e)</td></tr><tr><td>移除</td><td>remove()</td><td>poll()</td></tr><tr><td>检查</td><td>element()</td><td>peek()</td></tr></tbody></table><h2 id="deque" tabindex="-1">Deque <a class="header-anchor" href="#deque" aria-label="Permalink to &quot;Deque&quot;">​</a></h2><p><code>Deque</code>是&quot;double ended queue&quot;, 表示双向的队列，继承自<code>Queue</code>接口。由于 Deque 是双向的，所以可以对队列的头和尾都进行操作，它同时也支持两组格式，一组是抛出异常的实现；另外一组是返回值的实现(没有则返回 null)，共 12 个方法。</p>',7),o=[d];function c(l,n,i,q,s,_){return a(),t("div",null,o)}const A=e(u,[["render",c]]);export{p as __pageData,A as default};
