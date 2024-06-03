# 接口

## 接口语法

与建立类的继承层次一样，也可以扩展接口，即允许有多条接口链，从通用性较高的接口扩展到专用性较高的接口。

### 实现接口的类

一个类可以实现一个或多个接口。实现接口用关键字`implements`。

不能用`new`运算符实例化一个接口。但是可以声明接口的对象变量，该对象变量可以引用实现了该接口的类对象。

可以使用`instacnceof`检查一个对象变量是否属于某个特定接口。如果该对象变量`x`引用的实现该接口`I`的类对象，那么用`x instanceof I`检查时返回`true`。

#### 类实现接口的方法

实现接口的类必须实现所有`public`方法，可以实现也可以不实现`public default`方法，至于`public static`、`private`、`private static`方法，实现了也没有什么用，会被看做类自身的方法。

如果有没有实现的`public`方法，那么这个类本身就是抽象的，即将该类修饰为`abstract`类。

```java
public class Test{
    public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        var tss = new TestClass(3, 1998, 3);
        System.out.println(tss.getName()); // zhang san
        System.out.println(TestInterface.getDay()); // 1
        System.out.println(tss.getBirthday()); // Default Birthday
    }
}
class TestClass implements TestInterface{
    private int id;
    private int year;
    private int month;
    public TestClass(int id, int year, int month){
        this.id = id;
        this.year = year;
        this.month = month;
    }
    public int getId(){
        return id;
    }
    public String getName(){
        return "zhang san";
    }
}
interface TestInterface{
    public static int getDay(){
        return 1;
    }
    public static String getName(){
        return "xxx";
    }
    public default String getBirthday(){
        int x = getDay();
        String name = getName();
        return "Default Birthday";
    }
}
```

#### 解决默认方法冲突

1、如果接口中的某个方法（`public`或`public default`）和超类中的方法签名相同，那么java的规则是==超类优先==：对于接口中的`public`方法，类中可以不实现，超类中的该方法被看作是具体的实现；对于接口的`public default`方法，java会忽略接口中的该方法，只使用超类中的方法。

2、如果两个接口中提供了签名相同的默认方法，那么java要求该类必须==覆盖==这个方法来解决冲突：java最后会使用类中的这个方法作为两个接口的具体实现。

```java
public class Test{
    public static void main(String[] args){
        var ts = new Manager();
        System.out.println(ts.getDescription()); // hard
    }
}
class Manager extends Employee implements Person, Named{
    public String getName(){
        return Named.super.getName();
    }
}
class Employee{
    public String getDescription(){
        return "hard";
    }
} 
interface Person{
    default String getName(){ 
        return "";
    }
    default String getDescription(){
        return "good"
    }
}
interface Named{
    String getName(){
        return "xxx";
    }
}
```



### 接口的字段

接口不能提供实例字段，但可以定义常量，常量的修饰符自动是`public static final`。

这里的常量指的是静态常量，因为不可能存在接口的实例，所以该常量必然属于整个接口，即该常量的修饰符自动是`static final`。

### 接口的方法（java 8以后）

因为接口中不允许包含`protected`方法，并且当不提供访问权限修饰符时，都会被自动设置为`public`，所以接口中只有两种（而不是四种）方法：`public`和`private`方法，我们称之为公有方法和私有方法。

#### 公有方法

公有方法的作用就是由实现接口的类去具体实现（`public abstract`（`abstract`被省略）、`public default`）或直接调用（`public static`）。

`public abstract`方法：抽象方法，不能有函数体，只能由实现接口的类去具体实现。

`public default`方法：必须有函数体，即有具体实现，函数体中可以调用接口的`private`方法、`private static`方法、`public default`方法，可以调用常量，但是不能调用实例字段（因为接口没有实例字段）。这种方法的另一个重要作用是==接口演化==：当为接口增加新的方法时，`default`可以保证==源代码兼容==，即不影响以前实现了该接口的类。

`public staitic`方法：必须有函数体，即有具体实现，函数体中可以调用接口的`private`方法、`private static`方法、`public default`方法，可以调用常量，但是不能调用实例字段（因为接口没有实例字段）。

#### 私有方法

私有方法的作用就是被接口中的其他有具体实现的方法调用。可以也可以不用`static`修饰，但是没有什么意义。因为两者区别就在于被调用时怎么写：前者用`this.`调用，后者用`interfaceName.`调用，但在接口中这两个调用都可以省略。

`private`或`private static`方法：必须有函数体，即有具体实现，函数体中可以调用接口的`private`方法、`private static`方法、`public default`方法，可以调用常量，但是不能调用实例字段（因为接口没有实例字段）。



## 举例：数组排序 - `Comparable`接口

==接口用来描述类应该做什么，而不指定它们具体应该如何做。接口不是类，而是对希望符合这个接口的类的一组需求。==

举一个例子：`Arrays`类中的`sort`方法承诺可以对对象数组进行排序，但要求满足下面这个条件：对象所属的类必须实现`Comparable`接口。之所以要求实现`Comparable`接口，是因为`Arrays.sort`方法中会有类似这样的语句：

```java
if( (Comparable) a[i]).compareTo(a[j]) > 0 ) {
    ...
}
```

因此，在调用方法`Arrays.sort`时，编译器必须能够确定数组元素所属的类存在`compareTo`方法。如何确定呢？很简单，只要这个类实现了`Comparable`接口，就可以确保存在`compareTo`方法了。

`Comparable`是`java API`，其定义为：

```java
public interface Comparable<T>{
    public int compareTo(T o);
}
```

`compareTo`方法返回一个整数，如果被比较对象（调用`compatrTo`方法的对象）大于比较对象（传入`compareTo`方法的参数对象），则返回一个随机的正整数；如果小于，则返回一个随机的负整数；如果等于，则返回0。

```java
class TestClass implements Comparable<TestClass>{
    private int id;
    public int year;
    int month;
    public TestClass(int id, int year, int month){
        this.id = id;
        this.year = year;
        this.month = month;
    }
    public int getId(){
        return id;
    }
    public boolean setId(int id){
        this.id = id;
        return true;
    }
    public int compareTo(TestClass obj){
        return Integer.compare(this.getId(), obj.getId());
    }
}
public class Test{
    public static void main(String[] args){
        var tss = new TestClass[3];
        tss[0] = new TestClass(3, 1998, 3);
        tss[1] = new TestClass(2, 1997, 4);
        tss[2] = new TestClassChild(1, 1999, 6, 16);
        Arrays.sort(tss);
        System.out.println(tss[0].getId()); // 1
    }
}
```



实际上，关于`Comparable.compareTo`方法的实现，还有特别多需要注意的细节：

（1）反对称原则。必须保证`sgn(x.compareTo(y)) = -sgn(y.compareTo(x))`。

（2）可传递原则。如果`x.compareTo(y) > 0 && y.compareTo(z) > 0`，则`x.compareTo(z) > 0`。

（3）必须保证：如果`x.compareTo(y) == 0`，则`sgn(x.compareTo(z)) == sgn(y.compareTo(z))`。

具体参考`Comparable`接口的文档。



## 举例：数组排序 - `Comparator`接口

java中很多类都已经实现了`Comparable`接口，例如`String`类。如果我们想让`String`数组按我们自定义的比较方式排序的话，可以使用`Arrays.sort(T[] object, Comparator<T> comparator)`方法。这个方法接受一个实现了`Comparator`接口的类实例，允许自定义比较方式。

`Comparator`接口定义为：

```java
public interface Comparator<T>{
    int compare(T first, Tsecond);
}
```

在`Arrays.sort(T[] object, Comparator<T> comparator)`方法中，有类似这样的代码：

```java
if( comparator.compare(object.[i], object[j]) > 0 ){
    ...
}
```

`String`类默认的比较方式是字典方式（即依次比较字母的ASCII码值），但我们想定义为比较长度方式。

```java
public class Test{
    String[] str = new String[3];
    str[0] = "Hello, every body!";
    str[1] = "My name is zhang";
    str[2] = "I'm glad to meet you";
    Arrays.sort(str);
    // Hello, every body!	I'm glad to meet you	My name is zhang
    System.out.println(str[0]+'\t'+str[1]+'\t'+str[2]);
    Comparator comp = new LengthComparator();
    Arrays.sort(str, comp);
    // My name is zhang	Hello, every body!	I'm glad to meet you
    System.out.println(str[0]+'\t'+str[1]+'\t'+str[2]);
}
class LengthComparator implements Comparator<String>{
    public int compare(String first, String second){
        return first.length() - second.length();
    }
}
```

### lambda表达式写法

```java
public class Test{
    String[] str = new String[3];
    str[0] = "Hello, every body!";
    str[1] = "My name is zhang";
    str[2] = "I'm glad to meet you";
    Arrays.sort(str);
    // Hello, every body!	I'm glad to meet you	My name is zhang
    System.out.println(str[0]+'\t'+str[1]+'\t'+str[2]);
    // lambda表达式写法：String长度相减
    Comparator comp = (first, second) -> first.length() - second.length(); 
    Arrays.sort(str, comp);
    // My name is zhang	Hello, every body!	I'm glad to meet you
    System.out.println(str[0]+'\t'+str[1]+'\t'+str[2]);
}
```

## 举例：定时器与监听器

```java
public class Test{
    public static void main(String[] args){
        // 创建监听器对象
        var listener = new TestTimer();
        // 创建定时器对象，每个3000毫秒(1秒)给监听器对象发送通知
        // 1、通知方式是：定时器对象调用监听器对象的actionPerformed方法，因此监听器对象是一个实现了ActionListener接口的类实例
        // 2、通知内容是：ActionEvent类对象，该对象包含事件相关的信息，它会作为actionPerformed方法的参数被传入
        Timer t = new Timer(3000, listener);
        // 启动定时器
        t.start();
        // 程序弹出一个消息对话框，弹出对话框的目的其实是保证程序不要立即终止
        JOptionPane.showMessageDialog(null, "Quit?");
        // 用户点击OK按钮后对话框关闭，没有这条语句仍然能够立刻终止程序
        System.exit(0);
    }
}
public class TestTimer implements ActionListener {
    //  event参数提供了事件的相关信息，例如发生这个事件的时间等
    public void actionPerformed(ActionEvent event){
        // getWhen方法会返回这个事件时间，表示为"纪元"(1970.1.1)以来的毫秒数
        // 静态方法java.time.Instant.ofEpochMilli根据纪元以来的毫秒数返回一个Instant对象，将其转换为String后为更可读的描述
        String currentTime = java.time.Instant.ofEpochMilli(event.getWhen()).toString();
        System.out.println(currentTime);
        // 获取默认的工具箱，然后发出一声铃响
        Toolkit.getDefaultToolkit().beep();
    }
}
/** 输出结果为：
2023-09-01T10:54:23.582Z
2023-09-01T10:54:26.586Z
2023-09-01T10:54:29.599Z
*/
```



### lambda表达式写法

```java
public class Test{
    public static void main(String[] args){
        Timer t = new Timer(3000, event -> {
            String currentTime = java.time.Instant.ofEpochMilli(event.getWhen()).toString();
        	System.out.println(currentTime);
        	Toolkit.getDefaultToolkit().beep();
        });
        t.start();
        JOptionPane.showMessageDialog(null, "Quit?");
        System.exit(0);
    }
}
```





## 举例：对象克隆

1、当利用`y = x;`为一个对象变量`x`建立副本`y`时，`y`和`x`引用的是同一个对象。也就是说，之后`y`或`x`任何一个对象变量改变了对象的状态，都会影响另一个对象变量。

因此应该用`y = x.clone();`方法来为对象变量`x`建立副本`y`。这样，`y`引用的对象和`x`引用的对象是两个对象，但这两个对象的状态是相同的，之后`x`怎么改变它的对象状态，都不会影响`y`，反之亦然。

2、`clone`方法是`Object`类的一个`protected`方法，因此要克隆`x`的引用对象，只能在该对象所在的类中调用该类对象的`clone()`方法。

但是这个原生的`clone`方法只是浅拷贝：即对对象中的所有实例字段，都是简单的赋值操作。如果所有实例字段都是基本数据类型或不可变字段，那么没什么问题；但如果有实例字段是可变的对象变量，那么原对象和克隆对象仍然会共享这些对象变量的引用，如下图所示：

![浅拷贝](/pictures/java/chap04/chap4_1.png)

3、要进行深拷贝，就必须让`x`的引用对象所在类实现`Cloneable`接口，然后在类中实现`clone`方法。

（1）实际上`Cloneable`接口中不包含任何方法，它只是一个标记接口，其意义在于用`instanceof`判断其是否实现了`clone`方法。

但是要实现`clone`方法，仍然需要实现`Cloneable`接口（`implements Cloneable`）。因为不这么做的话，`Object.clone`方法会抛出一个`CloneNotSupportedException`异常。虽然我们可以选择捕获这个异常，但还是不建议这么做。

（2）`Object.clone`方法的源码在`java.lang.Object`类中是不可见的，因为它是一个本地方法（native method），其实现是由底层的java虚拟机提供的，通常不可见于java源代码级别。该方法会检查传入对象的类型去判断怎么拷贝，如果这个类型没有实现`Cloneable`接口的话，它就不知道怎么拷贝了，所以会抛出`CloneNotSupportedException`异常。

（3）实现了`Cloneable`接口以后，`Object.clone`方法就不会抛出异常了。但是编译器并不了解这一点，因此为了编译能通过，仍然需要在实现的`clone`方法以及调用该方法的方法中声明异常（`throws CloneNotSupportedException`）。

4、实现`clone`方法时，可以将方法的权限从`protected`更改为`public`，这样就可以在任意类中调用该方法了。同时，可以将返回类型更改为`x`这个对象变量的类型。最后就是具体的`clone`方法实现了。