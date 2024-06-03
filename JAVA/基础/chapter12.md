# 异常和断言

## 异常

### 异常类型

![异常层次结构](/pictures/java/chap12/chap12_2.png)

异常对象都是派生于`java.lang.Throwable`类的一个类实例。`java.lang.Throwable`派生于`java.lang.Object`类。

`Throwable`下一层有两个分支：`java.lang.Error`、`java.lang.Exception`。

`java.lang.Exception`这个层次结构又分为几个分支：一个分支派生于`java.lang.RuntimeException`；一个分支派生于`java.io.IOException`。这是最重要的两个分支，另外还有几个分支，比如`java.lang.ReflectiveOperationException`。

1、==java运行时系统的内部错误和资源耗尽错误属于`Error`类层次结构==，例如：内存不够`java.lang.OutOfMemoryError` 等。

应用程序不应当抛出这个类型的对象，但是如果出现了这样的内部错误，除了通知用户，并尽力妥善地终止程序之外，几乎无能为力。这种情况很少出现。`Exception`类层次结构是设计java程序时应当重点关注的。

2、==由编程错误导致的异常属于==`RuntimeException`==，主要包括：

（1）错误的强制类型转换`java.lang.ClassCastException`；

（2）数组访问越界`java.lang.ArrayIndexOutOfBoundsException`；

（3）访问`null`引用`java.lang.NullPointerException`；

......

3、==如果程序本身没有问题，不是派生于`RuntimeException`的其他异常都属于`IOException`==，主要包括：

（1）设备错误：磁盘故障`java.nio.file.FileSystemException`（磁盘空间不足、磁盘权限不足等）；

（2）网络错误：`java.net.SocketException`（网络连接中断、主机不可达等）；

（3）数据库错误：`java.sql.SQLException`（数据库连接中断等）；

（4）试图打开一个不存在的文件`java.io.FileNotFoundException`；

（5）试图超越文件末尾继续读取数据`java.io.EOFException`；

......

4、执行反射操作时引发的异常属于`ReflectOperationException`，例如：

试图根据给定的字符串查找`Class`对象，但这个字符串表示的类不存在 `java.lang.ClassNotFoundException`。

#### 检查型异常

java语言规范将派生于`Error`类和`RuntimeException`类的所有异常称为==非检查型异常==，所有其他的异常（主要是`IOException`，当然也包括`ReflectOperationException`）称为==检查型异常==。

为什么要这么划分呢？==首先java对`Error`类异常（错误）无能为力，而`RuntimeException`类异常一定是程序设计者自己的问题，怎么解决取决于程序设计者而不是java，所以编译器不会检查这些异常的；但是对于其他异常，java能够预料到所有可能出现的异常，因此会检查程序设计者是否为这些异常提供了异常处理器。


#### 抛出异常

1、如果一个已有的异常类能够满足要求，抛出这个异常就很容易：创建这个异常类的对象然后抛出即可。

假设使用一个`readData`方法读取文件。文件首部包含信息`Content-length: 1024`，即承诺文件长度为`1024`个字符。但是如果读到`700`个字符之后文件就结束了，这就属于不正常情况了，应该抛出一个异常。

```java
public String readData(Scanner in) throws EOFException{
    ...
    while(...){
        if(! in.hasNext()){
            if(n < len){
                String message = "Content-length:" + len + ", Received: " + n;
                throw new EOFException(message);
            }
        }
    }
}
```

2、有时也可能遇到任何标准异常类都无法描述清楚的问题。这种情况下，可以创建自己的异常类。自定义的异常类应该派生于java标准异常类。

```java
class FileFormatException extends IOException{
    public FileFormatException(){}
    public FileFormatException(String message){
        super(message);
    }
}
```

==一个方法如果抛出了异常，那么该方法需要在首部声明异常。==

#### 声明异常

一个方法的首部必须声明所有可能抛出的==检查型异常==。主要包括两种情况：

1、方法内部抛出了一个异常对象。

前面说过：==一个方法如果抛出了异常，那么该方法需要在首部声明异常。==

方法内部使用类似`throw e`的代码（`e`是一个==`Throwable`类或其子类类型==的对象）抛出一个异常对象。方法首部应该声明`throws Exception`（==`Exception`类或更具体的异常类型，但是这个类型不应该比抛出的对象实际类型更具体==）。

2、调用了其他可能抛出检查型异常的方法。

这里的”调用“不仅仅是直接调用，例如方法`A`调用`B`，`B`调用`C`，`C`调用`D`，那么我们说`A`、`B`、`C`都调用了`D`。

（1）异常对象被某个方法抛出后，运行时系统会检查方法的调用栈，看调用该方法的方法是否提供了异常处理器，如果没有，则向上层的方法抛出这个异常（因此调用该方法的方法也必须声明异常）；

（2）上层的方法还是没有提供异常处理器的话，就向更上层的方法抛出异常对象（因此这个更上层的方法也必须声明异常）；

（3）直到有某个上层方法提供了异常处理器，这个异常才会被处理（因此之后的上层方法就无需声明异常）；

（4）否则，如果调用栈的所有方法都没有提供异常处理器的话，程序就会终止。

==方法首部不需要声明非检查型异常，因为对于这种`Error`这种异常我们是无能为力的；而对于`RuntimeException`这种异常，我们应该做的不是声明和处理这个异常，而是修改我们的代码，以避免这个异常。==



#### 异常声明规则

1、如果编写了一个方法覆盖了超类的方法，而这个超类方法没有抛出异常，那么子类方法就不能抛出异常，而只能捕获异常。

2、如果超类方法中声明了异常（抛出了异常），那么子类的覆盖方法中不能出现超类方法未列出的异常类型。



### 捕获异常

==声明异常是为了抛出异常，捕获异常是为了处理异常，这两者不可兼得，也就是要么抛出异常要么捕获异常。`try-catch-finally`和`try-with-resources`语句用于捕获异常。==

如果发生了某个异常，但没有在任何方法中捕获这个异常，程序就会终止，并在控制台上打印一个消息，其中包括异常的类型和一个堆栈轨迹。

#### `try-catch-finally`语句

要想捕获一个异常，需要设置`try-catch-finally`语句块。

##### 语法规则

1、`catch`部分

（1）这部分可以没有。

（2）这部分可以有多个，以捕获多个类型的异常。

（3）一个`catch`块中声明的捕获类型可以使用`A | B`位运算符表示这个异常的类型可以是`A`也可以是`B`。但是函数中不能这么写，必须用重载。

（4）如果没有任何`catch`块能够捕获到某个类型的异常，那么这个异常就会被抛出。因为这个异常会被抛出，所以必须在`try-catch-finally`所在的方法首部声明这个类型的异常（必须声明，编译器会检测到的）。

（5）`catch`部分也可能抛出新异常，分为两种情况：用于将原始异常==包装==为新异常、程序执行错误导致抛出新异常。无论哪种情况，都必须在方法首部声明这个重新抛出的异常类型。

2、`finally`部分

（1）这部分可以没有。

（2）无论发生什么情况，`finally`部分的代码都一定会被执行，==但未必能够全部执行==。

（3）这部分是为了清理资源。比如在读取文件时发生了错误，抛出了异常，然后`catch`部分捕获了异常，但是处理完异常后可能会改变程序执行顺序，也可能会退出程序，无论哪种情况，都有可能损坏文件，因为文件被打开后没有被正确关闭，所以我们应该保证即使读取文件时发生了错误，也能正确关闭文件。这就是清理资源。

==`finally`部分是用来清理资源的，代码块中不要有`return`等转移控制流的语句，同时还要确保`finally`部分的代码不会抛出异常。==

##### 执行顺序

```java
InputStream in = ...;
try{
    // 1
    // code that might throw exceptions
    // 2
}
catch(EOFException e){
    // 3
    // show error message which might throw new exceptions
    // 4
}
catch(FileNotFoundException | UnknownHostException e){
    // 5
    // show error message
    // 6
}
finally{
    // 7
    in.close();
    // 8
}
// 9
```

1、如果`try`部分的代码没有抛出异常，则程序会跳过`catch`部分：

（1）如果有`finally`部分，则执行顺序为`1 2 7 8 9`。

（2）如果没有`finally`部分，执行顺序为`1 2 9`。

2、如果`try`部分的代码抛出了一个其他类异常，则`catch`部分无法捕获到这个异常且这个异常最终会被该方法抛出：

（1）如果有`finally`部分，则执行顺序为`1 7 8`，然后该方法会向调用它的上层方法抛出这个异常，直到遇到某个提供了异常处理器（`catch`）的上层方法，会按相同逻辑处理这个异常；如果mei有方法提供异常处理器，那么程序终止。

（2）如果没有`finally`部分，则执行顺序为`1`，然后该方法会向调用它的上层方法抛出这个异常，直到遇到某个提供了异常处理器（`catch`）的上层方法，会按相同逻辑处理这个异常；如果mei有方法提供异常处理器，那么程序终止。

3、如果`try`部分的代码抛出了一个`FileNotFoundException`或`UnknownHostException`类异常，则`catch`部分会捕获到这个异常并进行处理：

（1）如果有`finally`部分，则执行顺序为`1 5 6 7 8 9`。

（2）如果没有`finally`部分，则执行顺序为`1 5 6 9`。

4、如果`try`部分的代码抛出了一个`EOFException`类异常，则`catch`部分会捕获到这个异常并正确处理：

（1）如果有`finally`部分，则执行顺序为`1 3 4 7 8 9`；

（2）如果没有`finally`部分，则执行顺序为`1 3 4 9`。

5、如果`try`部分的代码抛出了一个`EOFException`类异常但`catch`部分捕获到这个异常后处理时又引发了新异常，则这个新异常最终会被该方法抛出：

（1）如果有`finally`部分，则执行顺序为`1 3 7 8`，然后该方法会向调用它的上层方法抛出这个新异常，直到遇到某个提供了异常处理器（`catch`）的上层方法，会按相同逻辑处理这个异常；如果mei有方法提供异常处理器，那么程序终止。

（2）如果没有`finally`部分，则执行顺序为`1 3`，然后该方法会向调用它的上层方法抛出这个新异常，直到遇到某个提供了异常处理器（`catch`）的上层方法，会按相同逻辑处理这个异常；如果mei有方法提供异常处理器，那么程序终止。

6、如果没有`catch`部分，则如果抛出了异常，这个异常最终或被该方法抛出：

（1）如果有`finally`部分，则执行顺序为`1 7 8`，然后该方法会向调用它的上层方法抛出这个异常，直到遇到某个提供了异常处理器（`catch`）的上层方法，会按相同逻辑处理这个异常；如果mei有方法提供异常处理器，那么程序终止。

（2）如果没有`finally`部分，则执行顺序为`1`，然后该方法会向调用它的上层方法抛出这个异常，直到遇到某个提供了异常处理器（`catch`）的上层方法，会按相同逻辑处理这个异常；如果mei有方法提供异常处理器，那么程序终止。

7、上面六种情况都是假设`finally`部分能够正确执行的。

但是如果程序执行到`finally`部分的代码`7`时：抛出了一个新异常（无论是`throw`显示抛出的还是程序执行引发的）或者执行`return`等转移控制流的语句，那么：

（1）如果之前的代码有原始异常（可能是未被`catch`捕获到的异常，也可能是`catch`块抛出的异常）要抛出，那么：这个原始异常会被`finally`部分抛出的新异常覆盖（”吞掉“）；

（2）如果之前的`try`块中没有抛出异常，且`try`块中最后要`return`一个值，那么：这个值会被`finally`部分抛出的新异常覆盖（”吞掉“）。

因此：要牢记==`finally`部分是用来清理资源的，代码块中不要有`return`等转移控制流的语句，同时还要确保`finally`部分的代码不会抛出异常。==

为了确保`finally`能够正确清理资源，可以这么写代码。这样还会报告`finally`部分出现的错误。

```java
InputStream in = ...;
try{
    try{
        ...
    }
    catch(EOFException e){
        ...
    }
    catch(FileNotFoundException | UnknownHostException e){
        ...
    }
    finally{
        in.close();
    }
}
catch(IOException e){
    ...
}
```



### `try-with-resources`语句

1、`try-with-resources`语句主要用于资源文件的读取操作，确保读取文件时即使发生错误也能够正确关闭，不会导致文件损坏。

2、要求：表示资源文件的对象必须是实现了`AutoCloseable`接口的类实例。`AutoCloseable`接口只有一个方法：`void close() throws Exception`。

3、这个语句能够保证：无论`try`语句中抛出了什么异常，在退出`try`块之前，都会自动调用`res1.close()`和`res2.close()`方法。

```java
// res1 res2未必是Resource类对象，可以是实现了`AutoCloseable`接口的任意类对象
try(Resource res1 = ...， Resource res2 = ...){
    // work with res
}
catch(Exception e){
    ...
}
finally{
    ...
}
```

4、`try-with-resourecs`语句后面还可以有`catch`和`finally`部分。在执行完`finally`部分代码（未抛出异常）或`close`方法（抛出了异常）之后，会继续执行`catch`（如果抛出了异常就会执行）和`finally`部分代码（只要有代码都会执行）。

5、如果`try`部分抛出了异常，执行`close`方法时又抛出了新异常，那么：原始异常`e`会被重新抛出，而`close`方法抛出的新异常会被”抑制“：自动调用`Throwable`类对象的`addSuppressed(Throwable t)`将`close`方法抛出的新异常添加进原始异常。之后，我们可以使用`e.getSuppressed()`方法获取`close`方法中被抑制的所有异常数组。



### 分析堆栈元素轨迹

==堆栈轨迹==是程序执行过程中某个特定点上所有挂起的方法调用的一个列表。

1、可以使用`Throwable`类的`printStackTrace`方法访问堆栈轨迹的文本描述信息。

```java
public class Test{
    public void main(String[] args){
        try{
            TestClass ts = new TestClass();
            ts.test();
        }
        catch(Exception e){
            System.out.println(e.toString());
            e.printStackTrace(System.out);
            e.printStackTrace();
            e.printStackTrace(System.err);
        }
    }
}
class TestClass{
    public void test() throws Exception{
        throw new FileNotFoundException();
    }
}
```

运行结果如下图所示：

![堆栈元素轨迹](/pictures/java/chap12/chap12_1.png)

2、一种更灵活的方法是使用`StackWalker`类，它会生成一个`StackWalker.StackFrame`实力流，其中每个实例分别描述一个栈帧。可以使用`forEach`方法操作迭代处理这些栈帧。

```java

public class Test{
    public void main(String[] args){
        try{
            TestClass ts = new TestClass();
            ts.test();
        }
        catch(Exception e){
            System.out.println(e.toString());
        }
    }
}
class TestClass{
    public void test() throws Exception{
        StackWalker walker = StackWalker.getInstance();
		walker.forEach(System.out::println);
        throw new FileNotFoundException();
    }
}
/** 输出结果为：
TestJava.TestClass.test(Test.java:168)
TestJava.Test.main(Test.java:42)
java.io.FileNotFoundException
*/
```



### 异常包装技术

异常包装就是将原始异常设置为新异常的原因，然后抛出新异常。

```java
try{
    ...
}
catch(SQLException original){
    var e = new ServletException("database error");
    e.initCause(original);
    throw e;
}
```

捕获到这个异常时，可以使用`e.getCause()`获取原始异常。



### 异常使用技巧

1、异常处理不能代替简单的测试

2、==不要过分细化异常==

一般而言当出现任何一种异常时都会取消任务，这种情况下异常类型的意义并不是很大。

3、==充分利用异常层次结构==

如果能够将一种异常转换成另一种更适合的自定义异常，那么不要犹豫。

4、==不要压制异常==

不要在`catch`部分什么也不处理，起码要打印出消息，否则它会被悄无声息地忽略。

5、==早抛出，晚捕获==

（1）早抛出：是为了能够获得最真实详细的错误原因。例如，当栈为空时，`Stack.pop()`方法该抛出一个异常还是返回`null`？我们认为最好在出错的地方直接抛出一个`EmptyStackException`异常，这要好于以后抛出一个`NullPointerException`异常。因为`NullPointerException`异常并不够详细，我们还需要进一步的排查。

（2）晚捕获：除非某个方法确定应该怎么处理异常，否则尽量将它抛出给调用它的方法。这样只有传递给合适的方法后，由它来根据任务逻辑决定怎么处理。

## 断言

断言机制允许在测试期间向代码中插入一些检查，而在生产代码中会自动删除这些检查。

`assert condition;`或`assert condition: expression;`

这两个语句都会计算`condition`，如果结果为`false`，则抛出一个`AssertionError`异常。在第二个语句中，表达式将传入`AssertionError`对象的构造器，并转换成一个消息字符串。应注意：`AssertionError`对象并不存储具体的表达式值，因此以后无法得到这个表达式值。

### 启用和禁用断言

1、通过命令行启用或禁用断言

```shell
// 运行MyApp，启用所有断言
java -enableassertions MyApp
// enableassertions可简写为ea
java -ea MyApp
// 运行MyApp, 启用 MyClass类 和 com.mycompany.mylib包及其子包的所有类 的断言
java -ea:MyClass -ea:com.mycompany.mylib MyApp
// 运行MyApp, 启用 MyClass类 的断言，禁用 com.mycompany.mylib包及其子包的所有类 的断言
java -ea:MyClass -disableassertions:com.mycompany.mylib MyApp
// disableassertions可简写为da
java -ea:MyClass -da:com.mycompany.mylib MyApp
```

启用或禁用断言是类加载器的功能，与编译器无关，但启用或禁用断言开关不能应用到那些没有类加载器的“系统类”上。

2、通过编程控制类加载器的断言状态

参见`java.lang.ClassLoader`类。

### 启用断言的情况

什么时候应该启用断言呢？如果方法的文档中这样指出：

```java
/**
...
@param a the array to be sorted(must not be null).
...
*/
```

那么对`null`数组调用这个方法是不合法的，因此在调用这个方法时，就应该提前使用断言：`assert a != null;`。否则，这个方法就会“为所欲为”。

如果文档中没有明确指出参数`a`不能为`null`，也就是没有指出`a`为`null`时该采取什么行动，那么在这种情况下，可以认为这个方法仍然会成功返回，而不会抛出一个异常。因此，就不应该使用断言。