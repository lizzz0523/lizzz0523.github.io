---
layout: post
title: isNaN和Number.isNaN的区别
categories: [javascript]
tags: [NaN, isNaN, Nubmer.isNaN]
---


由于在js中有一个非常特殊的数，它就是`NaN`，它特殊到自己也不等于自己，就是说：

{% highlight javascript %}

    NaN == NaN;  // 或者
    NaN === NaN; // 都会返回false

{% endhighlight %}

所以在早期的js中提供了`isNaN`这样一个全局函数来帮助我们判断一个数是否是`NaN`。


#### 问题

但很遗憾，这个全局的isNaN并不没有很好的完成它的任务。它除了

{% highlight javascript %}

    isNaN(NaN);        // true
    isNaN(Number.NaN); // true
    isNaN(0 / 0);      // true

{% endhighlight %}

之外

{% highlight javascript %}

    isNaN(undefined); // true
    isNaN({});        // true

{% endhighlight %}

甚至

{% highlight javascript %}

    isNaN('abc'); // true

{% endhighlight %}

可见这个全局的`isNaN`函数，会先对参数进行强制转型，在转型后，如果得到的是`NaN`则判断为`true`。


#### 解决

这不符合我们大家的预期，所以在ECMAScript 6中，终于重新加入了新的`Number.isNaN`方法。该方法只有在前三种情况中会返回true。

当然为了兼容，我们需要在不支持ECMAScript 6的浏览器中手动纠正`isNaN`方法。其实思路很简单，因为`NaN`的定义就是一个自己不等于自己的数字，所以

{% highlight javascript %}

    type(obj) == 'number' && obj !== obj;

{% endhighlight %}

就这么一句就可以检查该参数是否`NaN`了,鼓掌，撒花。


#### 补充

最后补充一点，由于上面提到`isNaN('abc')`或者`isNaN('45abc')`均返回`true`，这是由于js在对字符串进行强制转型的时候，会忽略里面包含的数字。而在某些使用场合，我们会希望`'abc'`对应`true`，`'45abc'`对应`false`以区分两者。这时我们就可以结合`isNaN`函数和`parseFloat`函数。

先利用`parseFloat`函数进行字符串强行转换成数字。由于

{% highlight javascript %}

    parseFloat('abc');   // NaN
    parseFloat('45abc'); // 45

{% endhighlight %}

然后再利用`isNaN`函数，即

{% highlight javascript %}

    isNaN(parseFloat('abc'));
    isNaN(parseFloat('45abc'));

{% endhighlight %}

这样就可以区分一个字符串是否可以转换成数字了。
