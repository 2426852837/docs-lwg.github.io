# lambda表达式

## 语法

下面是10种写法：

```java
// 没有参数，简单代码
()-> true;
// 没有参数，复杂代码块
()->{...}
// 2个以上参数，简单代码
(int x, int y) -> x + y;
// 2个以上参数，复杂代码块
(int x, int y) -> {...}
// 2个以上参数，简单代码，但是可以推导出参数类型，因此忽略其类型
(x, y) -> x + y;
// 2个以上参数，复杂代码块，但是可以推导出参数类型，因此忽略其类型
(x, y) -> {...};
// 1个参数，简单代码
(int x) -> x + 1;
// 1个参数，复杂代码块
(int x ) -> {...}
// 1个参数，简单代码，但是可以推导出参数类型，因此忽略其类型和小括号
x -> x + 1 ;
// 1个参数，复杂代码块，但是可以推导出参数类型，因此忽略其类型和小括号
x -> {...}
```

`(参数) -> 表达式` 

1、表达式可以为`{...}`代码块，也可以为不包含小括号的一行代码，这行代码表示返回一个值时应该省略`return`。

2、`(参数)`表示方法参数，可以为0个、1个或多个参数。参数需要声明类型。

（1）如果可以推导出一个lambda表达式的参数类型，则可以忽略其类型。

（2）如果方法只有一个参数，且可以推导出参数类型，则可以忽略其类型和小括号。

3、无须指定lambda表达式的返回类型，它总是会由上下文推导得出。

## 函数式接口 转换为 lambda表达式

==对于只有一个抽象方法（`public`方法或`public abstract`方法）的接口：需要这种接口的对象时，可以提供一个lambda表达式来都代替==。这种接口称为==函数式接口==。

`Comparator`和`ActionListener`就是函数式接口。因此，我们能够为**接口**部分的**举例：数组排序 - Comparator接口** 和 **举例：定时器与监视器** 提供lambda表达式写法。

下面举几个函数式接口的例子：

1、`Predicate`接口

`java.util.function.Predicte`表示一个断言函数，接受类型为`T` 的参数，并返回一个布尔值，用于判断是否满足某个条件。

`ArrayList`类有一个`removeIf(Predicate<? super E> filter)`方法，其参数就是一个`Predicate`。`removeIf`方法用于移除满足`Predicate`条件的元素。

```java
list.removeIf(e -> e == null);
```

2、`Supplier`接口

`java.util.function.Supplier`接口表示一个供应商函数，不接受参数，但返回类型为 T 的结果，用于提供数据。

`java.util.Objects`类有一个`requireNonNullElseGet(T obj, Supplier<? extends T> supplier)`方法，第二个参数就是`Supplier`。`requireNonNullElseGet`方法用于提供数据，当第一个参数为`null`时，需要利用第二个参数`supplier`返回生成的数据。

```java
LocalDate hireDay = Objects.requireNonNullElseGet(day, () -> new LocalDate(1970, 1, 1));
```

3、`java.lang.Runnable`接口

```java
public interface Runnable{
    public abstract void run();
}
```

```java
public static void repeat(int n, Runnable action){
    for(int i = 0; i < n; i++){
        action.run();
    }
}
repeat(10, ()-> System.out.println("Hello, World!"));
```

常用的函数式接口：



![函数式接口](/pictures/java/chap05/chap5_1.png)







## lambda表达式 重写为 方法引用

1、有时，lambda表达式涉及一个方法，只需要把方法引用代替lambda表达式作为参数传入即可。

```java
// 原来的写法
var timer = new Timer(3000, event -> System.out.println(event));
// 方法引用的写法
var timer = new Timer(3000, System.out::println);
```

表达式`System.out::println`是一个方法引用，==它指示编译器生成一个函数式接口的实例，覆盖这个接口的抽象方法来调用给定的方法==。在上面的例子中，会生成一个`ActionListener`，它的`actionPerformed(ActionEvent e)`方法要调用`System.out.println(e)`方法。

2、==只有当lambda表达式的体只调用一个方法而不做其他操作时，才能把lambda表达式重写为方法引用==。例如`s -> s.length() == 0`不能重写为方法引用。

3、==lambda表达式和方法引用都不是对象，但是为一个函数式接口类型的变量赋值时会生成一个对象。==

4、方法引用的运算符`::`分割对象或类名 与 方法名。主要有三种情况：

（1）`object::instanceMethod`

例如`System.out::println`。这种情况下方法引用等价于`x -> System.out.println(x)`。

也可以使用==`this`或`super`==关键字，例如`this::equals`等价于`x -> this.equals(x)`；`super::equals`等价于`x -> super.equals(x)`。这里的`this`或`super`在那个类中写的，就代表哪个类的当前实例。

还可以使用`new`关键字实现一个==构造器引用==。例如`Person[] people = stream.toArray(Person[]::new);`。

（2）`Class::instanceMethos`

例如`String::compareToIgnoreCase`。这种情况下方法引用等价于`(x, y) -> x.compareToIgnoreCase(y)`。

（3）`Class::staticMethod`

例如`Math::pow`。这种情况下方法引用等价于`(x, y) -> Math.pow(x, y)`。

更多的示例参考下图：

![方法引用示例](/pictures/java/chap05/chap5_2.png)



5、有时API包含一些专门用作方法引用的方法。比如`java.util.Objetcs`类有一个方法`isNull(Object obj)`，用于测试一个对象引用是否为`null`。

```java
list.removeIf(Objects::isNull);
// 等价于
list.removeIf(obj -> obj == null);
```



## lambda表达式的逻辑

1、函数式接口`interfaceA`是只有一个抽象方法`interfaceMethod`的接口。

2、某个方法`methodB`声明其参数类型为函数式接口`interfaceA`时，意味着在该方法内部会调用这个实现了函数式接口的类实例`interfaceInstant`的`interfaceMethod`方法。`interfaceMethod`方法的参数由方法`methodB`提供。

3、因为函数式接口的`interfaceMethod`方法是抽象方法，没有具体实现，所以传给`methodB`的实参必须是函数式接口的具体实现。

（1）因此我们可以定义一个类，使这个类实现函数式接口，然后构造一个该类的实例，作为方法`methodB`的参数传入。

```java
public class Test {
    public static void main(String[] args) throws Exception {
        ArrayList<String> strs = new ArrayList<>();
        strs.add("zhang san");
        strs.add("li si");
        strs.add("wang wu");
        strs.removeIf(new TestInterface());
        System.out.println(strs);
    }
}
class TestInterface implements Predicate<String>{
    public boolean test(String t){
        if (t.length() < 6){
            return true;
        }
        return false;
    }
}
```

（2）还有一种方法是：我们可以直接传入一个lambda表达式作为方法`methodB`的参数。这个lambda表达式本身就是一个方法，它作为参数传入，表示这个方法就是函数式接口的具体实现。

```java
public class Test {
    public static void main(String[] args) throws Exception {
        ArrayList<String> strs = new ArrayList<>();
        strs.add("zhang san");
        strs.add("li si");
        strs.add("wang wu");
        strs.removeIf(t -> t.length() < 6);
        System.out.println(strs);
    }
}
```

这里的`t`就是函数式接口`interfaceA`的方法`interfaceMethod`需要的参数，也是方法`methodB`提供的参数。`t.length < 6`就是方法`interfaceMethod`的具体实现。

不过，上面的例子中，我们没有看到在`removeIf`方法（也就是`methodB`）中实际调用`interfaceMethod`方法。下面我们再举一个例子：

```java
public class Test {
    public static void main(String[] args) throws Exception {
        makePairSupplier(() -> new String());
    }
    public static <T> T makePairSupplier(Supplier<T> constr){
        return constr.get();
    }
}
```

这个例子中，`methodB`就是`makePairSupplier`方法，它接受一个实现了`Supplier<T>`接口的实例`constr`。这里我们使用lambda表达式作为这个实例`constr`。当执行`constr.get()`时，实际上就是执行这个`lambda`表达式所定义的方法`return new String()`。

4、因为lambda表达式本身就是一个方法，那么我们也可以使用现成的方法作为lambda表达式，这就是方法引用。

```java
public class Test {
    public static void main(String[] args) throws Exception {
        makePairSupplier(String::new);
    }
    public static <T> T makePairSupplier(Supplier<T> constr){
        return constr.get();
    }
}
```

总的来说，这三者的关系是：==lambda表达式是函数式接口的唯一方法的具体实现，这个lambda表达式也可以替换成一个方法引用。==



## lambda表达式访问外部变量

lambda表达式语法：`(参数) -> {代码块}`

代码块中可以使用==自由变量==（非参数且不在代码块中定义的变量）。

但是要求这个自由变量必须是==事实最终变量==，即这个变量初始化后就不会被改变了：在lambda表达式中不能被改变，并且在lambda表达式外部也不会被改变。比如`String text`就是不可变变量。

关于代码块以及自由变量值，有一个术语：==闭包==。

lambda表达式可以==捕获==这个自由变量的值。

```java
public static void repeatMessage(String text, int delay){
    ActionListener listener = event -> {
        System.out.println(text);
        Toolkit.getDefaultToolkit().beep();
    }
    new Timer(delay, listener).start();
}
```