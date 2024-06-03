# 类

类是构建所有java应用程序和applet（小程序）的构建块。java应用程序的全部内容都必须放置在类中。

源代码的文件名必须与公共类的名字相同，并用.java作为扩展名。一个源文件中只能用一个公共类。

运行已编译的程序时，java虚拟机总是从指定类中的main方法的代码开始执行。因此为了代码能够执行，在类的源文件中必须包含一个main方法。

java中的所有函数都是某个类的方法（标准术语将其称为方法，而不是成员函数）。

## 面向对象设计（OOP）

面向对象程序设计（Object Oriented Programming，OOP）是当今主流的程序设计范型，它取代了20世纪70年代的”结构化“或过程式编程技术。传统的结构化程序设计通过设计一系列的过程（即算法）来求解问题。一旦确定了这些过程，就要开始考虑存储数据的适当方式。也就是说，首先要确定如何操作数据，然后再决定如何组织数据的结构，以便于操作数据。算法是第一位的，数据结构是第二位的。OOP却调换了这个次序，将数据放在第一位，然后再考虑操作数据的算法。

**类**是构造**对象**的模板。由类构造对象的过程称为创建类的**实例**。对象中的数据称为**实例字段**，操作数据的过程称为**方法**。作为一个类的实例，特定对象都有一组特定的实例字段值，这些值的集合就是这个对象的**当前状态**。

### 两个原则：封装 + 继承

**封装（数据隐藏）** 是处理对象的一个重要概念。实现封装的关键在于：**程序只能通过对象的方法与对象数据进行交互，不能让其他类中的方法直接访问类的实例字段**。

OOP的另一个原则会让用户自定义java类变得更容易：**可以通过扩展其他类来构建新类**。这个过程称为**继承**。

### 类之间的关系

#### 依赖（uses-a）

如果一个类的方法使用或操纵另一个类的对象，就说这个类依赖于另一个类。应该尽可能地将相互依赖的类减至最少，因为如果类A不依赖于B，那么它就不会关心B的任何改变（意味着B的任何改变不会导致A产生bug）。用软件工程的术语来说，就是尽可能减少类之间的**耦合**。

#### 聚合（has-a）

类A的对象包含类B的对象。

#### 继承（is-a）

如果类A继承了类B，类A不但包含从类B继承的方法，还会有一些额外的功能。

很多程序员采用UML（Unified Modeling Language，统一建模语言）绘制类图。

![UML Symbols](/pictures/java/chap03/chap3_1.png)



## 对象与对象变量

```java
Date birthday = new Date();
```

1、`new Date()`语句创建了一个`Date`对象（实例），它是一个匿名变量，代表这个对象。

2、`birthday`是一个对象变量，它的**值**是`new Date()`创建的这个对象的**地址**。

（1）虽然我们无法直接获得这个**地址**，但因为有了这个地址，我们才能够通过`birthday`这个对象变量来访问和操作这个对象，也就是通过点号`.`来访问这个对象的方法和实例字段。

（2）我们也可以更改`birthday`的**值**，使它引用别的`Date`类对象或null（表示不引用任何对象）。

（3）对象变量`birthday`也会有自己的地址。在c++中，能够利用`&birthday`获得对象变量`birthday`自身的地址；在java中，没有相关的操作符。




### 对象变量的地址与值

对象变量的地址：该变量本身的地址

对象变量的**值**：引用对象的**地址**

1、c++中的按引用调用：创建一个形参，**形参的值 = 实参的地址（无论实参是基本数据类型还是对象变量）**

```c++
void swapAddress(int& x, int& y){
    int tmp = x;
    x = y;
    y = tmp;
}
void swapValue(int x, int y){
    int tmp = x;
    x = y;
    y = tmp; 
}
int main(){
    int a = 1;
    int b = 2;
    swapValue(a, b); // a=1, b=2
    swapAddress(a, b); // a=2, b=1
}
```



2、java中没有按引用调用，只有按值调用：创建一个形参，**形参的值 = 实参的值 = 对象变量引用对象的地址 或 基本类型变量的值**

`test(a)`将实参`a`的值传递给形参`a`：形参`a`的值 = 实参`a`的值 = 实参`a`引用对象的地址。

`test(A a)`方法中，`a = new A(8)`是将形参`a`的值更改为 " 新创建的匿名对象`new A(8)` " 的地址，也就是说形参`a`引用了另一个对象，但是这不会影响实参`a`。

`a.x = 9`是更改形参`a`引用对象的状态，因为形参`a`和实参`a`引用的是同一个对象，所以这也会影响实参`a`。

```java
public class Test {
    public static void main(String[] args) {
        A a = new A(1);
        test(a);
        System.out.println(a.x);
    }

public static void test(A a){
        // a = new A(8); // 这一行不被注释则输出 1 ;这一行被注释掉则输出 9
        a.x = 9;
    }
}
```



3、java是按值返回，所以通过 "私有字段 + 访问器方法" 机制向外部返回的类字段`b`是这个字段引用对象的地址，而不是类字段`b`本身的地址。因此：

（1）可以保证类字段`b`不会被更改引用对象（即不会引用别的对象）：因为外部只能通过变量`b`接收访问器方法返回的值（值是类字段`b`引用对象的地址），外部变量`b`的值 = 类字段`b`的值 = 类字段`b`引用对象的地址，更改外部变量`b`的引用并不会影响类字段`b`。

（2）但是无法保证类字段`b`引用的对象状态不会发生改变，因为外部变量`b`和类字段`b`引用同一个对象。

```java
public class Test{
    public static void main(String[] args){
        A a = new A(new B(1));
        B b = a.getB();
        b = new B(2);
        System.out.println(a.getB().x); // 输出：1
    }
}
class A{
    private B b;
    public A(B b){
        this.b = b;
    }
    public B getB(){
        return b;
    }
}
class B{
    public int x;
    public B(int x){
        this.x = x;
    }
}
```



## 构造器

1、java中一般使用 **构造器（构造函数）** 来构造新实例。

- 构造器应该与类名相同。

- 每个类可以有1个以上的构造器。

- 构造器可以有0个、1个或多个参数。

- 构造器没有返回值。

- 构造器总是伴随着new操作符一起调用。

2、也可以使用 **静态工厂方法（factory method）** 来构造对象。

### 默认构造器：无参构造器

1、如果类中没有定义构造器，那么创建对象时，会自动调用默认构造器：将所有实例字段设置为默认值。

2、如果类中定义了构造器，那么创建对象时，会从所有定义的构造器中选择与实际调用的方法签名相同的一个。

如果类中定义了其他构造器，而没有定义无参构造器，那么即使实际调用的方法没有任何参数，也不会调用默认构造器，而是会报错。

### 调用另一个构造器

关键字this指示一个方法的隐式参数。但this还有另外一层含义：如果构造器的第一条语句为`this(...)`，就代表这个构造器将调用这个类的另一个构造器。

```java
class Employee{
    private static int nextId;
    private String name;
    public Employee(String name, double salary){
        this.name = name;
        this.salary = salary;
        nextId++;
    }
	public Employee(double salary){
        this("Employee " + nextId, salary);
    }    
}
```





## 实例字段

类包含的实例字段通常属于某个类类型。

类方法可以访问调用这个方法的对象的私有数据。

```java
class Employee{
    ...
    public boolean equals(Employee other){
        return this.name.equals(other.name);
    }
}
```

### 实例字段初始化



```java
class TestInitial{
    {
        System.out.println("step 3: nextId=" + nextId + ", score=" + score + ", id=" + getId() + ", year=" + getYear());
        year = 2; // 这个变量与类变量year同名，但它的作用域仅为这个块
    }
    private int year = 1;
    { System.out.println("step 4: id=" + getId() + ", year=" + year); }
    static{ System.out.println("step 1: nextId=" + getNextId() + ", score=" + getScore()); }
    private static int nextId = 1;
    static{
        System.out.println("step 2: nextId=" + getNextId() + ", score=" + getScore());
        nextId = 2; // nextId已经声明过了
    }
    private static int score = 1;
    public static int getNextId(){
        return nextId;
    }
    public static int getScore(){
        return score;
    }
    public int getId(){
        return id;
    }
    public int getYear(){
        return year;
    }
    public TestInitial(){
        System.out.println("step 6: Constructor");
    }
    private static int assignId(){
        int r = nextId;
        nextId++;
        return r;
    }
    //{ System.out.println("step 5: id=" + id); } // 这句会报错：非法前向引用
    private int id = assignId(); // 初始值不一定是常量值，也可以利用一个方法调用来初始化实例字段
    { System.out.println("step 5: nextId=" + nextId + ", score=" + score + ", id=" + id + ", year=" + year); }
}
public class Test{
    public static void main(String[] args){
        var init = new TestInitial();
    }
}
/** 输出结果为:
step 1: nextId=0, score=0
step 2: nextId=1, score=0
step 3: nextId=2, score=1, id=0, year=0
step 4: id=0, year=1
step 5: nextId=3, score=1, id=2, year=1
step 6: Constructor
*/
```

执行顺序如下：

1、首先将所有静态变量初始化为默认值。

2、然后按顺序执行类中所有的**静态变量声明语句和static初始化块**。

虽然静态变量已经有了默认值了，但是它们并没有被声明，要获得值只能通过类中的静态方法访问，只有在执行完声明语句以后才可以在初始化块中直接调用，否则会报错：非法前向访问。

在未声明之前如果在块中为同名变量赋值，会被看作块中的一个同名变量，这个变量的作用域只是这个块，出了这个块，就没有这个变量了。

3、然后将**所有非静态变量初始化为默认值**。

4、然后按顺序执行类中所有的非静态变量声明语句和普通初始化块。

虽然变量已经有了默认值了，但是它们并没有被声明，要获得值只能通过类中的静态方法访问，只有在执行完声明语句以后才可以在初始化块中直接调用，否则会报错：非法前向访问。

在未声明之前如果在块中为同名变量赋值，会被看作块中的一个同名变量，这个变量的作用域只是这个块，出了这个块，就没有这个变量了。

5、最后执行构造方法。

注意两点：

（1）默认值：数值类型为0，char类型为""，boolean类型为false，对象类型为null。

（2）static块中不允许访问非静态方法或字段。

（3）变量的初始值不一定得是常量值，也可以利用一个方法调用来初始化，例如`private int id=assignId()`。



### 修饰符

public修饰的实例字段可以由任意类访问。这样会破环封装性，非常不推荐。

private修饰的实例字段只能由类方法访问。<mark>即使是类的子类也不能访问private修饰的实例字段。</mark>这样做严格执行了封装性，推荐。

protected修饰的实例字段可以由子类和同一个包的所有类方法访问。

如果没有任何修饰符（默认），只能由同一个包的所有类方法访问。这样做会破环封装性，不推荐。



### final实例字段

**final实例字段必须在构造对象时就初始化，并且以后不能再修改这个字段。** final实例字段属于特定对象，不属于整个类。

final类中的所有方法会自动地成为final方法，但字段不会。

final修饰符对于类型为基本类型或者不可变类的字段尤其有用（如果类中的所有方法都不会改变其对象，这样的类就是不可变的类，例如String类）。

对于可变的类，使用final修饰符可能会造成混乱，**因为final只是表示对象变量不会再指示另一个不同的对象引用，但引用的这个对象本身可以修改**。

```java
class Employee{
    private final StringBuilder firstName;
    public Employee(String afirstName){
        firstName = new StringBuilder(afirstName);
    }
    public addSecondName(String secondName){
        firstName.append(secondName);
    }
}
```



### static字段（静态字段）

static字段又被称为静态字段，或者类字段。静态字段属于整个类，不属于某个特定类实例，因此是所有类实例共享的。某个类实例更改了静态字段，其他类实例也都会获得最新的值。



### 静态常量（static final）





## 方法

### 更改器方法与访问器方法

1、只访问对象而不修改对象的方法称为访问器方法。要实现访问器方法，一般需要做到2点：（1）私有的实例字段；（2）公共的字段访问器方法，一般为getXxx开头。

**注意不要编写返回对象引用的访问器方法，应该用克隆返回一个存放在新位置（地址）上的对象副本。**

```java
public class Test{
    public static void main(String[] args) {
        var ref = new TestRefrence(1, 2);
        var obj = ref.getObj();
        System.out.println(obj.x); // 1
        obj.x = 3;
        System.out.println(obj.x); // 3
    }
}
class TestObj{
    public int x;
    public int y;
    public TestObj(int x, int y){
        this.x = x;
        this.y = y;
    }
}
class TestRefrence{
    private TestObj obj;
    public TestRefrence(int x, int y){
        obj = new TestObj(x, y);
    }
    public TestObj getObj(){
        return obj;
    }
}
```



2、更改对象状态的方法称为更改器方法。要实现更改器方法，一般需要做到3点：（1）私有的实例字段；（2）公共的字段更改器方法，一般为setXxx开头。

### 修饰符

搞懂**修饰符的访问权限**的关键是搞清楚两点：（1）可以在哪里访问？（2）由谁调用？

public：在任何类的任何方法都可以访问该方法；只要利用该类对象调用即可。

private：确保只有类自身的方法可以调用该方法。即使是类的子类对象也不能访问该方法。

protected意味着子类和同一个包的所有类的方法都可以调用该方法。

如果没有任何修饰符（默认），只能由同一个包的所有方法调用该方法。



### 隐式参数this与显式参数

方法的第一个参数是隐式参数，也就是出现在方法名前面的对象，之后的参数才是显式参数，也就是方法名后面括号中的参数。

在每一个方法中，关键字this指示隐式参数，表示当前调用该方法的对象。**这个对象可能是该类实例，但也可能是该类的子类实例。**

在非静态类方法内部，经常访问当前实例的实例字段或非静态方法`xxx`，实际上完整的写法是`this.xxx`，但是`this`可以被省略。

### final方法

final方法是不允许被子类覆盖的方法。final类中的所有方法会自动地成为final方法，但字段不会。

### static方法（静态方法）

静态方法属于整个类，它不是在对象上执行的方法，因为方法内部不能使用隐式参数this，即不能访问**当前实例**的实例字段和非静态方法。

在其他地方调用静态方法时一般是使用类名，但也可以使用对象变量名。

静态方法还有一种常见的用途：使用静态工厂方法（factory methos）来构造对象。

### 变参方法

变参方法即参数数量可变的方法。



## 继承

关键字`extends`表明正在构造的新类派生于一个已存在的类。

已存在的类被称为 **超类**、基类、父类；

新类称为 **子类**、派生类。

子类只能继承于一个超类，但是一个超类可以被多个子类继承。

### 子类构造器

子类构造器的第一句应该是用`super`关键字调用超类构造器。

如果子类构造器中没有显示地调用超类构造器，那么将首先自动调用超类的无参构造器。

如果超类中没有无参构造器，java编译器就会报错。

```java
class Manager extends Employee{
    private int bonus;
    public Manager(String name, double salary, int year, int month, int day, int bonus){
        super(name, salary, year, month, day);
        this.bonus = bonus;
    }
    public int getSalary(){
        baseSalary = super.getSalary();
        return baseSalary + bonus;
    }
    public boolean getManagerInfo(){
        return "Manager";
    }
}
class Employee{
    private String name;
    private double salary;
    private int year;
    private int month;
    private int day;
    public Employee((String name, double salary, int year, int month, int day){
        this.name = name;
        this.salary = salary;
        this.year = year;
        this.month = month;
        this.day = day;
    }
    public int getSalary(){
        return salary;
    }
}
```

#### super关键字

指示编译器访问超类成员的关键字。用法有两种：（1）`super(...)`表示调用超类构造器；（2）`super.getSalary()`或`super.id`表示调用超类的实例字段或方法。





### final类

final类是不允许被继承的类。final类中的所有方法会自动地成为final方法，但字段不会。

### abstract类

abstract类是抽象类。

1、抽象类可以有实例字段，实例字段不能用abstract修饰。方法可以用abstract修饰，抽象类按方法可以分为以下几种情况：

（1）不包含抽象方法；（2）包含抽象方法和具体方法；（3）全部为抽象方法。

2、反过来，只要有抽象方法，就必须将类声明为抽象类。

3、抽象类不能被实例化，但抽象类对象变量可以引用非抽象的子类对象。



## 多态

### 重载

1、一个类的方法包括自身定义的方法以及从超类继承得到的方法。

2、如果一个类中有两个方法（包括构造方法）有相同的方法名、不同的参数，即使有不同的返回值，那么就是**重载**。重载包括以下两种特殊情况：

（1）如果一个类中有两个同名的方法，但是一个方法的参数类型是另一个方法的参数类型的子类型，那么这是两个不同的方法，这是重载。

（2）如果一个类中有一个与其超类方法同名的方法，但是子类方法的参数类型是超类方法的参数类型的子类型，那么这也是两个不同的方法，这也是重载。

### 覆盖

1、一个方法的方法名和参数（参数数量和参数类型）叫做方法签名。一个类中的方法签名应该是唯一的。

方法签名不包括返回类型，因此不能有两个方法名相同、参数相同，但返回类型不同的方法。

2、如果一个类中，有一个与其超类方法签名相同的方法，那么称子类方法覆盖（重写）了超类方法。这就是**覆盖**。

3、子类覆盖了超类的方法后，调用的会是子类的方法：

```java
public class Test{
    public static void main(String[] args){
        TestClass ts = TestClassChild();
        ts.test2();
    }
}
class TestClass{
    public void test(){
        System.out.println(1);
    }
    public void test2(){
        Syste.out.println(this.getClass());
        test();
    }
}
class TestClassChild extends TestClass{
    public void test(){
        System.out.println(2);
    }
}
/** 输出结果为：
class TestJava.TestClassChild
2
*/
```

4、覆盖超类的方法时，需要注意几点：

（1）返回类型的兼容性。**允许子类将覆盖方法的返回类型改为原返回类型的子类型**。

```java
// 超类
public Employee getBuddy(){
    ...
}
// 子类
public Manager getBuddy(){
    
}
```

（2）**子类方法不能低于超类方法的可见性**。例如，如果超类方法是`public`，子类方法必须也声明为`public`。

### 多态

假设有一个超类和一个子类。

1、一个被声明为子类类型的对象变量，只能引用子类类型的对象，不能引用超类类型的对象。

2、一个声明为超类类型的对象变量不仅可以引用超类类型的对象，可以引用子类类型的对象，这种现象称为**多态**。

3、一个被声明为超类类型的对象变量，无论它实际引用的是超类对象还是子类对象，该对象变量都只能访问超类成员（字段与方法），不能访问子类成员，否则出现编译错误。

#### 普通的方法调用

子类的方法分为两种：（1）继承自超类的方法（不包括超类中被子类覆盖的方法）；（2）自身定义的方法。

" 子类对象变量 " 和 " 引用**超类对象**的**超类对象变量** " 在执行方法调用时：

1、编译器执行**静态绑定**：

（1）编译器根据方法签名在类的所有方法中查找匹配的方法。

（2）当编译器遇到方法名相同的多个方法时，会根据参数类型寻找最为匹配的方法，这也就是**重载解析机制**。

关于参数类型，虚拟机（严格来说是编译器）只会根据传入给方法的参数的声明类型去查找匹配的方法，而不管这些参数的实际引用类型是什么。

（3）如果编译器还是找不到匹配的方法，那么就会考虑能够通过类型转换（向上转换）找到匹配的方法。如果仍然找不到，就会报错。

（4）如果编译器找到了最匹配的方法，就将其绑定。

2、在运行阶段，JVM进入类中：直接调用静态绑定的方法。

#### 方法调用（多态机制）

超类的方法分为两种：（1）没有被子类覆盖的方法（包括子类的重载方法）；（2）被子类覆盖的方法。

" 引用**子类对象**的**超类对象变量** " 在执行方法调用时：

1、编译器执行**静态绑定**：

（1）编译器根据方法签名在**超类**的所有方法中查找匹配的方法。

（2）当编译器遇到方法名相同的多个方法时，会根据参数类型寻找最为匹配的方法，这也就是**重载解析机制**。

关于参数类型，虚拟机（严格来说是编译器）只会根据传入给方法的参数的声明类型去查找匹配的方法，而不管这些参数的实际引用类型是什么。

（3）如果编译器还是找不到匹配的方法，那么就会考虑能够通过类型转换（向上转换）找到匹配的方法。如果仍然找不到，就会报错。

（4）如果编译器找到了最匹配的方法，就将其绑定。

2、在运行阶段，JVM进入**子类**中：检查方法是否被子类覆盖。

（1）如果静态绑定的方法没有被子类覆盖，JVM直接调用该方法；

（2）如果静态绑定的方法被子类覆盖，重新将方法绑定为子类的重写方法（**动态绑定**），然后调用子类的重写方法。

```java
public class Test{
    public static void main(String[] args){
        var staff = new Employee[3];
        // 实际引用对象为Manager类型
        staff[0] = new Manager("Carl Cracker", 7000, 1987, 12, 4, 1000);
        // 实际引用对象为Employee类型
        staff[1] = new Employee("Harry Hacker", 5000, 1998, 10, 1);
        // 实际引用对象为Employee类型
        staff[2] = new Employee("Tony Tester", 4000, 2002, 3, 15);
        for(Employee e: staff){
            // staff[0]调用Manager.getSalary(); staff[1]和staff[2]调用Employee.getSalaty()方法
            System.out.println(e.getSalary());
        }
    }
}
```

#### 多态存在的问题

多态也存在问题：在对象数组上会容易混乱，导致出错。

下面是对象变量和对象数组变量的区别：

```java
// ************************** 对象 **************************
Manager manager = new Manager("Carl Cracker", 7000, 1987, 12, 4, 1000);
// staff和manager都引用Manager对象
Employee staff = manager;
// manager引用Manager对象，staff改变了引用：引用Employee对象
staff = new Employee("Harry Hacker", 5000, 1998, 10, 1);
// ************************** 对象数组 **************************
Manager[] managers = new Managers[3];
// employees和managers的每一个元素都引用Manager对象
Employee[] employees = managers;
// employees和managers的第一个元素都引用Employee对象，其他元素都引用Manager对象
// 这不符合多态原则（子类类型的对象变量不能引用超类对象），但编译器会通过
employees[0] = new Employee("Tony Tester", 4000, 2002, 3, 15);
// 这句运行时会报错，因为Manager类型的对象变量manager[0]引用了超类Employee对象，却调用了子类Manager的方法
Syste,m.out.println(manager[0].getManagerInfo());
```

为了确保不发生这类破坏，所有数组都要牢记创建时的元素类型，并负责监督仅将类型兼容的引用存储到数组中。

### Demo

```java
public class Test {
    public static void main(String[] args){
        /**
         * 下面这三种情况：对象变量sup实际引用ChildClass类型，被声明为ChildClass类型
         * 因此调用的是ChildClass类型的方法：包括自身方法和SuperClass方法
         * 具体使用哪个方法是通过方法签名来判断的：传入给方法的参数类型（声明类型）
         * test 1中参数类型为ChildObject，因此调用ChildClass的setObj(ChildObject)方法
         * test 2 和 test 3中的参数类型为SuperObject，因此调用SuperClass的setObj(SuperObject)方法
         */
        System.out.print("test 1: ");
        ChildClass child1 = new ChildClass();
        ChildObject x1 = new ChildObject();
        child1.setObj(x1);

        System.out.print("test 2: ");
        ChildClass child2 = new ChildClass();
        SuperObject x2 = new SuperObject();
        child2.setObj(x2);

        System.out.print("test 3: ");
        ChildClass child3 = new ChildClass();
        SuperObject x3 = new ChildObject();
        child3.setObj(x3);
        /**
         *  下面这三种情况：对象变量sup实际引用SuperClass类型，被声明为SuperClass类型
         *  所以调用的只能是SuperClass类的setObj方法
         */
        System.out.print("test 4: ");
        SuperClass sup1 = new SuperClass();
        ChildObject y1 = new ChildObject();
        sup1.setObj(y1);

        System.out.print("test 5: ");
        SuperClass sup2 = new SuperClass();
        SuperObject y2 = new SuperObject();
        sup2.setObj(y2);

        System.out.print("test 6: ");
        SuperClass sup3 = new SuperClass();
        SuperObject y3 = new ChildObject();
        sup3.setObj(y3);
        /**
         * 下面这三种情况：对象变量sup实际引用ChildClass类型，但被声明为SuperClass类型
         * 除非调用的方法被ChildClass覆盖了，否则调用的都是SuperClass的方法
         * 因此调用的都是SuperClass的setObj方法
         */
        System.out.print("test 7: ");
        SuperClass sup4 = new ChildClass();
        ChildObject y4 = new ChildObject();
        sup4.setObj(y4);

        System.out.print("test 8: ");
        SuperClass sup5 = new ChildClass();
        SuperObject y5 = new SuperObject();
        sup5.setObj(y5);

        System.out.print("test 9: ");
        SuperClass sup6 = new ChildClass();
        SuperObject y6 = new ChildObject();
        sup6.setObj(y6);
    }
}
class SuperClass{
    private Object obj;

    public void setObj(SuperObject obj){
        System.out.println("Super");
        this.obj = obj;
    }
}
class ChildClass extends SuperClass {
    public void setObj(ChildObject obj){
        System.out.println("Child");
    }
}
class SuperObject{}
class ChildObject extends SuperObject {}
/** 输出结果为：
test 1: Child
test 2: Super
test 3: Super
test 4: Super
test 5: Super
test 6: Super
test 7: Super
test 8: Super
test 9: Super
*/
```



## 强制类型转换

### 基本类型强制转换

```java
double x = 9.997;
// 通过截断小数部分将浮点值转换为整型
int nx = (int) x; // 9
// Math.round方法对浮点数进行舍入运算，返回一个long类型的整数
int nx = (int) Math.round(x); // 10
```

### 对象类型强制转换

1、对象的实际类型

（1）对象的实际类型是由创建这个对象时`new`运算符后面的类型决定的。`new`运算符后面的类型可以是超类类型（构造器参数可以是超类类型参数，也可以是子类类型参数），也可以是子类类型（构造器参数只能是子类类型）。

（2）对象的实际类型不是由传入构造器的参数声明类型决定的，因为`new A(...)`指定了这个对象的类型是`A`，即要调用`A`类的构造器，所以构造器参数即使不严格匹配也会被向上转换或者强制转换为匹配类型。

2、对象变量的声明类型

（1）对象变量的声明类型是子类类型，其引用对象的实际类型只能是子类类型。

（2）对象变量的声明类型是超类类型，其引用对象的实际类型可以是超类类型或子类类型。

**对象变量的声明类型定义了引用对象的解释方式。**

3、强制类型转换

（1）在进行强制类型转换时，JVM会将对象变量引用的这个对象的实际类型（也就是）强制转换为对象变量的声明类型。如果转换不了，就报错。

（2）如果对象变量的声明类型为`A[]`，而引用对象的实际类型是`B[]`，且`B`是`A`的子类型，那么`B[]`也是`A[]`的子类型，可以将`A[]`强制转换为`B[]`。

**对象类型转换是改变对象变量的类型，但本质是改变对象的解释方式**。

```java
public class Test {
    public static void main(String[] args) {
        var staff = new Employee[3];
        staff[0] = new Manager("Carl Cracker", 7000, 1987, 12, 4, 1000);
        staff[1] = new Employee("Harry Hacker", 5000, 1998, 10, 1);
        staff[2] = new Employee("Tony Tester", 4000, 2002, 3, 15);
        // staff[0]实际引用的Manager对象地址 -> Manager类型的对象变量boss，但因为staff[0]被声明为了Employee类型，因此需要强制类型转换
        // 现在Manager类型的对象变量boss引用的是Manager类型的对象
        Manager boss = (Manager) staff[0];
        // staff[0]实际引用的Manager对象地址 -> Manager类型的对象变量boss，因为staff[0]被声明为了Employee类型，因此不需要强制类型转换
        // 现在Employee类型的对象变量emp引用的是Manager类型的对象
        Employee emp = staff[0];
        // 这行代码编译会报错，因为：虽然对象变量staff[0]引用的是Manager对象，但它被声明为了Employee类型
        // Manager boss = staff[0]; 
        // 这两行代码运行时都会报错，因为staff[1]实际引用的是Employee对象，不能强制转换为Manager类型
        // Employee emp2 = (Manager) staff[1];
        // Manager boss2 = (Manager) staff[1];
        
        // 对象的实际类型是String[]
        Object[] objs = new String[]{"ss", "rr"};
        String[] strs = (String[]) objs;
        Object[] objs2 = objs;
        String[] strs2 = (String[]) objs2;
        // 对象的实际类型是Object[](尽管构造器参数是String)
        Object[] objs3 = new Object[]{"ss", "rr"};
        // String[] strs3 = (String[]) objs3; // ERROR
    }
}
```



## 访问控制

### 基本概念

#### 访问控制的两个关键

先说明两个术语，对于字段，我们说”访问“；对于”方法“，我们说”调用“。但为了统一，我们统一说成”访问“。

访问控制主要在于两个问题（以实例成员为例）：

（1）怎么访问？当然由类对象访问；但是也可以由子类对象、子类中的`this`、子类中的`super`访问，这就涉及到了继承问题。

（2）在哪里访问？也就是访问的代码写在哪个类里面。

#### 访问和继承权限

类成员包括类字段和类方法。**类字段和类方法的访问权限相同**。

类成员的访问权限和继承权限**按权限大小**依次为以下四种修饰方式：（1）`public`；（2）`protected`；（3）默认（没有修饰符）；（4）`private`。但是为了便于理解，我们改变了介绍的顺序。

假设有类`A`、`A`的子类`B`（包括`Inner.B`和`Outer.B`）、其他类`C`（包括`Inner.C`和`Outer.C`）。类`A`有成员`x`（可能是实例成员也可能是静态成员），类`B`没有覆盖`x`。

按照上面四种修饰方式，`B`继承`A.x`的方式有：（1）能继承`public x`；（2）不能继承`private x`；（3）能继承`protected x`；（4）如果`B`和`A`在同一包中，能继承默认`x`，否则不能。

#### `this`和`super`

能通过`this`访问的超类成员，就能通过`super`访问；反之，能通过`super`访问的超类成员，就能通过`this`访问。因此，`super`实际上与继承权限有关，与访问权限无关。也就是说`super`是访问子类本身具有继承权限的超类成员，只要子类对这个超类成员有继承权限，就能通过`super`访问。

### 1、没有被子类覆盖的类实例成员

类实例成员包括实例字段和非静态方法。访问实例成员`x`的方式有以下几种：

（1）在类`A`中使用`this`访问`A.x` ；`x`为`public`、`x`为默认、`x`为`protected`、`x`为`private`

（2）在类`A`中使用`A`类实例访问`A.x`；`x`为`public`、`x`为默认、`x`为`protected`、`x`为`private`

（3）在类`A`中使用`B`类实例访问`B.x`；`x`为`public`、`x`为默认且`B`与`A`在同一包中、`x`为`protected`

（4）在子类`B`中使用`this`访问`B.x`；`x`为`public`、`x`为默认且`B`与`A`在同一包中、`x`为`protected`

（5）在子类`B`中使用`super`访问`B.x`；`x`为`public`、`x`为默认且`B`与`A`在同一包中、`x`为`protected`

（6）在子类`B`中使用`B`类实例访问`B.x`；`x`为`public`、`x`为默认且`B`与`A`在同一包中、`x`为`protected`

（7）在子类`B`中使用`A`类实例访问`A.x`；`x`为`public`、`x`为默认且`B`与`A`在同一包中、`x`为`protected`且`B`与`A`在同一包中

（8）在其他类`C`中使用`A`类实例访问`A.x`；`x`为`public`、`x`为默认且`C`与`A`在同一包中、`x`为`protected`且`C`与`A`在同一包中

（9）在其他类`C`中使用`B`类实例访问`B.x` ；`x`为`public`、`x`为默认且`B`、`C`与`A`在同一包中、`x`为`protected`且`C`与`A`在同一包中

#### 类`public`实例成员

`x`能被任意子类`B`继承；

能在任何类中访问`A.x`和`B.x`。即能以任意方式访问`A.x`和`B.x`。

**`public`实例成员是完全公开的实例成员。**

#### 类`private`实例成员

`x`不能被任何子类`B`继承；

只能在类`A`中访问`A.x`。即只能以方式（1）和（2）访问`x`，因为**类中能访问该类当前实例和该类其他实例的任意成员**。

**`private`实例成员是完全私密的实例成员。**

#### 类默认实例成员

`x`能被该类所在包的任意子类`Inner.B`继承，不能被与该类不同包的子类`Outer.B`继承；

能在该类所在包`Inner`的任意类（`A`、`Inner.B`、`Inner.C`）中访问`A.x`和`Inner.B.x`，不能在与该类不同包`Outer`的任何类（`Outer.B`和`Outer.C`）中访问`A.x`或`Inner.B.x`。

即只能以方式（1）和（2）访问`x`；如果`B`与`A`在同一包中，则能以方式（3）-（7）访问`x`，否则不能；如果`C`与`A`在同一包中，则能以方式（8）访问`x`，否则不能；如果`A`、`B`和`C`都在同一包中，则能以方式（9）访问`x`，否则不能。

**默认实例成员是作用域为超类（继承链最顶端的超类）所在包的`public`实例成员。**

#### 类`protected`实例成员

`x`可以被任意子类继承；

能在该类所在包`Inner`的任意子类（`A`、`Inner.B`和`Inner.C`）中访问`A.x`、`Inner.B.x`和`Outer.B.x`，只能在`Outer.B`类中访问当前实例的`x`，不能访问其他`Outer.B`类实例的`x`。

即能以方式（1）-（6）访问`x`；如果`B`与`A`在同一包中，则能以方式（7）访问`x`，否则不能；如果`C`与`A`在同一包中，则能以方式（8）、（9）访问`x`，否则不能。

**`protected`实例成员是在默认成员的基础上，增加了与超类（继承链最顶端的超类）不同包的子类的继承权限，且要求：（1）在该类中，只能访问该类实例的该成员，不能访问其他类的该成员；（2）在超类所在包的任意子类中，也可以访问该类实例的该成员。**



```java
package TestJava;
import TestAccess.OuterChild;
public class Parent {
    public void callPublic() { System.out.println("call Public"); }
    protected void callProtected(){ System.out.println("call Protected"); }
    void callDefault(){ System.out.println("call Default"); }
    private void callPrivate() { System.out.println("call Private"); }
    public void testFunc(){
        this.callPublic(); // (1) 在类A中使用this访问this.x; x为public
        this.callProtected(); // (1) 在类A中使用this访问this.x; x为protected
        this.callDefault(); // (1) 在类A中使用this访问this.x; x为默认
        this.callPrivate(); // (1) 在类A中使用this访问this.x; x为private
        Parent parent = new Parent();
        parent.callProtected(); // (2) 在类A中使用A类实例访问A.x; x为protected
        parent.callDefault(); // (2) 在类A中使用A类实例访问A.x; x为默认
        parent.callPrivate(); // (2) 在类A中使用A类实例访问A.x; x为private
        Child child = new Child();
        child.callProtected(); // (3) 在类A中使用B类实例访问B.x; x为protected
        child.callDefault(); // (3) 在类A中使用B类实例访问B.x; x为默认且B与A在同一包中
        OuterChild outChild = new OuterChild();
        outChild.callProtected(); // (3) 在类A中使用B类实例访问B.x; x为protected
        // outChild.callDefault(); // (3) 在类A中使用B类实例访问B.x; x为默认且B与A不在同一包中
    }
}
```

```java
package TestJava;
import TestAccess.OuterChild;
// 同一包的子类
public class Child extends Parent {
    public void testFunc(){
        this.callPublic(); // (4) 在子类B中使用this访问B.x; x为public
        this.callProtected(); // (4) 在子类B中使用this访问B.x; x为protected
        this.callDefault(); // (4) 在子类B中使用this访问B.x; x为默认且B与A在同一包中
        super.callPublic(); // (5) 在子类B中使用super访问B.x; x为public
        super.callProtected(); // (5) 在子类B中使用super访问B.x; x为protected
        super.callDefault(); // (5) 在子类B中使用super访问B.x; x为默认且B与A在同一包中
        Parent parent = new Parent();
        parent.callProtected(); // (7) 在子类B中使用A类实例访问A.x; x为protected且B与A在同一包中
        parent.callDefault(); // (7) 在子类B中使用A类实例访问A.x; x为默认且B与A在同一包中
        Child child = new Child();
        child.callProtected(); // (6) 在子类B中使用B类实例访问B.x; x为protected
        child.callDefault(); // (6) 在子类B中使用B类实例访问B.x; x为默认且B与A在同一包中
        OuterChild outChild = new OuterChild();
        outChild.callProtected(); // (9) 在其他类C中使用B类实例访问B.x; x为protected且C与A在同一包中
        // outChild.callDefault(); // (9) 在其他类C中使用B类实例访问B.x; x为默认且B、C与A不在同一包中
    }
}
```

```java
package TestJava;
import TestAccess.OuterChild;
// 同一包的非子类
public class Strange {
    public void testFunc(){
        Parent parent = new Parent();
        parent.callProtected(); // (8) 在其他类C中使用A类实例访问A.x; x为protected且C与A在同一包中
        parent.callDefault(); // (8) 在其他类C中使用A类实例访问A.x; x为默认且C与A在同一包中
        Child child = new Child();
        child.callProtected(); // (9) 在其他类C中使用B类实例访问B.x; x为protected且C与A在同一包中
        child.callDefault(); // (9) 在其他类C中使用B类实例访问B.x; x为默认且B、C与A在同一包中
        OuterChild outChild = new OuterChild();
        outChild.callProtected(); // (9) 在其他类C中使用B类实例访问B.x; x为protected且C与A在同一包中
        // outChild.callDefault(); // (9) 在其他类C中使用B类实例访问B.x; x为默认且B、C与A不在同一包中
    }
}
```

```java
package TestAccess;
import TestJava.Parent;
import TestJava.Child;
// 不同包的子类
public class OuterChild extends Parent {
    public void testFunc(){
        this.callPublic(); // (4) 在子类B中使用this访问B.x; x为public
        this.callProtected(); // (4) 在子类B中使用this访问B.x; x为protected
        // this.callDefault(); // (4) 在子类B中使用this访问B.x; x为默认且B与A不在同一包中
        super.callPublic(); // (5) 在子类B中使用super访问B.x; x为public
        super.callProtected(); // (5) 在子类B中使用super访问B.x; x为protected
        // super.callDefault(); // (5) 在子类B中使用super访问B.x; x为默认且B与A不在同一包中
        Parent parent = new Parent();
        // parent.callProtected(); // (7) 在子类B中使用A类实例访问A.x; x为protected且B与A不在同一包中
        // parent.callDefault(); // (7) 在子类B中使用A类实例访问A.x; x为默认且B与A不在同一包中
        Child child = new Child();
        // child.callProtected(); // (9) 在其他类C中使用B类实例访问B.x; x为protected且C与A不在同一包中
        // child.callDefault(); // (9) 在其他类C中使用B类实例访问B.x; x为默认且B、C与A不在同一包中
        OuterChild outChild = new OuterChild();
        outChild.callProtected(); // (6) 在子类B中使用B类实例访问B.x; x为protected
        // outChild.callDefault(); // (6) 在子类B中使用B类实例访问B.x; x为默认且B与A不在同一包中
    }
}
```

```java
package TestAccess;
import TestJava.Parent;
import TestJava.Child;
// 不同包的非子类
public class OuterStrange {
    public void testFunc(){
        Parent parent = new Parent();
        // parent.callProtected(); // (8) 在其他类C中使用A类实例访问A.x; x为protected且C与A不在同一包中
        // parent.callDefault(); // (8) 在其他类C中使用A类实例访问A.x; x为默认且C与A不在同一包中
        Child child = new Child();
        // child.callProtected(); // (9) 在其他类C中使用B类实例访问B.x; x为protected且C与A不在同一包中
        // child.callDefault(); // (9) 在其他类C中使用B类实例访问B.x; x为默认且B、C与A不在同一包中
        OuterChild outChild = new OuterChild();
        // outChild.callProtected(); // (9) 在其他类C中使用B类实例访问B.x; x为protected且C与A不在同一包中
        // outChild.callDefault(); // (9) 在其他类C中使用B类实例访问B.x; x为默认且B、C与A不在同一包中
    }
}
```



假设：

`Inner.Parent`、`Inner.Child`、`Inner.Strange`、`Outer.OutChild`、`Outer.OutStrange`。

`Parent`类成员：`xPublic`、`yPrivate`、`zProtected`，`aDefault`。

那么：

`Child`类成员：`xPublic`、`zProtected`、`aDefault`；

`OutChild`类成员：`xPublic`、`zProtected`；

所以：

`Parent.xPulic`：可以在任意类中访问；

`Parent.yPrivate`：只能在`Parent`类中访问；

`Parent.zProtected`：可以在`Inner`包的任意类中访问；

`Parent.aDefault`：可以在`Inner`包的任意类中访问。

`Child.xPublic`：可以在任意类中访问；

`Child.zProtected`：可以在`Inner`包的任意类中访问；

`child.aDefault`：可以在`Inner`包的任意类中访问。

`OutChild.xPublic`：可以在任意类中访问；

`OutChild.zProtected`：可以在`Inner`包的任意类、`OutChild`类中访问。



### 2、被子类覆盖的类实例成员

至于被子类覆盖的超类成员，超类成员属于超类，子类成员属于子类，互不相干。各自的访问权限和继承权限与上述相同。



### 3、类静态成员

类中的静态成员包括静态字段和静态方法。访问静态成员`x`的方式有以下几种：

（1）在类`A`中访问`A.x`；`x`为`public`、`x`为默认、`x`为`protected`、`x`为`private`

（2）在类`A`中访问`B.x`；`x`为`public`、`x`为默认且`B`与`A`在同一包中、`x`为`protected`

（3）在子类`B`中访问`A.x`；`x`为`public`、`x`为默认且`B`与`A`在同一包中、`x`为`protected`

（4）在子类`B`中访问`B.x`；`x`为`public`、`x`为默认且`B`与`A`在同一包中、`x`为`protected`

（5）在其他类`C`中访问`A.x`；`x`为`public`、`x`为默认且`C`与`A`在同一包中、`x`为`protected`且（`C`与`A`在同一包中 或  `C`是`A`的子类）

（6）在其他类`C`中访问`B.x` ；`x`为`public`、`x`为默认且`B`、`C`与`A`在同一包中、`x`为`protected`且（`C`与`A`在同一包中 或  `C`是`A`的子类）

**`public`静态成员是完全公开的静态成员。**

**`private`静态成员是完全私密的静态成员。**

**默认静态成员是作用域为超类（继承链最顶端的超类）所在包的`public`静态成员。**

**`protected`静态成员是作用域为超类（继承链最顶端的超类）所有子类和超类所在包的`public`静态成员。**

```java
package TestJava;
import TestAccess.OuterChild;
public class Parent {
    public static int x = 1;
    protected static int y = 2;
    private static int z = 3;
    static int a = 4;
    public void testFunc(){
        System.out.println(Parent.x); // (1) 在类A中访问A.x; x为public
        System.out.println(Parent.y); // (1) 在类A中访问A.x; x为protected
        System.out.println(Parent.z); // (1) 在类A中访问A.x; x为默认
        System.out.println(Parent.a); // (1) 在类A中访问A.x; x为private
        System.out.println(Child.x); // (2) 在类A中访问B.x; x为public
        System.out.println(Child.y); // (2) 在类A中访问B.x; x为protected
        System.out.println(Child.z); // (2) 在类A中访问B.x; x为默认且B与A在同一包中
        // System.out.println(Child.a); // (2) 在类A中访问B.x; x为private
        System.out.println(OuterChild.x); // (2) 在类A中访问B.x; x为public
        System.out.println(OuterChild.y); // (2) 在类A中访问B.x; x为protected
        // System.out.println(OuterChild.z); // (2) 在类A中访问B.x; x为默认且B与A不在同一包中
        // System.out.println(OuterChild.a); // (2) 在类A中访问B.x; x为private
    }
}
```

```java
package TestJava;
import TestAccess.OuterChild;
// 同一包的子类
public class Child extends Parent {
    public void testFunc(){
        System.out.println(Parent.x); // (3) 在子类B中访问A.x; x为public
        System.out.println(Parent.y); // (3) 在子类B中访问A.x; x为protected
        System.out.println(Parent.z); // (3) 在子类B中访问A.x; x为默认且B与A在同一包中
        // System.out.println(Parent.a); // (3) 在子类B中访问A.x; x为private
        System.out.println(Child.x); // (4) 在子类B中访问B.x; x为public
        System.out.println(Child.y); // (4) 在子类B中访问B.x; x为protected
        System.out.println(Child.z); // (4) 在子类B中访问B.x; x为默认且B与A在同一包中
        // System.out.println(Child.a); // (4) 在子类B中访问B.x; x为private
        System.out.println(OuterChild.x); // (6) 在其他类C中访问B.x; x为public
        System.out.println(OuterChild.y); // (6) 在其他类C中访问B.x; x为protected且C是A的子类
        // System.out.println(OuterChild.z); // (6) 在其他类C中访问B.x; x为默认且B、C与A不在同一包中
        // System.out.println(OuterChild.a); // (6) 在其他类C中访问B.x; x为private
    }
}
```

```java
package TestJava;
import TestAccess.OuterChild;
// 同一包的非子类
public class Strange {
    public void testFunc(){
        System.out.println(Parent.x); // (5) 在其他类C中访问A.x; x为public
        System.out.println(Parent.y); // (5) 在其他类C中访问A.x; x为protected且C与A在同一包中
        System.out.println(Parent.z); // (5) 在其他类C中访问A.x; x为默认且C与A在同一包中
        // System.out.println(Parent.a); // (5) 在其他类C中访问A.x; x为private
        System.out.println(Child.x); // (6) 在其他类C中访问B.x; x为public
        System.out.println(Child.y); // (6) 在其他类C中访问B.x; x为protected且C与A在同一包中
        System.out.println(Child.z); // (6) 在其他类C中访问B.x; x为默认且B、C与A在同一包中
        // System.out.println(Child.a); // (6) 在其他类C中访问B.x; x为private
        System.out.println(OuterChild.x); // (6) 在其他类C中访问B.x; x为public
        System.out.println(OuterChild.y); // (6) 在其他类C中访问B.x; x为protected且C与A在同一包中
        // System.out.println(OuterChild.z); // (6) 在其他类C中访问B.x; x为默认且B、C与A不在同一包中
        // System.out.println(OuterChild.a); // (6) 在其他类C中访问B.x; x为private
    }
}
```

```java
package TestAccess;
import TestJava.Parent;
import TestJava.Child;
// 不同包的子类
public class OuterChild extends Parent {
    public void testFunc(){
        System.out.println(Parent.x); // (3) 在子类B中访问A.x; x为public
        System.out.println(Parent.y); // (3) 在子类B中访问A.x; x为protected
        // System.out.println(Parent.z); // (3) 在子类B中访问A.x; x为默认且B与A不在同一包中
        // System.out.println(Parent.a); // (3) 在子类B中访问A.x; x为private
        System.out.println(Child.x); // (6) 在其他类C中访问B.x; x为public
        System.out.println(Child.y); // (6) 在其他类C中访问B.x; x为protected且C是A的子类
        // System.out.println(Child.z); // (6) 在其他类C中访问B.x; x为默认且B、C与A不在同一包中
        // System.out.println(Child.a); // (6) 在其他类C中访问B.x; x为private
        System.out.println(OuterChild.x); // (4) 在子类B中访问B.x; x为public
        System.out.println(OuterChild.y); // (4) 在子类B中访问B.x; x为protected
        // System.out.println(OuterChild.z); // (4) 在子类B中访问B.x; x为默认且B与A不在同一包中
        // System.out.println(OuterChild.a); // (4) 在子类B中访问B.x; x为private
    }
}
```

```java
package TestAccess;
import TestJava.Parent;
import TestJava.Child;
// 不同包的非子类
public class OuterStrange {
    public void testFunc(){
        System.out.println(Parent.x); // (5) 在其他类C中访问A.x; x为public
        // System.out.println(Parent.y); // (5) 在其他类C中访问A.x; x为protected且C与A不在同一包中且C不是A的子类
        // System.out.println(Parent.z); // (5) 在其他类C中访问A.x; x为默认且C与A不在同一包中
        // System.out.println(Parent.a); // (5) 在其他类C中访问A.x; x为private
        System.out.println(Child.x); // (6) 在其他类C中访问B.x; x为public
        // System.out.println(Child.y); // (6) 在其他类C中访问B.x; x为protected且C与A不在同一包中且且C不是A的子类
        // System.out.println(Child.z); // (6) 在其他类C中访问B.x; x为默认且B、C与A在同一包中
        // System.out.println(Child.a); // (6) 在其他类C中访问B.x; x为private
        System.out.println(OuterChild.x); // (6) 在其他类C中访问B.x; x为public
        // System.out.println(OuterChild.y); // (6) 在其他类C中访问B.x; x为protected且C与A不在同一包中且C不是A的子类
        // System.out.println(OuterChild.z); // (6) 在其他类C中访问B.x; x为默认且B、C与A不在同一包中
        // System.out.println(OuterChild.a); // (6) 在其他类C中访问B.x; x为private
    }
}
```



### 类成员的访问控制总结

1、**类中能访问该类当前实例和该类其他实例的任意成员。**

2、**`public`成员是完全公开的成员。**

3、**`private`成员是完全私密的成员。**

4、**默认成员是作用域为超类（继承链最顶端的超类）所在包的`public`成员。**

5、**`protected`实例成员是在默认实例成员的基础上，增加了与超类（继承链最顶端的超类）不同包的子类的继承权限，且要求：（1）在该类中，只能访问该类实例的该成员，不能访问其他类的该成员；（2）在超类所在包的任意子类中，也可以访问该类实例的该成员。**

6、**`protected`静态成员是作用域为超类（继承链最顶端的超类）所有子类和超类所在包的`public`静态成员。**

6、注意一种极端情况：顶层超类`Inner.Parent`、超类`Outer.Child`、类`Inner.Grandson`。超类`Outer.Child`能继承顶层超类`Inner.Parent`的全部`protected`成员，不能继承默认成员。**类`Inner.Grandson`能继承顶层超类`Inner.Parent`的全部`protected`成员，不能继承默认成员（尽管与顶层超类在同一包中）。**



### 类的访问权限

类的访问权限：（1）`public`；（2）默认（没有修饰符）

`public`类可以在其他包中使用（首先`import`导入）；默认类只能在同一个包中（可以是不同源文件）使用。

#### 复杂情况1

但是考虑这样一种情况：

`myPackage`包的源文件`A.java`中代码如下：

```java
package myPackage;
public  interface  A {
    int getX();
}
class B implements A{
    private int x = 3;

    public int getX() {
        return x;
    }
}
```

`myPackage`包的源文件`C.java`中代码如下：

```java
package myPackage;

public class C {
    public A getA(){
        return new B();
    }
}
```

另一个包的源文件`Test`中代码如下：

```java
import myPackage.A;
import myPackage.C;
public class Test {
    public static void main(String[] args){
        C c = new C();
        A a = c.getA();
        // 编译器认为访问的是A接口的getX()方法
        // 但a实际上是B类对象,在运行时访问的是B类的getX()方法
        // B类是私有类,但在运行时是可以访问的
        System.out.println(a.getX());
    }
}
```

#### 复杂情况2



1、模块`TestModule`：

该模块有三个包：`packageA`、`packageB`、`packageC`，每个包下只有一个类，分别是`A`、`B`、`C`。只导出了包`packageA`、`packageB`。

模块声明文件如下：

```java
module TestModule {
    exports packageA;
    exports packageC;
}
```

`packageA.A`类代码如下：

```java
package packageA;
public interface A {
    int getX();
}
```

`packageB.B`类代码如下：

```java
package packageB;
import packageA.A;
public class B implements A {
    private int x = 3;

    public B() {
    }

    public int getX() {
        return this.x;
    }
}
```

`packageC.C`类代码如下：

```java
package packageC;
import packageA.A;
import packageB.B;
public class C {
    public C() {
    }

    public A getA() {
        return new B();
    }
}
```

2、模块`Test`：

该模块依赖于`TestModule`模块，该模块下只有一个包`testPackage`，这个包中只有一个类`Test`。

模块声明如下：

```java
module Test{
    requires TestModule;
}
```

类`testPackage.Test`代码如下：

```java
package testPackage;
import packageA.A;
import packageC.C;
public class Test{
    public static void main(String[] args) {
        C c = new C();
        A a = c.getA();
        // 编译器认为访问的是A接口的getX()方法
        // 但a实际上是B类对象,在运行时访问的是B类的getX()方法
        // B类是私有类,但在运行时是可以访问的
        System.out.println(a.getX());
    }
}
```

#### 复杂情况3

1、模块`ModuleA`：

声明文件：

```java
module ModuleA{
    exports packageA;
}
```

类`A`：

```java
package packageA;
public interface A {
    int getX();
}
```

2、模块`ModuleB`：

声明文件：

```java
module ModuleB{
    exports packageB;
    requires ModuleA;
}
```

类`B`:

```java
package packageB;
import packageA.A;
public class B implements A {
    private int x = 3;
    public B() {
    }
    public int getX() {
        return this.x;
    }
}
```

3、模块`ModuleC`：

声明文件：

```java
module ModuleC {
    requires ModuleB;
    requires ModuleA;
    exports packageC;
}
```

类`C`：

```java
package packageC;
import packageA.A;
import packageB.B;
public class C {
    public C() {
    }
    public A getA() {
        return new B();
    }
}
```

4、模块`Test`：

声明文件：

```java
module Test{
    requires ModuleC;
    requires ModuleA;
}
```

类`Test`：

```java
package testPackage;
import packageA.A;
import packageC.C;
public class Test{
    public static void main(String[] args) {
        C c = new C();
        A a = c.getA();
        System.out.println(a.getX());
    }
}
```

运行`Test`类的`main`方法，会报错，具体不是哪句代码报错，而是加载模块时报错：模块`ModuleC`依赖于模块`ModuleB`，但是模块中`Test`中找不到模块`ModuleB`。

因此：（1）在IDEA中，把三个模块`ModuleA`、`ModuleB`、`ModuleC`的`.jar`文件都添加进`Test`模块的依赖项中以后，就不会报错了；（2）如果是以命令行方式运行程序，就需要把三个模块`ModuleA`、`ModuleB`、`ModuleC`的`.jar`文件都放置于模块路径（由`java`命令的`-p`选项设置）之下。

注意：无论如何运行，都不需要在`ModuleC`模块的声明文件中利用`requires transitive MudoleB`声明传递性需求。

之后：（2）虽然`Test`模块没有引用`ModuleB`模块，但是执行语句`System.out.println(a.getX());`仍然能够成功。



### 内部类的访问权限

内部类的访问权限：（1）`public`；（2）默认（没有修饰符）；（3）`private`只能用来修饰内部类，表明该内部类只能由它的**外围类**使用。



### 接口的访问权限

接口的访问权限：（1）`public`；（2）`private`







## 资源

类通常有一些关联的数据文件，例如：（1）图像和声音文件；（2）包含消息字符串和按钮标签的文本文件......在java中，这些关联的文件被称为**资源**。

java虚拟机会搜索与`.class`文件同一目录下的关联资源，这些资源文件会被认为属于该类的资源。

例如：`Test`类位于`TestJava`包中，三个资源文件`HTTP.png`、`HTTP.txt`、`Title.txt`与`Test.java`文件位于同一目录，即`TestJava`目录下。这样这三个资源文件就是`Test`类的资源。



## 类设计技巧

1、**一定要保证数据私有**

很多惨痛的教训告诉我们：数据的表示形式（在类中的定义）很可能会改变，但它们的使用方式（在其他类中的使用）却不会变化。

当数据保持私有时，表示形式的变化不会对类的使用者产生影响，而且也更容易检测bug。

2、一定要对数据初始化

3、**不要在类中使用过多基本类型**

这个想法是要用其他的类替换使用多个相关的基本类型。例如：用一个名为`Address`的新类替换`Customer`类中以下的实例字段：

```java
private String street;
private String city;
private String state;
private int zip;
```

这样一来，可以使类更容易理解，也更易于修改。例如，可以很容易地处理地址的变化。

4、不是所有字段都需要访问器和更改器

在对象中，常常包含一些不希望比尔获得或设置的实例字段。例如，`Address`类中的州缩写数组。

5、**分解有过多职责的类**

6、类名与方法名要能体现其职责

类名应当是一个名词，或者是有动名词（V-ing）修饰的名词，或者是有形容词修饰的名词。例如，`Address`、`BillingAddress`、`RushOrder`。

方法应当是一个动词，或者动词+名词。

7、**优先使用不可变的类**

不可变的类是指没有方法能够修改对象的状态。例如`java.time.LocalDate`类就是不可变类，其中的`plusDay`方法并不是更改对象，而是返回状态已修改的新对象。

8、**将公共操作和字段放在超类中**

9、**不要使用受保护的字段**

`protected`机制并不能带来更多的保护，这有两方面的原因。第一：子类集合是无限的，任何一个人都能够由你的类派生一个子类，然后编写代码直接访问`protected`实例字段；第二：再java中，在同一个包中的所有类都可以访问`protected`字段，而不管它们是否为这个类的子类。这两点都会破坏封装性。

10、**使用继承实现"is-a"关系**

如果两个类之间不是"is-a"关系，就不要使用继承，否则会带来很多麻烦。

11、**除非所有继承的方法都有意义，否则不要使用继承**

如果使假日类`Holiday`继承`GregorianCalendar`（西历）类，那么超类有一个方法`add`可以将一个假日变换为非假日，这样就会破坏原来的`Holiday`类对象的含义。

12、在覆盖方法时，不要改变预期的行为

13、**使用多态，而不要使用类型信息**

使用多态方法或接口实现的代码比使用多个类型检测的代码更易于维护和扩展。多态性固有的动态分配机制能够执行正确的动作。

14、不要滥用反射

反射对于编写系统程序极其有用，但是通常不适于编写应用程序。反射是很脆弱的，如果使用反射，编译器将无法帮助你查找编程错误，因此只有在运行时才会发现错误并导致异常。



## Object类

1、java中的每个类都扩展了`Object`类。但是不用显式地声明`extends Object`，因为这是默认的。

2、所有的数组类型，不管是基本类型的数组、对象类型的数组，甚至是`Object`类型的数组，都扩展了`Object`类。

```java
public class Test {
    public static void main(String[] args) {
        Object[] objs = new String[]{"ss", "rr"};
        Object obj = objs;
        Object obj2 = new Object[]{"ss", "rr"};
    }
}
```

3、`equals`方法

`Object`类的`equals`方法用于检测两个对象是否相等。

（1）这是一个合理的默认行为：如果两个`Object`对象都为`null`，则判定它们相等；如果其中一个为`null`另一个不为`null`，则判定它们不相等；如果两个都不为`null`，则判断它们的引用是否相等，是则返回`true`，否则返回`false`。

（2）`equals`方法与`hashCode`方法的定义必须相容，即：如果两个`Object`对象相等，则`hashCode`方法返回相同的散列码；否则返回不同的散列码。

（3）其他java标准类型都实现了各自的`equals`方法。

4、`hashCode`方法

`Object`类的`hashCode`方法从对象的存储地址得出散列码。散列码是一个整数，可以为负整数。

（1）如果两个`Object`对象相等，则`hashCode`方法返回相同的散列码；否则返回不同的散列码。

（2）其他java标准类型都实现了各自的`hashCode`方法。例如`String`类根据字符串的内容计算散列码：如果两个字符串的内容相同，则`hashCode`方法返回相同的散列码；否则返回不同的散列码。

5、`toString`方法

`Object`类的`toString`方法返回表示对象值的一个字符串，默认实现是：返回类名加存储地址。

其他java标准类型都实现了各自的`equals`方法。