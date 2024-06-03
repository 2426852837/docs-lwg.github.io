import{_ as a,c as l,o as i,a1 as t}from"./chunks/framework.DCKU21so.js";const e="/assets/1.Bsu2ODxe.png",r="/assets/2.BxO_GyBt.png",o="/assets/3.DotGY5PR.png",s="/assets/4.pWArjqZo.png",n="/assets/5.Cs_Nqtdc.png",k=JSON.parse('{"title":"MySQL 底层数据结构：B+树","description":"","frontmatter":{},"headers":[],"relativePath":"DATABASE/MySQL/chap00.md","filePath":"DATABASE/MySQL/chap00.md"}'),p={name:"DATABASE/MySQL/chap00.md"},h=t('<h1 id="mysql-底层数据结构-b-树" tabindex="-1">MySQL 底层数据结构：B+树 <a class="header-anchor" href="#mysql-底层数据结构-b-树" aria-label="Permalink to &quot;MySQL 底层数据结构：B+树&quot;">​</a></h1><h2 id="b-树" tabindex="-1">B 树 <a class="header-anchor" href="#b-树" aria-label="Permalink to &quot;B 树&quot;">​</a></h2><p>B-树,这里的 B 表示 balance( 平衡的意思),B-树是一种多路自平衡的搜索树（B 树是一颗多路平衡查找树）。简化图如下所示：</p><p><img src="'+e+'" alt="image"></p><p>B-树有如下特点:</p><ul><li>所有键值分布在整颗树中（索引值和具体 data 都在每个节点里）;</li><li>任何一个关键字出现且只出现在一个结点中；</li><li>搜索有可能在<strong>非叶子结点</strong>结束（最好情况 O(1)就能找到数据）；</li><li>在关键字全集内做一次查找,性能逼近二分查找。</li></ul><h3 id="b-树的由来" tabindex="-1">B 树的由来 <a class="header-anchor" href="#b-树的由来" aria-label="Permalink to &quot;B 树的由来&quot;">​</a></h3><p><strong>B-树是专门为外部存储器设计的，如磁盘，它对于读取和写入大块数据有良好的性能，所以一般被用在文件系统及数据库中</strong>。</p><p>其他 AVL、红黑树这类平衡二叉树为什么从设计上无法迎合磁盘？</p><ul><li>平衡二叉树是通过旋转来保持平衡的，而旋转是对整棵树的操作，若部分加载到内存中则无法完成旋转操作。</li><li>平衡二叉树的高度相对较大为 log n（底数为 2），这样逻辑上很近的节点实际可能非常远，<strong>无法很好的利用磁盘预读（局部性原理）</strong></li></ul><p>B 树的设计：</p><p>索引的效率依赖于磁盘 IO 的次数，快速索引需要有效的减少磁盘 IO 次数，如何快速索引呢？索引的原理其实是不断的缩小查找范围</p><ul><li>B-树每次将范围分割为多个区间，区间越多，定位数据越快越精确;</li><li>如果节点为区间范围，每个节点就较大了。</li><li>所以新建节点时直接<strong>申请页大小的空间</strong>，计算机内存分配是按页对齐的，这样就实现了一个节点只需要一次 IO。</li><li>多叉会有效降低 B-树的高度，提高范围缩小的速度。</li></ul><h3 id="b-树的查找" tabindex="-1">B-树的查找 <a class="header-anchor" href="#b-树的查找" aria-label="Permalink to &quot;B-树的查找&quot;">​</a></h3><p>B-树在查找时会从根节点开始，对 key 进行二分查找，当需要进入下一层时，进行一次磁盘 IO 来读取数据，再重复上述过程，直至找到 key 为止。</p><h2 id="b-树-1" tabindex="-1">B+树 <a class="header-anchor" href="#b-树-1" aria-label="Permalink to &quot;B+树&quot;">​</a></h2><p>与 B- 树的不同之处在于:</p><ul><li>所有关键字存储在叶子节点出现,内部节点(<strong>非叶子节点并不存储真正的 data</strong>)</li><li>为所有叶子结点增加了一个链指针</li></ul><p><img src="'+r+'" alt="image"></p><p>因为内节点并不存储 data，所以一般 B+树的叶节点和内节点大小不同，而 B-树的每个节点大小一般是相同的，为一页。</p><h3 id="b-树和-b-树的区别" tabindex="-1">B+树和 B-树的区别 <a class="header-anchor" href="#b-树和-b-树的区别" aria-label="Permalink to &quot;B+树和 B-树的区别&quot;">​</a></h3><ol><li>B+树内节点不存储数据，所有 data 存储在叶节点导致查询时间复杂度固定为 log n，都必须从根节点索引至叶子节点。而 B-树查询时间复杂度不固定，与 key 在树中的位置有关，最好为 O(1)。</li><li>B+树叶节点两两相连可大大增加区间访问性，<strong>可使用在范围查询等</strong>，而 B-树每个节点 key 和 data 在一起，则无法区间查找。 空间局部性原理：如果一个存储器的某个位置被访问，那么将它附近的位置也会被访问。</li></ol><p><img src="'+o+'" alt="image"></p><ul><li>B+树则可以通过磁盘预读原理提前将这些数据读入内存，减少了磁盘 IO 的次数，从而很好地利用空间局部性原理。</li><li>由于 B+树的叶子节点的数据都是使用链表连接起来的，而且他们<strong>在磁盘里是顺序存储的</strong>，所以当读到某个值的时候，磁盘预读原理就会提前把这些数据都读进内存，使得范围查询和排序都很快</li></ul><ol start="3"><li>B+树更适合外部存储。由于内节点无 data 域，每个节点能索引的范围更大更精确。</li></ol><ul><li>B+树节点只存储 key 的副本，真实的 key 和 data 域都在叶子节点存储。</li><li>磁盘是分 block 的，一次磁盘 IO 会读取若干个 block，具体和操作系统有关，那么由于磁盘 IO 数据大小是固定的，在一次 IO 中，单个元素越小，量就越大。</li><li>因此，B+树单次磁盘 IO 的信息量大于 B-树，从这点来看 B+树相对 B-树磁盘 IO 次数少。</li></ul><h2 id="mysql-为什么使用-b-tree-b-tree-存储知识" tabindex="-1">MySQL 为什么使用 B-Tree（B+Tree）&amp;&amp; 存储知识 <a class="header-anchor" href="#mysql-为什么使用-b-tree-b-tree-存储知识" aria-label="Permalink to &quot;MySQL 为什么使用 B-Tree（B+Tree）&amp;&amp; 存储知识&quot;">​</a></h2><p>一般来说，索引本身也很大，不可能全部存储在内存中，因此索引往往以索引文件的形式存储的磁盘上。然而，这样的方式会导致索引查找过程中产生磁盘 I/O 消耗，相对于内存存取，I/O 存取的消耗要高几个数量级。因此，索引的结构组织要尽量减少查找过程中磁盘 I/O 的存取次数。</p><h3 id="存储数据最小单元" tabindex="-1">存储数据最小单元 <a class="header-anchor" href="#存储数据最小单元" aria-label="Permalink to &quot;存储数据最小单元&quot;">​</a></h3><ul><li>扇区：磁盘存储数据最小单元是扇区，一个扇区的大小是 512 字节。</li><li>页（page）：页是磁盘存储的最小单元，每个页的大小一般为 16KB。</li><li>块（block）：块是文件系统分配的最小单元，一般为 4KB。</li></ul><p><img src="'+s+'" alt="image"></p><p>数据表中的数据都是存储在页中的，所以一个页中能存储多少行数据呢？假设一行数据的大小是 1k，那么一个页可以存放 16 行这样的数据。</p><h3 id="主存存取原理" tabindex="-1">主存存取原理 <a class="header-anchor" href="#主存存取原理" aria-label="Permalink to &quot;主存存取原理&quot;">​</a></h3><p>目前计算机使用的主存基本都是随机读写存储器（RAM）。</p><ul><li>从抽象角度看，主存是一系列的存储单元组成的矩阵，每个存储单元存储固定大小的数据。</li><li>每个存储单元有唯一的地址，现代主存的编址规则比较复杂，这里将其简化成一个二维地址：通过一个行地址和一个列地址可以唯一定位到一个存储单元。</li></ul><p>主存的存取过程如下：</p><ul><li>当系统需要读取主存时，则将地址信号放到地址总线上传给主存，主存读到地址信号后，解析信号并定位到指定存储单元，然后将此存储单元数据放到数据总线上，供其它部件读取。</li><li>写主存的过程类似，系统将要写入单元地址和数据分别放在地址总线和数据总线上，主存读取两个总线的内容，做相应的写操作。</li></ul><h3 id="磁盘存取原理" tabindex="-1">磁盘存取原理 <a class="header-anchor" href="#磁盘存取原理" aria-label="Permalink to &quot;磁盘存取原理&quot;">​</a></h3><p>与主存不同，磁盘 I/O 存在机械运动耗费，因此磁盘 I/O 的时间消耗是巨大的。</p><p><img src="'+n+'" alt="image"></p><ul><li>盘片被划分成一系列同心环，圆心是盘片中心，每个同心环叫做一个<strong>磁道</strong>，所有半径相同的磁道组成一个<strong>柱面</strong>。</li><li>磁道被沿半径线划分成一个个小的段，每个段叫做一个<strong>扇区</strong>，每个扇区是磁盘的最小存储单元。</li></ul><p>从磁盘读取数据：</p><ul><li>当需要从磁盘读取数据时，系统会将数据逻辑地址传给磁盘，磁盘的控制电路<strong>按照寻址逻辑将逻辑地址翻译成物理地址</strong>，即确定要读的数据在哪个磁道，哪个扇区。</li><li>为了读取这个扇区的数据，需要磁头放到这个扇区上方，因此需要移动磁头来对准相应磁道，这个过程叫做寻道，所耗费时间叫做<strong>寻道时间</strong>，然后磁盘旋转将目标扇区旋转到磁头下，这个过程耗费的时间叫做<strong>旋转时间</strong>。</li></ul><h3 id="局部性原理与磁盘预读" tabindex="-1">局部性原理与磁盘预读 <a class="header-anchor" href="#局部性原理与磁盘预读" aria-label="Permalink to &quot;局部性原理与磁盘预读&quot;">​</a></h3><p>由于存储介质的特性，磁盘本身存取就比主存慢很多，再加上机械运动耗费，磁盘的存取速度往往是主存的几百分分之一，因此为了提高效率，要尽量减少磁盘 I/O。</p><p><mark>由于磁盘顺序读取的效率很高（不需要寻道时间，只需很少的旋转时间），因此对于具有局部性的程序来说，预读可以提高 I/O 效率。</mark></p><ul><li>预读的长度一般是页的整数倍</li><li>页是计算机管理存储器的逻辑块，硬件及操作系统往往将主存和磁盘存储区分割为连续的大小相等的块，每个存储块称为一页（在许多操作系统中，页得大小通常为 4k），主存和磁盘以页为单位交换数据。</li><li>当程序要读取的数据不在主存中时，会触发一个缺页异常，此时系统会向磁盘发出读盘信号，磁盘会找到数据的起始位置并向后连续读取一页或几页载入内存中</li></ul><p><strong>因此，IO 一次就是读一页的大小</strong></p>',48),c=[h];function d(B,u,g,m,b,_){return i(),l("div",null,c)}const O=a(p,[["render",d]]);export{k as __pageData,O as default};
