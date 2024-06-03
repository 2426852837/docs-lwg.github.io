import{_ as a,c as e,o as p,a1 as o}from"./chunks/framework.DCKU21so.js";const u=JSON.parse('{"title":"Java 简介","description":"","frontmatter":{},"headers":[],"relativePath":"JAVA/基础/chapter1.md","filePath":"JAVA/基础/chapter1.md"}'),t={name:"JAVA/基础/chapter1.md"},i=o('<h1 id="java-简介" tabindex="-1">Java 简介 <a class="header-anchor" href="#java-简介" aria-label="Permalink to &quot;Java 简介&quot;">​</a></h1><p>java并不只是一种语言，它是一个完整的平台，有一个庞大的库，其中包含了很多可重用的代码，以及一个提供诸如安全性、跨操作系统的可移植性以及自动垃圾收集等服务的执行环境。</p><h2 id="java安装" tabindex="-1">java安装 <a class="header-anchor" href="#java安装" aria-label="Permalink to &quot;java安装&quot;">​</a></h2><p>1、下载jdk并设置环境变量</p><p>下载地址：<a href="https://www.oracle.com/java/technologies/downloads/" target="_blank" rel="noreferrer">https://www.oracle.com/java/technologies/downloads/</a></p><p>环境变量设置为“java安装目录\\bin”，环境变量只需要在用户级别下设置即可，系统级别不要设置。linux和windows都是这样。</p><p>设置好环境变量后，终端窗口键入javac --version检验是否安装成功。</p><p>2、安装类库源文件</p><p>类库源文件（源码）在jdk中以压缩文件的形式发布，将其解压缩后才能访问源代码。其目录为““java安装目录\\lib\\src.zip”。</p><p>3、安装文档</p><p>下载地址：<a href="https://www.oracle.com/java/technologies/downloads/" target="_blank" rel="noreferrer">https://www.oracle.com/java/technologies/downloads/</a></p><p>文档是一个独立于jdk的压缩文件，下载地址与jdk在同一个页面。</p><h2 id="使用命令行编译和运行java程序" tabindex="-1">使用命令行编译和运行java程序 <a class="header-anchor" href="#使用命令行编译和运行java程序" aria-label="Permalink to &quot;使用命令行编译和运行java程序&quot;">​</a></h2><p><a href="https://docs.oracle.com/en/java/javase/17/docs/specs/man/index.html" target="_blank" rel="noreferrer">https://docs.oracle.com/en/java/javase/17/docs/specs/man/index.html</a></p><h2 id="javac程序" tabindex="-1">javac程序 <a class="header-anchor" href="#javac程序" aria-label="Permalink to &quot;javac程序&quot;">​</a></h2><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">javac</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> javaFileName.java</span></span></code></pre></div><p>javac程序是一个java编译器。<code>javaFileName</code>是一个java源文件名，因为是源文件名，所以后面一定要加.java后缀。执行这个命令后，会在源文件的目录下多出来一个字节码文件<code>javaFileName.class</code>。</p><p>使用<code>--debug=verboseResolution=all</code>选项可以查看参数类型。</p><p><code>-d</code>选项用来设置类文件的输出目录（目标目录），目录不存在则会创建该目录。如果类是包的一部分，则<code>javac</code>会将类文件放入反映模块名称（如果适用）和包名称的子目录中。如果没有<code>-d</code>选项，则<code>javac</code>将每个类文件放在与源文件相同的目录中。</p><p>对于模块化程序，除了编译<code>.java</code>源文件外，还需要同时编译模块声明文件<code>module-info.java</code>。</p><p><code>-p</code>选项用于指定模块依赖的其他模块（可以是模块路径也可以是<code>.jar</code>路径）。</p><h2 id="java程序" tabindex="-1">java程序 <a class="header-anchor" href="#java程序" aria-label="Permalink to &quot;java程序&quot;">​</a></h2><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">java</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> javaClassName</span></span></code></pre></div><p>java程序启动java虚拟机，虚拟机执行编译器编译到类文件中的字节码。javaClassName是java类名，所以后面不需要添加任何后缀。</p><h3 id="模块化程序的执行" tabindex="-1">模块化程序的执行 <a class="header-anchor" href="#模块化程序的执行" aria-label="Permalink to &quot;模块化程序的执行&quot;">​</a></h3><p>执行模块化程序时，必须使用<code>-p</code>或<code>--module-path</code>选项指定模块基目录的路径（也就是模块目录的所在的目录）。<code>-p</code>选项的参数可以是<code>.</code>，代表当前目录。</p><p><code>-m</code>或<code>--module</code>选项指定主类（&quot;模块名/类名&quot;格式，不能是反斜杠<code>\\</code>）。其中模块名中不能是路径形式，只能是具体的模块名称，因为<code>-p</code>或<code>--module-path</code>选项已经指定了模块基目录的路径。</p><h2 id="jar命令" tabindex="-1">jar命令 <a class="header-anchor" href="#jar命令" aria-label="Permalink to &quot;jar命令&quot;">​</a></h2><p>1、<code>-c</code>命令是主操作模式，用于指示：创建<code>.jar</code>文件，但是后面不跟参数。一般在后面跟一个<code>-f</code>选项来指定输出的<code>.jar</code>文件路径。</p><p>2、<code>-f</code>选项是在任何主操作模式下都可以使用的选项，用来指定<code>.jar</code>文件路径。</p><p>3、<code>-v</code>选项用来输出详细的创建过程记录。</p><p>4、<code>-d</code>选项用于打印<code>.jar</code>文件中的模块信息，但是后面不跟参数。一般在后面跟一个<code>-f</code>选项来指定输出的<code>.jar</code>文件路径。</p><p>5、<code>-e</code>选项指定捆绑到可执行模块化jar文件中的程序入口点（主类）。主类的名称应该是完全限定类名（即包含包名），但不应包含路径名和模块名，因为路径就是jar文件路径。</p><p>指定了程序入口点的jar文件，双击可以直接运行；否则不能执行。</p><h2 id="javap程序" tabindex="-1">javap程序 <a class="header-anchor" href="#javap程序" aria-label="Permalink to &quot;javap程序&quot;">​</a></h2><p>反编译程序</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">javap</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -verbose</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> javaClassName</span></span></code></pre></div><p>如果发现反编译后的类中没有局部变量表<code>LocalVariableTable</code>，则重新编译java文件：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">javac</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -g:vars</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> javaFileName.java</span></span></code></pre></div><h1 id="java特点" tabindex="-1">java特点 <a class="header-anchor" href="#java特点" aria-label="Permalink to &quot;java特点&quot;">​</a></h1><p>1、简单性</p><p>Java语法可以说是c++语法的一个纯净版本，它剔除了c++中许多特性：头文件、指针、结构、联合、操作符重载、虚基类等。这些特性带来的麻烦远远多于它们的好处。</p><p>简单所以小，Java的目标之一是支持能够在小型机器上独立运行的软件开发。基本的解释器以及类支持大约仅为40KB，再加上基础的标准类库和对线程的支持（基本上是一个自包含的微内核），大概需要增加175KB。</p><p>现在由于不断的扩展，类库已经相当庞大了。但是仍然有一个独立的较小类库的java微型版（java Micro Edition），这个版本适用于嵌入式设备。</p><p>2、面向对象</p><p>面向对象的程序设计技术将重点放在数据（即对象）和对象的接口上。用木匠打比方，&quot;面向对象&quot;的木匠始终首先关注的是所制作的椅子，其次才是所使用的工具；&quot;非面向对象&quot;的木匠主要考虑的是所用的工具。</p><p>Java的面向对象特性与c++旗鼓相当，主要不同点在于：c++的多重继承被Java中更简单的接口替代。</p><p>3、分布式</p><p>java有一个丰富的例程库，用于处理像HTTP和FTP之类的TCP/IP协议。java应用程序能够通过URL打开和访问网络上的对象，其便捷程度就好像访问本地文件一样。</p><p>如今，这一点被认为是理所当然的。但是在1995年，主要还是从c++或Visual Basic程序连接Web服务器。</p><p>4、健壮性</p><p>java的设计目标之一在于使得java编写的程序具有多方面的可靠性。java非常强调进行早期的问题检测、后期动态的（运行时）检测，以及消除容易出错的情况......java与c++最大的不同在于java采用的指针模型可以消除重写内存和损坏数据的可能性。</p><p>java编译器能够检测许多在其它语言中仅在运行时才能够检测出来的问题。</p><p>5、安全性</p><p>java要适用于网络/分布式环境。为了实现这个目标，安全性颇受重视。使用java可以构建防病毒、防篡改的系统。</p><p>从一开始，java就被设计成能够防范各种攻击，包括：（1）运行时堆栈溢出，这是蠕虫和病毒常用的攻击手段；（2）破坏自己的进程空间之外的内存；（3）未经授权读写文件......</p><p>原先，java对下载代码的态度是“尽管来吧！”。不可信代码在一个沙箱环境中执行，在这里它不会影响主系统。用户可以确信不会发生不好的事情，因为java代码不论来自哪里，都不能脱离沙箱。</p><p>但是JDK第一版发布后，很快就被发现一些小bug会允许不可信的代码攻击主系统。虽然bug很快被修复，但是之后的Sun以及Oracle公司为不断修复安全bug经历了一段很是艰难的日子。</p><p>遭遇多次高调攻击后，浏览器开发商和Oracle开始越来越谨慎。java浏览器插件不再信任远程代码，除非代码有数字签名而且用户同意执行这个代码。</p><p>与之相比，微软提供了一种与之竞争的代码交付机制，其安全性完全依赖于数字签名。显然这是不够的，因为微软自身产品的任何用户都可以证实，一些知名开发商的程序确实会崩溃并对系统产生危害。</p><p>现在看来，尽管java安全模型并没有原先预想的那么成功，但java在那个时代确实相当超前。</p><p>6、体系结构中立</p><p>编译器生成一个体系结构中立的目标文件格式，这是一种编译过的代码，只要有java运行时系统，这些编译后的代码可以在许多处理器上运行。java编译器通过生成与特定的计算机体系结构无关的字节码指令来实现这一特性。</p><p>精心设计的字节码不仅可以很容易地在任何机器上解释执行，而且还可以动态地转换成本地机器代码。</p><p>当时，虚拟机生成代码并不是一个新思路。当然，解释型虚拟机指令肯定会比全速运行机器指令慢很多。但虚拟机有一个选项，可以将执行最频繁地字节码序列转换成机器码，这一过程称为即时编译。</p><p>java虚拟机还有一些其他优点，比如可以检查指令序列的行为，从而增强安全性。</p><p>7、可移植性</p><p>与c或c++不同，java规范中没有&quot;依赖具体实现&quot;的地方：基本数据类型的大小以及有关运算的行为都有明确的说明。</p><p>例如，java中的int始终未32位整数。而在c/c++中，int可能是16位整数、32位整数，也可能是编译器开发商指定的任何其他大小，唯一的限制只是int类型的字节数不能低于short int，并且不能高于long int。</p><p>在java中，数值类型有固定的字节数，这消除了代码移植时令人头痛的主要问题。</p><p>二进制数据以固定的格式进行存储和传输，消除了字节顺序的困扰。字符串则采用标准的Unicode格式存储。</p><p>作为系统组成部分的类库，定义了可移植的接口。例如，有一个抽象的Window类，并给出了在UNIX、Windows和Macintosh环境下的不同实现。</p><p>凡是尝试过的人都知道，要编写一个在Windows、Macintosh和10种不同风格的UNIX上看起来都不错的程序有多么困难。Java尝试过类似的壮举，但用户界面工具包的跨平台可移植性仍然是个问题。</p><p>不过，除了与用户界面有关的部分外，所有其他java库确实能很好地支持平台独立性。你可以处理文件、正则表达式、XML、日期与时间、数据库、网络连接、线程等，而不用操心底层操作系统。</p><p>8、解释型</p><p>java解释器可以在任何移植了解释器的机器上直接执行java字节码。</p><p>字节码可以在运行时动态地转换成对应运行这个应用的特定CPU的机器码。</p><p>9、高性能</p><p>早期的java是解释型的，但现在java虚拟机使用了即时编译器，性能已经非常出色，可以与传统编译器媲美，而且在某些情况下甚至超越了传统编译器，因为它们有更多的可用信息。</p><p>比如，即时编译器可以监控哪些代码频繁执行，并优化这些代码以提高速度。更为复杂的优化是消除函数调用（即“内联”）。即时编译器知道哪些类已经加载。基于当前加载的类集合，如果一个特定的函数不会被覆盖，就可以使用内联。必要时，以后还可以撤销这种优化。</p><p>采用java编写的&quot;热点&quot;代码运行速度与c++相差无几，有些情况下甚至更快。</p><p>10、多线程</p><p>java是第一个支持并发程序设计的主流语言。当时，多核处理器还很神秘，而Web编程才刚刚起步，处理器需要花很长时间等待服务器响应，需要并发程序设计来确保用户界面不会&quot;冻住&quot;。</p><p>11、动态性</p><p>Java与c/c++相比更加具有动态性。它能够适应不断发展的环境。库中可以自由地添加新方法和实例变量，而对客户端却没有任何影响。</p><p>在Java种找出运行时类型信息十分简单。</p><p>当需要为正在运行的程序增加代码时，动态性将是一个非常重要的特性。一个很好的例子是：从Internet下载代码，然后在浏览器上运行。如果使用c/c++，这确实难度很大。</p><p>Java成功推出后不久，微软就发布了一个叫作J++的产品，它与java有几乎相同的编程语言和虚拟机，现在被C#替代。</p><p>C#与Java有很多相似之处，不过在一个不同的虚拟机上运行。</p><h1 id="java相关术语" tabindex="-1">java相关术语 <a class="header-anchor" href="#java相关术语" aria-label="Permalink to &quot;java相关术语&quot;">​</a></h1><h2 id="jdk" tabindex="-1">JDK <a class="header-anchor" href="#jdk" aria-label="Permalink to &quot;JDK&quot;">​</a></h2><p>Java Development Kit，java开发工具包。</p><h2 id="jre" tabindex="-1">JRE <a class="header-anchor" href="#jre" aria-label="Permalink to &quot;JRE&quot;">​</a></h2><p>Java Runtiome Environment，java运行时环境。运行java程序的用户使用的软件。</p><h2 id="sever-jre" tabindex="-1">Sever JRE <a class="header-anchor" href="#sever-jre" aria-label="Permalink to &quot;Sever JRE&quot;">​</a></h2><p>在服务器上运行java程序的软件。</p><h2 id="java-se" tabindex="-1">Java SE <a class="header-anchor" href="#java-se" aria-label="Permalink to &quot;Java SE&quot;">​</a></h2><p>SE：Standard Edition，标准版。用于桌面或简单服务器应用的java平台。</p><h2 id="java-ee" tabindex="-1">Java EE <a class="header-anchor" href="#java-ee" aria-label="Permalink to &quot;Java EE&quot;">​</a></h2><p>EE：Enterprise Edition，企业版。用于复杂服务器应用的java平台。</p><h2 id="java-me" tabindex="-1">Java ME <a class="header-anchor" href="#java-me" aria-label="Permalink to &quot;Java ME&quot;">​</a></h2><p>ME：Micro Edition，微型版。用于小型设备的java平台。</p><h2 id="jar" tabindex="-1">JAR <a class="header-anchor" href="#jar" aria-label="Permalink to &quot;JAR&quot;">​</a></h2><p>Java Archive，java归档。</p><p>在一个JAR文件中，可以包含多个压缩形式的类文件和子目录，这样既节省空间又能改善性能。</p><h2 id="java-本地方法" tabindex="-1">Java 本地方法 <a class="header-anchor" href="#java-本地方法" aria-label="Permalink to &quot;Java 本地方法&quot;">​</a></h2><p>本地方法（Native Methods）是Java中的一种机制，允许Java应用程序调用由本地库（通常是C或C++编写的库）实现的方法。本地方法的主要用途是与底层系统、硬件或其他编程语言进行交互，或者执行性能关键的操作。本地方法通常涉及到对JNI（Java Native Interface）的使用，JNI允许Java代码与本地代码之间进行互操作。</p>',107),s=[i];function c(d,l,r,h,n,v){return p(),e("div",null,s)}const b=a(t,[["render",c]]);export{u as __pageData,b as default};
