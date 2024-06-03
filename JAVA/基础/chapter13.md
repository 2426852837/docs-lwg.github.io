# 日志

很多应用程序会使用其他日志框架，如Log4J 2、Logback等。

SLF4J和Commons Logging等日志门面提供了一个统一的API，利用这个API无须重写应用就可以替换日志框架。

另外在java 9以后，java平台还有一个单独的轻量级日志系统，它不依赖于`java.logging`模块，这个系统只用于java API。

## 日志管理器

日志管理器负责配置日志记录，并将日志记录委托给适当的日志记录器。日志管理器实例通过`LogManager.getLogManager()`获取。

日志记录的配置包括各个日志记录器（包括根日志记录器）的级别、处理器、格式化器等，具体参见：https://docs.oracle.com/cd/E57471_01/bigData.100/data_processing_bdd/src/rdp_logging_config.html 

这些配置属性不是系统属性，因此不能调用`System.setProperty()`方法设置，可以通过以下两种方式来设置：1、日志管理器配置文件；2、程序代码中利用映射器`mapper`更新日志配置。

### 利用配置文件设置日志系统

日志管理器在虚拟机启动时（在`main`方法执行前）初始化，初始化时会读取日志管理器配置文件，默认的配置文件路径为`javaPackage\conf\logging.properties`。

配置文件中的属性设置是针对所有日志记录器的。例如有一个属性设置为`.level = INFO`，这是将所有日志记录器的级别设置为`INFO`。我们可以设置某个单独的日志记录器的属性，例如`Test.level = FINER`将日志记录器`Test`的级别单独设置为`FINER`。

如果想使用另一个配置文件，需要将系统属性`java.util.logging.config.file`设置为该文件的路径，有两种设置方式：

（1）可以在启动java虚拟机时通过命令行设置：

```shell
java -D"java.util.logging.config.file"="D:\Code\JavaTest\x.txt" Test2
```

`java`命令的选项`-D`用于设置系统属性。系统属性的键和值必须用双引号括起来，且键与`-D`之间不能有空格。

（2）也可以在程序中利用代码设置：

```java
System.setProperty("java.util.logging.config.file", file);
 // 重新初始化日志管理器
LogManager.getLogManager().readConfiguration();
```



### 利用映射器`mapper`更新日志配置

```java
// 利用mapper更新日志配置
LogManager.getLogManager().updateConfiguration(mapper);
```



## 日志记录器

1、日志记录器用于实际记录日志消息，并将日志记录发送给一个或多个日志处理器进行处理。

2、标准java日志框架中有一个根日志记录器（全局日志记录器），其名称为`""`，它是所有日志记录器的祖先。

3、其他日志记录器需要手动创建。

4、日志记录器具有父子关系。但和java包不同，日志记录器的父与子之间具有语义关系，例如`com.mycompany.mylib`就是`com.mycompany`的子日志记录器。

5、日志记录器的父与子之间将共享属性。例如，如果对日志记录器`com.mycompany`设置了日志级别，它的子日志记录器也会继承这个级别。

```java
import java.util.lang.logging;
public class Test{
    // 获取根日志记录器
    Logger logger = Logger.getGlobal();
    // 创建或获取自定义的日志记录器（未被任何变量引用的日志记录器可能会被垃圾回收，因此用静态变量存储日志记录器的引用）
    private static final Logger myLogger = Logger.getLogger("com.mycompany.myapp");
    
    public void main(String[] args){
        read("HTTP.txt", "utf-8");
        // 记录一条普通日志（方式1）
        logger.warning(message);
        // 记录一条普通日志（方式2）
        logger.log(Level.WARNING, message);
        // 记录一条日志：方法调用
        // 默认的日志记录将显示根据调用堆栈得出的包含日志调用的类名和方法名，但如果虚拟机对执行过程进行了优化，就得不到准确的调用信息
        logger.logp(Level.WARNING, "Test", "main", message);
        try{
            ...
        }
        catch(IOException e){
            // 记录一条日志：抛出的异常（方式1）
            logger.throwing("Test", "main", e);
            // 记录一条日志：抛出的异常（方式2）
            logger.log(Level.ALL, e.toString(), e);
        }
    }
    private int read(String file, String pattern){
        // 记录一条日志：执行流（进入方法）
        logger.entering("Test", "read", new Object[]{file, pattern});
        ...
        // 记录一条日志：执行流（退出方法）
        logger.exiting("Test", "read", count);
        return count;
	}
}
```

## 日志处理器

1、日志处理器负责将日志记录输出到不同的目标位置，比如控制台、文件、数据库、远程服务器等。

2、java标准库提供了一些内置的日志处理器，如：`ConsoleHandler`（将日志记录打印到控制台窗口）、`FileHandler`（将日志记录写入文件）、`StreamHandler`（将日志记录写入流中）、`SocketHandler`（将日志记录发送到指定的主机和端口）等，同时也允许用户创建自定义的处理器来满足特定需求。

3、一个日志记录器可以有0个、1个或多个处理器（`handler`私有属性表示）。

4、根日志记录器的处理器默认是`ConsoleHandler`，我们手动创建的日志记录器的处理器默认为`null`。可以显式地设置日志记录器的处理器。

```java
var handler  new ConsoleHandler();
handler.setLevel(Level.FINE);
logger.addHandler(handler);
logger.setUseParentHandlers(false);
```

5、日志记录器的`useParentHandlers`属性默认为`true`，即默认会使用父处理器（父日志记录器的处理器）。

6、当我们用某个日志记录器记录一条日志时，步骤如下：

（1）如果日志级别高于等于日志记录器的级别，那么接受这条日志记录；否则舍弃，即结束执行。

（2）如果日志符合过滤器（日志记录器的过滤器）的过滤规则，那么接受这条日志记录；否则舍弃，即结束执行。

（3）日志记录器将日志传送给自己所有的处理器：如果它的`handler`属性不为`null`，则传送；否则不会传送，但继续执行。

（4）如果日志记录器的`useParentHandlers`属性设置为`true`，则将日志传送给父处理器；否则不会传送，即结束执行。

（5）如果父日志记录器的`useParentHandlers`属性也设置为`true`，则将这条日志记录传送给更上层的父处理器；否则不会传送，即结束执行。

（6）依次类推，最终可能会到达根日志记录器，然后传送给它的处理器（默认为`ConsoleHandler`），然后由处理器输出（默认为标准错误流`System.err`，即控制台窗口）。

因此，一条日志记录可能会被多个处理器重复打印多次，这是正常且合理的。



### 文件处理器`FileHandler`

```java
// 默认为用户主目录下的javan.log文件，n是保证文件唯一的一个编号
// 如果用户没有主目录的概念，文件就存储在一个默认位置下（例如C:\Windows）
var handler = new FileHandler();
logger.addHandler(handler);
```

默认情况下，记录会被格式化为XML。例如，一个典型的日志记录形式如下：

```xml
<record>
	<date>2002-02-04T07:45:15</date>
    <millis>1012837515710</millis>
    <sequence>1</sequence>
    <logger>com.mycompany.myapp</logger>
    <level>INFO</level>
    <class>com.company.mylib.Reader</class>
    <method>read</method>
    <thread>10</thread>
    <message>Reading file corejava.gif</message>
</record>
```

#### 文件处理器属性

文件管理器属性如下表所示。

![1694122012594](D:\Summary\typora\pictures\1694122012594.png)

1、文件名模式（`java.util.logging.FileHandler.pattern`），其含义如下表所示：

![1694122369280(1)](D:\Summary\typora\pictures\1694122369280(1).png)

2、如果多个应用程序（或者同一个应用程序的多个副本）使用同一个日志文件，就应该：

（1）开启`append`标志，即设置`java.util.logging.FileHandler.append = true`。

（2）文件名模式使用`%u`，以便每个应用程序创建日志的唯一副本。不过默认就是`%h/java%u.log`，不用更改。

3、开启文件循环功能：例如设置`java.util.logging.FileHandler.count = 3`，那么日志文件将以循环序列的形式保存，如`myapp.log.0`、`myapp.log.1`、`myapp.log.2`等。只要文件超出了大小限制，最老的文件就会被删除，其他的文件将重新命名，同时创建一个新文件，其生成号为`0`。

### 流处理器`StreamHandler`

可以通过扩展`Handler`类或`StreamHandler`类自定义处理器。

```java
class WindowHandler extends StreamHandler{
    public WindowHandler(){
        ...
        var output = new JTextArea();
        this.setOutputStream(new OutputStream(){
            public void write(int b) {}
            public void write(byte[] b, int off, int len){
                output.append(new String(b, off, len));
            }
        });
        ...
    }
    public void publish(LogRecord record){
        super.publish(record);
        flush();
    }
}
```

这个处理器扩展了`StreamHandler`类，并安装了一个流。这个流的`write`方法将流输出显示到一个文本区中。

使用这种方式只存在一个问题，就是处理器会缓存记录，并且只有当缓冲区满的时候才将它们写入流中。因此，==需要覆盖`publish`方法==，以便在处理器获得每个记录之后立马就刷新*输出缓冲区*。

如果希望编写更加复杂的处理器，就应该扩展`Handler`类，并定义`publish`、`flush`和`close`方法。

### 格式化器

`ConsoleHandler`类和`FileHandler`类可以生成文本和XML格式的日志记录。

1、也可以自定义格式，这需要扩展`Formatter`类并覆盖下面这个方法：`String format(LogRecord record)`。可以根据自己的需要以任何方式对记录中的信息进行格式化，并返回结果字符串。

2、在`format`方法中，可能会调用下面这个方法：`String formatMessage(LogRecord record)`。这个方法对记录中的消息部分进行格式化，将替换参数并应用本地化处理。

3、很多文件格式（如XML）需要在已格式化的记录的前后加上一个头部和尾部。为此，需要覆盖下面两个方法：`String getHead(Handler h)`和`String getTail(Handler h)`。

4、最后，调用`setFormatter`方法将格式化器安装到处理器中。

## 日志过滤器

默认情况下，会根据日志记录的级别进行过滤。除此之外，==每个日志记录器和处理器都有一个可选的过滤器来完成附加的过滤==。

1、要定义一个过滤器，首先需要实现`Filter`接口并定义以下方法：

```java
boolean isLoggable(LogRecord record);
```

在这个方法中，可以自定义规则，对那些应该包含在日志中的记录返回`true`。

2、然后，调用`setFilter`方法将过滤器安装到日志记录器或处理器中。日志记录器和处理器上都可以安装过滤器。



## 日志级别

1、日志级别用于指示日志消息的重要性或严重程度。java有七个日志级别，按照严重程度依次为：

（1）SEVERE（严重错误）；（2）WARNING（警告）；（3）INFO（信息性消息）；（4）CONFIG（配置信息）；（5）FINE（调试信息）；（6）FINER（调试信息）；（7）FINES（调试信息）。

2、日志记录器默认的级别是INFO，也就是只有SEVERE、WARNING、INFO这三个级别的日志会被传送给处理器，其他级别的日志会被忽略。日志记录器的级别可以通过`logger.getLevel()`获得，通过`logger.setLevel(Level l)`设置。这种设置只会影响指定的日志记录器，不会影响其他日志记录器。

```java
// 设置日志记录器logger的级别为FINE
logger.setLevel(Level.FINE);
// 开启日志记录器logger所有级别的记录
logger.setLevel(Level.ALL);
// 关闭日志记录器logger所有级别的记录
logger.setLevel(Level.OFF);
```

3、日志处理器默认的级别也是INFO，也就是只有SEVERE、WARNING、INFO这三个级别的日志会被处理器输出，其他级别的日志会被忽略。日志处理器的级别可以通过`handler.getLevel()`获得，通过`handler.setLevel(Level l)`设置。这种设置只会影响指定的日志处理器，不会影响其他日志处理器。

因此，==某一条日志记录要想被记录到目标位置（控制台窗口、文件、远程服务器、数据库等），它的级别必须满足：（1）高于等于日志记录器的级别；（2）且高于日志处理器的级别。==



## 调试技巧

1、==`main`方法==

可以在每个类中放置一个单独的`main`方法。这样就可以提供一个单元测试桩（stub）,能够独立测试类。

更进一步，可以使用一个非常流行的单元测试框架JUnit（http://junit.org）。利用它可以很容易地组织测试用例套件。只要对类做了修改，就需要运行测试。一旦发现bug，还要再补充另一个测试用例。

2、==日志代理==

日志代理对象是一个超类的子类对象，它可以截获方法调用，记录日志，然后调用超类的方法。

```java
public class Test{
    public static void main(String[] args) throws IOException {
        // 日志代理对象rand是Random子类的对象
        var rand = new Random(){
            public double nextDouble(){
                var num = super.nextDouble();
                Logger.getGlobal().info("nextDouble: " + num);
                return num;
            }
        };
        System.out.println(rand.nextDouble());
    }
}
```

3、==获得堆栈轨迹==

（1）利用`Throwable`类的`printStackTrace`方法，可以从任意的异常对象获得堆栈轨迹。

（2）也可以使用代码`Thread.dumpStack();`获得任意的堆栈轨迹。

4、==重定向标准错误流==

程序错误默认会发送到`System.err`，如果要将程序错误记入一个文件，应当使用：

```shell
# 重定向标准错误流，不要使用javac MyProgram > errors.txt
java MyProgram 2> errors.txt
# 在同一个文件中同时捕获System.err和System.out
java MyProgram 1> errors.txt 2>&1
```

5、==改变未捕获异常的处理器==

有些未捕获异常的堆栈轨迹也可能输出到标准错误流`System.err`中。更好的方法是将这些消息记录到一个文件中。可以用静态方法`Thread.setDeafaultUncaughtExceptionHandler`改变未捕获异常的处理器。

```java
Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler(){
    public void uncaughtException(Thread t, Throwable e){
        ...
    };
});
```

6、==观察类的加载过程==

启动java虚拟机时可以使用`-verbose`标志。这种方法对诊断类路径会很有帮助。

7、`javac -Xlint`选项

启动javac编译器时，`-Xlint`选项告诉编译器找出常见的问题代码，这可以找出代码中有问题但不违背语法规则的构造。

```shell
javac -Xlint MyProgram.java
```

8、==jconsole图形工具==

==java虚拟机增加了对java应用程序的监控和管理支持，允许在虚拟机中安装代理来跟踪内存消耗、线程使用、类加载等情况。这些特性对于规模很大而且长时间运行的java程序（如应用服务器）尤其重要。==

作为展示这些功能的一个例子，jdk提供了一个名为jconsole（www.oracle.com/technetwork/articles/java/jconsole-1564139.html）的图形工具，可以显示有关虚拟机性能的统计结果。

启动你的java程序，然后启动jconsole，可以从正在运行的java程序列表中选择你的程序。控制台会给出有关运行程序的大量信息。

9、==java任务控制器==

java任务控制器（Java Mission Control）是一个专业级性能分析和诊断工具，包含在oracle jdk中，可以免费用于开发。

如果在生产环境中使用则需要有商业授权。目前OpenJDK中提供了一个开源版本。

与jconsole类似，Java任务控制器可以关联到正在运行的java虚拟机。

Java任务控制器还能分析java飞行记录器（Java Flight Recorder）的输出。java飞行记录器可以从一个正在运行的java应用程序收集诊断和性能分析数据。

有关这些工具的更多信息参见 https://docs.oracle.com/javacomponents/index.html 。