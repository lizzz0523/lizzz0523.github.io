---
layout: post
title: Zero I/O 源码分析
categories: [javascript]
tags: [blog, code analysis]
---


经过将近一个月的磨蹭，我的博客终于完整的迁移到github page上了。我这样做主要有几个原因：

1. 我原来的博客是使用wordpress建立起来的，但我是一个前端，而且是个菜鸟，虽然也会一点点的php，但要我花太多的时间和精力来学习如何写wordpress主题，我觉得有点喧宾夺主，毕竟我只是想有空的时候可以写写博客，记录一些工作上的想法，笔记等。
2. 那有同学可能会说，如果只是写写博客，那去163建个blog就好了。但同样我是一个前端，偶尔还是希望能炫技一下，装一下13，github page给我的自由度比较大，基本上整个博客的每一部分都可以自己来控制，这正合我意。

好了废话说完了，这篇博文主要是记录一下，建立github page过程中我的一些经验和想法。

首先说明一下，github page其实就是github上的一个repository，只是这个repo比较特殊，它的名字必须以`{{ username }}.github.io`这样的格式给出，其中username是你在github上的用户名。所以，我的整个博客，大家都可以在我的[github][1]上找到[源码][2]。


#### Jekyll

由于github page只是一个repo，基本上是，你丢上去什么，它就显示什么，例如你是个设计师，你想做个作品集，那就直接做好一个网站，commit到github上就可以了。然而如果你是用来做博客，每次写博文都要重新建一个html页，那也未免太麻烦了，而github非常给力的，给我们提供了__[Jekyll][3]__这样一个工具。

![jekyll][4]

那__Jekyll__到底是一个什么东东呢？

__Transform your plain text into static websites and blogs.__

这个是__Jekyll__官网上的对自身的描述，简单来说，__Jekyll__就是一个模板引擎，可以把_Markdown_ (or _Textile_), _Liquid_等语法写成的文档，转化成html输出。而且__Jekyll__还会给你提供_文章分类_，_标签管理_，_文章分页_等博客常见的功能。 

这里我就不再叙述如何去建立以及配置__Jekyll__了，大家可以直接去它的[官网][3]，或看看阮一峰写的这篇[文章][5]


#### AJAX

作为一个菜鸟前端，又爱装13的，如果只是写写模板就未免太丢脸了。_SPA_时代，_AJAX_横行。有事没事发一个_XHR_请求是标配，单在__Jekyll__没有数据库，我们应该向哪里发请求呢？

大师们（不是我）发现，其实__Jekyll__不单只可以输出html文件，只要是text类型的，它都可以输出，那当然也就包括xml或者json这些常见的数据文件咯。

所以我也试着玩玩，我在data文件夹下，建了几个这个的数据文件，以posts.json文件为例：

{% highlight javascript %}

    ---
    layout: nil
    ---

    [{% for post in site.posts %}
        {
            "title"   : "{{ post.title }}",
            "url"     : "{{ site.url }}{{ post.url }}",
            "excerpt" : "{{ post.excerpt | escape | strip_newlines }}",
            "date"    : "{{ post.date | date_to_string }}",
            "tags"    : [{% for tag in post.tags %}
                            "{{ tag }}"{% if forloop.last == false %},{% endif %}
                        {% endfor %}],
            "categories"    : [{% for category in post.categories %}
                            "{{ category }}"{% if forloop.last == false %},{% endif %}
                        {% endfor %}]
        }{% if forloop.last == false %},{% endif %}
    {% endfor %}]

{% endhighlight %}

注意，要输出json格式，layout必须设置成nil。

接下，只要我们在jquery中轻轻的调用一下`getJSON`方法：

{% highlight javascript %}

    $.getJSON('http://lizzz0523.github.io/data/posts.json?' + Math.random(), function(data) {
        /*...*/
    });

{% endhighlight %}

马上就高大上了有木有。


#### 百度统计

为了知道装13有木有效果，一般站长都会在网站上添加百度统计等第三方分析工具。

__Jekyll__上安装百度统计和wordpress上是大同小异的。具体做法如下：

_第一_：在_includes文件夹下写入statistics.html模块：

{% highlight html %}

    <!-- blog statistics start -->
    <div style="display:none">
        <script type="text/javascript">
            var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
            document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F3844bdea852ce208f30397ea72bba90e' type='text/javascript'%3E%3C/script%3E"));
        </script>
    </div>
    <!-- blog statistics end -->

{% endhighlight %}

_第二_：在layouts文件夹下的default.html模板中把statistics.html模块引入：

{% highlight html %}

    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>{{ site.name }}{% if page.title %} | {{ page.title }}{% endif %}</title>
    </head>
    <body>

    <div class="canvas">

    {% include header.html %}

    <!-- page content start -->
    <div class="page_content">

    {{ content }}

    </div>
    <!-- page content end -->

    {% include footer.html %}

    </div>

    <!-- 引入 statistics.html 模块 -->
    {% include statistics.html %}

    </body>
    </html>

{% endhighlight %}

具体位置，就自己决定把。未免她影响到我其他代码的运行，我是把它放在了body标签结束之前才添加的。


[1]: https://github.com/lizzz0523
[2]: https://github.com/lizzz0523/lizzz0523.github.io
[3]: http://jekyllrb.com/
[4]: {{ site.url }}/images/post/blog-code-analysis-20140617-001.png
[5]: http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html