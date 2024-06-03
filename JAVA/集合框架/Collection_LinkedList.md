# Collection - LinkedList 源码解析

## 概述

*LinkedList*同时实现了*List*接口和*Deque*接口，也就是说它既可以看作一个顺序容器，又可以看作一个队列(Queue)，同时又可以看作一个栈(Stack)。

![image](/pictures/java/Collections_Map/LinkedList/1.png)

- LinkedList 的实现方式决定了所有跟下标相关的操作都是线性时间，而在首段或者末尾删除元素只需要常数时间
- 为追求效率*LinkedList*没有实现同步(synchronized)，如果需要多个线程并发访问，可以先采用`Collections.synchronizedList()`方法对其进行包装。

## 实现（List 接口相关）

### 底层数据结构

LinkedList 底层通过双向链表实现：

- 双向链表的每个节点用内部类 Node 表示
- LinkedList 通过`first`和`last`引用分别指向链表的第一个和最后一个元素
- 没有所谓的哑元，当链表为空的时候`first`和`last`都指向`null`

```java
    transient int size = 0;

    /**
     * Pointer to first node.
     * Invariant: (first == null && last == null) ||
     *            (first.prev == null && first.item != null)
     */
    transient Node<E> first; // 底层数据结构含有首个节点

    /**
     * Pointer to last node.
     * Invariant: (first == null && last == null) ||
     *            (last.next == null && last.item != null)
     */
    transient Node<E> last; // 底层数据结构含有尾节点
```

Node 为私有的内部类：

```java
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
```

### 构造函数

```java
    /**
     * Constructs an empty list.
     */
    public LinkedList() {
    }

    /**
     * Constructs a list containing the elements of the specified
     * collection, in the order they are returned by the collection's
     * iterator.
     *
     * @param  c the collection whose elements are to be placed
     *         into this list
     * @throws NullPointerException if the specified collection is null
     */
    public LinkedList(Collection<? extends E> c) {
        this();
        addAll(c); // 调用addAll方法来添加元素
    }
```

### getFirst()，getLast()

```java
    /**
     * Returns the first element in this list.
     *
     * @return the first element in this list
     * @throws NoSuchElementException if this list is empty
     */
    public E getFirst() {
        final Node<E> f = first;
        if (f == null)
            throw new NoSuchElementException();
        return f.item;
    }

    /**
     * Returns the last element in this list.
     *
     * @return the last element in this list
     * @throws NoSuchElementException if this list is empty
     */
    public E getLast() {
        final Node<E> l = last;
        if (l == null)
            throw new NoSuchElementException();
        return l.item;
    }
```

### removeFirst()，removeLast()

```java
    /**
     * 删除List中的首节点.
     *
     * @return the first element from this list
     * @throws NoSuchElementException if this list is empty
     */
    public E removeFirst() {
        final Node<E> f = first;
        if (f == null)
            throw new NoSuchElementException();
        return unlinkFirst(f); // 删除首节点
    }

    /**
     * Unlinks non-null first node f.
     */
    private E unlinkFirst(Node<E> f) {
        // assert f == first && f != null;
        final E element = f.item; // 暂存首节点的值
        final Node<E> next = f.next;
        f.item = null;
        f.next = null; // help GC 方便进行垃圾回收
        first = next;
        if (next == null)
            last = null;
        else
            next.prev = null;
        size--;
        modCount++;
        return element;
    }
```

删除尾部元素

```java

    /**
     * Removes and returns the last element from this list.
     *
     * @return the last element from this list
     * @throws NoSuchElementException if this list is empty
     */
    public E removeLast() {
        final Node<E> l = last;
        if (l == null)
            throw new NoSuchElementException();
        return unlinkLast(l);
    }

    /**
     * Unlinks non-null last node l.
     */
    private E unlinkLast(Node<E> l) {
        // assert l == last && l != null;
        final E element = l.item;
        final Node<E> prev = l.prev;
        l.item = null;
        l.prev = null; // help GC
        last = prev;
        if (prev == null)
            first = null;
        else
            prev.next = null;
        size--;
        modCount++;
        return element;
    }

```

### remove()

该方法有两个版本：

- `remove(Object o)`: 删除跟指定元素相等的第一个元素
- `remove(int index)`: 删除指定下标处的元素

![image](/pictures/java/Collections_Map/LinkedList/2.png)

```java
    public boolean remove(Object o) {
        // for循环查找第一个与o相等的元素
        if (o == null) {
            for (Node<E> x = first; x != null; x = x.next) {
                if (x.item == null) {
                    unlink(x);
                    return true;
                }
            }
        } else {
            for (Node<E> x = first; x != null; x = x.next) {
                if (o.equals(x.item)) {
                    unlink(x);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Unlinks non-null node x.
     */
    E unlink(Node<E> x) {
        // assert x != null;
        final E element = x.item;
        final Node<E> next = x.next;
        final Node<E> prev = x.prev;

        if (prev == null) {// 前一个元素
            first = next;
        } else {
            prev.next = next;
            x.prev = null;
        }

        if (next == null) {// 后一个元素
            last = prev;
        } else {
            next.prev = prev;
            x.next = null;
        }

        x.item = null; // GC
        size--;
        modCount++;
        return element;
    }

```

`remove(int index)`使用的是下标计数， 只需要判断该 index 是否有元素即可，如果有则直接 unlink 这个 node。

```java
    public E remove(int index) {
        checkElementIndex(index);
        return unlink(node(index)); // 调用node()方法获取指定Index的Node
    }

```

### add()

add()有两个版本：

- `add(E e)`:该方法在 LinkedList 的末尾插入元素，因为有 last 指向链表末尾，在末尾插入元素的花费是常数时间
- `add(int index, E element)`: 该方法是在指定 index 处插入元素，需要先通过线性查找找到具体位置，然后修改相关引用完成插入操作

![image](/pictures/java/Collections_Map/LinkedList/3.png)

`add(E e)` 创建新节点，并修改引用完成插入操作。

```java
    /**
     * 将指定的元素添加至list尾部
     *
     * <p>This method is equivalent to {@link #addLast}.
     *
     * @param e element to be appended to this list
     * @return {@code true} (as specified by {@link Collection#add})
     */
    public boolean add(E e) {
        linkLast(e);
        return true;
    }

     /**
     * Links e as last element.
     */
    void linkLast(E e) {
        final Node<E> l = last;
        final Node<E> newNode = new Node<>(l, e, null); // 创建新节点，prev指向last节点
        last = newNode;
        if (l == null)
            first = newNode;
        else
            l.next = newNode;
        size++;
        modCount++;
    }
```

`add(int index, E element)`：当 index==size 时，等同于 add(E e); 如果不是，则分两步:

1. 先根据 index 找到要插入的位置,即 node(index)方法；
2. 修改引用，完成插入操作。

```java
    public void add(int index, E element) {
        checkPositionIndex(index);

        if (index == size)
            linkLast(element);
        else
            linkBefore(element, node(index));
    }
```

`node(index)`方法可从头往后找，也可从尾往前找，取决于条件`index < (size >> 1)`，也即是 index 是靠近前端还是后端。

```java
    /**
     * Returns the (non-null) Node at the specified element index.
     */
    Node<E> node(int index) {
        // assert isElementIndex(index);

        if (index < (size >> 1)) { // index靠近前端
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next; // 从头往后找
            return x;
        } else { // index靠近后端
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev; // 从尾往前找
            return x;
        }
    }
```

### addAll()

addAll(index, c) 实现方式并不是直接调用 add(index,e)来实现，主要是因为效率的问题，另一个是 fail-fast 中 modCount 只会增加 1 次；

```java
    /**
     * 将指定集合中的所有元素添加到此列表的尾部
     *
     * <p>This method is equivalent to {@link #addAll(int, Collection)}.
     *
     * @param c collection containing elements to be added to this list
     * @return {@code true} if this list changed as a result of the call
     * @throws NullPointerException if the specified collection is null
     */
    public boolean addAll(Collection<? extends E> c) {
        return addAll(size, c);
    }

    /**
     * 将指定集合中的所有元素添加到此列表的指定位置
     *
     * * @param index index at which to insert the first element
     *              from the specified collection
     * @param c collection containing elements to be added to this list
     * @return {@code true} if this list changed as a result of the call
     * @throws IndexOutOfBoundsException {@inheritDoc}
     * @throws NullPointerException if the specified collection is null
     */
    public boolean addAll(int index, Collection<? extends E> c) {
        checkPositionIndex(index); // 检查index是否合法

        Object[] a = c.toArray(); // 将c转换为Object数组
        int numNew = a.length;
        if (numNew == 0)
            return false;

        Node<E> pred, succ;
        if (index == size) { // index位于list的尾部
            succ = null;
            pred = last;
        } else {
            succ = node(index); // 查找index位置的节点
            pred = succ.prev;
        }

        for (Object o : a) {
            @SuppressWarnings("unchecked") E e = (E) o; // 强制类型转换
            Node<E> newNode = new Node<>(pred, e, null);
            if (pred == null)
                first = newNode;
            else
                pred.next = newNode;
            pred = newNode;
        }

        // 连接
        if (succ == null) {
            last = pred;
        } else {
            pred.next = succ;
            succ.prev = pred;
        }

        size += numNew;
        modCount++;
        return true;
    }

```

### clear()

**为了让 GC 更快可以回收放置的元素**，需要将 node 之间的引用关系赋空。

```java
    /**
     * 删除所有元素之间的引用关系
     * Removes all of the elements from this list.
     * The list will be empty after this call returns.
     */
    public void clear() {
        // Clearing all of the links between nodes is "unnecessary", but:
        // - helps a generational GC if the discarded nodes inhabit
        //   more than one generation
        // - is sure to free memory even if there is a reachable Iterator
        for (Node<E> x = first; x != null; ) {
            Node<E> next = x.next;
            x.item = null;
            x.next = null;
            x.prev = null;
            x = next;
        }
        first = last = null;
        size = 0;
        modCount++;
    }
```

### Positional Access 方法

get 方法：根据 index 获取元素

```java
    /**
     * Returns the element at the specified position in this list.
     *
     * @param index index of the element to return
     * @return the element at the specified position in this list
     * @throws IndexOutOfBoundsException {@inheritDoc}
     */
    public E get(int index) {
        checkElementIndex(index);
        return node(index).item;
    }
```

set 方法：根据 index 修改元素，返回之前的值

```java
    /**
     * Replaces the element at the specified position in this list with
     * the specified element.
     *
     * @param index index of the element to replace
     * @param element element to be stored at the specified position
     * @return the element previously at the specified position
     * @throws IndexOutOfBoundsException {@inheritDoc}
     */
    public E set(int index, E element) {
        checkElementIndex(index);
        Node<E> x = node(index);
        E oldVal = x.item;
        x.item = element;
        return oldVal;
}
```

判断位置的方法：

```java
    /**
     * 判断index所在的位置是否有元素
     */
    private boolean isElementIndex(int index) {
        return index >= 0 && index < size;
    }

    /**
     * 判断index是否合法
     */
    private boolean isPositionIndex(int index) {
        return index >= 0 && index <= size;
    }

    /**
     * Constructs an IndexOutOfBoundsException detail message.
     * Of the many possible refactorings of the error handling code,
     * this "outlining" performs best with both server and client VMs.
     */
    private String outOfBoundsMsg(int index) {
        return "Index: "+index+", Size: "+size;
    }

    private void checkElementIndex(int index) {
        if (!isElementIndex(index))
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }

    private void checkPositionIndex(int index) {
        if (!isPositionIndex(index))
            throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
    }

```

### 查找操作

- indexOf(Object o)：返回元素 o 在 list 中第一次出现的 index，如果找不到返回-1

```java
    /**
     * <tt>(o==null&nbsp;?&nbsp;get(i)==null&nbsp;:&nbsp;o.equals(get(i)))</tt>,
     * or -1 if there is no such index.
     *
     * @param o element to search for
     * @return the index of the first occurrence of the specified element in
     *         this list, or -1 if this list does not contain the element
     */
    public int indexOf(Object o) {
        int index = 0;
        if (o == null) {
            for (Node<E> x = first; x != null; x = x.next) {
                if (x.item == null)
                    return index;
                index++;
            }
        } else {
            for (Node<E> x = first; x != null; x = x.next) {
                if (o.equals(x.item))
                    return index;
                index++;
            }
        }
        return -1;
    }
```

- lastIndexOf(Object o)：返回元素 o 在 list 中最后一次出现的 index，如果找不到返回-1

```java
    /**
     * Returns the index of the last occurrence of the specified
     * element in this list, or -1 if this list does not contain the element.
     * More formally, returns the highest index <tt>i</tt> such that
     * <tt>(o==null&nbsp;?&nbsp;get(i)==null&nbsp;:&nbsp;o.equals(get(i)))</tt>,
     * or -1 if there is no such index.
     *
     * @param o element to search for
     * @return the index of the last occurrence of the specified element
     *         in this list, or -1 if this list does not contain the element
     */
    public int lastIndexOf(Object o) {
         int index = size;
        if (o == null) {
            for (Node<E> x = last; x != null; x = x.prev) {
                index--;
                if (x.item == null)
                    return index;
            }
        } else {
            for (Node<E> x = last; x != null; x = x.prev) {
                index--;
                if (o.equals(x.item))
                    return index;
            }
        }
        return -1;
     }
```

### Queue 方法

基于 LinkedList 的 Queue 其实是调用上述的一些方法来进行实现

实际上，Java 中是不存在 Queue 这个类（为一个接口），可以用 LinkedList、ArrayDeque、PriorityQueue 来实现 Queue 的功能。

```java
    /**
     * 获取队列头部的元素
     *
     * @return the head of this list, or {@code null} if this list is empty
     * @since 1.5
     */
    public E peek() {
        final Node<E> f = first;
        return (f == null) ? null : f.item;
    }

    /**
     * 获取队列头部的元素
     *
     * @return the head of this list
     * @throws NoSuchElementException if this list is empty
     * @since 1.5
     */
    public E element() {
        return getFirst();
    }

    /**
     * 返回队首元素并移除队首节点
     *
     * @return the head of this list, or {@code null} if this list is empty
     * @since 1.5
     */
    public E poll() {
        final Node<E> f = first;
        return (f == null) ? null : unlinkFirst(f);
    }

    /**
     * 返回队首元素并移除队首节点
     *
     * @return the head of this list
     * @throws NoSuchElementException if this list is empty
     * @since 1.5
     */
    public E remove() {
        return removeFirst();
    }

    /**
     * 向队尾添加给定元素的节点
     *
     * @param e the element to add
     * @return {@code true} (as specified by {@link Queue#offer})
     * @since 1.5
     */
    public boolean offer(E e) {
        return add(e);
    }
```

### Deque 方法

与 Queue 方法类似，Deque 方法也是基于 LinkedList 的 Queue 方法来实现的，而 Deque 为双向队列，因此添加和删除节点的方法均有两个版本

```java
    /**
     * 在列表前端添加节点
     *
     * @param e the element to add
     * @return {@code true} (as specified by {@link Deque#offerFirst})
     * @since 1.6
     */
    public boolean offerFirst(E e) {
        addFirst(e);
        return true;
    }

    /**
     * 在列表后端添加节点
     *
     * @param e the element to add
     * @return {@code true} (as specified by {@link Deque#offerLast})
     * @since 1.6
     */
    public boolean offerLast(E e) {
        addLast(e);
        return true;
    }

    /**
     * 获取列表前端节点
     *
     * @return the head of this list, or {@code null} if this list is empty
     * @since 1.6
     */
    public E peekFirst() {
        final Node<E> f = first;
        return (f == null) ? null : f.item;
    }

    /**
     * 获取列表后端节点
     *
     * @return the tail of this list, or {@code null} if this list is empty
     * @since 1.6
     */
    public E peekLast() {
        final Node<E> l = last;
        return (l == null) ? null : l.item;
    }

    /**
     * 获取列表前端元素并移除节点
     *
     * @return the head of this list, or {@code null} if this list is empty
     * @since 1.6
     */
    public E pollFirst() {
        final Node<E> f = first;
        return (f == null) ? null : unlinkFirst(f);
    }

    /**
     * 获取列表后端元素并删除节点
     *
     * @return the tail of this list, or {@code null} if this list is empty
     * @since 1.6
     */
    public E pollLast() {
         final Node<E> l = last;
         return (l == null) ? null : unlinkLast(l);
     }

     /**
     * 类似于栈的push操作，将元素入栈
     *
     * <p>This method is equivalent to {@link #addFirst}.
     *
     * @param e the element to push
     * @since 1.6
     */
    public void push(E e) {
        addFirst(e);
    }

    /**
     * 类似于栈的pop操作，将栈顶节点移除（出栈）
     *
     * <p>This method is equivalent to {@link #removeFirst()}.
     *
     * @return the element at the front of this list (which is the top
     *         of the stack represented by this list)
     * @throws NoSuchElementException if this list is empty
     * @since 1.6
     */
    public E pop() {
        return removeFirst();
    }

    /**
     * 移除列表中第一个与指定元素相同的节点
     *
     * @param o element to be removed from this list, if present
     * @return {@code true} if the list contained the specified element
     * @since 1.6
     */
    public boolean removeFirstOccurrence(Object o) {
        return remove(o);
    }

    /**
     * 移除列表中最后一个与指定元素相同的节点
     *
     * @param o element to be removed from this list, if present
     * @return {@code true} if the list contained the specified element
     * @since 1.6
     */
    public boolean removeLastOccurrence(Object o) {
        // 从列表的尾部开始往前遍历
        if (o == null) {
            for (Node<E> x = last; x != null; x = x.prev) {
                if (x.item == null) {
                    unlink(x);
                    return true;
                }
            }
        } else {
            for (Node<E> x = last; x != null; x = x.prev) {
                if (o.equals(x.item)) {
                    unlink(x);
                    return true;
                }
            }
        }
        return false;
    }
```
