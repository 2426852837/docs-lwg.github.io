# 代理

## 代理实例

```java
public class ProxyTest{
    public static void main(String[] args){
        var elements = new Object[1000];
        for(int i = 0; i < elements.length, i++){
            Integer value = i + 1;
            // 系统类加载器，用于加载代理类
            var loader = ClassLoader.getSystemClassLoader();
            // 接口类数组，代理对象将实现这些接口
            var interfaces = new Class[] { Comparable.class };
            // 处理器，用于处理代理对象的方法调用；接收的参数value将在调用该方法时使用
            var handler = new TraceHandler(value);
            // 代理对象
            Object proxy = Proxy.newProxyInstance(loader, interfaces, handler);
            // 将int类型元素包装为代理对象proxy
            elements[i] = proxy;
		}
        // 要查找的值
        Integer key = new Random().nextInt(elements.length) + 1;
        // 二分查找
        int result = Arrays.binarySearch(elements, key);
        if(result >= 0) System.out.println(elements[result]);
    }
}
class TraceHandler implements InvocationHandler{
    private Object target;
    // 包装int类型元素
    public TraceHandler(Object t){
        target = t;
    }
    public Object invoke(Object proxy, Method m, Object[] args) throws Throwable{
        // 完成我们指定的额外操作（跟踪）
        System.out.print(target);
        System.out.print("." + m.getName() + "(");
        if(args != null){
            for(int i = 0; i < args.length; i++){
                System.out.print(args[i]);
                if(i < args.length - 1) System.out.print(", ");
            }
        }
        System.out.println(")");
        // 完成`int`类型元素应有的操作（二分查找）
        return m.invoke(target, args);
    }
}
```



## 代理逻辑

1、本来应该在二分查找方法`binarySearch`中传入一个`int[]`类型的对象`elements`，但是现在我们的目的是：：==不仅完成`int`类型元素应有的操作（二分查找），还会完成我们指定的额外操作（跟踪）==。

这就需要用到代理类`Proxy`。`Proxy`类的构造器为：`public static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)`。

2、代理方法是：将每个`int`类型的元素==包装==成为了一个代理对象`proxy`，然后为方法`binarySearch`传入`proxy[]`（`elements`）。

这样每一个代理对象`proxy`都会==代理==原本的`int`类型的元素，完成下面的操作：==不仅完成`int`类型元素应有的操作（二分查找），还会完成我们指定的额外操作（跟踪）==。

**至此，记住两个关键的操作：==包装==、==代理==。==代理==的目的就是 “ ==不仅完成`int`类型元素应有的操作（二分查找），还会完成我们指定的额外操作（跟踪）==”。为了 “ ==完成`int`类型元素应有的操作（二分查找）==”，就需要==包装==。**

3、那么如何包装呢？

这是由实现了`InvocationHandler`接口的类实例`handler`完成的。`var handler = new TraceHandler(value);`这句代码就是包装。

4、包装完成了以后，怎么代理？

首先要创建一个代理对象`proxy`：`Object proxy = Proxy.newProxyInstance(loader, interfaces, handler); `。

这个代理对象是在运行时（调用`Proxy.newProxyInstance`方法时）动态生成的新类实例。`Proxy.newProxyInstance`方法中：

（1）首先生成代理类的字节码：实现`interfaces`中的全部接口，动态生成字节码。这些字节码就定义了一个新的代理类。这个类的类名不知道是什么。

（2）然后利用类加载器`loader`把这个代理类加载到内存中。

（3）创建这个代理类的实例。

（4）将代理类实例与处理器`handler`连接（`handler`是`proxy`的内部成员）。这意味==着当代理对象的方法（`interfaces`中的接口方法）被调用时，将会调用处理器`handler`中的`invoke`方法==。
在这个`invoke`方法中，才真正完成了下面这个操作：==不仅完成`int`类型元素应有的操作（二分查找），还会完成我们指定的额外操作（跟踪）==。

5、`handler`所属的类实现了`InvocationHandler`接口，这个接口有一个抽象方法`invoke`必须实现。我们真正要重点关注的就是怎么实现这个`invoke`方法，具体的实现逻辑是由我们的目的决定的：==不仅完成`int`类型元素应有的操作（二分查找），还会完成我们指定的额外操作（跟踪）==。
（1）前面我们说过，处理器`handler`已经包装了真正的数据（`int`类型的元素），并且代理对象`proxy`会的接口方法被调用后，`proxy`会将这个接口方法（`Method m`）、方法参数（`Object[] args`）连同`proxy`本身都传递给`handler`的`invoke`方法，因此`invoke`方法中足够完成操作：==完成`int`类型元素应有的操作（二分查找）==。
（2）至于==完成我们指定的额外操作（跟踪）==，就由我们来指定了。
总之，所有的操作都会写在`invoke`方法中。

6、这也就是我们说的代理`Proxy`的真正含义：`int`类型的元素委托对象`proxy`完成我们想要的操作；`proxy`接受了这一委托，对其进行代理，但是它并不直接完成这些操作，而是分配给实现了`InvocationHandler`接口的类实例`handler`去完成具体操作。

`proxy`真正完成的操作则是：

（1）实现接口。比如`int`类型会被包装为`Integer`对象，在进行二分查找时需要反复进行比较操作，而`Integer`类实现了`Comparable`接口。因此`proxy`需要实现`Comparable`接口。

（2）因为是动态创建代理类，所以还得加载代理类。

这些都是处理器`handler`做不到的。可以说`handler`是具体干活的，`proxy`是指挥`handler`的。

7、这样就完成了代理工作。之后，==当代理对象的方法（接口方法）被调用时，将会调用处理器`handler`中的`invoke`方法==。



## 总结



`target`是被代理对象。



1、`InvocationHandler`接口的实现类对象`handler`定义对`target`的代理逻辑（即`handler`是代理逻辑对象）：

（1）代理逻辑在`InvocationHandler`必须实现的`invoke`方法中实现；

```java
/**
* 处理被代理对象方法逻辑
* @param target 被代理对象
* @param method 当前方法
* @param args 运行参数
* @return 方法调用结果 */
public Object invoke(Object target, Method method, Object[] args);
```

（2）因为`invoke`方法接收三个参数：被代理对象`target`、`target`的方法名`method`、`target.method`方法的参数`args`，因此在`invoke`方法中可以通过代码`method.invoke(target, args)`回调被代理对象`target`的`method`方法。



2、使用静态方法`Proxy.newProxyInstance`生成`target`的代理对象`proxy`：

```java
public static Object newProxyInstance(ClassLoader classLoader, Class<?>[] interfaces, 
                                      InvocationHandler handler) throws IllegalArgumentException
```

（1）`classLoader`是`target`的类加载器；`interfaces`是`target`实现的所有接口；`handler`是代理逻辑对象。

（2）该方法会生成动态生成类的字节码，然后把类加载到内存中，最后再创建类的实例。

（3）这个类是一个匿名类，实现了`interfaces`中的全部接口。因此`target`可以调用的方法，`proxy`都能调用。

（4）在这个类定义的所有方法中，都会调用`handler.invoke`方法。



3、然后就可以像操作`target`一样操作`proxy`了：

（1）逻辑上调用`proxy`的各种方法就相当于调用`target`的方法；

（2）实际上调用`proxy`的方法时执行的是`handler.invoke`方法。







## 静态代理

上面说的是动态代理，下面介绍静态代理的例子。

```java
public class Test{
    public void static main(String[] args){
        var rand = new RandomProxy(new Random());
        System.out.println(rand.nextDouble());
    }
}
class RandomProxy{
    private Random random;
    public RandomProxy(Random random){
        this.random = random;
    }
    public double nextDouble(){
        System.out.println("proxy");
        return random.nextDouble();
    }
}
```

这里由于`Random`类的代理类`RandomProxy`实现（代理功能）比较简单，所以可以精简代码：

```java
public class Test{
    public static void main(String[] args) throws IOException {
        // 创建一个继承了Random类的子类对象，该子类覆盖了nextDouble()方法
        var rand = new Random(){
            // nextDouble方法的具体实现与上述代理类RandomProxy中的具体实现一样
            public double nextDouble(){
                var num = super.nextDouble();
                System.out.println("proxy");
                return num;
            }
        };
        System.out.println(rand.nextDouble());
    }
}
```