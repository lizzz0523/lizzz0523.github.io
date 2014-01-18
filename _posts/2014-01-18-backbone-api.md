---
layout: post
title: Backbone API 中文翻译（持续更新）
categories: [javascript, backbone]
tags: [backbone api translation]
---


由于英文同记性都比较差，所以还还是决定用这个笨方法来学习backbone——__翻译Backbone API__


#### Model

_Models_是所有js程序的程序部件，其中包含了需要操作的数据，以及大部分与操作这些数据相关的逻辑：转换，验证，属性计算，以及可访问性控制等。如果你要使用`Backbone.Model`，首先，你需要用你的业务逻辑来扩展它。当然，_Model_本身已经提供了一组基本的功能来完成数据的修改。

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


#### extend

`Backbone.Model.extend(properties, [classProperties])`

为了创建你自己的_Model_类，你需要扩展`Backone.Model`，在`extend`方法中，你可以传入_实例属性_，也可以选择性的传入_类属性_，而_类属性_则会被直接赋值到子类的构造函数上。

`extend`方法是允许链式调用的，那就是说，你可以在你扩展出来的子类上，再次调用`extend`方法来进行进一步的扩展。

{% highlight javascript %}

    var Note = Backbone.Model.extend({
        initialize: function() { ... },
        author: function() { ... },
        coordinates: function() { ... },
        allowedToEdit: function(account) {
            return true;
        }
    });

    var PrivateNote = Note.extend({
        allowedToEdit: function(account) {
            return account.owns(this);
        }
    });

{% endhighlight %}

关于`super`的题外话：由于js本身并没有提供一个简单的方法来方位`super`——即在原型链上游的同名函数。如果你重载了_Model_上的方法，例如`set`，或者`save`，但你希望能在子类中重新访问这些方法，那你只能手动去调用它们了：

{% highlight javascript %}

    var Note = Backbone.Model.extend({
        set: function(attributes, options) {
            Backbone.Model.prototype.set.apply(this, arguments);
            ...
        }
    });

{% endhighlight %}


#### constructor/initialize

`new Model([attributes], [options])`

当你创建一个model的实例是，你需要在参数中传入_attributes_的作为属性的初始值，在model的构造函数中，我们会通过调用`set`方法来设置这些初始值。如果你在扩展`Backbone.Model`时，定义了initialize方法，我们也会在构造函数中调用它。

{% highlight javascript %}

    new Book({
        title: "One Thousand and One Nights",
        author: "Scheherazade"
    });

{% endhighlight %}

当然，如果你需要做发生一些有趣的事情，你也可以尝试重载`constructor`来实现你的想法。当然，这种做法并不常见。

{% highlight javascript %}

    var Library = Backbone.Model.extend({
        constructor: function() {
            this.books = new Books();
            Backbone.Model.apply(this, arguments);
        },
        parse: function(data, options) {
            this.books.reset(data.books);
            return data.library;
        }
    });

{% endhighlight %}

如果你在参数_options_中传入`{collection: ...}`，那么model就会被指向对应的collection（即model的`collection`属性会被赋值，用于计算出model的`url`属性）。正常的情况下，当你将model加入到某一个collection时，`model.collection`属性就会自动创建。这里要注意的是，这并不是一个逆向操作，也就是说，在传进构造函数的_options_中设置`collection`并不是真的会把model加入到对应的collection中的。有些时候，这非常有用。

如果你在参数_options_中传入`{parse: true}`，那么我们在调用`set`方法设置属性之前，首先会调用`parse`方法对传入的_attributes_进行转换。


#### get

`model.get(attribute)`

从model中取出attribute对应的属性的当前值，例如`note.get("title")`


#### escape

`model.escape(attribute)`

与`get`方法类似，当返回值时经过html转义的。当你需要将数据如果到html中是，使用`escape`方法能防止_XSS_攻击。

{% highlight javascript %}

    var hacker = new Backbone.Model({
        name: "<script>alert('xss')</script>"
    });

    alert(hacker.escape('name'));

{% endhighlight %}


#### set

`model.set(attributes, [options])`

根据attributes来设置model中一个或多个属性，如果过程中，修改了属性原来的值，那么model就会触发一个`change`事件，同时model也会针对被修改的属性触发`change`事件，例如`change:title`或者`change:content`，你可以根据需要来绑定这些事件。你可以通过在options中传入`{silent: true}`来阻止这些`change`事件。`set`方法也接受单个属性的设置。

{% highlight javascript %}

    note.set({title: "March 20", content: "In his eyes she eclipses..."});
    book.set("title", "A Scandal in Bohemia");

{% endhighlight %}


#### unset

`model.unset(attribute, [options])`

重model中delete掉对应的属性，并且触发`change`事件。你可以通过在options中传入`{silent: true}`来阻止`change`事件。


#### clear

`model.clear([options])`

清除model中所有的属性，包括`id`属性，触发`change`事件，同样，也可以在options中传入`silent`来阻止。


#### has

`model.has(attribute)`

如果model中包含该属性（非null以及非undefined），则返回`true`。

{% highlight javascript %}

    if (note.has("title")) {
      ...
    }

{% endhighlight %}