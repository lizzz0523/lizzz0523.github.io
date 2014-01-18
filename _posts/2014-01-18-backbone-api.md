---
layout: post
title: Backbone API 中文翻译（持续更新）
categories: [javascript, backbone]
tags: [backbone api translation]
---


由于英文同记性都比较差，所以还还是决定用这个笨方法来学习backbone——__翻译Backbone API__


#### Model

_Models_是所有js程序的程序部件，其中包含了需要操作的数据，以及大部分与操作这些数据相关的逻辑：转换，验证，属性计算，以及可访问性控制等。如果你要使用_Backbone.Model_，首先，你需要用你的业务逻辑来扩展它。当然，_Model_本身已经提供了一组基本的功能来完成数据的修改。

下面是一个随便编写的例子，用来说明如果基于你的业务逻辑来定制model，设置它的属性，以及当某一个属性发生变化时，触发对应的change事件。当第一次运行这些代码以后，`sidebar`这个变量在你的console里就会变得可用，这样，你就可以按照你的想法随意的摆弄它。

{% highlight javascript %}

    var Sidebar = Backbone.Model.extend({
        promptColor: function() {
            var cssColor = prompt("Please enter a CSS color:");
            this.set({color: cssColor});
        }
    });

    window.sidebar = new Sidebar;

    sidebar.on('change:color', function(model, color) {
        $('#sidebar').css({background: color});
    });

    sidebar.set({color: 'white'});

    sidebar.promptColor();

{% endhighlight %}