# 内部类



## 成员内部类

1、在内部类中可以访问任何外部类成员（即使是`private`成员）。这是因为：内部类对象会有一个隐式引用，指向构造这个内部类对象的外部类对象。但是这个隐式引用是不可见的。

这个机制是由编译器实现的。编译器会修改所有的内部类构造器，添加一个对应外部类引用的参数。

不过，我们也可以在内部类中使用`OuterClass.this`来显式访问外部类成员。

```java
// 假设原来的类是这样的定义的
public class OuterClass{
    ...
    public class InnerClass{
        public InnerClass(){
            ...
        }
    }
    public void test(){
        InnerClass inner = new InnerClass();
    }
}
// 编译器修改后的类是这样的
public class OuterClass{
    ...
    public class InnerClass{
        public InnerClass(OuterClass outer){
            this.outer = outer;
            ...
        }
    }
    public void test(){
        InnerClass inner = new InnerClass(this);
    }
}
```



2、在内部类之外构造内部类对象时：（1）引用内部类的方式是`OuterClass.InnerClass`，在外部类中可以省略`OuterClass`限定；（2）使用`new`运算符时必须添加外部类对象名前缀，表示该内部类对象引用的是这个外部类对象：`this.new`或`OuterClassObject.new`，在外部类中也可以直接构造（省略`this`，表示当前外部类对象）。

```java
public class OuterClass{
    public class InnerClass{
        public InnerClass(){ }
    }
    public void test(){
        // 下面3条语句都是等价的，即创建一个引用当前外部类OuterClass对象的内部类InnerClass对象
        InnerClass inner1 = new InnerClass();
        OuterClass.InnerClass inner2 = new InnerClass();
        InnerClass inner3 = this.new InnerClass();
        // 创建一个引用外部类OuterClass对象other的内部类InnerClass对象
        OuterClass other = new OuterClass();
        OuterClass.InnerClass inner4 = other.new InnerClass();
    }
}
class class OtherClass{
    public void test(){
        OuterClass obj = new OuterClass();
        // 在外部类的作用域之外，访问内部类时用OuterClass.InnerClass
        // 创建内部类对象时，要在new关键字前加上外部类对象名，即OuterClassObject.new
        // new关键字之后的类名中，要省略外部类名
        OuterClass.InnerClass inner = obj.new InnerClass();
        // OuterClass.InnerClass inner2 = obj.new Test.InnerClass(); //编译错误
    }
}
```



3、如果内部类修饰符是`public`，那么其他类中只要能访问外部类，也就可以通过外部类访问内部类`OuterClass.InnerClass`；如果内部类是`private`，那么即使是同一个包中的类也无法访问内部类，只能由外部类访问。

4、内部类`InnerClass`的类名会被编译器设置为`OuterClass$InnerClass`，而其外部类的引用则被设置为`this$0`。

5、成员内部类中不能有静态方法。因为类的静态成员会在类加载的时候存入内存，但是在加载外部类的时候不会加载非静态内部类，这样就会导致：内部类未加载，却试图在内存中创建静态成员。



## 局部内部类

在外部类方法中定义的内部类。

这个局部内部类的作用域被限定在了这个方法块中，因此不能有访问说明符（`private`或`public`等）。

局部内部类不仅能够访问外部类的成员，还能访问方法块中的局部变量。

```java
// 外部类TimePrinter中的一个方法
public void start(int interval, boolean beep){
    class TimePrinter implements ActionListener{
        public void actionPerformed(ActionEvent event){
            System.out.println(Instant.ofEpochMilli(event.getWhen()));
            if(beep) Toolkit.getDefaultToolkit().beep();
        }
    }
    var listener = new TimePrinter();
    var timer = new Timer(interval, listener);
    timer.start();
}
```



## 匿名内部类

假如只是想创建一个局部内部类的对象，甚至不需要为类指定名字。这样一个类被称为匿名内部类。

```java
// 外部类TimePrinter中的一个方法
public void start(int interval, boolean beep){
    var listener = new ActionListener(){
        public void actionPerformed(ActionEvent event){
            System.out.println(Instant.ofEpochMilli(event.getWhen()));
            if(beep) Toolkit.getDefaultToolkit().beep();
        }
    }
    var timer = new Timer(interval, listener);
    timer.start();
}
```

上述代码的含义是：==创建一个类对象，这个类实现了`ActionListener`接口，需要实现的方法`actionPerformed`在括号`{}`中被定义了。==

当然，`ActionListener`也可以替换为一个可继承（非`final`）的类名`className`，这样代码的含义就是：==创建一个类对象，这个类继承了`className`父类，需要覆盖的方法`methodName`在括号`{}`中被定义了。==

## 静态内部类

1、如果只是想将一个类隐藏在另外一个类的内部，并不需要外部类对象的一个引用（构造静态内部类对象时不需要引用任何外部类对象），可以将内部类声明为`static`，这就是一个静态内部类。

2、静态内部类中可以有静态成员方法，但是静态方法中只能访问内部类和外部类的静态成员，不能访问它们的实例成员。

# 服务加载器

## 服务

```java
package serviceLoader;
public interface Cipher{
    byte[] encrypt(byte[] source, byte[] key);
    byte[] decrypt(byte[] source, byte[] key);
}
```

服务应该是一个接口或者超类。

## 服务提供（服务实现）

```java
package serviceLoader.impl;
private class CaesarCipher implements Cipher{
    public byte[] encrypt(byte[] source, byte[] key){
        var result = new byte[source.length];
        for(int i = 0; i < source.length; i++){
            result[i] = (byte) (source[i] + key[0]);
        }
        return result;
    }
    public byte[] decrypt(byte[] source, byte[] key){
        return encrypt(source, new byte[]{(byte)-key[0]});
    }
    public int strength(){
        return 1;
    }
}
```

（1）服务提供者可以提供一个或多个实现这个服务的类。

（2）实现类可以放在任意的包中，不一定是服务接口所在的包。

（3）每个实现类都必须有一个无参数构造器。

### 提供服务实现

提供服务实现有两种方式：

1、在包含实现类的`.jar`文件中，应该在`META-INF/services`目录下增加一个名称为 "完全限定的接口（超类）名" 的文件，在这个例子中是`serviceLoader.Cipher`文件；并且在该文件中需要包含 "完全限定的实现类名" 的行，在这个例子中是：

```
serviceLoader.impl.CaesarCipher
```

2、模块化系统提供了一种更好的方式。提供服务实现的模块可以在模块的声明文件`module-info.java`中添加一条`provides`语句，这条语句应该是"`provides` 接口或超类 `with` 实现类"，表示将实现类提供给接口或超类：

```java
module serviceModule{
    exports serviceLoader;
    provides serviceLoader.Cipher with
        serviceLoader.impl.CaesarCipher;
}
```

在消费该服务的模块中，应当在其模块声明文件中添加一条`uses`语句，表示要使用该服务（接口或超类）：

```java
module consumerModule{
    requires serviceModule;
    uses serviceLoader.Cipher;
}
```



注意：服务（接口或超类）必须是公开（`public`）的，实现类可以是私有（`private`）的。因为具体实现（实现类）是和服务（接口或超类）绑定的，消费者使用的是服务（接口或超类），可以不关心具体的实现细节。

因此，`provides`和`uses`声明的效果，是使得消费该服务的模块允许访问私有实现类的对象（但是不能显示地出现私有类的类名）。



## 服务消费者

在其他应用程序中，首先要依赖包含

```java
public class Test{
    private static ServiceLoader<Cipher> cipherLoader = ServiceLoader.load(Cipher.class);
    public void main(String[] args){
        Cipher cipher = getCipher(1);
    }
    public static Cipher getCipher(int minStrength){
        for(Cipher cipher: cipherLoader){
            if(cipher.strength() >= minStrength){
                return cipher;
            }
        }
        return null;
    }
}
```