# 关键字

## final

1、final实例字段

（1）必须在构造对象时就初始化，或者在声明时初始化。如果在声明时初始化了，再在构造器中初始化就会覆盖声明时的值。

（2）初始化以后不能再修改这个字段：对于基本类型，不允许再改变其值；（2）对于对象类型，允许改变其状态，但是不能改变其引用。

（3）final实例字段属于特定对象，不属于整个类。

```java
public class Test {
    public static void main(String[] args) {
        A a = new A(new B(1), 1);
        // 不允许修改基本类型
        // a.x = 3;
        // 不允许修改对象的引用，但可以修改其状态
        a.b.y = 2;
        // a.b = new B(2);
    }
}
class A{
    public final B b;
    public final int x = 1;
    // 构造器中初始化会覆盖声明时的值
    public A(B b, int x){
        this.b = b;
        this.x = x;
    }
    public A(){
        this.b = new B(2);
        this.x = 2;
    }
    // 不允许再修改了,所以赋值语句编译不通过
    public void setFields(){
        // b = new B(3);
        // x = 3;
    }
}
class B{
    public int y = 3;
    public B(int y){
        this.y = y;
    }
}
```

2、final方法是不允许被子类覆盖的方法。

3、final类是不允许被继承的类。final类中的所有方法会自动地成为final方法，但字段不会。

## static

1、static字段又被称为静态字段，或者类字段。静态字段属于整个类，不属于某个特定类实例，因此是所有类实例共享的。某个类实例更改了静态字段，其他类实例也都会获得最新的值。

2、static方法属于整个类，它不是在对象上执行的方法，因为方法内部不能使用隐式参数this，也不能访问实例字段。在调用static方法时一般是使用类名，但也可以使用对象变量名。

3、static不能用来修饰普通类，但可以修饰内部类。在接口中声明的内部类默认是`public static`。

## this

1、隐式参数

方法的第一个参数是隐式参数，也就是出现在方法名前面的对象，之后的参数才是显式参数，也就是方法名后面括号中的参数。

在每一个方法中，关键字this指示隐式参数，表示当前调用该方法的对象。

2、调用另一个构造器

关键字this指示一个方法的隐式参数。但this还有另外一层含义：如果构造器的第一条语句为`this(...)`，就代表这个构造器将调用这个类的另一个构造器。

3、内部类中，利用`this`访问内部类对象自身成员，前面加外部类名，例如`OuterClassName.this`则访问外部类对象的成员。

## super

指示编译器调用超类方法的关键字。用法有两种：（1）`super(...)`表示调用超类构造器；（2）`super.getSalary()`或`super.id`表示调用超类的实例字段或方法。

当某个类继承自一个超类和多个接口时，`super`前可以加类名或接口名（例如`Employee.super.getId()`或`Employee.super(...)`），表示调用该类的构造器、字段或方法。

## abstract

1、abstract类是抽象类。

2、abstract方法是抽象方法。

## default

实现这个接口的类如果不实现这个方法的话，就用接口提供的默认实现。



## instanceof

判断变量是否属于某个类型。类型名后面加一个变量名：表示如果判断为真，就将`obj`转换为该类型并赋值给`str`，不需要再次进行强制转换。

```java
void outputValueInUppercase(Object obj) {
    if (obj instanceof String str) {
        System.out.println(str.toUpperCase());
    }
    if (obj instanceof String) {
        // 进行强制转换
        String str = (String) obj;
        System.out.println(str.toUpperCase());
    }
}
```