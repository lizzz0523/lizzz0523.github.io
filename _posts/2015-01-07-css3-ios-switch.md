---
layout: post
title: 纯CSS实现IOS开关模拟
categories: [css]
tags: [css, ios, switch]
---

不废话先上效果图

![demo][1]

请注意，这个不是iPhone截屏，而是使用纯CSS实现的模仿IOS开关效果图
![gif][2]
![gif][2]
![gif][2]
![gif][2]
![gif][2]
![gif][2]

为了模拟出开关的不同状态，我们必须能记录当前开关状态，通常我们会使用JS来达到这样的目的，而纯CSS，你该如何是好？

其实使CSS能记录状态的核心方法，是利用__label__触发__checkbox__状态发生反转，然后根据__checkbox__的不同状态，利用CSS3的__伪类__以及__通用兄弟选择器（~），__来使__label__的样式方式变化。

先来看看HTML部分

{% highlight html %}

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>IOS SWITCH</title>
    </head>
    <body>
        <span class="ui-check">
            <input id="check" type="checkbox" />
            <label for="check"></label>
        </span>
    </body>
    </html>

{% endhighlight %}

可以看到一个checkbox与一个label被包含在同一个父元素中（这里是span.ui-check），而且利用__for__与__id__进行了绑定，这样当点击label的时候，checkbox的状态就会发生相应的反转。

再看看CSS部分的代码

{% highlight html %}
    .ui-check {
        display: inline-block;
        width: 40px;
        height: 24px;
        vertical-align: top;
    }

    .ui-check label {
        position: relative;
        display: block;
        padding: 1px;
        border-radius: 24px;
        height: 22px;
        background-color: #eee;
        cursor: pointer;
        
        // 这里设置user-select为none是防止拖拽选中label
        -webkit-user-select: none;
        -webkit-transition: all 0.3s ease;
    }

    .ui-check label::before {
        content: '';
        display: block;
        border-radius: 24px;
        height: 22px;
        background-color: white;

        -webkit-transform: scale(1, 1);
        -webkit-transition: all 0.3s ease;
    }

    .ui-check label::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -11px;
        margin-left: -11px;
        display: block;
        border-radius: 100%;
        width: 22px;
        height: 22px;
        background-color: white;
        box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.08);

        -webkit-transform: translateX(-9px);
        -webkit-transition: all 0.3s ease;
    }

    .ui-check input[type=checkbox] {
        // 将原来的checkbox隐藏起来，界面上只显示label
        display: none;
    }

    .ui-check input[type=checkbox]:checked~label {
        // 修改label的底色为高亮的绿色
        background-color: #4cda64;
    }

    .ui-check input[type=checkbox]:checked~label::before {
        -webkit-transform: scale(0, 0);
    }

    .ui-check input[type=checkbox]:checked~label::after {
        -webkit-transform: translateX(9px);
    }

{% endhighlight %}

可以看到，利用CSS伪类:checked可以选中checkbox的不同状态，然后根据不同的状态，对label进行了不同的样式设置

整个label分为三层
 
+ label本身是负责显示底色（灰色和高亮的绿色）
+ label::before负责做一层白色的遮罩，来模拟ios开关效果
+ label::after负责开关的那个圆形凸起（记得加box-shadow来提高逼格哦）

<br />
动画部分采用的是CSS3的transition动画。

最后习惯性的放个彩蛋

![code][3]

以上~~


[1]: {{ site.url }}/images/post/css-ios-switch-20150107-003.png
[2]: {{ site.url }}/images/post/css-ios-switch-20150107-002.gif
[3]: {{ site.url }}/images/post/css-ios-switch-20150107-001.png