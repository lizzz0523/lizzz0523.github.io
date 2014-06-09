---
layout: post
title: Trello API 中文翻译
categories: [translation, trello]
tags: [trello, api, translation]
---


最近在留意一些国外的一些初创的企业，留意到一个非常不错的任务管理应用__Trello__，这是他们的官网：[https://trello.com/][1]

而且重要的是，他们对开发者开放了_API_，所以决定，给大家翻译翻译，这是他们英文文档的地址：[https://trello.com/docs/][2]

以下是我的翻译：


#### 简介

__Trello__提供了一组简单的符合_RESTful_风格的web API，使得每一样你需要与其进行交互的资源（例如一张_card_，一个_board_或者一个_member_）都对应了一个唯一的URI。例如，假设你需要使用我们的API去获取有关Trello Development board的相关信息，那么你可以访问以下URI：

{% highlight javascript %}

    https://api.trello.com/1/boards/4d5ea62fd76aa1136000000c

{% endhighlight %}

_注意:_

1. 所有API都是向https://api.trello.com发送请求的
2. API中的/1代表的是API的版本号
3. API中的/boards表示我们正在访问Trello中的boards集合
4. API中的/4d5ea62fd76aa1136000000c则表示我们需要交互的board的`id`（的确，这个`id`也是整个URI的其中一部分）

利用这些Trello URI，你可以完成的最简单的事是获取（GET）对应的资源（当通过HTTP使用RESTful风格的API，你可以使用HTTP的GET方法来读取所需的资源）

但如果你直接访问上述URI（`https://api.trello.com/1/boards/4d5ea62fd76aa1136000000c`），例如你直接把它复制粘贴到浏览器的地址栏，你并不会得到任何的数据；相反，你会收到一个invalid key的错误（以401并未授权的形式）。这是由于所有向Trello API的发送的请求都需要包含一个_application key_，Trello会使用这个_key_来识别来自不同应用的请求。


#### 获取你的Application Key

要获取你的_application key_，首先你需要登录Trello，然后访问：[https://trello.com/1/appKey/generate][3]。

这样属于你的32位_application key_就会放在第一个框框中。在之后的例子当中，我们假设你的_application key_为：

{% highlight javascript %}

    substitutewithyourapplicationkey

{% endhighlight %}

如果你发出一个GET请求，你需要在URL的参数部分中，包含你的_application key_。

例如，你访问`https://api.trello.com/1/boards/4d5ea62fd76aa1136000000c?key=substitutewithyourapplicationkey`，这时，你就不会在遇到那个invalid key错误了；相反，你会得到以下这样的JSON数据

{% highlight javascript %}

    {
        "id":"4d5ea62fd76aa1136000000c",
        "name":"Trello Development",
        "desc":"Trello board used by the Trello team to track work on Trello.  How meta!\n\nThe development of the Trello API is being tracked at https://trello.com/api\n\nThe development of Trello Mobile applications is being tracked at https://trello.com/mobile",
        "closed":false,
        "idOrganization":"4e1452614e4b8698470000e0",
        "url":"https://trello.com/board/trello-development/4d5ea62fd76aa1136000000c",
        "prefs":{
            "voting":"public",
            "permissionLevel":"public",
            "invitations":"members",
            "comments":"public"
        }
    }

{% endhighlight %}

如果你希望在响应数据中包含更多的信息，你可以在请求中加入更多的参数。例如，你希望同时获取在Trello Development Board中所有_open lists_和所有_open cards_的话，你可以访问：

{% highlight javascript %}

    https://api.trello.com/1/boards/4d5ea62fd76aa1136000000c?key=substitutewithyourapplicationkey&cards=open&lists=open

{% endhighlight %}

如果你希望读取你自己的_board_，你首先要找到它的`id`（最直接的方法是到你的__Trello__，然后从某个_board_对应的URL中复制它），然后发送请求：

{% highlight javascript %}
    
    // 假设你自己的board对应的id为substitutewiththeboardid
    https://api.trello.com/1/boards/substitutewiththeboardid?key=substitutewithyourapplicationkey

{% endhighlight %}

但除非你的_board_是对外公开的（就像Trello Development Board一样），否则，你也会收到一个401的未被授权错误。只有当__Trello__的API得知你获得了访问该资源的权限时，才会允许你获取这些私有的_board_。那么如何让__Trello__的API知道你已经获得权限呢？这是你需要一个_token_，一个用户交给你的，允许你读取（甚至修改）他的信息的标识。

_注意：_

`application key`只能让__Trello__识别出去来自哪一个应用的请求，但它无法告诉__Trello__是哪一位用户在使用这个应用。例如，即使你在使用自己的_application key_，你仍然需要获得你自己的_token_，才能继续访问你自己的私有_boards_。


#### 从用户那获取Token

如果你需要在客户端获得授权，你可以阅读[Authorizing a Client][4]，如果你是使用_OAuth_方式进行授权，你可以阅读[Authorizing via OAuth][5]。

你可以通过跳转URL到__Trello__的授权页面来获取用户的_token_。例如，你希望获取一个30天以内只读的权限，你可以访问：

{% highlight javascript %}

    https://trello.com/1/authorize?key=substitutewithyourapplicationkey&name=My+Application&expiration=30days&response_type=token

{% endhighlight %}

如果你希望获取一个无限期的只读权限，你可以访问：

{% highlight javascript %}

    https://trello.com/1/authorize?key=substitutewithyourapplicationkey&name=My+Application&expiration=never&response_type=token

{% endhighlight %}

如果你希望获得一个1天的读写权限，你可以访问：

{% highlight javascript %}

    https://trello.com/1/authorize?key=substitutewithyourapplicationkey&name=My+Application&expiration=1day&response_type=token&scope=read,write

{% endhighlight %}

如果用户授权给你，页面会返回一个64位的_token_，通过复制粘贴你的应用就会获得这个_token_。这样，只要你把这个_token_加入到你的请求当中，那么你就可以读取到那些只有该用户才能看到的_board_。

而且，一旦你获取了用户的_token_，那么你就可以获取该用户的所有信息。例如，你希望获取用户的_member_记录，你可以访问：

{% highlight javascript %}

    // 假设你获得用户的token为substitutethispartwiththeauthorizationtokenthatyougotfromtheuser
    https://trello.com/1/members/my/cards?key=substitutewithyourapplicationkey&token=substitutethispartwiththeauthorizationtokenthatyougotfromtheuser

{% endhighlight %}

除此以外，你还可以访问很多很多不同的数据。当然，要用户自己去复制粘贴一个_token_到你的应用并不是一个好的方法，所以__Trello__的API也支持_OAuth_的授权方式。在_OAuth_授权方式中需要使用你的_application secret_。它被放在了[https://trello.com/1/appKey/generate][3]的第二个框框中。


#### 使用client.js

如果你开发的是一个web 应用，你可以使用__Trello__ API客户端库，例如：

{% highlight html %}

    <head>
        <!-- ...  -->
        <!-- The client library requires jQuery  -->
        <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
        <script src="https://api.trello.com/1/client.js?key=substitutewithyourapplicationkey"></script>
        <!-- ...  -->
    </head>

{% endhighlight %}

你可以在[https://trello.com/1/client.coffee][6]中找到_client.js_找到的源代码（以coffee script的形式出现）。而client.js的文档则在[client.js][7]给出。

这个客户端库可以帮你完成例如：从用户那获取授权_token_，还有对GET，PUT，POST，DELETE这样的HTTP方法的包装。


[1]: https://trello.com/
[2]: https://trello.com/docs/
[3]: https://trello.com/1/appKey/generate
[4]: https://trello.com/docs/gettingstarted/authorize.html
[5]: https://trello.com/docs/gettingstarted/oauth.html
[6]: https://trello.com/1/client.coffee
[7]: https://trello.com/docs/gettingstarted/clientjs.html