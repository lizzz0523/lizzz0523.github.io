---
layout: post
title: Backbone API 中文翻译（持续更新）
categories: [javascript, backbone]
tags: [backbone api translation]
---


由于英文同记性都比较差，所以还还是决定用这个笨方法来学习backbone——__翻译Backbone API__


#### Model

_Models_是所有js应用里的重要部件，其中包含了需要操作的数据，以及大部分作用在这些数据上的相关逻辑：转换，验证，属性计算，以及可访问性控制等。如果你要使用`Backbone.Model`，首先，你需要用你的业务逻辑来扩展它。当然，_Model_本身已经提供了一组基本的功能来完成数据的修改。

下面是一个随便编写的例子，用来说明如何基于你的业务逻辑来定制model，设置它的状态，以及当某一个状态发生变化时，change事件的触发。当第一次运行这些代码以后，`sidebar`这个变量在你的console里就会变得可用，这样，你就可以按照你的想法随意的摆弄它。

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

为了创建你自己的_Model_类，你需要扩展`Backone.Model`，在`extend`方法中，你可以传入_properties_，也可以选择性的传入_classProperities_，而_classProperities_则会被直接赋值到子类的构造函数上。

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

关于`super`的题外话：由于js本身并没有提供一个简单的方法来调用`super`——即在原型链上游的同名函数。如果你重载了_Model_上的方法，例如`set`，或者`save`，但你希望能在子类中重新访问它们，那你只能手动去调用它们了：

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

当你创建一个model的实例是，你需要在构造函数中传入_attributes_作为状态的初始值，在model的构造函数中，我们会通过调用`set`方法来设置这些初始值。如果你在扩展`Backbone.Model`时，定义了initialize方法，我们也会在构造函数中调用它。

{% highlight javascript %}

    new Book({
        title: "One Thousand and One Nights",
        author: "Scheherazade"
    });

{% endhighlight %}

当然，如果你希望发生一些有趣的事情，你也可以尝试重载`constructor`来实现你的想法。当然，这种做法并不常见。

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


#### id

`model.id`

`id`是model中一个特殊的属性，是一个随机的数字或者UUID。如果你在`set`方法中设置`id`，它就会被复制到`model.id`中作为一个直接的对象属性。在collection中我们可以同`id`来找到对应的model对象，而且在默认的情况下，`id`会被用于产生model的url（记住Backbone与后台的教育采用RESTFUL风格的url）。


#### idAttribute

`model.idAttribute`

通常，对一个model的唯一标识是保存在`id`属性里的。但如果你使用的后端技术（如CouchDB，MongoDB）使用不同的属性作为唯一标识，你可以通过设置`idAttribute`来是它自动映射到`id`属性上来。

{% highlight javascript %}

    var Meal = Backbone.Model.extend({
        idAttribute: "_id"
    });

    var cake = new Meal({ _id: 1, name: "Cake" });
    alert("Cake id: " + cake.id);

{% endhighlight %}


#### cid

`model.cid`

`cid`或者叫做client id，是model的一个属性。当model第一次被创建时，`model.cid`就会自动被赋值，用于_暂时_唯一标识这个model。这里的暂时是指，在model被创建，但还没有来得及同步到服务器这段时间（这时model的属性内没有`id`属性，来区分不同的model）。由于有`cid`，model就可以马上被渲染到UI上。


#### isNew

`model.isNew()`

这是用于判断一个model是否已经同步到服务器。如果model属性中还没有`id`属性，则我们认为这个model是新的，还没有同步的。


#### defaults(internal)

`model.defaults or model.defaults()`

`default`属性可以是一个hash表，也可以是一个函数，我们可以利用它来为model设置默认值。当我们创建一个model的实例时，任何没有被指定的状态都会被设置为默认值。

{% highlight javascript %}

    var Meal = Backbone.Model.extend({
        defaults: {
            "appetizer":  "caesar salad",
            "entree":     "ravioli",
            "dessert":    "cheesecake"
        
    });

    alert("Dessert will be " + (new Meal).get('dessert'));

{% endhighlight %}

注意，在js当中，object的传递时按引用的，而已就是说，当你使用object作为默认值，那么所有的model时候，都会共享这一份默认值。相反，如果你使用function来产生默认值，就不会这样了。


#### attributes(internal)

`model.attributes`

`attributes`是model内部用于保存状态的hash表，通常（但不一定）是以JSON形式存在的反映后台数据的js对象。它可以是数据库里面的某一行数据，也可以是在客户端保存的某些状态值。

我们十分建议你使用`set`方法来更新model的`attributes`，而不是直接手动的修改它。如果你想获得并操作`attributes`的一个副本，你可以`_.clone(model.attributes)`;

由于Backbone的事件系统是采用空格来区分多个不同的事件的，所以不要在状态名中使用空格，以免在绑定某个状态的`change`事件时出错。


#### changed(internal)

`model.changed`

`changed`属性model内部用于保存那些在对上一次`set`操作时被修改过的状态名。千万不用手动去修改这个`changed`属性，因为它是由model的`set`来维护的。如果你想获得`changed`属性的一个副本，你可以调用model的`changedAttributes`方法。


#### hasChanged

`model.hasChanged([attribute])`

在上一次的`set`操作中，model是否被修改？如果参数中传入某一个_attribute_，`hasChanged`方法就会告诉你具体这个_attribute_是否被修改。

注意，这个方法以及马上要说的几个与change相关的方法，只有在`change`事件发生的时候才有用。


#### changeAttributes

`model.changeAttributes([attributes])`

获得一个与上一次的`set`操作中，被修改过的状态对应的hash表，如果没有任何修改，则返回false。如果你在参数中传入一个额外的_attributes_hash表，那么该方法则返回现在model所有状态中与该hash表不同的项。这可以用于决定view的那一部分需要更新，或者决定如何与后台来同步这些不同。


#### previous

`model.previous(attribute)`

在`change`事件期间，这个方法能用于获取被修改的状态之前的值。

{% highlight javascript %}

    var bill = new Backbone.Model({
        name: "Bill Smith"
    });

    bill.on("change:name", function(model, name) {
        alert("Changed name from " + bill.previous("name") + " to " + name);
    });

    bill.set({name : "Bill Jones"});

{% endhighlight %}


#### previousAttributes

`model.previousAttributes()`

该方法将会获得修改前状态的一个副本，我们可以用它做比较不同版本的model之前的差别，或者在出现验证错误的时候，让model恢复的上一个版本。


#### get

`model.get(attribute)`

从model中取出attribute对应的状态的当前值，例如`note.get("title")`


#### escape

`model.escape(attribute)`

与`get`方法类似，当返回值时经过html转义的。当你需要将状态数据渲染到html中是，使用`escape`方法能防止_XSS_攻击。

{% highlight javascript %}

    var hacker = new Backbone.Model({
        name: "<script>alert('xss')</script>"
    });

    alert(hacker.escape('name'));

{% endhighlight %}


#### set

`model.set(attributes, [options])`

根据attributes来设置model中一个或多个状态，如果过程中，修改了状态原本的值，那么model就会触发一个`change`事件，同时model也会针对被修改的状态来触发不同的`change`事件，例如`change:title`或者`change:content`，你可以根据需要来绑定这些事件。你可以通过在options中传入`{silent: true}`来阻止这些`change`事件。`set`方法也接受单个状态的设置。

{% highlight javascript %}

    note.set({title: "March 20", content: "In his eyes she eclipses..."});
    book.set("title", "A Scandal in Bohemia");

{% endhighlight %}


#### unset

`model.unset(attribute, [options])`

重model中delete掉对应的状态，并且触发`change`事件。你可以通过在options中传入`{silent: true}`来阻止`change`事件。


#### clear

`model.clear([options])`

清除model中所有的状态，包括`id`属性，触发`change`事件，同样，也可以在options中传入`silent`来阻止。


#### has

`model.has(attribute)`

如果model中包含该状态（非null以及非undefined），则返回`true`。

{% highlight javascript %}

    if (note.has("title")) {
      ...
    }

{% endhighlight %}


#### toJSON

`model.toJSON([options])`

获取model中的`attributes`的一个副本用于产生json格式的字符串。这能用于对数据的持久化，序列化，或在发送到后端前进行扩张。这个方法的名字可能让人有些迷惑，它实际上并是不是直接返回json字符串，但可以作为一个参数传入_JSON.stringify_方法来得到json字符串。

{% highlight javascript %}

    var artist = new Backbone.Model({
        firstName: "Wassily",
        lastName: "Kandinsky"
    });

    artist.set({birthday: "December 16, 1866"});

    alert(JSON.stringify(artist));

{% endhighlight %}


#### validate

`model.validate(attributes, options)`

这个方法实际上并没有定义，而我们是建议你重载它，并写入关于你的业务的验证逻辑。默认情况下，`validate`方法会在`save`操作前被调用，如果你在进行`set`操作时传入`{validate: true}`，那么`validate`方法也同样会被调用，`validate`方法接受的参数其实是来自`set`方法和`save`方法的。如果验证通过，这`validate`方法不会有任何返回。但如果验证不通过，它就会根据你的选择来返回错误信息，简单的可以是显示一句关于该错误的描述，或者也可以一个充分描述这个错误的error对象。当返回一个error对象时，`save`方法会被暂停，那样在客户端的错误的数据，就不会同步到服务器了，同时会触发`invalid`事件，并且设置`validationError`属性设置为返回的error对象。

{% highlight javascript %}

    var Chapter = Backbone.Model.extend({
        validate: function(attrs, options) {
            if (attrs.end < attrs.start) {
                return "can't end before it starts";
            }
        }
    });

    var one = new Chapter({
        title : "Chapter One: The Beginning"
    });

    one.on("invalid", function(model, error) {
        alert(model.get("title") + " " + error);
    });

    one.save({
        start: 15,
        end:   10
    });

{% endhighlight %}

`invalid`事件能在错误发生时，在model或者collection的层面提供粗粒度的错误信息


#### validationError

`model.validationError`

在最后一次调用`validate`方法时的返回值。


#### isValid

`model.isValid()`

立即验证model状态的正确性

{% highlight javascript %}

    var Chapter = Backbone.Model.extend({
        validate: function(attrs, options) {
            if (attrs.end < attrs.start) {
                return "can't end before it starts";
            }
        }
    });

    var one = new Chapter({
        title : "Chapter One: The Beginning"
    });

    one.set({
        start: 15,
        end:   10
    });

    if (!one.isValid()) {
        alert(one.get("title") + " " + one.validationError);
    }

{% endhighlight %}


#### parse


#### clone


#### url


#### urlRoot


#### sync


#### fetch


#### save


#### destroy


#### Underscore Methods(6)

