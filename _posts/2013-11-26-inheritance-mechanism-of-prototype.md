---
layout: post
title: Prototype 的类创建与继承机制
categories: [javascript]
tags: [prototype, inheritance, code analysis]
---


在__Prototype__中，有这样一个用于创建其他类的工具包`Class`。而其中，最主要的是他的`Class.create()`方法。该方法的api为`Class.create([superclass][, methods...])`。


#### 源码分析

翻开源码，可以大致发现，它和_Backbone_的`extend`机制大同小异。主要有一下这几步：

1. 调整参数，如果第一个参数为函数则，`parent = arguments.shift()`
2. 创建构造函数`klass`（当中执行了`this.initialize`方法）
3. 在`klass`中继承`parent`，即`subclass.prototype = parent.prototype`，`klass.prototype = new subclass()`
4. 最后将剩余的参数中所有的方法都加入到`klass.prototype`中


#### 与Backbone的区别

这里和_Backbone_的`extend`不同之处，就只有`klass`构造函数本身。

_Backbone_中需要通过传入`constructor`来自定义构造函数，缺省时，则使用`parent.apply(this, arguments)`代替。而__Prototype__中，则不允许自定义，或者自定义是通过`this.initialize`函数来实现。

而在__Prototype__中值得注意的时，__Prototype__会在`klass`中加入`addMethods`这个静态方法，该方法主要是用于在`klass.prototype`中加入新的方法（有点像_Underscore_里的`extend`函数）

之所以说这个方法值得关注，是因为它里面做了两个有趣的处理

1. 处理了_IE_中的_dontenum bug（无法枚举漏洞）_，即在使用`for-in`循环时，`toString`和`valueOf`属性无法被枚举，由于在取出属性的`key`值时使用的就是`for-in`循环，所以__Prototype__在遇到_dontenum bug_时，就手工的在`keys`中加入`toString`和`valueOf`属性。
2. __Prototype__为了能在子类中使用父类的方法，它允许方法的第一个参数为`$super`，在遇到这样的参数时，__Prototype__首先找到父类的方法`parent[property].apply(this, arguments)`，然后作为第一个参数传入子类的方法中代替`$super`。
