# 泛型

泛型程序设计意味着编写的代码可以对多种不同类型的对象重用。

## 基本语法

### 泛型类

泛型类相当于普通类的工厂。

```java
public class Pair<T, S>{
    private T first;
    private S second;
    public Pair(){
        first = null;
        second = null;
    }
    public Pair(T first, S second){
        this.first = first;
        this.second = second;
    }
    public T getFirst(){
        return first;
    }
    public S getSecond(){
        return second;
    }
    public void setFirst(T newValue){
        first = newValue;
    }
    public void setSecond(S newValue){
        second = newValue;
    }
    // 这里特意使用U而不是T或S，是为了说明：静态方法的泛型类型和类的泛型类型没有任何关系
    public static <U> Pair<U> makePair(Supplier<U> constr){
        return new Pair<>(constr.get(), constr.get());
    }
}
```

1、一般而言，`T`、`S`、`U`表示任意类型，`E`表示集合的元素类型，`K`和`V`表示表的键和值类型。

2、规定：

（1）类名为`Pair<T, S>`，但构造器名可以直接写`Pair`；

（2）实例成员可以直接使用`T`和`S`；

（3）不能有静态泛型字段；

（4）静态方法中必须在方法修饰符`public static`后面、返回类型前面加上`<U>`，然后才能在方法返回类型和方法参数中使用`U`。静态方法也不能访问类的实例成员。

### 泛型方法

```java
public class Test{
    public void main(String[] args){
        String middle = ArrayAlg.<String>getMiddle("John", "Q", "Public");
    }
}
class ArrayAlg{
    public <T> T getMiddle(T...a){
        return a[a.length / 2];
    }
}
```

1、方法声明中，类型变量`<T>`应放在修饰符`public static`后面、返回类型`T`前面。

2、调用方法时，应该把具体类型包围在尖括号中（`<String>`），并放在方法名`getMiddle`前面。但如果编译器有足够的信息能够推断出泛型类型`<T>`，也可以省略具体类型说明，例如在这里也可以写成`ArrayAlg.getMiddle("John", "Q", "Public")`。

3、在方法中，如果泛型`T`没有任何限定，那会被编译器认为是`Object`类型，所以`T`类型的变量也只能调用`Object`类的实例方法；如果是`T extends A`，那会被编译器认为是`A`类型，所以变量可以调用`A`类的实例方法。

### 泛型数组列表`ArrayList<T>`

`ArrayList<T>`，声明方式：

```java
ArrayList<Employee> staff = new ArrayList<Employee>();
var staff = new ArrayList<Employee>();
// 菱形语法
ArrayList<Employee> staff = new ArrayList<>();
// 可以对Employee的匿名子类使用菱形语法
ArrayList<Employee> staff = new ArrayList<>(){
    public int getId(){
        return super.getId();
    }
}
```

### 类型变量约束

`<T extends SuperClass1 & Interface1 & Interface2>`：限制类型`T`是`SuperClass`类的子类型，并且实现了`Interface1 `接口和`Interface2`接口。超类类型限定必须放在接口类型限定之前。



## 转换泛型类（类型擦除）

==虚拟机没有泛型类型对象，所有对象都属于普通类。==

无论何时定义一个泛型类型，都会自动提供一个相应的==原始类型==。这个原始类型就是类名去除类型参数（比如`<T, S>`）后的原始名称。

类内部的类型变量（比如`T`和`S`）会被替换为其各自的额限定类型（第一个限定类型）或`Object`（没有限定类型时）。

1、这个原始类型就是（`Pair<T, S>`）去除类型参数`<T, S>`后的泛型类型名`Pair`。

`Pair`类内部的类型变量`T`和`S`会被擦除，并替换为其限定类型或`Object`。

原代码：

```java
public class Pair<T, S>{
    private T first;
    private S second;
    public Pair(){
        first = null;
        second = null;
    }
    public Pair(T first, S second){
        this.first = first;
        this.second = second;
    }
    public T getFirst(){
        return first;
    }
    public S getSecond(){
        return second;
    }
    public void setFirst(T newValue){
        first = newValue;
    }
    public void setSecond(S newValue){
        second = newValue;
    }
}
```

类型擦除后：

```java
public class Pair{
    private Object first;
    private Object second;
    public Pair(){
        first = null;
        second = null;
    }
    public Pair(Object first, Object second){
        this.first = first;
        this.second = second;
    }
    public Object getFirst(){
        return first;
    }
    public Object getSecond(){
        return second;
    }
    public void setFirst(Object newValue){
        first = newValue;
    }
    public void setSecond(Object newValue){
        second = newValue;
    }
}
```

2、如果我们声明一个类为：

```java
public class Interval<T extends Comparable & Serializable> implements Serializable{
    private T lower;
    private T upper;
    public Interval(T first, Tsecond){
        if(first.compareTo(second) <= 0){
            lower = first;
            upper = second;
        }
        else{
            lower = second;
            upper =first;
        }
    }
}
```

那么类型擦除后为：

```java
public class Interval implements Serializable{
    private Comparable lower;
    private Comparable upper;
    public Interval(Comparable first, Comparable second){
        if(first.compareTo(second) <= 0){
            lower = first;
            upper = second;
        }
        else{
            lower = second;
            upper =first;
        }
    }
}
```

原始类型是`Interval<T extends Comparable & Serializable>`去除类型参数`<T extends Comparable & Serializable>`的泛型类型名`Interval`。

`Interval`类内部的类型变量`T`用其限定类型`Comparable`代替。

## 转换泛型表达式（强制类型转换）

编写一个泛型方法调用时，如果擦除了泛型方法的返回类型，编译器会插入强制类型转换；编写泛型方法字段也一样。

```java
// ################ 原代码 ################
Pair<Employee> buddies = ...;
Employee buddy = buddies.getFirst();
Employee staff - buddies.second; // 假设能够访问
// ################ 类型擦除后 ################
Pair buddies = ...;
Employee buddy = (Employee) buddies.getFirst();
Employee staff = (Employee) buddies.second;
```

### 泛型类对象的创建

泛型类`A`的三种应用：（1）某个类继承`A`类；（2）`A`类对象作为方法参数；（3）访问`A`类的方法；（4）接收`A`类方法返回值或`A`类字段（编译器会根据上下文推断，做强制类型转换）；。其中，（2）、（3）、（4）都要创建`A`类对象，如何创建决定了以后的使用。

创建泛型类对象的写法有9种，按照有参数和无参数构造器，又细分为18种。如下面的代码所示。其中涉及到4种写法：`A`、`var`、`A<X>`、`A<>`。至于`A`写法，是遗留代码中的写法，我们单独讲。

```java
public class Test{
    public static void main(String[] args){
        A<X> a1 = new A<X>();
		A<X> a2 = new A<>();
		A<X> a3 = new A();
		var a4 = new A<X>();
		var a5 = new A<>();
		var a6 = new A();
		A a7 = new A<X>();
		A a8 = new A<>();
		A a9 = new A();
        
        Y y = new Y();
        A<X> a10 = new A<X>(y);
        A<X> a11 = new A<>(y);
        A<X> a12 = new A(y);
        var a13 = new A<X>(y);
        var a14 = new A<>(y);
        var a15 = new A(y);
        A a16 = new A<X>(y);
        A a17 = new A<>(y);
        A a18 = new A(y);
    }
}
class A<T>{
    private T t;
    public A() { }
    public A(T t) { this.t = t; }
}
class X { }
class Y extends X{ }
```

所以我们只详细讨论剩下的3种写法：`var`、`A<X>`、`A<>`。这3种写法可以构成4种创建泛型类对象的写法，按照有参数和无参数构造器细分，共有8种写法。写在赋值语句左侧的语句`var`和`A<X>`是声明类型变量，写在赋值语句右侧的`new A<X>()`和`new A()`是创建匿名的类型对象。

```java
Y y = new Y();
A<X> a1 = new A<X>();
A<X> a2 = new A<>();
var a3 = new A<X>();
var a4 = new A<>();
A<X> a5 = new A<X>(y);
A<X> a6 = new A<>(y);
var a7 = new A<X>(y);
var a8 = new A<>(y);
```

1、创建泛型类`A`对象时要声明参数类型，其目的是确保以下几种情况：

（1）利用对象变量调用`A`类方法时，确保传入方法的参数类型匹配；

（2）利用变量接收`A`类方法返回值或`A`类实例字段时，确保变量类型匹配；

（3）参数化泛型类对象`a`作为某个方法的参数时，确保方法声明的参数类型匹配`a`的泛型类型。

2、为了确保这些情况：

（1）首先要由用户声明与定义。传入方法的参数对象、方法返回的对象、访问的`Pair`类字段：实际类型是什么只有用户自己知道，因为代码是用户写的。

（2）然后由编译器根据用户代码的上下文去检查，检查通过后才能成功编译并允许JVM运行。

3、编译完成后，`A`类内部的泛型`T`都被替换为限定类型（可能是`Object`也可能是`Employee`等）了，所以会添加强制类型转换的代码。在运行阶段：

（1）在调用`A`类的方法时，传入方法的参数可以是任何实际类型；

（2）最终方法的返回值或`A`类的实例字段也可以是任何实际类型；

（3）在调用某个参数为参数化`A`类对象的方法时，传给方法的`A`类对象参数也可以是任何实际类型。

JVM只是无条件接收方法参数，然后执行代码，然后返回值而已。JVM不知道也不会去检查参数类型是什么，如果参数的实际类型不支持代码逻辑，就会出现运行时错误。

#### `new A<X>()`

`new A<X>()`是告诉编译器要创建一个`A`类中参数类型为`X`的`A`类对象。

因此编译器会查找`A`类的所有构造器，看传入的参数是否匹配某个构造器的参数（参数数量和参数类型）。

对于参数类型，需要保证传入的参数类型与构造器声明的参数类型（泛型`T`类型是`X`）一致，或者可以转换（向上转换和强制类型转换）为声明的参数类型。

如果没有匹配的构造器（参数数量或参数类型不匹配），就会报告编译错误。

#### `new A<>()`

https://xiamianyu.github.io/2017/10/23/Java-%E6%B3%9B%E5%9E%8B-%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD/

`new A<>()`是告诉编译器要创建一个`A`类对象，`A`类中的参数类型需要编译器进行类型推断。

1、编译器首先从上下文中进行类型推断。在Java 8以后，编译器的类型推断机制包括：

（1）编译器能够根据赋值语句左侧的声明类型推断出泛型类的参数类型。

（2）编译器能够根据传给方法的参数类型推断出泛型方法声明的参数类型。

```java
Public Test{
    public static void main(String[] args){
       A<X> a = new A<>("s"); // 推断T为X类型，S为String类型
       A<X> a2 = new <X>A<>("s");
       var a2 = new A<>("s"); // 推断T为Object类型，S为String类型
    }
}
class A<T> {
    <S> A(S s) { }
}
class X { }
```

（3）编译器能够根据泛型方法声明的参数类型（目标类型）推断出传给方法的参数类型。

```java
public class Test{
    public static void main(String[] args){
        // 推断为Pair<Employee>
        testPairEmployee(new Pair<>(new Manager(),new Manager()));
    }
    public static void testPairEmployee(Pair<Employee> p) throws NoSuchMethodException {
        p.testFunc();
    }
}
```

（4）编译器能够根据传给方法的参数类型（目标类型）推断出泛型方法的返回类型。

```java
// Collections.emptyList方法返回List<T>类型
processStringList(Collections.emptyList()); // 推断T为String
void processStringList(List<String> lst) {...}
static <T> List<T> emptyList();
```

编译器类型推断的结果是：要创建一个`A`类中参数类型为`type`的`A`类对象。

2、然后编译器会查找`A`类的所有构造器，看传入的参数是否匹配某个构造器的参数（参数数量和参数类型）。

对于参数类型，需要保证传入的参数类型与构造器声明的参数类型（泛型`T`类型是`type`）一致，或者可以转换（向上转换和强制类型转换）为声明的参数类型。

如果没有匹配的构造器（参数数量或参数类型不匹配），就会报告编译错误。

`new A<X>`最终会创建`A<X>`类型的对象，`new A<>`最终会创建`A<type>`类型的对象。

#### `A<X>`

`A<X>`是声明一个`A<X>`类型的对象变量。因此`A<X>`类型的对象变量必须能够引用赋值语句右侧创建的对象。

#### `var`

`var`是声明一个变量，变量的类型由编译器从赋值语句左侧推断得到。

最终，赋值语句一定是定义了某个具体参数类型`type`的`A`类对象，即`A<type>`类型的对象。

#### `A`类型

`new A()`表示创建一个`A`类型（原始类型）的对象。`A`表示声明一个`A`类型的对象。

注意：虽然原始类型`rawType` = 类型擦除后泛型`T`的类型 = `Object`（`A<T>`）或`constraintType`（`A<T extends constraintType>`），但是`A<rawType>`类型和`A`类型并不同。

可以认为`A`类型就是`A<T>`类型，`T`这个类型经过类型擦除后就是`rawType`类型，但`A<rawType>`类型并不是`A`类型。

`A`类型本来是应该极力避免使用的，它仍然有效是为了兼容遗留代码（Java 5编写的代码）。之所以要兼容，考虑下面几种情况：

（1）在遗留代码中，某个方法会返回一个原始类型`A`的对象`a`，但是它在实际上代表的是一个参数化类型`A<X>`。因此我们接收完该方法的返回值后，就需要一个`A<X>`类型的对象引用`A`类型的对象。

（2）遗留代码的某个方法接受原始类型`A`的参数，但是它实际上代表的是`A<X>`。因此为了调用这个方法，我们需要一个`A`类型的对象变量引用`A<X>`类型的对象`a`，然后将`a`作为方法参数传入。

因此java允许`A`类型的对象与任意`A<type>`类型的对象等价。这意味着下面几个**弊端**是真实存在的：

（1）`A`类型对象变量可以引用`A<type>`类型对象。

（2）`A<type>`类型对象变量可以引用`A`类型对象。

（3）某个方法参数是`A<type>`类型时，可以传入`A`类型的变量。

（4）`A`类型对象变量调用方法时，可以向方法传入任意类型的参数，甚至两个参数可以是两个不同的`T`类型。

```java
public class Test{
    public static void main(String[] args) throws NoSuchMethodException {
        // 原始类型打破了规则：两个参数的声明类型必须都是T的子类型
        A  a = new A(new X(), "ss");
        // 调用类方法时，可以传入任意类型的参数
        a.setFirst("ss");
        a.setFirst(new X());
        // testFunc接受A<X>类型变量，但可以传入A类型变量
        testFunc(a); // 输出：success
        A<X> a2 = new A<X>(new X());
        // A<X>与A类型对象可以互相引用
        a = a2;
        a2 = a;
    }
    public static void testFunc(A<X> p){
        System.out.println("success");
    }
}
class A<T>{
    private T first;
    private T second;
    // 规则：两个参数的声明类型必须都是T的子类型（声明类型可以不同于实际类型）
    public A(T first, T second){
        this.first = first;
        this.second = second;
    }
    public void setFirst(T first) { 
        this.first = first; 
    }
}
class X { }
```



## 转换泛型方法（桥方法）

这里的泛型方法包括普通类（普通接口）的泛型方法、泛型类（泛型接口）的泛型方法。

### 泛型基本概念

#### 泛型类和泛型接口

（1）类分为普通类和泛型类，接口分为普通接口分为泛型接口。

（2）泛型类和泛型接口指的是形如`ClassOrInterfaceName<T>`这样的类或接口。

不存在`T`这样的泛型类或接口，这里的`T`会被认为是类或接口名。下面的声明式错误的：

```java
class <T> T { ... }  // ERROR
```

（3）泛型类和泛型接口的泛型具有限定类型`BoundType`和限定范围`Bounds`。

#### 三种表示方式

泛型类和泛型接口有三种表示方式，也是子类在继承泛型类和实现泛型接口时的三种方式。

这三种继承方式实际上是对 " 在子类中**调用超类或接口的方法**时**传给方法的参数类型** " 的不同限制。

为了满足这个限制，也导致了 " 在子类中**重写超类或接口的方法**时**参数的声明类型** " 的不同限制：

1、`GenericClass`或`GenericInterface`：

（1）在子类中调用超类或接口的方法时：传给方法的参数类型可以是泛型也可以是具体类型，但必须在超类或接口中的限定范围之内。

（2）在子类中重写超类或接口的方法时：方法参数必须是超类或接口方法中声明的参数（被类型擦除后）的具体类型。之所以不能写成泛型是因为子类的限定范围不一定在超类或接口的限定范围之内，所以不能写泛型。

2、`GenericClass<Type>`或`GenericInterface<Type>`：

`Type`是一个具体类型，这个具体类型必须在超类或接口的限定范围之内。

（1）在子类中调用超类或接口的方法时，传给方法的参数类型必须是`Type`。

（2）在子类中重写超类或接口的方法时，方法参数必须是`Type`。

3、`GenericClass<T>`或`GenericInterface<T>`：

`T`是子类定义的，子类的限定范围必须完全包含在超类或接口的限定范围之内。一个必要而不充分条件为：子类的限定类型不能高于超类或接口的限定类型（参见类`TestClass17`、`TestClass18`、`TestClass21`）。

因为要继承`GenericClass<T>`或实现`GenericInterface<T>`，子类中必须声明`T`（即子类必须是泛型类），所以只有泛型类可以继承这种方式的泛型超类或实现这种方式的泛型接口，普通类不行。

（1）在子类中调用超类或接口的方法时，传给方法的参数类型必须是泛型`T`。

（2）在子类中重写超类或接口的方法时，方法参数可以是泛型也可以是具体的子类限定类型。之所以能写成泛型是因为类型擦除后它就是子类限定类型。

```java
class TestChildClass extends TestGenericClass<String>{
    public int y;
    public TestChildClass(int x) {
        // 只能传入类型为String的参数
        super("x");
        this.y = x;
    }
    public void test(){
        // 只能传入类型为String的参数
        super.setX("y");
        Object z = super.getX();
    }
    @Override
    public void setX(String x) {
        super.setX(x);
    }
    // 不是覆盖
    public void setX(int x){
        this.y = x;
    }
}
class TestChildClass<T extends SuperClass> extends TestGenericClass<T>{
    public T y;
    public TestChildClass(T x) {
        super(x);
        this.y = x;
    }
    public void test(T x){
        SuperClass sp = new SuperClass();
        // super.setX(sp); // 这句会报错
        super.setX(x);
    }
    @Override
    public void setX(SuperClass x) { // 参数类型声明为T也可以
        super.setX((T) x);
    }
}
class TestChildClass<T extends SuperClass> extends TestGenericClass{
    public T y;
    public TestChildClass(T x) {
        super(x);
        this.y = x;
    }
    public void test(T x){
        SuperClass sp = new SuperClass();
        super.setX(sp);
        super.setX(x);
    }
    @Override
    public void setX(Object x) {
        super.setX((T) x);
    }
}
class TestGenericClass<T>{
    public T x;
    public TestGenericClass(T x){
        this.x = x;
    }
    public T getX(){
        return x;
    }
    public void setX(T x){
        this.x = x;
    }
}
```

类型擦除后最终都只会生成：一个超类`GenericClass`，其中的泛型类型被替换为`BoundType`；一个接口`GenericInterface`，其中的泛型类型被替换为`BoundType`。

所以无论哪一种继承方式，它们会共享这一个超类或接口。

### 桥方法

#### 添加桥方法的关键

编译器是否会为重写方法`A`添加桥方法的关键在于：类型擦除后方法`A`是否会成为重载。

具体说，就是当对子类、超类或接口进行类型擦除后，子类方法`A`中的参数类型 与 超类或接口方法`A`中的参数类型 是否相同。

如果相同，就不会成为重载，也就不会添加桥方法；如果不同，就会成为重载，会为`A`添加桥方法。

#### 桥方法的逻辑

（1）当一个子类继承泛型超类或者实现泛型接口时，有三种不同的方式。

（2）不同的方式导致了 " 在子类中**调用超类或接口的方法**时**传给方法的参数类型** " 的不同限制。

（3）为满足上述限制，又导致了 " 在子类中**重写超类或接口的方法**时**参数的声明类型** " 的限制。

（4）子类继承的超类或实现的接口无论是哪一种形式，其泛型类型都会被替换为超类或接口的限定类型。

（5）这就导致子类的重写方法中声明的参数类型可能不是超类或接口的限定类型。这也就是==类型擦除与多态的冲突==。

（6）于是重写方法实际成为了重载方法，这才导致了桥方法。

```java
class SuperClass { }
class ChildClass extends SuperClass { }
interface SuperInterface<T extends SuperClass> { void setX(T x); }
interface ChildInterface<T extends ChildClass> { void setX(T x); }
interface TestInterface<T> { void setX(SuperClass x); }
class TestClass implements ChildInterface{
    public void setX(ChildClass x) {} } // 无桥方法
class TestClass2<T extends ChildClass> implements ChildInterface{
    public void setX(ChildClass x) {} } // 无桥方法
class TestClass3<T extends SuperClass> implements ChildInterface{
    public void setX(ChildClass x) {} } // 无桥方法
class TestClass4<T> implements ChildInterface{
    public void setX(ChildClass x) {} } // 无桥方法
class TestClass5 implements SuperInterface{
    public void setX(SuperClass x) {} } // 无桥方法
class TestClass6<T extends ChildClass> implements SuperInterface{
    public void setX(SuperClass x) {} } // 无桥方法
class TestClass7<T extends SuperClass> implements SuperInterface{
    public void setX(SuperClass x) {} } // 无桥方法
class TestClass8<T> implements SuperInterface{
    public void setX(SuperClass x) {} } // 无桥方法
class TestClass9 implements Comparable{
    public int compareTo(Object o) { return 0; } } // 无桥方法
class TestClass10<T extends ChildClass> implements Comparable{
    public int compareTo(Object o) { return 0; } } // 无桥方法
class TestClass11<T extends SuperClass> implements Comparable{
    public int compareTo(Object o) { return 0; } } // 无桥方法
class TestClass12<T> implements Comparable{
    public int compareTo(Object o) { return 0; } } // 无桥方法
class TestClass13<T extends ChildClass> implements Comparable<T>{
    public int compareTo(T o) { return 0; } } // 有桥方法
class TestClass14<T extends SuperClass> implements Comparable<T>{
    public int compareTo(SuperClass o) { return 0; } } // 有桥方法
class TestClass15<T> implements Comparable<T>{
    public int compareTo(T o) { return 0; } } // 无桥方法
class TestClass16<T extends ChildClass> implements ChildInterface<T>{
    public void setX(T x) {} } // 无桥方法
/** class TestClass17<T extends SuperClass> implements ChildInterface<T>{
 public void setX(T x) {} }  */
/** class TestClass18<T> implements ChildInterface<T>{
 public void setX(T x) {} }  */
class TestClass19<T extends ChildClass> implements SuperInterface<T>{
    public void setX(T x) {} } // 有桥方法
class TestClass20<T extends SuperClass> implements SuperInterface<T>{
    public void setX(T x) {} } // 无桥方法
/** class TestClass21<T> implements SuperInterface<T>{
 public void setX(T x) {} }  */
class TestClass22 implements Comparable<String>{
    public int compareTo(String o) { return 0; } } // 有桥方法
class TestClass23<T extends ChildClass> implements Comparable<String>{
    public int compareTo(String o) { return 0; } } // 有桥方法
class TestClass24<T extends SuperClass> implements Comparable<String>{
    public int compareTo(String o) { return 0; } } // 有桥方法
class TestClass25<T> implements Comparable<String>{
    public int compareTo(String o) { return 0; } } // 有桥方法
class TestClass26 implements Comparable<ChildClass>{
    public int compareTo(ChildClass o) { return 0; } } // 有桥方法
class TestClass27<T extends ChildClass> implements Comparable<ChildClass>{
    public int compareTo(ChildClass o) { return 0; } } // 有桥方法
class TestClass28<T extends SuperClass> implements Comparable<ChildClass>{
    public int compareTo(ChildClass o) { return 0; } } // 有桥方法
class TestClass29<T> implements Comparable<ChildClass>{
    public int compareTo(ChildClass o) { return 0; } } // 有桥方法
class TestClass30 implements Comparable<SuperClass>{
    public int compareTo(SuperClass o) { return 0; } } // 有桥方法
class TestClass31<T extends ChildClass> implements Comparable<SuperClass>{
    public int compareTo(SuperClass o) { return 0; } } // 有桥方法
class TestClass32<T extends SuperClass> implements Comparable<SuperClass>{
    public int compareTo(SuperClass o) { return 0; } } // 有桥方法
class TestClass33<T> implements Comparable<SuperClass>{
    public int compareTo(SuperClass o) { return 0; } } // 有桥方法
class TestClass34 implements ChildInterface<ChildClass>{
    public void setX(ChildClass x) {} } // 无桥方法
class TestClass35<T extends ChildClass> implements ChildInterface<ChildClass>{
    public void setX(ChildClass x) {} } // 无桥方法
class TestClass36<T extends SuperClass> implements ChildInterface<ChildClass>{
    public void setX(ChildClass x) {} } // 无桥方法
class TestClass37<T> implements ChildInterface<ChildClass>{
    public void setX(ChildClass x) {} } // 无桥方法
class TestClass38 implements SuperInterface<ChildClass>{
    public void setX(ChildClass x) {} } // 有桥方法
class TestClass39<T extends ChildClass> implements SuperInterface<ChildClass>{
    public void setX(ChildClass x) {} } // 有桥方法
class TestClass40<T extends SuperClass> implements SuperInterface<ChildClass>{
    public void setX(ChildClass x) {} } // 有桥方法
class TestClass41<T> implements SuperInterface<ChildClass>{
    public void setX(ChildClass x) {} } // 有桥方法
class TestClass42 implements SuperInterface<SuperClass>{
    public void setX(SuperClass x) {} } // 无桥方法
class TestClass43<T extends ChildClass> implements SuperInterface<SuperClass>{
    public void setX(SuperClass x) {} } // 无桥方法
class TestClass44<T extends SuperClass> implements SuperInterface<SuperClass>{
    public void setX(SuperClass x) {} } // 无桥方法
class TestClass45<T> implements SuperInterface<SuperClass>{
    public void setX(SuperClass x) {} } // 无桥方法
class TestClass46<T extends SuperClass> implements TestInterface<T>{
    public void setX(SuperClass x) {} } // 无桥方法
```



#### 桥方法示例

原代码如下：

```java
public class Test{
    public static void main(String[] args){
        var interval = new DateInterval(...);
        Pair<LocalDate> pair = interval;
        var aDate = java.time.LocalDate.now();
        pair.setSecond(aDate);
    }
}
class DateInterval extends Pair<LocalDate>{
    public void setSecond(LocalDate second){
        System.out.println("child");
        super.setSecond(second);
    }
    public LocalDate getSecond(){
        return (LocalDate) super.getSecond();
    }
}
class Pair<T>{
    private T first;
    private T second;
    public Pair(){
        first = null;
        second = null;
    }
    public Pair(T first, T second){
        this.first = first;
        this.second = second;
    }
    public T getFirst(){
        return first;
    }
    public T getSecond(){
        return second;
    }
    public void setFirst(T newValue){
        first = newValue;
    }
    public void setSecond(T newValue){
        System.out.println("super");
        second = newValue;
    }
}
/** 输出结果为： 
child
super
*/
```

类型擦除后的代码如下：

```java
public class Test{
    public static void main(String[] args){
        var interval = new DateInterval(...);
        Pair pair = interval;
        var aDate = java.time.LocalDate.now();
        pair.setSecond(aDate);
        LocalDate date = pair.getSecon();
    }
}
class DateInterval extends Pair{
    public void setSecond(LocalDate second){
        System.out.println("child");
        super.setSecond(second);
    }
    public LocalDate getSecond(){
        return (LocalDate) super.getSecond();
    }
    /**
    public void setSecond(Object second){
    	setSecond((LocalDate) second);
	}
    public Object getSecond(){
    	return getSecond();
	}
	*/
}
class Pair{
    private Object first;
    private Object second;
    public Pair(){
        first = null;
        second = null;
    }
    public Pair(Object first, Object second){
        this.first = first;
        this.second = second;
    }
    public Object getFirst(){
        return first;
    }
    public Object getSecond(){
        return second;
    }
    public void setFirst(Object newValue){
        first = newValue;
    }
    public void setSecond(Object newValue){
        System.out.println("super");
        second = newValue;
    }
}
```

1、`setSecond`方法

类型擦除后`DateInterval`类中有三个`setSecond`方法：超类`Pair`的`setSecond(Object newValue)` 、`DateInterval`类的 `setSecond(LocalDate second)`、`DateInterval`类的`setSecond(Object newValue)` （桥方法）。

对于代码`pair.setSecond(aDate);`：

（1）编译器将其==静态绑定==为超类`Pair`的`setSecond(Object newValue)` 方法；

（2）在运行阶段，JVM进入子类`DateInterval`中，发现`setSecond(Object newValue)` 方法被子类覆盖了，于是==动态绑定==为`DateInterval`类的桥方法`setSecond(Object newValue)` ；

（3）然后调用桥方法：在执行桥方法时，将参数`newValue`强制转换为`LocalDate`类型，调用并执行`DateInterval`类的 `setSecond(LocalDate second)`方法。

2、`getSecond`方法

类型擦除后`DateInterval`类中有三个`getSecond`方法：超类`Pair`的`Object getSecond()` 、`DateInterval`类的 `LocalDate getSecond()`、`DateInterval`类的`Object setSecond()` （桥方法）。代码`pair.getSecond()`的编译与执行过程与`setSecond`方法类似。

需要注意的是：

（1）当子类覆盖超类或重写接口的一个方法时，可以指定一个更具体的返回类型：即子类的覆盖方法的返回类型可以是超类该方法返回类型的子类型，这成为==可协变的返回类型==。上面的`getSecond`方法实现了这一机制。

（2）在`DateInterval`类中出现了两个方法签名相同的方法 `LocalDate getSecond()`、`Object setSecond()` ，我们不能这么写代码，但是编译器可以，因为虚拟机是根据参数类型和返回类型共同决定一个方法的。

## 泛型的局限性

### 1、不能用基本类型实例化类型参数

```java
Pair<int> pair1 = new Pair<int>(); // ERROR
```

这是因为八种基本类型不是`Object`的子类。但是java提供了自动装箱与拆箱机制，可以将其转换为包装类型。

```java
public class Test {
    public static void main(String[] args){
        int x = 1;
        // x被自动装箱为Integer类型
        Object y = x;
        // y被自动拆箱为int类型
        System.out.println(y);
    }
}
/** 输出结果为：
1
2
*/
```

### 2、不能实例化泛型对象

```java
class Pair<T>{
    ...
    public Pair(){
        this.first = new T(); // ERROR
        this.second = new T(); // ERROR
    }
    public Pair(T first, T second){
        this.first = first;
        this.second = second;
    }
    ...
}
```

类型擦除后`T`会被替换为`Object`或指定的限定类型，但是实际类型只有在运行时才能得知，无法在编译阶段确定。因此编译器无法检查潜在的错误，所以java禁止实例化类型变量：即不能使用`new`运算符创建一个`T`类型的对象。

要创建`T`类型的对象，解决办法有两个：（1）让调用者提供一个构造器表达式；（2）使用反射。

```java
public Test{
    public static void main(String[] args) throws Exception {
        // String::new是一个构造器引用，表示String类型的构造方法：String str = new String();
        Pair<String> pair1 = Pair.makePairSupplier(String::new);
        Pair<String> pair2 = Pair.makePairReflect(String.class);
    }
}
class Pair<T>{
    ...
    // 解决办法1：让调用者提供一个构造器表达式 
    public static <T> Pair<T> makePairSupplier(Supplier<T> constr){
        return new Pair<>(constr.get(), constr.get());
    }
    // 解决办法2：使用反射
    public static <T> Pair<T> makePairReflect(Class<T> cls) throws Exception {
        try{
            return new Pair<>(cls.getConstructor().newInstance(), cls.getConstructor().newInstance());
        }
        catch (Exception e){
            return null;
        }
    }
    public Pair(){
        
    }
    public Pair(T first, T second){
        this.first = first;
        this.second = second;
    }
    ...
}
```

### 3、不能创建泛型数组

假设我们需要实现一个方法，方法接受可变数量的`T`类型参数`a`，需要从`a`中挑选出最小和最大的元素，构成一个数组`T[]`返回。

```java
public static T[] getMinMax(T...a){
    // ...
    T[] arr2 = {min, max}; // ERROR
    T[] arr = new T[2]; // ERROR
}
```

因为不能实例化类型参数，因此也就不能创建泛型数组。解决方法仍然是两个：（1）让调用者提供一个构造器表达式；（2）使用反射。

```java
public class Test{
    public static void main(String[] args){
        String a = "zhang san";
        String b = "li si";
        String c = "wang wu";
    	String[] result = getMinMax(String[]::new, a, b, c);
        // 上面的语句等价于下面的语句(String::new构造器引用的lambda表达式写法)
        String[] result2 = getMinMax(value -> new String[value], a, b, c);
        String[] result3 = getMinMax2(a, b, c);
    }
    public static <T> T[] getMinMax(IntFunction<T[]> constr, T...a){
        // 解决办法1：让调用者提供一个构造器表达式
        T[] minmax = constr.apply(2);
        ...
        minmax[0] = min;
        minmax[1] = max;
        return minmax;
    }
    public static <T> T[] getMinMax2(T...a){
        // 解决办法2：使用反射
        T[] minmax = (T[]) Array.newInstance(a.getClass().getComponentType(), 2);
        ...
        minmax[0] = min;
        minmax[1] = max;
        return minmax;
    }
}
```

（1）`IntFunction`接口实现为：

```java
public interface IntFunction<R>{
    R apply(int value);
}
```

（2）方法`Array.newInstance`是`java.lang.reflect.Array`类的方法`public static Object newInstacne(Class<?> componentType, int length)`。

（3）方法`getMinMax2`中，`a`是一个数组`T[]`，这里实际类型是`String[]`。`a.getClass()`就是`String[]`的类类型，`getComponentType()`方法是获取数组元素的类类型。

（4）方法`getMinMax2`中，无法使用`ArrayList<T>`构造数组`T[]`，因为最终要将`ArrayList<T>`转换为`T[]`，转换方式只能是`toArray`方法。但它的`toArray`方法有两个重载：

```java
// 无法将返回的Object[]向下转换为T[]
Object[] toArray(){...};
// 需要构建额外的result，但是无法构建（要能构建就直接构建T[]了）
T[] toArray(T[] result);
```

### 4、不能创建泛型类对象的数组

```java
var table = new Pair<String>[10]; // ERROR
Object[] arr = table;
/**
    如果第一行代码允许执行的话，这一行代码也能够执行
    这是因为类型擦除后table中元素的实际为Pair类型
    但Pair<String>和Pair<Employee>是两个类型
    这违反了数组存储中的原则
    所以编译器不允许第一行代码的检查通过
*/
arr[0] = new Pair<Employee>(); 
// 如果不使用new Pair<String>[10]初始化变量arr2，那么这行代码是合法的
Pair<String> arr2 = ...; 
```

下面的代码是被允许的：（1）可以创建泛型类对象的`ArrayList`（泛型列表数组）；（2）可以传入可变数量个泛型类对象作为方法的可变参数。

```java
import java.util.ArrayList;
import java.util.Collection;
public class Test {
    public static void main(String[] args){
        Pair<String> pair1 = new Pair<>("Tom", "Zhang San");
        Pair<String> pair2 = new Pair<>("Peter", "Li Si");
        Pair<String> pair3= new Pair<>("David", "Wang Wu");
        // 可以创建泛型类对象的ArrayList（泛型列表数组）
        Collection<Pair<String>> table = new ArrayList<Pair<String>>();
        // 可以传入可变数量个泛型类对象作为方法的可变参数
        addAll(table, pair1, pair2, pair3);
        System.out.println(((Pair<String>)(table.toArray())[0]).getFirst()); // Tom
    }
    public static <T> void addAll(Collection<T> coll, T...ts){
        for(T t: ts){
            coll.add(t);
        }
    }
}
class Pair<T>{
    private T first;
    private T second;
    public Pair(){
        first = null;
        second = null;
    }
    public Pair(T first, T second){
        this.first = first;
        this.second = second;
    }
    public T getFirst(){
        return first;
    }
    public T getSecond(){
        return second;
    }
    public void setFirst(T newValue){
        first = newValue;
    }
    public void setSecond(T newValue){
        second = newValue;
    }
}
```

### 5、泛型类的静态字段无效

```java
public class Obj<T>{
    private static T x; // ERROR
}
```

否则，对于`Obj<String>`实例和`Obj<Employee>`实例来说，它们共享一个字段`x`。那么`x`的类型到底是`String`还是`Employee`？无法解决这个问题，所以java禁止使用泛型静态字段。

### 6、不能抛出或捕获泛型类的实例

```java
public class ClassGeneric<T> extends Throwable{...} // ERROR
public static <T extends Throwable> void test(){
    try{
        ...
    }
    catch(T t){ // ERROR
        ...
    }
}
```

（1）泛型类`ClassGeneric<T>`不能扩展`Throwable`类，因此不能抛出泛型类`ClassGeneric<T>`对象。

（2）不能捕获泛型`T`对象（即使泛型`T`扩展自`Throwable`）。

（3）但是可以抛出泛型`T`对象（`T`必须扩展自`Throwable`）。

```java
public class Test{
    public static void main(String[] args) throws Throwable {
        try{
            Test.<Exception>test();
        }
        catch (Exception t){
            System.out.println("Success"); // Success
        }
    }
    public static <T extends Throwable> void test() throws T {
        try{
            throw new IOException();
        }
        catch(IOException realCause){
            T t = (T) realCause;
            t.initCause(realCause);
            throw t;
        }
    }
}
/** 输出结果为：
Success
*/
```



### 7、可以取消对检查型异常的检查

java异常处理机制的一个基本原则是：如果一个方法抛出了或者可能会抛出检查型异常，那么必须在方法首部声明。不过，可以利用泛型取消这个机制，具体做法是让编译器认为抛出的是非检查型异常，而非检查型异常不用在方法首部声明。

```java
public class Test{
    public static void main(String[] args) {
        try {
            Test.test();
        } catch (IOException t) {
            Test.<RuntimeException>throwAs(t);
        }
    }
    public static  void test() throws IOException {
        throw new IOException();
    }
    public static <T extends Throwable> void throwAs(Throwable t) throws T{
        throw (T) t;
    }
}
```

这里需要注意几点：

（1）"欺骗"编译器，让其以为`t`是非检查型异常`RuntimeException`的是这句代码：`Test.<RuntimeException>throwAs(t);`，严格地说是`<RuntimeException>`。因此不需要在`main`方法首部声明异常。

（2）同样，如果将`Test.<RuntimeException>throwAs(t);`更改为`Test.<IOException>throwAs(t);`甚至`Test.<Throwable>throwAs(t);`，编译器都会认为这是或者可能是一个检查型异常，所以编译不会通过，除非在`main`方法首部声明。

（3）上面的代码只是"欺骗"了编译器，使我们能够不在`main`方法首部声明异常，仅此而已。其他的任何事实都不会被改变：异常`t`真正的类型仍然是`IOException`，而且它仍然会抛出，最终会在控制台输出为`java.io.IOException`异常：

```shell
Exception in thread "main" java.io.IOException
	at TestGeneration.Test.test(Test.java:22)
	at TestGeneration.Test.main(Test.java:15)
```

（4）即使抛出的是`RuntimeException`异常，虽然可以不用在方法首部声明，但仍然会被控制台打印出来：

```java
public class Test{
    public static void main(String[] args) {
        test();
    }
    public static  void test() throws RuntimeException {
        throw new RuntimeException();
    }
}
```

控制台输出结果为`java.lang.RuntimeException`异常：

```shell
Exception in thread "main" java.lang.RuntimeException
	at TestGeneration.Test.test(Test.java:21)
	at TestGeneration.Test.main(Test.java:15)
```

总结一下，我们可以利用泛型取消编译器对检查型异常的检查，具体做法是让编译器认为抛出的异常是一个非检查型异常。利用这项技术可以解决一个棘手的问题：创建线程。

创建线程`Thread`时，需要传入一个函数式接口`Runnable`参数。`Runnable`接口只定义了一个`run`方法。这个`run`方法不允许抛出检查型异常。但是我们创建线程`Thread`往往是为了运行一段程序代码（比如读取文件），不可避免地要抛出检查型异常。为了解决这个限制，我们就需要"欺骗"编译器，让其以为我们抛出的所有检查型异常都是非检查型异常。

```java
public class Test{
    public static void main(String[] args) throws Exception{
        var thread = new Thread(()-> {
            try {
                Thread.sleep(3000);
                System.out.println("Hello World!");
                throw new Exception("Check this out!");
            } catch (Exception e) {
                Test.<RuntimeException>throwAs(e);
                // 如果把上面的一句代码改为下面这样，throw语句就会报错
        		// 即使在main方法首部声明 throws Exception，仍然无法通过编译
                // Test.<IOException>throwAs(e);
            }
        });
        thread.start();
    }
    static <T extends  Throwable> void throwAs(Throwable t) throws T{
        throw (T) t;
    }
}
```

控制台输出结果为：

```shell
Hello World!
Exception in thread "Thread-0" java.lang.Exception: Check this out!
	at TestGeneration.Test.lambda$main$0(Test.java:19)
	at java.base/java.lang.Thread.run(Thread.java:833)
```

### 8、实现泛型接口的限制

如果两个接口是同一个泛型接口的不同参数化，一个类就不能同时作为这两个接口的子类。

分三种情况讨论：

1、如果两个接口是同一个泛型接口的不同参数化，一个类就不能同时实现这两个接口。

如果类同时实现了`Comparable<Employee>`和`Comparable<Manager>`接口，那么类中将有两个内部实现不同的方法`compareTo(Object o)`，这就冲突了。

```java
class A implements Comparable<Manager>{
    public int compareTo(Manager m) { return 0; }
}
class B implements Comparable<Employee>{
    public int compareTo(Employee e) { return 0; }
}
/** 编译器生成桥方法后的代码：
class A implements Comparable{
    public int compareTo(Manager m) { return 0; }
    public int compareTo(Object o) { return compareTo((Manager) o); }
}
class B implements Comparable{
    public int compareTo(Employee e) { return 0; }
    public int compareTo(Object o) { return compareTo((Employee) o); }
}
*/
```

2、如果两个接口是同一个泛型接口的不同参数化，某个类实现了其中一个接口，一个类不能在继承该类的同时实现另一个接口。

（1）这里`Manager`类继承了`Employee`类，因此`Manager`类也是`Comparable<Employee>`接口的子类。

因为`Manager`类的`compareTo(Manager m)`方法是`Employee`类的`compareTo(Employee e)`方法的重载而非重写，所以编译器不会为它生成桥方法。

```java
class Manager extends Employee{
    public Manager() {}
    public int compareTo(Manager m) { return 0; }
 }
class Employee implements Comparable<Employee>{
    public Employee() {}
    public int compareTo(Employee e) { return 0; }
}
/** 编译器生成桥方法后的代码
class Manager extends Employee{
    public Manager() {}
    public int compareTo(Manager m) { return 0; }
 }
class Employee implements Comparable{
    public Employee() {}
    public int compareTo(Employee e) { return 0; }
    public int compareTo(Object o) { return compareTo((Employee) o); }
}
*/
```

但是如果在`Manager`类中重写`compareTo(Employee e)`方法，编译器就会为这个重写方法生成桥方法。

```java
class Manager extends Employee{
    public int compareTo(Manager m) { return 0; }
    public int compareTo(Employee e) { return 0; }
}
class Employee implements Comparable<Employee>{
    public int compareTo(Employee e) { return 0; }
}
/** 编译器生成桥方法后的代码
class Manager extends Employee{
    public Manager() {}
    public int compareTo(Manager m) { return 0; }
    public int compareTo(Employee e) { return 0; }
    public int compareTo(Object o) { return compareTo((Employee) o); }
 }
class Employee implements Comparable{
    public Employee() {}
    public int compareTo(Employee e) { return 0; }
    public int compareTo(Object o) { return compareTo((Employee) o); }
}
*/
```

（2）如果`Manager`类再实现`Comparable<Manager>`接口，那么编译器会为`Manager`类的`compareTo(Manager m)`方法生成另一个桥方法`compareTo(Object o)`。这样`Manager`类内部就会有两个实现不同的桥方法`compareTo(Object o)`，这就冲突了。

3、如果两个接口是同一个泛型接口的不同参数化，某个类实现了其中一个接口，另一个类实现了另一个接口，一个类不能同时继承这两个类。

### 9、运行时类型查询

```java
public class Test {
    public static void main(String[] args){
        Pair<String> pair1 = new Pair<>("Tom", "Zhang San");
        Pair<TestClass> pair2 = new Pair<>();
        // ERROR:无法将TestJava.Pair<java.lang.String>转换为TestJava.Pair<TestJava.TestClass>
        // if(pair1 instanceof Pair<TestClass>){...}
        // ERROR:无法解析T
        // if(pair1 instanceof Pair<T>){...}
        if(pair1 instanceof Pair<String>){
            System.out.println("Success 1");
        }
        if(pair1.getClass() == pair2.getClass()){
            System.out.println("Success 2");
        }
    }
}
/** 输出结果为：
Success 1
Success 2
*/
```

这是因为类型擦除后，`Pair<String>`类型和`Pair<Employee>`类型都变为了`Pair`类型。





## 泛型类型的继承

### 继承规则

1、`ArrayList`是实现了泛型接口`List`的泛型接口，`Y`是`X`的子类：

（1）`List<Y>`和`List<X>`都是`List`接口的子类型，但这两者之间没有任何关系；

（2）`ArrayList<Y>`和`ArrayList<X>`都是`ArrayList`接口的子类型，但这两者之间没有任何关系；

（3）`ArrayList<Y>`实现了`List<Y>`接口，`ArrayList<X>`实现了`List<X>`接口。

```java
List<String> ls2 = new ArrayList<String>();   // OK
```

2、泛型类型的继承规则导致：虽然`Y`是`X`的子类，但`A<Y>`不是`A<X>`的子类型。因此在以`A<X>`为参数的方法中，不能传入`A<Y>`类型的参数。

![泛型列表类型中子类型间的关系](/pictures/java/chap08/chap8_1.png)



为了解决这个问题，提出了通配符（wildcard）的概念。

### 三种通配符

1、通配符只能用来声明类型，不能用在`new`运算符后面创建对象，即不能使用`new A<? extends X>`、`new A<? super X>`、`new A<?>`写法。

2、任何通配符都不能单独作为类型使用；肯定是写在一个类名后面的尖括号中的，作为这个泛型类的实际类型使用。

3、继承关系是：

`Y` -> `X`

`A<Y>` -> `A<? extends Y>` -> `A<?>` -> `A`

`A<Y>` -> `A<? super Y>` -> `A<?>` -> `A`

`A<X>` -> `A<? extends Y>` -> `A<?>` -> `A`

`A<X>` -> `A<? super Y>` -> `A<?>` -> `A`

`A<T>` -> `A<?>` -> `A` （`A<T>`在类型擦除后是一个具体的类型）



```java
public class Test{
    public static void main(String[] args){
        // 以下代码说明了继承关系
        A<X> a = new A<>(new X());
        A<Y> a2 = new A<>(new Y());
        A<? extends X> a3 = a;
        A<? extends X> a4 = a2;
        A<? super Y> a5 = a;
        A<? super Y> a6 = a2;
        A<?> a7 = a5;
        A<?> a8 = a6;
        A a9 = a7;
        // 以下代码说明了方法调用时如何传入A<Y>参数
        // testMethod(a2);
        testMethod2(a2);
        testMethod2(a4);
        // testMethod2(a6);
        // 以下代码说明了A<? extends X>对象方法调用问题
        // a4.setT(new X());
        // a4.setT(new Y());
        X x = a4.getT();
        System.out.println(x.getClass().getName()); // 输出: Y
        // Y y = a4.getT();
        Y y = a2.getT();
        a4.printString("ss");
        // 以下代码说明了方法调用时如何传入A<X>参数
        // testMethod3(a);
        testMethod4(a);
        testMethod4(a5);
        // testMethod4(a3);
        // 以下代码说明了A<? super Y>对象方法调用问题
        Object o = a5.getT();
        // X x2 = a5.getT();
        X x3 = (X) a5.getT();
        // Y y2 = (Y) a5.getT(); // 这句可以通过编译，但运行时错误
        a5.setT(new Y()); // 输出: Y
        a5.setT(new Z()); // 输出: Z
        // a5.setT(new X());
        a5.printString("ss");
        // 以下代码说明了A<?>对象方法调用问题
        Object o2 = a8.getT();
        // a8.setT(new Object());
        a8.setT(null);
        a8.printString("ss");
    }
    public static void testMethod(A<X> a){
        System.out.println("success");
    }
    public static void testMethod2(A<? extends X> a){
        System.out.println("success");
    }
    public static void testMethod3(A<Y> a){
        System.out.println("success");
    }
    public static void testMethod4(A<? super Y> a){
        System.out.println("success");
    }
}
class A<T>{
    private T t;
    public A(T t){
        this.t = t;
    }
    public void setT(T t) {
        System.out.println(t.getClass().getName());
        this.t = t;
    }
    public T getT(){
        return t;
    }
    public void printString(String s){
        System.out.println(s);
    }
}
class X { }
class Y extends X { }
class Z extends Y { }
```



#### `A<? extends X>`

**子类型限定通配符：限定超类型**

1、`A<? extends X>`类型对象的意义

方法`testMethod`中声明参数类型为`A<X>`，但是我们有一个`A<Y>`类型的对象，想把它传入方法中并调用该方法。

为此，我们需要将`testMethod2`方法中的参数类型声明为`A<? extends X>`，表示类型参数为`X`及其子类型的`A`类对象均可以作为参数。

这样我们就可以为`testMethod2`方法传入`A<? extends X>`类型或其子类`A<Y>`类型的对象了。

2、`A<? extends X>`类型对象的方法调用

（1）java语言规范规定：`A<? extends X>`类型的对象不能调用泛型类`A<T>`中需要泛型参数`T`的方法。

这是因为`A<? extends X>`类型的对象变量在调用方法时，可以传入`X`或其任意子类类型的参数。编译器会根据传入的参数类型推断出类`A`的泛型类型。但是这个对象变量实际引用的可能是参数类型为`X`任意子类类型的`A`类对象，这样在运行期间就可能发生冲突。

例如`a4`在调用`setT`方法时可以传入一个`X`类型的参数，但是`a4`实际引用`A<Y>`类型的对象，所以在执行`this.t = t`代码时，就会将`X`类型的参数赋值给`Y`类型的变量。这样就会出错。

（2）允许调用返回泛型类型值的方法：返回类型为`X`。

例如对于声明类型为`A<? extends X>`、实际类型为`A<Y>`的对象`a4`来说，调用`getT`方法返回的值实际类型为`Y`，但它会被编译器强制转换为`X`，因此它只能赋值给`X`类型对象变量。

（3）允许调用具体类型参数的方法`printString`。

#### `A<? super X>`

**超类型限定通配符：限定子类型**

1、`A<? super Y>`类型对象的意义

方法`testMethod3`中声明参数类型为`A<Y>`，但是我们有一个`A<X>`类型的对象，想把它传入方法中并调用该方法。

为此，我们需要将`testMethod4`方法中的参数类型声明为`A<? super Y>`，表示类型参数为`Y`及其超类类型的`A`类对象均可以作为参数。

这样我们就可以为`testMethod4`方法传入`A<? super Y>`类型或其子类`A<X>`类型的对象了。

2、`A<? super Y>`类型对象的方法调用

（1）允许调用泛型类`A<T>`中需要泛型参数`T`的方法。但是传入的类型参数必须是`Y`类或其子类类型。

因为`A<? super Y>`类型的对象变量类型参数可能是`Y`或其超类类型，所以传给`setT`方法的参数必须是`Y`或其子类类型，这样执行代码`this.t = t;`时就不会报错。

（2）允许调用返回泛型类型值的方法：返回类型为`Object`。

这是因为`A<? super Y>`类型的对象变量类型参数可能是`Y`或其任意超类类型，最高为`Object`。编译器无法推断出这个具体类型到底是什么，所以只能推断为`Object`。

用户可以将返回的值强制转换为自己想要的类型，就看是否会在运行期间出错了。

（3）允许调用具体类型参数的方法`printString`。

3、应用实例一

假设有一个数组`LocalDate[]`，要从中选出最小值，因此需要实现`Comparable<LocalDate>`接口。然而`LocalDate`实现了`ChronoLocalDate`，而`ChronoLocalDate`扩展了`Comparable<ChronoLocalDate>`。因此`LocalDate`实现的是`Comparable<ChronoLocalDate>`而不是`Comparable<LocalDate>`接口。

所以下面的代码中，被注释掉的代码都报编译错误：" no instance(s) of type variable(s) exist so that ChronoLocalDate conforms to LocalDate "。意思是无法将`ChronoLocalDate`类型变量实例化为`LocalDate`类型。以第一行代码`// LocalDate dt = min(ls);`为例进行说明（下面是反编译的信息）：

```shell
Test.java:18: 注: 将类型 Test 的方法 min 解析为候选项 0
        LocalDate dt = min(ls);
                       ^
  阶段: BASIC
  具有实际值: LocalDate[]
  具有类型参数: 没有参数
  候选项:
      找到第 0 个适用方法: <T>min(T[])
        (部分实例化为: (ChronoLocalDate[])ChronoLocalDate)
  其中, T是类型变量:
    T扩展已在方法 <T>min(T[])中声明的Comparable<T>
Test.java:18: 错误: 不兼容的类型: 推论变量 T 具有不兼容的上限
        LocalDate dt = min(ls);
                          ^
    等式约束条件：ChronoLocalDate
    下限：LocalDate,Comparable<T>
  其中, T是类型变量:
    T扩展已在方法 <T>min(T[])中声明的Comparable<T>
```

（1）编译器接收传入`min`方法的参数`ls`，推断`T`类型为`LocalDate`；

（2）编译器发现了`min`方法中的`T`类型限定：`T extends Comparable<T>`，因为`LocalDate`实现的是`Comparable<ChronoLocalDate>`而不是`Comparable<LocalDate>`接口，所以编译器推断`T`类型为`ChronoLocalDate`。

（3）编译器根据赋值语句左侧的`LocalDate`声明推断`min`方法应当返回一个`T`为`LocalDate`类型的值。但是`ChronoLocalDate`类型无法转换为`LocalDate`类型。

所以，为了解决这个问题：

（1）可以用一个`ChronoLocalDate`对象变量来接收`min(ls)`返回值（第二行代码`ChronoLocalDate dt2 = min(ls);`）；但实际上返回值是一个`LocalDate`对象，所以能够将其转换为`LocalDate`类型（第三行代码`LocalDate dt3 = (LocalDate) dt2;`）；

（2）也可以将`min`方法定义为`public static <T extends Comparable<? super T>> T min2(T[] a)`（第四行代码`LocalDate dt3 = min2(ls);`）。

```java
public class Test{
    public static void main(String[] args){
        LocalDate[] ls = {LocalDate.now(), LocalDate.now(), LocalDate.now()};
        ChronoLocalDate[] ls2 = ls;
        // LocalDate dt = min(ls);
        ChronoLocalDate dt2 = min(ls); // 用一个ChronoLocalDate对象变量来接收min(ls)返回值
        LocalDate dt3 = (LocalDate) dt2; // 实际上返回值是一个LocalDate对象
		LocalDate dt3 = min2(ls); // 重新定义min方法
        ChronoLocalDate dt4 = min2(ls); // min(ls)返回LocalDate类型，可以用ChronoLocalDate接收
        
        // LocalDate dt4 = min(ls2); // min(ls2)返回ChronoLocalDate类型，不能用LocalDate接收
        ChronoLocalDate dt5 = min(ls2); // 用ChronoLocalDate接收没问题
        LocalDate dt6 = (LocalDate) dt5; // min(ls2)返回的dt5实际是个LocalDate对象，因为ls2引用的是LocalDate对象

        // LocalDate dt8 = min2(ls2); // min2(ls2)返回ChronoLocalDate类型，不能用LocalDate接收
        ChronoLocalDate dt9 = min2(ls2); // 用ChronoLocalDate接收没问题
        LocalDate dt10 = (LocalDate) dt9; // min2(ls2)返回的dt9实际是个LocalDate对象，因为ls2引用的是LocalDate对象
    }
    public static <T extends Comparable<T>> T min(T[] a){
        T mt = a[0];
        for(T t: a){
            if(mt.compareTo(t) < 0){
                mt = t;
            }
        }
        return mt;
    }
    public static <T extends Comparable<? super T>> T min2(T[] a){
        T mt = a[0];
        for(T t: a){
            if(mt.compareTo(t) < 0){
                mt = t;
            }
        }
        return mt;
    }
}
```

==如果将`min`方法定义为`<T extends Comparable<T>> T min(T[] a)`，那么只能传入`ChronoLocalDate[]`类型（也能传入`LocalDate[]`但会被向上转换，因此接收时又得转换）；但是如果定义为`<T extends Comparable<? super T>> T min(T[] a)`，那么不仅可以传入`ChronoLocalDate[]`类型，也能传入`LocalDate[]`类型。==

4、应用实例二

```java
// Collection接口的某个方法
defacult boolean removeIf(Predicate<? super T> filter);
...
ArrayList<Employee> staff = ...;
Predicate<Object> oddHashCode = obj -> obj.hashCode() % 2 != 0;
// 可以传入Predicate<Object>，而不仅仅是Predicate<Employee>
staff.removeIf(oddHashCode);
```

==将`reomove`方法定义为`removeIf(Predicate<? super T> filter)`而不是`removeIf(Predicate<T> filter)`，导致不仅可以传入`Predicate<Employee>`，还可以传入`Predicate<Object>`。==



#### `A<?>`

**无限定通配符**

1、`A<?>`类型对象的意义

（1）方法参数类型定义为`A<?>`，可以接受任何参数类型的`A`对象。

```java
public static boolean hasNulls(A<?> a){
    return a.getT() == null;
}
// 等价于下面的代码，但比下面的代码可读性强
public static <T> boolean hasNulls(A<T> a){
    return a.getT() == null;
}
```

（2）`A<?>`是`A<T>`的超类，所以`A<?>`类型对象变量可以引用`A<T>`类型对象，反之不行。但是方法参数为泛型类对象`A<T>`时，可以将`A<?>`类型对象作为参数传入方法并调用方法，这是通配符捕获机制。

2、`A<?>`类型对象的方法调用

（1）禁止调用泛型类`A<T>`中需要泛型参数`T`的方法（但是可以调用参数为`null`的方法，这没有意义）。

（2）允许调用返回泛型类型值的方法：返回类型为`Object`。

（3）允许调用具体类型参数的方法`printString`。



### 通配符捕获

1、比如要写一个方法，交换`Pair<?>`类型对象的两个实例字段。没法写代码，因为无法将通配符`?`转换为具体的类型。

```java
public class Test{
    public static void main(String[] args){
        Pair<?> p = new Pair<>("ss", "rr");
        swap(p);
    }
    public static void swap(Pair<?> p){
        var first = p.getFirst();
        var second = p.getSecond();
        // p.setFirst(second); // ERROR: Provided:Object, Required tyoe: capture of ?
        // p.setSecond(first); // ERROR: Provided:Object, Required tyoe: capture of ?
    }
}
class Pair<T>{
    private T first;
    private T second;
    public Pair(T first, T second){
        this.first = first;
        this.second = second;
    }
    public T getFirst(){
        return first;
    }
    public T getSecond() {
        return second;
    }
    public void setFirst(T first){
        this.first = first;
    }
    public void setSecond(T second) {
        this.second = second;
    }
}
```

这就需要用到通配符捕获了。

```java
public class Test{
    public static void main(String[] args){
        Pair<?> p = new Pair<>("ss", "rr");
        swap(p);
    }
    public static void swap(Pair<?> p){
        // 能也只能将返回值赋给Object类型
        Object s = p.getFirst();
        // 然后可以强制转换为任意类型，编译器不限制，运行时出错是用户的事情
        String str = (String) s;
        swap2(p); // 通配符捕获
    }
    public static <T> void swap2(Pair<T> p){
        var first = p.getFirst();
        var second = p.getSecond();
        p.setFirst(second);
        p.setSecond(first);
    }
}
```

这里需要注意的是：

（1）`Pair<?>`是`Pair<T>`的超类，但这里之所以可以这么写，是因为：==方法参数为泛型类对象`A<T>`时，可以将`A<?>`类型对象作为参数传入方法并调用方法。==

（2）尽管编译器不会知道通配符`?`的类型，但只要我们写代码时确定它就是某个类型，可以先用`Object`类型的对象变量接收，然后强制转换为特定的类型，编译器不会检查的。

2、编译器必须能够保证通配符表示单个确定的类型。类似`ArrayList<A<?>>`中的`T`将永远不能捕获通配符`?`。

```java
public class Test{
    public static void main(String[] args){
        ArrayList<A<?>> arr = new ArrayList<>();
        // 列表或数组中可以有两个A<?>，其中?可以为不同类型
        arr.add(new A<String>());
        arr.add(new A<B>());
        // 无法捕获ArrayList<A<?>>的通配符
        test(arr);
    }
    public static void test(ArrayList<A<?>> arr){
        System.out.println(arr.get(0).getClass().getName()); // 输出：A
        test2(arr.get(0));
    }
    public static <T> void test2(A<T> a){
        // 无法获得T的类型信息
    }
}
```



## 反射和泛型

1、`Class<T>`类本身就是泛型的，例如`String.Class`本身就是一个`Class<String>`类对象。

2、对于我们创建的`A<String>`类对象，在运行阶段虚拟机无法知道`A<T>`中的`T`就是`String`。但是泛型擦除后在虚拟机中仍然会保留一些微弱记忆：==原始的`A`类知道它源于`A<T>`类。==

因此对于方法`public static <T extends Comparable<? super T>> T min(T[] a)`，虽然擦除后为`public static Comparable min(Comparable[] a)`，但是可以使用反射API确定以下信息：

（1）这个泛型方法有一个名为`T`的类型参数；

（2）这个类型参数`T`有一个子类型限定`Comparable<? super T>`；

（3）这个子类型限定`Comparable<? super T>`本身也是一个泛型类型，它有一个通配符参数`? super T`；

（4）这个通配符参数`? super T`有一个超类型限定`T`；

（5）这个泛型方法`min`有一个泛型数组参数`T[]`；

（6）这个泛型方法返回一个泛型类型`T`。



### 泛型方法反射实例

对于一个方法`public static <T extends Comparable<? super T>> Pair<? extends T> minmax(T[] a)`：

1、先分解一下元素：

`Comparable<? super T>`、`Pair<? extends T>`都属于`ParameterizedType`类型；`? super T`和`? extends T`都属于`WildcardType`类型；`Comparable`和`Pair`都属于`Class`类型；`T[]`属于`GenericArrayType`类型。

2、然后看一下怎么获取各个元素：

（1）`Method`类的`Type[] getTypeParameters()`方法返回泛型数组：比如`<T extends A & B, S, U>`就返回的是`{T, S, U}`，这个例子中返回的是`T`。返回的泛型数组中，元素实际上是`TypeVariable`类型。

```java
public static <T extends A & B, S, U> void setObject(T t){...}
```

（2）`T`属于`TypeVariable`类。该类的`Type[] getBounds()`方法返回泛型`T`的所有限定：比如`<T extends A & B>`就返回的是`{A, B}`，这里返回的是`Comparable<? super T>`。返回的限定数组中，元素实际上可能是`Class`类型，也可能是`ParameterizedType`类型。

```java
public static <T extends A & B> void setObject(T t){...}
```

（3）`Comparable<? super T>`属于`ParameterizedType`类。该类表示一个参数化类型，即是==含有泛型的类名==。

`ParameterizedType`类的`Type Class.getRawType()`方法获得原始类型。原始类型实际上是`Class`类型。

`ParameterizedType`类的`Type[] getActualTypeArguments()`方法获得实际类型。实际类型数组中的元素实际上可能是`TypeVariable`、`ParameterizedType`、`Class`、`WildcardType`、`GenericArrayType`类型。例如：`A<T, ? super S, U[], Comparable<String>, String>`。

```java
class A<T, S, U, E, K> { }
class TestClass<T, S, U, E, K>{
    public  void test(A<T, ? super S, U[], Comparable<String>, String> a){
        System.out.println("complex");
    }
}
```

这个例子中原始类型是`Comparable`，它属于`Class`类；实际类型是`? super T`，它属于`WildcardType`类。

（4）`Pair<? extends T>`也属于`ParameterizedType`类，由`Method`类的`Type getGenericReturnType()`方法获得。该方法返回的`Type`实际上可能是`Class`、`TypeVariable`、`ParameterizedType`、`GenericArrayType`类型。

```java
public A getObject(){...}
public T getObject(){...}
public A<T> getObject(){...}
public T[] getObject(){...}
```

这个例子中，`ParameterizedType`类的`Type Class.getRawType()`方法返回`Pair`（`Class`类型）；`Type[] getActualTypeArguments()`方法返回具有一个`? extends T`（`WildcardType`类型）元素的数组。

（5）`T[]`属于`GenericArrayType`类型，由`Method`类的`Type[] getGenericParameterTypes()`方法获得。`Type[]`中的元素实际上可能是`TypeVariable`、`Class`，`GenericArrayType`、`ParameterizedType`类型。

```java
public void setObject(A a){...}
public void setObject(A<T> a){...}
public void setObject(A<? super T> a){...}
public void setObject(T[] a){...}
```

（6）`GenericArrayType`类的`getGenericComponentType`方法返回`T`，属于`TypeVariable`类。该方法返回泛型类型数组的元素类型，元素类型实际上可能是`TypeVariable`、`Class`、`GenericArrayType`、`ParameterizedType`类型。

```java
public A[] getObject(){...}
public A<T>[] getObject(){...}
public T[] getObject(){...}
public T[][] getObject(){...}
```



### 捕获泛型`T`的运行时类型字面量

有一种情况可以获取到`T`的实际类型（运行时类型）字面量：继承类`A<T>`的匿名子类的`Class`对象调用`getGenericSuperClass`方法，可得到`A<ClassName>`，其中`ClassName`就是运行时类型。

只不过无法直接获得这个运行时类型的字面量。

```java
public class Test{
    public static void main(String[] args){
        // a是一个匿名类对象，这个匿名类继承A<String>类
        var a = new A<>("ss") { };
        // a属于匿名类，其泛型超类为A<String>
        System.out.println(a.getClass().getGenericSuperclass());
        System.out.println(cls.getActualTypeArguments().getClass().getName()); 
    }
}
class A<T>{
    private T t;
    public A(T t) { }
}
/** 输出结果为：
TestGeneration.A<java.lang.String>
[Ljava.lang.reflect.Type;
*/
```