---
layout: post
title: 有限状态机FSM
categories: [javascript]
tags: [finite state machine, fsm]
---


在之前的阅读[文章][1]的时候，无意间认识了__有限状态机__这个概念，当时觉得好像挺高深的，然后就没有然后了。

到了最近，在完成公司的项目时，学习了两样做特效时非常重要的技术

1. 是要学会欺骗观众的眼睛（fake）
2. 是要学会对时间的管理（timing）

在就在学习如何控制timing的时候，我发现在js里面，要控制好timing，就必须在手中掌控异步操作的主动权。而回调的组织，就是你掌握主动权的武器。

而在实践中我发现了三种组织回调的模式


#### 基于事件的回调

这种模式的回调是基于同一个事件_并行_触发的回调，适用于处理动画的起始触发


#### 基于列队的回调

这种模式的回调是基于同一列队_串行_触发的回调，适用于控制同一个效果中，动画先后顺序的处理


#### 基于状态转换的回调

这种模式的回调是处于一种受限的状态中，即回调的触发除了与当前时间点有关，还与_当前的状态（即过去所有的历史）_有关，适合于一些组件特效。

而要实现这一种模式的回调，就需要__有限状态机（FSM）__


#### FSM的实现方法

在翻阅资料 [[1]][2]，[[2]][3]，[[3]][4]，[[4]][5]，[[5]][6] 后，我大概了解了FSM的实现方法。

具体而言就是在FSM内部保存一个`map`，这个`map`就是维基百科里提到的状态表。通过这个`map`我们可以知道某个动作会使当前的状态跳转到一下个状态。而在状态转换的过程中只需要事件和列队就可以完成。

state1 -----> leave:state1
  
-----------> transit(asyn or sync)
  
state2 -----> enter:state2

这样的转换。

[1]: http://www.ruanyifeng.com/blog/2013/09/finite-state_machine_for_javascript.html
[2]: http://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA
[3]: http://ued.taobao.org/blog/?p=6178
[4]: https://github.com/jakesgordon/javascript-state-machine
[5]: http://codeincomplete.com/posts/2011/8/19/javascript_state_machine_v2/example/
[6]: http://www.cnblogs.com/Random/p/3343074.html
