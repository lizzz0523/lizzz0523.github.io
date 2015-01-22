---
layout: post
title: Angular执行顺序一瞥
categories: [javascript]
tags: [angular, directive]
---

开始接触__Angular__已经有两三周了，期间也有自己写一些简单的__directive__，但作为一个要成为优秀前端工程师的男人（哈哈哈哈哈哈哈哈哈哈），写__directive__库才是正道。

PS: [Angular UI Bootstrap][1] 是一个基于bootstrap的__directive__库，感觉还是比较牛逼的，羡慕嫉妒恨啊~~。

好了废话就不多说了，这篇博文，纯粹是做个实验记录，方便以后查看的。而实验的内容有两项

 * __directive__各方法（`controller`，`compile`，`pre-link`，`post-link`）执行的顺序
 * 所谓的__directive__独立scope到底是个啥

带着问题，马上开工。先来看看实验用代码，

HTML部分：

{% highlight html %}

<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
    <meta charset="UTF-8">
    <title>Angular</title>
</head>
<body>
    <div ng-controller="ACtrl"></div>
    <div ng-controller="BCtrl">
        <hello>
            <div ng-controller="CCtrl"></div>
        </hello>
    </div>
</body>
</html>

{% endhighlight %}

JS部分：

{% highlight javascript %}

angular.module('app', [])

.directive('hello', [function() {
    return {
        restrict: 'E',
        scope: {},
        controller: 'HelloCtrl',
        compile: function() {
            console.log('compile: Hello');
            return {
                pre: function() {
                    console.log('pre-link: Hello');
                },
                post: function() {
                    console.log('post-link: Hello');
                }
            }
        }
    }
}])

.controller('HelloCtrl', ['$scope', function($scope) {
    console.log('controller: Hello');
}])

.controller('ACtrl', ['$scope', function($scope) {
    console.log('controller: A');
}])

.controller('BCtrl', ['$scope', function($scope) {
    console.log('controller: B');
}])

.controller('CCtrl', ['$scope', function($scope) {
    console.log('controller: C');
}]);

{% endhighlight %}

实验结果：

![result][2]

实验结论：

__Angular__的整个执行周期是采取，先编译（`compile`），再链接（`link`）的优化策略，这是由于对所有指令，`compile`只会执行一次，而`link`则会执行多次。这里有必要举个栗子来说明一下。看代码：

{% highlight html %}

<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
<meta charset="UTF-8">
<title>Angular</title>
</head>
<body>

    <hello></hello>
    <hello></hello>

</body>
</html>

{% endhighlight %}

这里是两个指令，个指令，指令，令...

对的，这里是两个指令，只是他们都对应同一个指令定义。那很多同学就不理解了，`compile`只执行一次，`link`则执行多次，这个多次是啥意思呢？，仔细想想？再想想。想不到？哈哈哈，其实是`ng-repeat`（或者这一类，会复制dom，修改dom的指令）。同学们只要记住，指令，是给__Angular__看的，浏览器不认识，而dom才是给浏览器看的。在__Angular__里面，指令是给`compile`看的，`compile`会把指令转换成对应的dom，而换成后的dom会丢给`link`来做处理，所以`link`就有可以因为dom被复制或修改而需要执行多次）。

好了，我们继续。现在我们已经知道了`compile`和`link`的区别以及执行顺序了，那接下来，就要深入了解__Angular__的链接（`link`）过程了。

首先，我们需要搞清楚链接，到底是链接啥？在__Angular__里面，这个链接的过程，其实是把dom和scope链接在一起了，其中dom是由`compile`过程产生的，而scope实际上是由`controller`产生的：

![link][3]

从上图（有点丑）可知，整个链接的过程可以分为`pre-link`和`post-link`两个过程。为了能在`pre-link`前获得scope，__Angular__实际上是在`pre-link`前已经创建了`controller`，然后把在`controller`中已经初始化的scope，和在`compile`中转换好的dom，丢给`pre-link`做第一次链接，这个过程会从`ng-app`节点一直向下执行，直到dom树的枝叶。这时候，__Angular__又再次从枝叶出发，把scope和dom丢给`post-link`做第二次链接，一直到`ng-app`节点，整个链接过程就完成了。

所以从实验结果我们可以看出，`compile`函数是首先执行的，比任意一个`controller`都早，然后是`controller`，接着才是`pre-link`，最后再回朔调用`post-link`。

未完待续



[1]: http://angular-ui.github.io/bootstrap/
[2]: {{ site.url }}/images/post/angular-execute-order-20150122-001.png
[3]: {{ site.url }}/images/post/angular-execute-order-20150122-002.png