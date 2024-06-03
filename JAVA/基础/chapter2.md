# Java 基本程序设计结构

## 注释

//

/*  */

/**  */

每个`/**...*/`文档注释包含标记以及之后紧跟着的自由格式文本。

### 标记

标记以`@`开始，如`@since`和`@param`。

1、`@see`标记

该标记增加一个超链接。超链接可以链接到包、类、变量或方法，也可以链接到指定的url。

（1）`@see package.class#feature label`

类名和feature（变量名或方法名）必须用`#`隔开。

label是锚点，也就是指代链接的文字。

链接到包：`@see TestEmployee`

链接到类：`@see TestEmployee.EmployeeTest` 或 `@see TestEmployee.EmployeeTest ` 。如果在同一个包中，就需要省略包名。

链接到方法：`@see TestEmplpyee.EmployeeTest#main(String[] args)` 或 `@see EmployeeTest#main(String[] args)`。如果在同一个包中，就需要省略包名。

（2）`@see <a href="...">label</a>`

`@see <a href="https://www.baidu.com">BaiDu</a>`

不要使用：

`@see <a href="www.baidu.com">BaiDu</a>`

因为这会被javadoc理解为相对路径`./www.baidu.com`，它会把`www.baidu.com`当作一个包名。

（3）`@see "text"`

`@see "Core Java 2 volume 2"`

2、`@link`标记

可以在注释的任何地方插入`{@link package.class#feature label}`，这表示指向其他类或方法的超链接。

3、`@author`标记

这个貌似不起作用，暂未找出原因。

4、`@version`标记

这个貌似不起作用，暂未找出原因。

### 自由格式文本

自由格式文本的第一句应该是一个概要性的句子。javadoc工具自动地将这些句子抽取出来生成概要页。

在自由格式文本中，可以使用HTML修饰符。例如，用于强调的`<em>...</em>`、用于着重强调的`<strong>...</strong>`、用于项目列表的`<ul>/<li>`、用于包含图像的`<img...>`、用于包含等宽代码的`{@code...}`等。

如果文档中有到其他文件的链接，如图像文件，就应该将这些文件放到包含源文件的目录下的一个子目录`doc-files`中。javadoc工具将从源目录将`doc-files`目录及其内容拷贝到文档目录中。在链接中需要使用`doc-files`目录，例如`<img src="doc-files/uml.png" alt="UML diagram"/>`。

### 类注释

类注释必须放在import语句之后、类定义之前。

注意：没有必要再每一行的开始都添加星号`*`。

### 方法注释

每一个方法注释必须放在所描述的方法之前。

常用的标记有：`@param variable description`、`@return description`、`@throws class description`。

### 字段注释

只需要对公共字段（通常指的是静态常量）建立文档。

### 包注释

要想产生包注释，需要在每一个包目录中添加一个单独的文件，有两种方法：

1、提供一个名为`package-info.java`的java文件，这个文件必须包含一个初始的以`/**...*/`界定的doc注释，后面是一个package语句。不能包含更多的代码或注释。

2、提供一个名为`package.html`的HTML文件。javadoc会抽取标记`<body>...</body>`之间的所有标记。

### 函数式接口注解

任何只有一个抽象方法的接口都是函数式接口，可以使用`@FunctionalInterface`注解。

这样做有两个优点：（1）如果无意中增加了一个抽象方法，编译器会产生一个错误消息；（2）javadoc页里会指出这个接口是一个函数式接口。

### javadoc工具

javadoc工具从下面几项中抽取信息：（1）模块；（2）包；（3）公共类与接口；（4）公共的和受保护的字段；（5）公共的和受保护的构造器及方法。

1、首先切换到包的基目录下，然后运行命令：

```shell
javadoc -d docDirectory nameOfPackage1 nameOfPackage2
```

这会为多个包生成文档。其中`-d docDirectory`指示提取的HTML所在的目录，如果省略了，则提取到当前目录下，不建议这么做。

如果是无名包，则运行命令：

```shell
javadoc -d docDirectory *.java
```

2、选项`-link url`可以为标准类添加超链接。例如：

```shell
javadoc -link http://docs.oracle.com/javase/9/docs/api *.java
```

所有的标准类库都会自动地链接到oracle网站地文档。

3、选项`-linksource`会将每个源文件转换为HTML文档，并且每个类和方法名都将变为指向源代码地超链接。HTML文档中不对代码着色，但包含行号。

4、还可以为所有的源文件提供一个概要注释，把它放在一个类似`overview.html`的文件中。这个文件的目录应该是包的基目录。

然后运行命令：

```shell
javadoc -d docDirectory nameOfPackage -overview overview.html
```

javadoc工具将抽取`overview.html`文件中标记`<body>...</body>`之间的所有文本。

当用户从导航栏中选择`"Overview"`时，就会显示这些内容。

## 八种基本数据类型

java是一种强类型语言，这意味着必须为每一个变量声明一种类型。

java有8种基本类型，其中有4种整型（byte、short、int、long），2种浮点类型（float、double），1种字符类型（char），1种boolean类型。

### 整型：byte/ short/ int/ long

1、byte：1字节；short：2字节；int：4字节；long：8字节。

2、整型都是有符号的，允许是负数。java中没有任何无符号（unsigned）形式的整型。

3、长整型（long）数值有一个后缀l或L，如4000000000L。

4、十六进制数值有一个前缀0x或0X，如0xCAFE；八进制数值有一个前缀0，例如010对应十进制的8，显然八进制表示法容易混淆，建议不要使用八进制常数；从java 7开始，二进制数值有一个前缀0b或0B。

5、从java 7开始，可以为数字字面量加下划线，比如1_000_000。这些下划线只是为了让人更易读，java编译器会去除这些下划线。

6、byte类型表示范围为-128到127的整数。因为ASCII编码共有128个字符（0到127），所以可以自动将char类型的英文字符转换为byte类型的整数。

```java
byte s = 'A';
System.out.println(s); // 65
```

### 浮点类型：float/ double

float：4字节；double：8字节。

float类型的精度为6-7位有效数字，double类型精度是其2倍。

float类型数值有一个后缀f或F，如3.12F。double类型数值有一个后缀d或D。没有后缀的浮点数值总是被默认为double类型。

表示溢出和出错情况的三种特殊浮点数值：正无穷大（Doule.POSITIVE_INFINITY）、负无穷大(Double.NEGATIVE_INFINITY)、NaN（Double.NaN，不是一个数字）。正整数除以0的结果为正无穷大；负整数除以0的结果为负无穷大；0/0或者负数的平方根结果为NaN。

所有“非数值”的值都是不同的，所以不能用`x==Double.NaN`监测一个特定值x是否为Double.NaN，但是判断某个数x是否为非数值NaN：`Double.isNaN(x)`。

### 字符类型：char

char：2字节。

char类型原本用于表示单个字符（1个字节），但现在是2个字节。因为有些Unicode字符可以用一个char值描述，另外一些Unicode字符则需要两个char值。

char类型的字面量值要用单引号''括起来，如’A‘。

==强烈建议不要使用char类型。==



### 布尔类型：boolean

boolean类型有两个值：false和true。

整型值和布尔值之间不能互相转换。

### 包装器







## 变量与常量

1、变量声明

```java
// 声明与初始化
int a = 3;
// 先声明后初始化
int k;
k = 3;
// 可以在一行种声明多个变量，但是不提倡这种风格
int i, j;
i = 1;
j = 2;
// 从java 10开始，对于局部变量，如果可以从变量的初始值推断出它的类型，就不需要声明类型，只需要使用关键字var
var y = "hello"
```

2、常量

关键字final指示常量。final表示这个变量只能被赋值一次，一旦被赋值以后，就不能再被更改了。

习惯上，常量名使用全大写。

const是java保留的关键字，但目前没有被使用。在java中，必须使用final定义常量。



## 运算符

### 算术运算符

#### + - * / % 

```java
// ==================加、减、乘、除、取模==================
// 加
int x = 5 + 6;
// 减
float y = 8.0 - 5;
// 乘
int z = 3 * 4;
// 除： 当两个操作数都为整数时，表示整数除法
int x = 5 / 3;
// 除：当至少有一个操作数为浮点数时，表示浮点除法
float y = 6.0 / 2;
// 求余（取模）
int z = 15 % 2;
// ==================结合赋值和运算符==================
int x = 4;
x += 4;
x -= 4;
x *= 4;
x /= 4;
x %= 4;
// ==================自增与自减运算符==================
int x = 3;
// 后缀表示变量先使用原来的值，然后变量再加1或减1
x++;
x--;
// 前缀表示变量先加1或减1，然后使用新值
++x;
--x;
// ==================其他数学运算需要借助Math类================== 
// 开方
double x = 4;
double y - Math.sqrt(x);
// 求幂
double z = Math.pow(x, 3);
```



#### 数值类型转换

当用一个二元运算符连接两个值时，先要将两个操作数转换为同一种类型，然后再进行计算：

1、如果至少有一个操作数为double类型，则另一个操作数会被转换为double类型；

2、如果至少有一个操作数为float类型，则另一个操作数会被转换为float类型；

3、如果至少有一个操作数为long类型，则另一个操作数会被转换为long类型；

4、否则，两个操作数都会被转换为int类型。

![num_transform_type](/pictures/java/chap02/chap_2_1.png)

#### 强制类型转换

```java
double x = 9.997;
// 通过截断小数部分将浮点值转换为整型
int nx = (int) x; // 9
// Math.round方法对浮点数进行舍入运算，返回一个long类型的整数
int nx = (int) Math.round(x); // 10
```



### 关系运算符

小于<

小于等于<=

大于>

大于等于>=

等于==

不等于!=



### 逻辑运算符

&& 与

|| 或

!  非

如果第一个操作数已经能够确定表达式的值，第二个操作数就不会被计算。



### 三元操作符

condition? expression1 : expression2



### 位运算符

& (and)

|（or）

^（xor）

~（not）

\>>（右移，符号位填充高位）

\<<（左移）

\>>>（右移，用0填充高位）

没有<<<这个运算符。

```java
// 如果n是一个整数变量，而且用二进制表示的n从右数第4位为1，则返回1；否则返回0
int fourthBitFromRight = (n & 0b1000) / 0b1000;
```



## 字符串：String类对象

1、java中使用双引号""界定字符串。java字符串就是Unicode字符序列。

```java
// 提取字串
String str = "Hello";
String s - str.substring(0, 3); // "Hel"
// 拼接： +
String str2 = ", my friend!";
String str3 = str1 + str2; // "Hello, my friend!"
int x = 16;
String str2 = str1 + x; // "Hello16"
// 将多个字符串按某个界定符拼接
String all = String.join("/", "S", "M", "L"); // "S/M/L"
// 重复
String repeated = "java".repeat(3); // "javajavajava"
// 检查字符串是否相等: 切记不要使用==（只是判断字符串的地址是否相同）
boolean isEqual = "Help!".equals("Hello"); // false
boolean isEqualIgnoreCase = "Hello".equals("hello"); // true
```



2、java字符串（String类对象）是不可变的，即不能修改字符串中的单个字符，也没有直接操作的函数。除非创建一个新的字符串。

```java
String str = "Hello";
String str2 = str.substring(0, 3) + "p!"; // "Help!"
```



不可变字符串有一个优点：编译器可以让字符串共享。



3、空串与null串

空串`""`是长度为0、内容为空的字符串（String类对象）。可以用`str.equals("")`判断。

null串表示目前没有任何对象与该变量关联。可以用`str==null`判断。

4、构建字符串

```java
StringBuilder builder = new StringBuilder();
builder.append("Hello");
builder.append(", ");
builder.append("my friend!");
String str = builder.toString();
```

## 控制流程

### 块

用{}括起来的部分。不能在嵌套的两个块中声明同名变量。

```java
public static void main(String[] args)
{
    int n;
    {
        int k;
        int n; //ERROR--can't redefine n in inner block
    }
}
```



### if语句

```java
if (a > 2){
    ...
}
else if (a > 1){
    ...
}
else{
    ...
}
```



### switch语句

```java
switch(choice){
    case 1:
        ...
        break;
    case 2:
        ...
        break;
    case 3:
        ...
        break;
    case 4:
        ...
        break;
    default:
        ...
        break;
}
```



![switch_process](/pictures/java/chap02/chap_2_2.png)



### while循环

```java
// while do循环
while (a > 2){
    ...
    a--;
}
// do while循环
do{
    ...
    a==;
}
while (a > 2);
```



### for循环

```java
for (int i=0; i < 10; i++){
    ...
}
```



#### break关键字

退出当前层的循环，不会退出最外层循环。

```java
for(int i=0; i<3; i++){
    for(int j=0; j<2; j++){
        if(j == 1){
            break;
        }
        System.out.println(j);
    }
}
// 输出为：
// 0
// 0
// 0
```



#### continue关键字

继续执行当前层的循环。

### for each循环

```java
int[] arr = {1, 2, 3, 4};
for(int item: arr){
    System.out.println(item);
}
```

## 枚举

```java
public class Test{
    public static void main(String[] args){
        Size size = Size.SMALL;
        
    }
}
// 定义一个枚举Size:枚举enum和类class一个等级,Size是一个枚举名
enum Size{
    SMALL, MEDIUM, LARGE;
}
// or
enum Size{
    SMALL(), MEDIUM(), LARGE();
}
/** 上述定义的完整形式实际上如下所示:
public enum Size extends Enum<Size>{
	SMALL(), MEDIUM(), LARGE();
	public Size(){}
}
*/
enum Size{
    SMALL("S"), MEDIUM("M"), LARGE("L");
    private String abbreviation;
    public Size(String abbreviation){
        this.abbreviation = abbreviation;
    }
    public String getAbbreviation(){
        return abbreviation;
    }
}
/** 与上述定义类似的类class形式如下所示:
class Size{
    private Size SMALL = new Size("S");
    private Size MEDIUM = new Size("M");
    private Size LARGE = new Size("L");
    private String abbreviation;
    public Size(String abbreviation){ // 构造器本应该是private的,但是类的语法不允许
        this.abbreviation = abbreviation;
    }
    public String getAbbreviation(){
        return abbreviation;
    }
}
*/
```



1、枚举`enum`和类`class`、接口`interface`是一个等级的，枚举`enum`后面的名称实际上就是枚举名，这个枚举名（`Size`）代表一种类型。

实际上，这种类型（`Size`）扩展了枚举类`Enum`（`Enum<Size>`）。

2、枚举和类一样，如果不定义构造器，会有一个默认的无参构造器。枚举的构造器总是`private`的（可以省略声明），如果显式声明为`public`或`protected`会出现语法错误：即不能自己创建一个枚举`Size`的常量。

3、枚举内部可以有多个枚举常量，用逗号`,`分隔，以分号`;`结束（如果后面没有语句的话可以也不写分号`;`）。

它们类似于`Size`类中的的静态字段（`Size`类对象），例如`Size.SMALL`，但不同的是它们必须"初始化"，即`SMALL("S")`这种形式：括号内的参数必须和构造器的参数匹配（参数数量与参数类型）。

如果构造器没有参数，也可以省略括号，即`SMALL()`或`SMALL`这种形式。

4、除了构造器和枚举常量，枚举内部还可以定义字段和方法。

5、所有的枚举都扩展了枚举类`Enum<T>`。该类的方法有：

```java
public class Enum<E>{
    private final String name; // name字段就是枚举常量的名称
    public final String name() { return name; } // 返回枚举常量名
    public String toString() { return name; } // 返回枚举常量名
    public final int ordinal() { return ordinal; } // 返回枚举常量次序(从0开始)
    public final int compareTo(E o) {...} // 返回当前枚举常量与o的次序之差
    // 返回某个枚举中名称为name的枚举常量
    public static <T extends Enum<T>> T valueOf(Class<T> enumClass, String name);
}
/** 以下代码说明了 "打印枚举变量s的toString()返回值" 等价于 "打印枚举变量"
public class PrintStream extends FilterOutputStream implements Appendable, Closeable {
    public void print(Object obj) {
        write(String.valueOf(obj));
    }
    ...
}
public final class String{
    public static String valueOf(Object obj) {
        return (obj == null) ? "null" : obj.toString();
    }
    ...
}
```



以下代码是枚举的使用示例：

```java
public class Test {
    public static void main(String[] args) {
        Size s = Size.LARGE;
        Size s2 = Size.MEDIUM;
        System.out.println(s.name()); // LARGE
        System.out.println(s.ordinal()); // 2
        System.out.println(s.toString()); // LARGE
        System.out.println(s); // LARGE
        System.out.println(s.compareTo(s2)); // 1
        Size s3 = Enum.valueOf(Size.class, "SMALL");
        System.out.println(s3.ordinal()); // 0
        Size[] sizes = Size.values();
        for(Size size: sizes){
            System.out.print(size.getAbbreviation()); // SML
        }
    }
}
enum Size{
    SMALL("S"), MEDIUM("M"), LARGE("L");
    private String abbreviation;
    private Size(String abbreviation){
        this.abbreviation = abbreviation;
    }
    public String getAbbreviation(){
        return abbreviation;
    }
}
```





## 数组

1、创建数组

```java
// 一般的声明和初始化方式
int[] arr = new int[100];
// 数组长度可以是变量
int size = 100;
int[] arr = new int[size];
// 另一种声明方式是将[]放置在变量名之后
int arr[] = new int[100];
// 另一种初始化方式
int[] arr = {1, 2, 3, 4};
// new int[]{1, 2, 3, 4}是一个匿名数组
int[] arr = new int[] {1, 2, 3, 4};
// 长度为0的数组的两种初始化方式
int[] arr = new int[0];
int[] arr = new int[]{}; 
```

2、一旦创建了数组，就不能再改变它的长度了。如果在程序运行中需要扩展数组的大小，就应该使用另一种数据结构：数组列表。

3、在没有给数组各元素赋值前，所有元素都是默认值，其中数值类型默认值为0，boolean类型默认值为false，字符char类型默认值为''，对象类型默认值为null。

4、数组的一些操作

```java
int[] arr = {1, 2, 3, 4};
// 打印数组中的所有值，Arrays.toString返回一个包含数组元素的字符串
System.out.println(Arrays.toString(arr)); // [1,2,3,4]
// 数组拷贝
int[] arr2;
arr2 = Arrays.copyOf(arr, arr.length); // [1,2,3,4]
arr2 = Arrays.copyOf(arr, arr.length / 2); // [1,2]
arr2 = Arrays.copyOf(arr, arr.length * 2); // [1,2,3,4,0,0,0,0]
// 数组排序：使用了优化的快速排序算法
arr2 = Arrays.sort(arr);
```

5、命令行参数

```java
public class Test{
    public static void main(String[] args) {
        for(String arg: args){
            System.out.println(arg);
        }
    }
}
// 结果为空，因为args为长度为0的数组
// 如果使用命令行调用程序 java Test -b Good ，则args=["-b", "Good"]
```
