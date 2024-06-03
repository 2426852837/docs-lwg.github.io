# 反射

能够分析类能力的程序称为==反射==。反射可以用来：

（1）在运行时分析类的能力；（2）在运行时检查对象，例如，编写一个适用于所有类的`toString`方法；（3）实现泛型数组操作代码；（4）利用`Method`对象，这个对象很像c++中的函数指针。

## 获取类类型（Class类实例）

在程序运行期间，java运行时系统始终为所有对象维护一个==运行时类型标识==。这个信息会跟踪每个对象所属的类。虚拟机利用运行时类型信息选择要执行的正确方法。

可以使用一个特殊的java类访问这些信息。保存这些信息的类名为`Class`。

### 1、`Object`类的`getClass`方法

`Object`类对象的`getClass()`方法将返回一个`Class`类型的实例。调用`getClass`方法的对象变量引用的实际对象类型是什么，就获得什么类的`Class`类实例。`Class`对象会描述一个类的属性。

```java
Employee e = new Employee("Carl Cracker", 75000, 1987, 12, 15);
Class cl = e.getClass();
Employee boss = new Manager("Carl Cracker", 75000, 1987, 12, 15, 1000);
// getClass()返回Class类实例
Class cl2 = boss.getClass();
// getName()返回类名
System.out.println(cl.getName()); // Employee
System.out.println(cl2.getName()); // Manager
// forName(className)方法返回Class类实例
Class cl3 = Class.forName("Manager");
// T.class方式返回Class类实例
Class cl4 = Employee.class;
```

### 2、`Class`类的`forName`方法

`Class`类的`forName`方法是一个静态方法，可以根据类名获得一个`Class`类实例。

### 3、`T.class`方式

`T.class`方式是获取`Class`类实例的第三种方法，其中`T`表示泛型，可以是`Manager`类，也可以是`Integer`类，可以是`int`，也可以是`Double[]`。但出于一些历史原因，`int.class`和`Double[].class`会返回莫名其妙的值。

### 4、`Class`类的`getName()`方法

`Class`类对象的`getName()`方法获取类名。如果类在一个包里，包的名字也作为类名的一部分。

### 比较`Class`类实例

虚拟机为每个类型管理一个==唯一==的`Class`对象。因此，可以利用`==`运算符比较两个类对象。

```java
Employee e = new Manager("Carl Cracker", 75000, 1987, 12, 15, 1000);
if(e.getClass == Employee.class){
    System.out.println("equals 1");
}
if(e.getClass == Manager.class){
    System.out.println("equals 2");
}
if(e instanceof Employee){
    System.out.println("equals 3");
}
if(e instanceof Manager){
    System.out.println("equals 4");
}
/** 输出为：
equals 2
equals 3
equals 4
*/
```

### `instanceof`关键字

超类类型的对象变量可以引用一个子类类型的对象。当使用`instanceof`判断该对象变量时，无论是超类类型还是子类类型，它都会返回`true`。

## 构造类的实例

如果有一个`Class`类型的对象，可以用它来构造类的实例。

### 1、获得类的构造器

`Class`类对象的`getConstructor`方法获得类的构造器`Constructor`。

### 2、创建类实例

类的构造器`Constructor`对象调用`newInstance`方法创建类实例。

```java
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
}
public class Test{
    public static void main(String[] args){
        Class cl = Employee.class;
        Constructor cont = cl.getConstructor(String.class, double.class, int.class, int.class, int.class);
        var e = (Employee) cont.newInstance("zhang san", 8888, 1999, 9, 9);
        System.out.println(e.getName());
    }
}
```



## 利用反射在运行时分析对象

可以利用反射获取某个类对象的字段，然后获得该字段的值，或者设置该字段的值。

但是设置该字段的值时，可能会抛出一个`IllegalAccessException`异常，因为：如果某个字段是私有的，那么反射机制可以获取到该字段（即我们能知道类中有这个字段），但是不能获取甚至设置该字段的值。

这是因为反射机制的默认行为受限于java的访问控制。但是我们可以调用`Field`、`Method`、`Constructor`类对象的`setAccessible`方法来覆盖java的访问控制。

```java
public class Test{
    public static void main(String[] args){
        TestClass ts = new TestClass(1, 1998, 3);
        Class cl = ts.getClass();
        // id是TestClass类的私有字段
        Field field = cl.getDeclaredField("id");
        // 覆盖id字段的访问控制
        field.setAccessible(true);
        // 构造TestClass类实例
        Constructor cont = cl.getConstructor(int.class, int.class, int.class);
        var e = cont.newInstance(2, 2005, 5);
        // 访问对象e的id字段值
        int value = (int) field.get(e);
        System.out.println(value); // 2
    }
}
```

当然，执行`setAccessible`方法不一定会成功，可能会抛出一个异常。这是因为访问可能会被模块系统或安全管理器拒绝，解决办法就是将相关模块中的包"打开"给其他模块（模块可能只是导出`exports`了包但并没有打开`opens`它，因此不能使用反射）。具体的做法是：

（1）在IDEA中，右键单击主函数`main`，点击`Modify Run Configuration`，打开运行配置窗口。然后点击`Modify Options` - `Add VM Options`，在`VM Options`一栏中输入类似格式的语句：`--add-opens java.base/java.lang=ALL-UNNAMED`。这段语句的意思是将`java.base`模块中的`java.lang`包"打开"给所有未命名的模块。

（2）命令行运行java程序时，就这么写：`java --add-opens java.base/java.lang=ALL-UNNAMED YourClassName`。



## 利用反射编写泛型数组代码

```java
package TestJava;
import java.lang.reflect.Array;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
public class Test{
    public static void main(String[] args) 
        throws NoSuchMethodException, InvocationTargetException, 
    			InstantiationException, IllegalAccessException, NoSuchFieldException {
        TestClass[] tss = new TestClass[3];
        Object obj = copyArray(tss, 6);
        System.out.println(Array.getLength(obj)); // 6
    }
    // 该方法实现了"任意类型元素"的数组拷贝
    public static Object copyArray(Object obj, int newLength){
        Class cl = obj.getClass();
        Class component = cl.getComponentType();
        System.out.println(cl.getName()); // [LTestJava.TestClass;
        System.out.println("flag: " + cl.isArray()); // flag: true
        System.out.println(component.getName()); // TestJava.TestClass
        Object arr = Array.newInstance(component, newLength);
        System.arraycopy(obj, 0, arr, 0, Math.min(Array.getLength(obj), newLength));
        return arr;
    }
}
```



## 调用任意方法和构造器

```java
public class Test{
    public static void main(String[] args) 
        throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        Class cl = TestClass.class;
        Constructor cont = cl.getConstructor(int.class, int.class, int.class);
        var e = cont.newInstance(2, 2005, 5);
        Method methodSet = cl.getDeclaredMethod("setId", int.class);
        methodSet.invoke(e, 3);
        Method methodGet = cl.getDeclaredMethod("getId");
        int newId = (int) methodGet.invoke(e);
        System.out.println(newId);
    }
}
class TestClass{
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
}
```





## 查找资源文件

`Class`类提供了一个很有用的服务可以查找类的资源文件。下面是必要步骤：

1、获得拥有资源的类的`Class`对象。

2、有些资源文件，例如图像：根据文件路径（可以是相对路径也可以是绝对路径），获得文件的url，根据url获得文件。

2、有些资源文件，例如文本：根据文件路径（可以是相对路径也可以是绝对路径），获得文件输入流，根据输入流获得文本字符串。

下面的程序是资源加载的代码。

```java
public class Test{
    public static void main(String[] args) throws IOException { 
        Class cl = Test.class;
        // 根据文件路径，获得描述资源位置的url,根据url获得图像
        URL url = cl.getResource("HTTP.png");
        var icon = new ImageIcon(url);
        // 根据文件路径，获得文件输入流，根据输入流获得文本字符串
        InputStream stream = cl.getResourceAsStream("HTTP.txt");
        var words = new String(stream.readAllBytes(), "UTF-8");
        // 根据文件路径，获得文件输入流，根据输入流获得文本字符串
        InputStream stream2 = cl.getResourceAsStream("Title.txt");
        var title = new String(stream2.readAllBytes(), StandardCharsets.UTF_8);
        // 资源加载
        JOptionPane.showMessageDialog(null, words, title, JOptionPane.INFORMATION_MESSAGE, icon);
    }
}
```



## 反射的弊端

`Class<T> Class.forName(String name)`方法会返回一个名称为`name`的类的`Class`类对象。有了这个类对象以后我们就可以查看这个类的大部分信息，甚至能够创建对象，调用函数。

但是可能本来这个类就是私有的，它只在所在包中可见，这样就破坏了访问规则。