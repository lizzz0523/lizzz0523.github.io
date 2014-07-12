---
layout: post
title: Zoe 上线啦！！！
categories: [javascript]
tags: [zoe]
---

经过将近3个月的开发，推倒，重来，再推倒，再重来，终于终于 __Zoe__的第一版本要上线啦！！！猛戳 [Donwload][4]


__Zoe__ 是一个基于$_B（[jquery][1]，[underscore][2]，[backbone][3]）开发的组件库，主要用于满足设计师制作专题页面时的特效需求。


#### 对象

__Zoe__的目标对象主要是设计师，这是由于__Zoe__在开发初期就定立了

1. 零代码
2. 按需加载
3. 自定义样式

三大目标。这样设计师在工作时就可以专心于设计，而将页面特效的工作交给__Zoe__。


#### 零代码

零代码并不是指完全不需要写代码，而是，把js代码以配置的方式写在了html标签中。举个例子，在专题制作时，经常会用到Slider特效做图片切换，那么使用__Zoe__，你只需在html中作如下配置：

{% highlight html %}

    <div class="my_slider" data-zoe="slider[nav, auto, loop, hover]">
        <p class="my_slider_item">
            <img src="path/to/pic1.jpg" />
        </p>
        <p class="my_slider_item">
            <img src="path/to/pic2.jpg" />
        </p>
        <p class="my_slider_item">
            <img src="path/to/pic3.jpg" />
        </p>
        <p class="my_slider_item">
            <img src="path/to/pic4.jpg" />
        </p>
        <p class="my_slider_item">
            <img src="path/to/pic5.jpg" />
        </p>
    </div>

{% endhighlight %}

你只需在某个div标签中，按照`name[param1=value1, param2=value2, ...]`格式配置`data-zoe`属性，则__Zoe__内部的扫描程序，就会自动获取到这些配置信息，并对Slider组件进行初始化。

而__Zoe__另一项_零代码_功能是View Binding，即__Zoe__内部，自动让不同的组件之间产生联动，同样，你只需要简单的配置一下html标签，例如，你需要让一个Menu组件与一个Panel组件产生联动：

{% highlight html %}

    <div class="my_tab" data-zoe="menu[current=item-1]" data-for="panel-1">
        <a href="#item-1">Tab-1</a>
        <a href="#item-2">Tab-2</a>
        <a href="#item-3">Tab-3</a>
    </div>
    <div class="my_panel" data-zoe="panel[current=item-1]" data-id="panel-1">
        <p id="item-1" class="my_panel_item">
            <img src="path/to/pic1.jpg" />
        </p>
        <p id="item-2" class="my_panel_item">
            <img src="path/to/pic2.jpg" />
        </p>
        <p id="item-3" class="my_panel_item">
            <img src="path/to/pic3.jpg" />
        </p>
    </div>

{% endhighlight %}

你只需要在控制组件上添加`data-for`属性，与被控制组件上的`data-id`属性对应起来，就可以产生组件间联动了。

但可能有人会疑问，如果整个程序都被自动执行，那当项目需要做一些自定义的效果时，不就没有办法了吗？其实这个问题，很好解决，在之后的文字我会详细说明。


#### 按需加载

按需加载，主要是帮助设计师在使用__Zoe__时，不需要手动去添加与组件相应的_script标签_和_link标签_。为了做到这一点，__Zoe__是使用了seajs来组织的，这样有两点好处：

1. 使得整个组件库以模块的形式组织起来，管理和维护都更加方便了，毕竟组件库还是需要不断的扩展才有意义。
2. seajs只会把页面中使用到的组件，异步加载进来，这样就不用每次都把整个组件库都载入，加快页面的下载速度。

由于使用了seajs，因此如果你要在页面中使用__Zoe__，那么你就需要在body标签结束之前，加入如下代码：

{% highlight html %}

    <script type="text/javascript" src="zoe/sea.js"></script>
    <script type="text/javascript" src="zoe/sea-config.js"></script>

{% endhighlight %}

在_sea-config.js_文件中，有这么一句：

{% highlight javascript %}

    sea.use('zoe');

{% endhighlight %}

这里就是程序的开端，__Zoe__是默认以_zoe.js_作为程序入口的，如果有人需要在页面中加入自定义的一些效果时，你只需要修改这个程序入口为你自己编写的sea模块，并且在这个自定义的sea模块中，引入_zoe.js_即可，例如：

{% highlight javascript %}

    /*
        这里是sea-config.js文件,
        使用自定义的app.js作为程序的入口
    */
    sea.use('app');


    /* 
        这里是app.js文件
    */
    define(function(require, exports, module) {
        var zoe = require('zoe');
    });

{% endhighlight %}

而且这个require进来的`zoe`对象提供了几个有用的接口，例如判断所有__Zoe__组件都初始化完毕：

{% highlight javascript %}

    /* 
        这里是app.js文件
    */
    define(function(require, exports, module) {
        var zoe = require('zoe');
        zoe(function() {
            // 这里的回调就是当所有组件都初始化完毕才执行的
        });
    });

{% endhighlight %}

又例如，你需要寻找某个组件，你只需要在组件对应的div标签上添加`data-id`属性，然后利用`zoe`对象的`find`方法：

{% highlight javascript %}

    /* 
        这里是app.js文件
    */
    define(function(require, exports, module) {
        var zoe = require('zoe');
        zoe(function() {
            var view = zoe.find('view-id');
        });
    });

{% endhighlight %}

这样，你就能与__Zoe__进行交互了。


#### 自定义样式

__Zoe__本身不会对设计师的设计产生过多的限制。因此，所有__Zoe__组件，除了最基本的，与特效相关的样式以外，不会添加如何样式，组件中的内容如何显示，全靠设计师自己编写css代码来完成。


[1]: http://jquery.com/
[2]: http://underscorejs.org/
[3]: http://backbonejs.org/
[4]: https://github.com/lizzz0523/Zoe