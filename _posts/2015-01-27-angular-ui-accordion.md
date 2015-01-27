---
layout: post
title: Angular UI Accordion 源码分析
categories: [javascript]
tags: [angular, directive]
---

上一篇博文提及到吗[Angular UI][1]这个directive库，今天我们就来分析一下其中的__Accordion__。首先，从module的依赖关系看

{% highlight html %}

accordion->collapse->transition

{% endhighlight %}

accordion这个module依赖于另外两个module，它们分别负责：

 * accordion 负责建立模板，维护组状态
 * collapse 负责维护单体的开合效果
 * transition 负责提供动画服务

#### accordion：

整个module被拆分成__两个controller__和__四个directive__，其中包括：

 * accordion / AccordionController
 * accordionGroup / AccordionGroupController
 * accordionHeading
 * accordionTransclude

__accordion__只是一个入口，为其他directive提供controller（这里就是AccordionController）

__AccordionController__则是整个module的主控制器。它提供了三个方法：

 * `addGroup`，加入对新增accordionGroup的`$scope`引用
 * `removeGroup`，当某个accordionGroup被destroy时（抛出`$destory`事件），删除对其`$scope`的引用
 * `closeOthers`，当某一个accordionGroup打开时，对其他accordionGroup的状态进行处理

在`closeOthers`方法中它采用了一个读取参数的技巧：

{% highlight javascript %}

angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;

{% endhighlight %}

即检测属性中是否包含`closeOthers`，如果有，手动求值，这样处理有点像：

{% highlight javascript %}

scope： {
    closeOthers: '@'
}

{% endhighlight %}

但不用新开一个独立`scope`。如果没有包含`closeOthers`属性，则找到`config`中的`closeOthers`（`config`在`contant`中定义）。

__accordionGroup__才是整个module的主directive，在`scope`中提供了`isOpen`状态，用于保存自身的开合状态，和`toggleOpen`方法，用于改变自身的开合状态（其中`isOpen`状态会传递给collapse）。

__accordionHeading__算是一个语法糖类的directive，因为heading，本身是可以通过accordionGroup的`heading`属性来设置的，但只能设置为字符串类型，如果是需要样式的html标签，则无法满足。有了，accordionHeading这个directive，他就可以自身包含的子标签作为值传给accordionGroup。
而且这里它使用了一个小技巧来去除自身，即：

{% highlight javascript %}

{
    template: ’’,
    replace: true,
    transclude: true,
    link: function(scope, element, attr, accordionGroupCtrl, transclude) {
        accordionGroupCtrl.setHeading(transclude(scope, function() {}));
    }
}

{% endhighlight %}

也就是把自身替换成空字符串。但由于它启用了transclude，在link函数就可以通过第五个参数来获取到他的子标签。

__accordionTransclude__是和accordionHeading组合使用的directive，accordionHeading获得`heading`并传递给accordionGroup后，并没有通知accordionGroup的`scope`（即所谓这次更新不在域内），那么accordionTransclude就是用于检测这个`heading`的变化的，一旦发生变化，就去更新自己的内容。

好了，accordion就这样完了，擦，怎么就完了？？，它是怎么动的？？哈哈，不留心啊，文章开头就说了，accordion的单体开合效果是由collapse这个module来负责的。

#### collapse：

这个directive就简单直接很多了，总的一句就是通过监听`collapse`属性（通过字符串形式绑定到`scope`中的一个变量）的变化，分别调用`collapse`方法和`expand`方法。

其他的，就是组织参数传给transition来完成动画，Angular UI的动画，都是采用css3来完成，所以就没有什么好分析的了。


[1]: http://angular-ui.github.io/bootstrap/