# 类、源文件、包、jar、模块、工程

## 源文件与类

### 源文件中导入类

import语句用于导入类。类名必须是完整的，即包含完整包名的类名。

==java.lang包中的所有类总是会被默认导入。==

### 导入静态方法和字段

静态导入即导入类中的静态方法和静态字段。

```java
import static java.lang.System.*; //导入所有静态方法和静态字段
import static java.lang.System.out; // 导入特定的静态字段
```

### 源文件与类的关系

1、一个源文件中必须有且只能有一个与源文件同名的类。这个类可以不是`public`类，但是`public`类必须与源文件同名。

每个类都可以有一个`main`方法，可以选择运行不同类的`main`方法。

（1）如果一个源文件有多个类，那么在IDEA中，可以看到该源文件为`EmployeeTest.java`，它的子目录是该源文件下的两个类：`EmployeeTest`和`Employee`。

（2）如果一个源文件只有一个类，那么在IDEA中，可以看到两个源文件`Employee`和`EmployeeTest`，它们都没有后缀`.java`。

如果利用`javac`命令编译源文件，则所有的类都会被编译，所有类的`.class`文件都会位于同一目录下。

```java
import java.time.*;

public class EmployeeTest{
    public static void main(String[] args){
        Employee[] staff = new Employee[3];
        staff[0] = new Employee("Carl Cracker", 75000, 1987, 12, 15);
        staff[1] = new Employee("Harry Hacker", 50000, 1989, 10, 1);
        staff[2] = new Employee("Tony Tester", 40000, 1990,3, 15);
        for(Employee e: staff){
            e.raiseSalary(5);
        }
        for(Employee e: staff){
            System.out.println("name="+e.getName()+", salary="+e.getSalary()+", hireDay="+e.getHireDay());
        }
    }
}
class Employee{
    private String name;
    private double salary;
    private LocalDate hireDay;
    public Employee(String n, double s, int year, int month, int day){
        name = n;
        salary = s;
        hireDay = LocalDate.of(year, month, day);
    }
    public String getName(){
        return name;
    }
    public double getSalary(){
        return salary;
    }
    public LocalDate getHireDay(){
        return hireDay;
    }
    public void raiseSalary(double byPercent){
        double raise = salary * byPercent / 100;
        salary += raise;
    }
}
```



2、如果每个类对应一个源文件，只要它们在同一个包中，那么利用`javac`命令编译某个源文件，则所有的源文件都会被编译，并且各个类的`.class`文件会位于相同目录下。

注意几点：

（1）首先要进入基目录下。基目录就是包所在的目录（不要进入包目录内部）。

（2）然后执行`javac`命令进行编译。`javac`命令后面的java文件目录是”包目录\java文件“。

（3）最后执行`java`命令运行java类。`java`命令后面的类名是”包名.类名“。

如果不进入基目录，那么大概率会出错，因为找不到依赖的类。



## 包

可以使用包（package）将类组织在一个集合中。使用包的主要原因是确保类名的唯一性。

每一个包都是独立的类集合。从编译器的角度看，嵌套的包没有任何关系。例如`java.util`和`java.util.jar`包毫无关系。

一个包可以使用所属包中的所有类，以及其他包中的公共类。

在包中定位类是编译器的工作。类文件中的字节码总是使用完整的包名引用其他类。



### 导入包

看第4章。

当使用的类不是定义在基本包`java.lang`中时，一定要使用`import`指令导入相应的包。



### 命名冲突

如果导入的两个包中具有同名类，例如`java.util`和`java.sql`包都有`Date`类，那么使用`Date`类时为了避免命名冲突，有两种方法：（1）增加一个特定的`import`语句；（2）代码中写出完整的类名。

```java
import java.util.*;
import java.sql.*;
import java.util.Date;
	...
	var deadline = new Date(); // 方法(1)
	var today = new java.sql.Date(...); // 方法(2)
	...
```





### 在包中增加类

要想将类放入包中，就必须将包的名字放在源文件的开头。包名应该与类目录严格匹配。

```java
package com.horstmann.corejava;
import java.util.*;
public class Employee{
    ...
}
...
```



如果在以`java.`开头的包中添加我们自定义的类，是不是就可以访问java原生类的默认修饰符的方法和字段了？

1、java明确禁止加载包名以`java.`开头的用户自定义的类。

2、让JAR文件声明包时密封的，以防止第三方修改。

3、前两种机制已经过时了，现在应当使用模块封装包。



### 编译源文件时不检查目录结构

编译器在编译源文件时不检查目录结构。

考虑这样的情况：某个包只对应一个源文件，即包中所有的类都在同一个源文件中。

1、那么，即使这个源文件的真实目录并不是包名对应的目录，仍然会编译成功。

编译结果是：在真实目录下生成各个类的`.class`文件。

如果包中的类不在同一个源文件中，那么当对某个源文件执行`javac`命令进行编译时，会报错，因为找不到依赖的其他类（源文件）。除非"该文件的所有类"都没有引用"其他源文件的类"，这样就只会生成该源文件中各个类的`.class`文件。

2、但是，当执行`java`命令运行时，虚拟机是从包名对应的目录中去找`.class`文件的，所以运行会出错。除非将所有类文件移动到包名对应的目录下。



### 无名包

如果没有在源文件中放置package语句，那么这个源文件中的类就属于无名包，即没有包名。



## 类路径

类的路径必须与包名匹配。类文件就是`.class`文件。

为了使类能够被多个程序共享，一般需要做到以下几点：

1、把所有类文件放到同一个目录中，例如`/home/user/classdir`。这个目录是包树状结构的基目录，例如对于类`TestEmployee.EmployeeTest`，其类文件`EmployeeTest.class`的路径应当为`/home/user/classdir/TestEmployee/EmployeeTest.class`。

2、把所有jar文件放在同一目录下，例如`/home/user/archives`。

3、设置类路径。如果没有设置类路径，那么默认的类路径会包含`.`目录（当前目录）。

（1）在UNIX环境中，各项类路径之间用冒号`:`分隔，用点号`.`表示当前目录。例如`/home/user/classdir:.:/home/user/archives/'*'`。其中`*`是通配符，但必须转义以防止shell扩展。

（2）在Windows环境中，各项类路径之间用冒号`;`分隔，用点号`.`表示当前目录。例如`C:\classdir;.;C:\archives\*`。其中`*`是通配符。

### 编译器查找类

javac编译器查找类要比虚拟机复杂得多。如果引用了一个类`Employee`，而没有指定这个类的包，那么编译器将首先查找包含这个类的包。

1、首先查看所有的`import`指令，确定其中是否包含这个类。

```java
import java.util.*;
import com.corejava.*;
```

1、编译器会依次查找以下几个类（查找目标）：`java.lang.Employee`、`java.util.Employee`、`com.corejava.Employee`、当前包中的`Employee`。查找路径则是类路径中定义的所有位置。

（1）对于当前包来说，编译器会查找所有的源文件，查看哪个源文件定义了这个类。

（2）编译器总是会在当前目录中查找文件。

2、如果找到了一个以上的类，就会产生编译时错误，因为完全限定类名必须是唯一的。

3、找到了类之后，还要查看源文件是否比类文件新。如果是，那么源文件就会被自动地重新编译，生成最新的`.class`文件。

### 虚拟机查找类文件

类路径所列出的目录和jar文件是搜寻类的起始点，假设类路径被设置为`/home/user/classdir:.:/home/user/archives/archives.jar`，现在虚拟机要搜寻类`TestEmployee.EmployeeTest`：

1、首先查看java API类。

2、找不到就查看类路径。首先查找`/home/user/classdir/TestEmployee/EmployeeTest.class`文件。

3、找不到就查找`./TestEmployee/EmployeeTest.class`文件。

注意：java虚拟机仅在类路径中包含`.`目录时才查看当前目录。如果没有设置类路径，因为默认类路径会包含当前目录`.`，所以没有什么问题。但如果设置了类路径而忘记包含当前目录`.`了，那么尽管可以编译通过，却不能运行。

4、找不到就查找`/home/user/archives/archives.jar/TestEmployee/EmployeeTest.class`文件。

### 设置类路径

在使用`java`命令运行java程序时：

（1）可以增加`-classpath`（或`-cp`、或`-class-path`）选项来指定类路径。

（2）也可以设置`CLASSPATH`环境变量来指定类路径。具体细节依赖于所使用的shell。直到退出为止，类路径设置均有效。



## jar文件

一个jar文件中，可以包含多个压缩形式的类文件和子目录，这样既可以节省空间又可以改善性能。

### 应用程序打包

将应用程序打包时，我们希望只向用户提供一个单独的文件，而不是一个包含大量类文件的目录结构，jar文件就是为此目的设计的。

一个jar文件既可以包含类文件，也可以包含诸如图像和声音等其他类型的文件。

jar文件使用zip格式组织文件和子目录。

可以使用jar工具制作jar文件。jar工具在默认的jdk安装包中，目录位于jdk/bin。

以下是jar命令的选项：

![jar程序选项](/pictures/java/chap10/chap10_1.png)

![jar程序选项](/pictures/java/chap10/chap10_2.png)

#### 清单文件

除了类文件、图像和其他资源外，每个jar文件还包含一个清单文件`META-INF/MANIFEST.MF`，用于描述归档文件的特殊特性。

1、清单文件格式

符合标准的最小清单文件极其简单：

```json
Manifest-Version: 1.0
```

复杂的清单文件可能包含更多条目。这些清单条目被分成多个节，节与节之间用空行分开。

第一节称为主节，作用于整个jar文件。

随后的条目用来指定命名实体的属性，如单个文件、包或者url，它们都必须以一个Name条目开始。

```json
Manifest-Version: 1.0

Name: Woozle.class

Name: com/mycompany/mypkg/
```

2、创建包含清单文件的jar文件

```shell
jar cfm MyArchive.jar manifest.mf com/mycompany/mypkg/*.class
```

这行命令相当于三行命令：

```shell
# 将所有.class文件打包到.jar文件中
jar c MyArchive.jar com/mycompany/mypkg/*.class
# 将清单文件添加到.jar文件中
jar f MyArchive.jar manifest.mf
# 为.jar文件添加清单信息
jar m MyArchive.jar
```

3、编辑清单文件

要想编辑文件，需要将希望添加到清单文件中的行放到文本文件`manifestFileName`中，然后运行：

```shell
jar cfm jarFileName manifestFileName
```

4、更新.jar文件的清单

```shell
jar ufm MyArchive.jar manifest-additions.mf
```



## 模块

多个现有的java模块系统都依赖于类加载器来实现类之间的隔离。但是，java 9引入了一个由java编译器和虚拟机支持的新系统，称为java平台模块系统。模块使类和包可以有选择性地获取，从而使得模块地演化可以受控。

包是类的集合，包和类一样，也提供了一种封装级别，具有包访问权限的所有特性（无论是公有的还是私有的）都只能被同一个包中的方法访问。但是，在大型系统中，这种级别的访问控制仍显不足。所有公有特性（即在包的外部也可以访问的特性）可以从任何地方访问。假设我们想要修改或剔除一个很少使用的特性，如果它是公有的，那么就没有办法推断这个变化所产生的影响。

一个java平台模块包括：

（1）一个包集合；（2）可选的包含资源文件和像本地库这样的其他文件；（3）一个有关模块中可访问的包的列表；（4）一个有关这个模块依赖的所有其他模块的列表。

java平台在编译时和在虚拟机中都强制执行封装和依赖。

### 模块的命名

1、模块是包的集合，==模块中的包名无须彼此相关==，并且模块名和包名相同也是完全可行的。例如，`java.sql`模块中就包含了`java.sql`、`javax.sql`、`javax.transaction.xa`这几个包。

2、按照惯例，包的基目录一般都是模块名。

2、模块名和路径名一样，是由字母、数字、下划线、句点构成的。而且，和路径名一样，==模块之间没有任何层次关系==。例如有一个模块是`com.horstmann`，另一个模块是`com.horstmann.corejava`，那么就模块系统而言，它们是无关的。

3、当创建供他人使用的模块时，重要的是确保==模块的名字应该是全局唯一的==。

4、==模块名只用于模块声明中，在java类的源文件中只能引用包名而不能引用模块名==。

5、不具名的包不能包含在模块中。

6、模块没有作用域的概念，因此不能在不同的模块中放置两个具有相同名字的包。即使是隐藏的包（不会导出的包）也是如此。

### 模块化的程序

```java
package com.horstmann.hello;
public class HelloWorld{
    public static void main(String[] args){
        System.out.println("Hello, Modular World!");
    }
}
```

为了创建这个包的`v2ch09.hellomod`模块，需要添加一个模块声明，可以将其置于名为`module.info.java`的文件中，该文件位于基目录中（即与包含`com`目录的目录相同）。

#### 基目录名与模块名相同

按照惯例，基目录的名字与模块名相同。

```
v2ch09.hellomod/
	module-info.java
	com/
		horstmann/
			hello/
				HelloWorld.java
```

`module-info.java`就是模块声明文件，该文件内容如下：

```java
module v2ch09.hellomod
{

}
```

现在进入`v2ch09.hellomod`目录的上级目录中，执行以下命令进行编译，这个文件会以二进制文件形式编译到包含该模块定义的类文件`module-info.class`中。

```shell
javac	v2ch09.hellomod/module-info.java	v2ch09.hellomod/com/horstmann/hello/HelloWorld.java
# or
javac	.\v2ch09.hellomod\module-info.java	.\v2ch09.hellomod\com\horstmann\hello\HelloWorld.java
```

第一个`.java`文件是模块声明文件，第二个`.java`文件是主类的源文件。

运行以下命令，将执行这个程序：

```shell
java	--module-path v2ch09.hellomod	--module v2ch09.hellomod/com.horstmann.hello.HelloWorld
# or
java	-p v2ch09.hellomod	-m v2ch09.hellomod/com.horstmann.hello.HelloWorld
# or (.代表当前目录)
java -p . -m v2ch09.hellomod/com.horstmann.hello.HelloWorld
```

其中`-p`或`--module-path`选项指定模块路径（也就是模块声明文件所在的目录），`-m`或`--module`选项指定主类（"模块名/类名"格式，不能是反斜杠`\`）。

#### 基目录名与模块名不同

```
anotherModule/
	module-info.java
	com/
		horstmann/
			hello/
				HelloWorld.java
```

现在进入`anotherModule`目录的上级目录中，执行以下命令进行编译：

```shell
javac	anotherModule/module-info.java	anotherModule/com/horstmann/hello/HelloWorld.java
```

运行以下命令运行程序，其中`.`表示当前目录：

```shell
java	-p anotherModule	-m v2ch09.hellomod/com.horstmann.hello.HelloWorld
# or (.代表当前目录)
java	-p .	-m v2ch09.hellomod/com.horstmann.hello.HelloWorld
```



### 对模块的需求

```java
package com.horstmann.hello;
import javax.swing.JOptionPane;
public class HelloWorld{
    public static void main(String[] args){
        JOptionPane.showMessageDialog(null, "Hello, Modular World!");
    }
}
```

文件结构依然为：

```
requiredModule/
	module-info.java
	com/
		horstmann/
			hello/
				HelloWorld.java
```

模块声明文件内容如下：

```java
module v2ch09.requiremod
{

}
```

现在进入`myjava`目录下，编译会失败：

```shell
javac .\requiredModule\module-info.java .\requiredModule\com\horstmann\hello\HelloWorld.java
# javax.swing包被声明在java.desktop模块中，但是没有读入java.desktop模块(因为模块声明中没有声明依赖)
error: package javax.swing is not visible
	(package javax.swing is declared in module java.desktop,
	but module v2ch09.requiremod does not read it)
```

原因是jdk已经被模块化了，并且`javax.swing`包现在包含在`java.desktop`模块中。我们的模块需要声明它依赖于这个模块：

```java
module v2ch09.requiremod{
	requires java.desktop;
}
```

现在进入`requiredModule`目录的上级目录中，输入以下命令：

```shell
javac .\requiredModule\module-info.java .\requiredModule\com\horstmann\hello\HelloWorld.java
java -p requiredModule -m v2ch09.requiremod/com.horstmann.hello.HelloWorld
```



模块系统的设计目标之一就是模块需要明确它们的需求，使得虚拟机可以确保在启动程序之前所有的需求都得以满足。在`v2ch09.hellomod`的例子中，并没有产生明确的需求，这是因为我们只用到了`java.lang`和`java.io`包。这些包都包含在默认需要的`java.base`模块中。

一般在三种情况下，模块`M`会读入模块`N`：（1）`M`需要`N`；（2）`M`需要某个模块，而该模块传递性地需要`N`；（3）`N`是`M`或`java.base`。

### 模块中导出包

一个模块如果想要使用其他模块的包，就必须声明需要该模块。但是，这不会自动使得所需模块中的所有包都可用。

模块可以使用`exports`关键词来声明它的那些包可用：

```java
module java.xml{
    exports javax.xml;
    exports javax.xml.catalog;
    exports javax.xml.datatype;
    exports javax.xml.namespace;
    exports javax.xml.parsers;
}
```

`java.xml`这个模块让许多包都可用，但是通过不导出其他包（`jdk.xml.internal`等）而隐藏了它们。

当包被导出时，它的`public`成员，在模块的外部也是可以访问的；`protected`成员，只有在模块外部的子类中是可以访问的。

当包没有被导出时，该包中即使是公有（`public`）的类，也无法在模块外部被访问。

#### 举例

```
myjava/
	com.horstmann.greet/
		module-info.java
		com/
			horstmann/
				greet/
					Greeter.java
					internal/
						GreeterImpl.java
	v2ch09.exportedpkg/
		module-info.java
		com/
			horstmann/
				hello/
					HelloWorld.java
```

代码如下：

公有的`Greeter`接口在第一个包中：

```java
package com.horstmann.greet;
public interface Greeter{
    static Greeter newInstance(){
        return new com.horstmann.greet.internal.GreeterImpl();
    }
    String greet(String subject);
}
```

第二个包有一个实现了该接口的类：

```java
package com.horstmann.greet.internal;
import com.horstmann.greet.Greeter;
public class GreeterImpl implements Greeter{
    public String greet(String subject){
        return "Hello, " + subject + "!";
    }
}
```

`com.horstmann.greet`模块会包含这两个包，其模块声明文件为：

```java
module com.horstmann.greet{
    exports com.horstmann.greet;
}
```

我们的应用程序将使用`Greeter`类，应用程序放在`com.horstmann.hello`包中：

```java
package com.horstmann.hello;
import com.horstmann.greet.Greeter;
public class HelloWorld{
    public static void main(String[] args){
        Greeter greeter = Greeter.newInstance();
        System.out.println(greeter.greet("Modular World"));
    }
}
```

应用程序所在的模块声明文件为：

```java
module v2ch09.exportedpkg{
    requires com.horstmann.greet;
}
```

现在，进入`myjava`目录中，执行以下命令，以编译和运行程序：

```shell
# 注意复制下面的命令时去掉换行符和制表符,否则会报错
javac	.\com.horstmann.greet\module-info.java	.\com.horstmann.greet\com\horstmann\greet\Greeter.java	.\com.horstmann.greet\com\horstmann\greet\internal\GreeterImpl.java
javac -p .\com.horstmann.greet	.\v2ch09.exportedpkg\module-info.java	.\v2ch09.exportedpkg\com\horstmann\hello\HelloWorld.java
java	-p .	-m v2ch09.exportedpkg/com.horstmann.hello.HelloWorld
# 这句会报错
java    -p v2ch09.exportedpkg;com.horstmann.greet    -m v2ch09.exportedpkg/com.horstmann.hello.HelloWorld
```



### 模块化的jar

模块可以通过将其所有的类都置于一个jar文件而得以部署，其中`module-info.class`在jar文件的根部。这样的jar文件被称为模块的jar。

1、如果一个模块中有多个包，可以先使用`javac`命令的`-d`选项将所有的类文件置于指定的目录中（在指定目录中，各个类文件在与源文件相同的文件结构中），然后在收集这些类文件时使用`jar`命令的`-C`选项来指定类文件所在的目录。

```shell
# Windows中使用dir命令查找文件,Linux使用find
javac -d .\javas $(dir -s *.java)
	# or
	javac -d javas $(dir -s .\com.horstmann.greet\*.java)
jar -cvf myjar.jar -C .\javas .
# 运行jar
java	-p myjar.jar	-m com.horstmann.greet/com.horstmann.hello.HelloWorld
```

创建`.jar`文件时可以指定主类：

```shell
# 报错: -e: com.horstmann.hello.HelloWorld: 没有这个文件或目录
jar -cvf myjar.jar -e com.horstmann.hello.HelloWorld -C .\javas .
# 运行成功
jar -c -v -f myjar.jar -e com.horstmann.hello.HelloWorld -C .\javas .
```

如果`.jar`文件的主类（程序入口点）是一个控制台应用程序，则双击`.jar`文件看不到什么变化。

2、如果`v2ch09.exportedpkg`模块依赖另一个`.jar`文件中的模块：

```shell
javac -p myjar.jar -d v2ch09.exportedpkg $(dir -s .\v2ch09.exportedpkg\*.java)
jar -c -v -f v2ch09.exportedpkg.jar -e com.horstmann.hello.HelloWorld -C .\v2ch09.exportedpkg\ .
```

然后执行以下命令运行：

```shell
# .表示当前目录,即v2ch09.exportedpkg.jar的上级目录
java -p . -m v2ch09.exportedpkg
```

双击`.jar`文件无法运行，因为它依赖`myjar.jar`文件的模块，必须要在命令行中用`-p`选项指定`myjar.jar`文件的路径，并且`v2ch09.exportedpkg.jar`文件要和`myjar.jar`文件位于同一路径下。

因为`v2ch09.exportedpkg.jar`依赖`myjar.jar`文件，因此双击`v2ch09.exportedpkg.jar`文件并不会执行它。但是如果`v2ch09.exportedpkg.jar`文件只依赖`java.base`模块，则双击该文件会执行。

3、在创建`.jar`文件时，可以选择指定版本号。使用`--module-version`选项，同时在`.jar`文件名上添加`@`和版本号：

```shell
jar -c -v -f v2ch09.exportedpkg@1.0.jar --module-version 1.0 -e com.horstmann.hello.HelloWorld -C .\v2ch09.exportedpkg\ .
```



### 模块和反射式访问

在没有引入模块系统之前，我们可以利用反射访问任意类对象，并且对于类中的`private`字段，可以通过`setAccessibale`方法设置字段为可访问，然后利用`Field.set(Object, Object)`方法更改私有字段的值。

在引入了模块系统之后，我们仍然可以利用反射访问类对象，但仅限于模块中显式导出（利用`exports`关键字导出，即使这个包没有利用`opens`关键字修饰）的包中的类，并且对于这些导出包中的类的私有字段，我们是无法通过`setAccessibale`方法设置字段为可访问的（运行时抛出`InaccessibaleObjectException`异常），自然也就无法更改私有字段的值了。

如果在模块声明文件中，一个被`exports`显式导出的包，又利用`opens`关键字修饰了，那么对于该包中的类，其私有字段可以利用反射被更改，当然前提是这个类本身被定义为`public`的。

1、如果是一个明确模块（不是自动模块，也不是不具名模块，即`module-info.class`文件在模块路径上的模块）依赖`v2ch09.openpkg`模块，那么下面的声明意味着：该模块能访问`v2ch09.openpkg`模块中`com.horstmann.places`包中的`public`类，并且能够更改类中的私有字段；如果没有`exports`声明，那么首先就无法使用`com.horstmann.places`中的类，但是只要类对象能够被作为方法参数传入，即使不知道它的具体类型，也能够利用反射去访问这个类，并且更改类的私有字段。

```java
module v2ch09.openpkg{
    requires com.horstmann.util;
    exports com.horstmann.places;
    opens com.horstmann.places;
}
```

2、如果是一个自动模块或不具名模块依赖`v2ch09.openpkg`模块，那么下面的声明中即使没有`exports`语句，该模块也能够访问`v2ch09.openpkg`模块中`com.horstmann.places`包中的任意`public`类，并且能够更改类中的私有字段。

```java
module v2ch09.openpkg{
    requires com.horstmann.util;
    opens com.horstmann.places;
}
```

3、另外，整个模块也可以使用`open`（注意不是`opens`）关键字声明，这相当于对模块中的所有包都使用`opens`关键字（即允许反射式访问但未必导出），一旦模块被声明为`open`，就不允许在模块声明内再出现`opens`了：

```java
open module v2ch09.openpkg{
    requires com.horstmann.util;
}
```



### 自动模块

模块路径上没有`module-info.class`文件的`.jar`文件被称为自动模块。自动模块具有以下属性：

（1）自动模块隐式地包含对其他明确模块的`requires`子句，并且对于明确模块中没有导出的包，该自动模块仍然可以访问这些包中的类；

（2）自动模块的所有包都被导出，且都是开放的（`exports`+`opens`）；

（3）明确模块可以访问自动模块，对于自动模块的模块名：如果在该自动模块的`.jar`文件的清单`META-INF/MANIFEST.MF`中具有键为`Automatic-Module-Name`（自动模块名）的项，那么它的值会变为模块名；否则，`.jar`文件的文件名就是自动模块名，并且文件名中尾部的版本号会被删除，并将非字母数字的字符替换为句点`.`。

例如，我们正在实现一个处理`.csv`文件的模块，其中依赖了`Apache Commons CSV`库，这个库对应的`.jar`文件是`commons.csv-1.5.jar`，但是`commons.csv-1.5.jar`文件是自动模块。

如果它的清单文件`META-INF/MANIFEST.MF`中没有键为`Automatic-Module-Name`（自动模块名）的项，那么在我们的模块声明中就应该使用`commons.csv`作为它的模块名：

```java
module v2ch09.automod{
    requires commons.csv;
}
```

如果它的清单文件`META-INF/MANIFEST.MF`中有键为`Automatic-Module-Name`（自动模块名）的项，并且设置为它的顶级包名：

```java
Automatic-Module-Name: org.apache.commons.csv
```

那么在我们的模块声明中就应该使用`org.apache.commons.csv`作为它的模块名：

```java
module v2ch09.automod{
    requires org.apache.commons.csv;
}
```



### 不具名模块

任何不在模块路径中的`.jar`文件都被该模块视为不具名模块。可能会有多个不具名模块，它们合起来也是单个不具名模块。不具名模块具有以下属性：

（1）不具名模块隐式地包含对其他明确模块的`requires`子句，并且对于明确模块中没有导出的包，该不具名模块仍然可以访问这些包中的类；

（2）不具名模块的所有包都被导出，且都是开放的（`exports`+`opens`）；

（3）明确模块不能访问不具名模块；

（4）自动模块可以访问不具名模块，因为它们的依赖关系放在类路径中。

### 传递的需求

```java
module javafx.controls{
    requires transitive javafx.base;
}
```

现在，任何声明需要`javafx.controls`的模块都会自动的需要`javafx.base`模块。

### 限定导出和开放

```java
module javafx.base{
    exports com.sun.javafx.collections to
        javafx.controls, javafx.graphics, javafx.fxml, javafx.swing;
}
```

这样的语句被称为限定导出，所列的模块可以访问`com.sun.javafx.collections`包，其他模块不能访问。

类似地，也可以将`opens`语句限制到具体的模块。

### 操作模块的工具

#### `jdeps`工具

该工具可以分析给定的`.jar`文件集之间的依赖关系。

```shell
jdeps -s  A.jar  B.jar  C.jar  Test.jar
```



#### `jlink`工具

该工具可以产生执行时无须单独的java运行时环境的应用程序。所产生的镜像文件要比整个JDK小得多。

```sh
jlink --module-path A.jar;B.jar;C.jar;Test.jar;$JAVA_HOME\jmods --add-modules Test --output .\save2\save3
```

运行：

```shell
.\save3\bin\java -m Test
```

`jlink`的关键是它将运行程序所需的最小的模块集打包在一起。可以列出其中包含的所有模块：

```shell
PS D:\Code\myjava\save\save2\save3> bin\java --list-modules
ModuleA
ModuleB
ModuleC
Test
java.base@17.0.8
```

所有模块都包含在运行时镜像文件`lib\modules`中。

这可以成为用于打包应用程序的实用工具的基础。我们仍旧需要产生针对多平台的文件集和针对应用程序的脚本。



#### `jmod`工具







### 用于迁移的命令行标识







## 工程与模块

假设你的java项目中，最顶级模块的名称为`corejava`，它是一个目录名称。这个目录又放在一个名为`corejava`的目录中。

现在要在IDEA中，要打开一个工程。这个工程的目录名称就是你的最顶级模块（第二个`corejava`）的目录名称。

如果是第一个`corejava`的目录名称，IDEA会将第一个`corejava`当作模块名称。又因为子目录中还有一个模块`corejava`，所以会报错，所有的子模块都不能被识别，因此无法运行任何类的`main`方法。



## `PATH`和`CLASSPATH`

**环境变量PATH是什么，对java有什么用？**



https://docs.oracle.com/javase/tutorial/essential/environment/paths.html

https://docs.oracle.com/javase/8/docs/technotes/tools/windows/classpath.html#A1100762

https://docs.oracle.com/javase/specs/jls/se17/html/jls-7.html#jls-7.3

### `PATH`

#### 设置`PATH`

可以使用以下命令来检查`PATH`中是否包含java路径。

```shell
java -version
# or
java --v
```

jdk安装目录的`/bin`子目录下，包含等一系列**jdk工具**，例如：java编译器（`javac.exe`）、java启动器（`java.exe`）、`jar`、`javadoc`等。

1、以Windows系统为例：

（1）实际上可以不设置环境变量`PATH`，只要知道编译器`javac.exe`的绝对路径即可。

```shell
# 编译: <path of javac.exe> <fileName of .java>
C:\Java\jdk1.7.0\bin\javac MyClass.java
```

（2）但是，要在任何地方使用以下命令编译或允许java程序，就必须设置环境变量`PATH`：

```shell
javac MyClass.java
```

这是因为系统不知道`javac.exe`（`javac`命令被认为对于`javac.exe`可执行文件）在哪里，所以会到环境变量`PATH`指定的一系列路径下查找。

（3）`PATH`是一系列用分号`;`分隔的目录（Linux系统下为冒号`:`）。系统按从左到右的顺序在`PATH`目录中查找程序。如果找到了，则之后的目录会被忽略。

```
# PATH示例
C:\Java\jdk1.7.0\bin;C:\Windows\System32\;C:\Windows\;C:\Windows\System32\Wbem
```

2、以Linux系统为例：

（1）首先更改`~/.bashrc`文件，添加下面两行。注意：在linux系统中，`PATH`是一系列用冒号`:`分隔的目录（Windows系统下为分号`;`）。

```
PATH=C:\Java\jdk1.7.0\bin:$PATH
export PATH
```

（2）然后执行`~/.bashrc`文件，以更新配置：

```shell
source ~/.bashrc
```



### `CLASSPATH`

`CLASSPATH`也是环境变量。

1、设置`CLASSPATH`变量的方法与`PATH`相同。要检查是否定义了`CLASSPATH`变量，可以使用以下命令：

```shell
# Windows
echo %CLASSPATH%
# Linux
echo %CLASSPATH
```

2、变量`CLASSPATH`（类路径）是告诉应用程序（包括jdk工具）在哪里查找用户类的一种方法。==属于jre、jdk平台和扩展的类应该通过其他方式定义，例如引导类路径或扩展目录==。

3、指定`CLASSPATH`的首选方法是使用`-cp`或`-classpath`命令行开关，这样就可以为每个应用程序单独设置`CLASSPATH`，而不影响其他应用程序。

4、`CLASSPATH`的默认值是`.`，表示只搜索当前目录。定义了`CLASSPATH`变量或使用`-cp`（`-classpath`）命令行开关指定了类路径后，会覆盖该值。

==思考：当前目录是什么？==

5、`CLASSPATH`可以是包含`.jar`文件的目录。



类路径是java运行时环境（jre）搜索类文件、jar文件、zip文件和其他资源文件的路径。`CLASSPATH`变量指定了类路径。



每个类路径应以文件名或目录结尾： 

（1）对于包含类文件的jar或zip文件，类路径以jar或zip文件的名称结尾；

（2）对于未命名包中的类文件，类路径以包含类文件的目录结尾；

（3）对于命名包中的类文件，类路径以包含根包的目录结尾，根包是完整包名称中的第一个包。