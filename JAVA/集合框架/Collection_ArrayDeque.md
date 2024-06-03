# Stack & Queue (采用 ArrayDeque 实现)

Java 里有一个叫做 Stack 的类，却没有叫做 Queue 的类(它是个接口名字)。当需要使用栈时，Java 已不推荐使用 Stack，而是推荐使用更高效的 ArrayDeque；既然 Queue 只是一个接口，当需要使用队列时也就首选 ArrayDeque 了(次选是 LinkedList)。

## Queue

与 LinkedList 实现方式类似，ArrayDeque 实现了 Queue 的六个方法，一组是抛出异常的实现；另外一组是返回值的实现(没有则返回 null)。

|      | 抛出异常  | 返回值   |
| ---- | --------- | -------- |
| 插入 | add(e)    | offer(e) |
| 移除 | remove()  | poll()   |
| 检查 | element() | peek()   |

## Deque

`Deque`是"double ended queue", 表示双向的队列，继承自`Queue`接口。由于 Deque 是双向的，所以可以对队列的头和尾都进行操作，它同时也支持两组格式，一组是抛出异常的实现；另外一组是返回值的实现(没有则返回 null)，共 12 个方法。
