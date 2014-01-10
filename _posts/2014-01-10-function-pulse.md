---
layout: post
title: 脉冲式状态检测
---


脉冲式状态检测
==============

在web编程时，我们经常要做的一件事就是状态检测。例如：

    {% highlight javascript %}
    if(isWeekend){
        play();    
    }else{
        work();
    }
    {% endhighlight %}

在这里，'isWeekend'就是状态变量，我们需要通过检测这个状态变量来判断，接下来所需要完成的动作，在这里是'play()/work()'

有了状态检测，接下来，我们需要面对的一件事，就是什么时候进行状态检测，这时我们就需要引入一个叫做触发器的概念。

什么是触发器呢，说简单点就是触发状态检测的原因。
例如，当你点击某个按钮时，我们需要检测当前是否周末（'isWeekend'），然后弹出信息告诉我们到底是去玩还是去玩（哈哈！）
这样，“点击按钮”，就成为检测状态变量isWeekend的原因，也就是说是状态检测的触发器。

那么我们通常在编程时，会遇到的触发器有那些呢？
_click，dbclick，mousedown，mouseenter，mouseover，mouseout，mouseleave，mousewheel，drag，swipe，tap，resize，focus，blur，change，timeout，interval......_
（这里补充一点：由于我们讨论的是，什么时候进行状态检测，这是一种异步的触发机制，所以我们讨论的触发器也是异步的触发器）

当然除了上面这些，还有很多其他的触发器（例如ajax请求是的'readystatechange'等等）

现在我们尝试讨论一下，触发器与代码实际执行之间的问题。
下面是一个触发器（click事件）和与之对应的状态检测的时间流：



可以看出来，由于浏览器的单线程和基于事件流的机制，触发器触发的时间与实际的状态检测时间总有一定的延时，而且这个延时并不是稳定的（如同种黄色的部分）。