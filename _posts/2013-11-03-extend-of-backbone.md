---
layout: post
title: Backbone extend 方法
categories: [javascript]
tags: [backbone, extend, inheritance, code analysis]
---


最近受到文章[http://code-magazine.com/Article.aspx?quickid=1312061][1]的鼓舞，加上新的项目又要开始了，需要开发基于mv*模式的webapp。所以就从demo着手，开始了__Backbone__之旅。

其实很早以前就接触过__Backbone__，但都只是处于观望状态，毕竟没有实际项目support是很难有决心专研新东西的。而现在终于有机会了，心情还是挺愉悦的。哈哈，废话不多说，直接进入正题。

我想大多数开发__Backbone__程序的前端，都是从`Backbone.View.extend`方法开始的，我也不例外。其实我们对_extend模式_并不陌生，在_jQuery_里写plugin就会用到_extend模式_。但毕竟_extend模式_是在js里写oop的核心，所以我还是决定钻进__Backbone__的源码里一探究竟。（顺道提醒，__Backbone__的`extend`函数式在源码最后才添加上去的，所以要看的小伙伴，直接拉到最低端去看就好了）


### API

首先我们看看__Backbone__里`extend`函数的_api_

{% highlight javascript %}

    extend = function(protoProps, staticProps){...}

{% endhighlight %}

可以看出，`extend`函数，是接受两种属性的专递的，简单来说就是：

{% highlight javascript %}

    var klass = function(){...}

    // staticProps
    klass.prop1 = 'staticProp1';
    klass.prop2 = 'staticProp2';

    // protoProps
    klass.prototype.prop1 = 'protoProp1';
    klass.prototype.prop2 = 'protoProp2';

{% endhighlight %}

这样，我们就可以清楚的看出两种属性的区别了。


#### 工作流程

再看看源码，发现，__Backbone__的`extend`函数，其实做了四件事：

##### 第一

1. 创建子类构造函数`child`
2. 如果`protoProps`中包含有`constructor`的话，就直接使`child = protoProps.constructor`
3. 如果没有，就使用`parent`作为构造函数`child = function(){ return parent.apply(this, arguments) }`

##### 第二

1. 将`statisProps`中的属性直接复制到`child`上

##### 第三

1. 创建一个临时的类`Surrogate`（`Surrogate.prototype = parent.prototype`），用于将父类`parent`的原型（`prototype`）继承到`child.prototype`的原型链上游（`child.prototype = new Surrogate()`），并且隔离了`parent`构造函数中直接使用`this`传递进去的属性（那些属性，是在`child`类的构造函数中添加的）。

##### 最后

1. 然后将`protoProps`中的属性都复制到`child.prototype`中。

当然，为了以后引用方便，__Backbone__在`child.__super__`中保存了`parent.prototype`。


这就是__Backbone__的_extend模式_，较为充分的考虑了js原型链的特性，值得学习学习。


[1]: http://code-magazine.com/Article.aspx?quickid=1312061