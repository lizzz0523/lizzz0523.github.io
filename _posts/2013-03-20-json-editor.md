---
layout: post
title: JSON Editor
categories: [javascript]
tags: [json editor]
---


最近兴致大发，准备自己写一个__JSON__的编辑器。本想应该是小菜一碟，上网翻翻资料，才发现，自己才是小菜 — 囧。

[http://www.jsoneditoronline.org/][1]

这是我找到的，界面设计的比较好的，操作性也不错的__JSON__编辑器——_jsoneditor_，重点是该编辑器的作者已经把_jsoneditor_作为开源项目，提供了完整的封装和_API_，方便别的程序员把它嵌入到自己的应用当中。

这是_jsoneditor_在github上的链接：[https://github.com/josdejong/jsoneditoronline][2]

既然作者也大方的和大家分享他的“艺术品”，那我更要尽自己的能力，分析一下他的代码了，哈哈哈哈


#### 界面

从源码中，我发现_jsoneditor_的界面主要由`JSONEditor`，`Node`，`AppendNode`，`ContextMenu`和`SearchBox`，五个类构成，其中最重要的应该是`Node`这个类，界面上`TreeView`的就是由`Node`类构成和控制。

先来看看`Node`类提供的_API_:

{% highlight javascript %}

    Node.prototype = {
        // 构造函数
        constructor : function(){},

        // 读写Node上的一些必要属性（parent，field，value，level，type）
        setParent : function(){},
        setField : function(){},
        getField : function(){},
        setValue : function(){},
        getValue : function(){},
        changeType : function(){},
        getLevel : function(){},

        // 一些交互动作（如高亮，打开下拉菜单，展开 / 收起子节点，隐藏自己包括所有字节点）
        setHighlight : function(){},
        showContextMenu : function(){},
        search : function(){},
        expand : function(){},
        collapse : function(){},

        moveTo : function(){},
        moveBefore : function(){},

        insertBefore : function(){},
        insertAfter : function(){},

        // 父子关系的Node之间的操作，注意这里AppendNode是一种特殊的Node而已
        showChilds : function(){},
        hideChilds : function(){},
        hide : function(){},
        appendChild : function(){},
        removeChild : function(){},

        // 事件处理器
        scrollTo : function(){},
        focus : function(){},
        blur : function(){},
        onEvent : function(){},
        onKeyDown : function(){},

        // 实际DOM的创建和更新
        containsNode : function(){},
        getDom : function(){},
        getAppend : function(){},
        clearDom : function(){},
        updateDom : function(){},
        updateField : function(){},
        updateValue : function(){},

        clone : function(){}
    }

{% endhighlight %}
 
从接口上可知，`Node`类主要负责：

1. 创建和维护自身所在的`NodeTree`（各个`Node`节点之间的父子关系）
2. 创建和更新所对应的DOM节点（包括`tr`，`tdDrag`，`drag`，`tdMenu`，`menu`，`tree`，`tdExpand`，`expand`，`tdField`，`field`，`tdSeparator`，`tdValue`，`value`）

下图为`Node`类创建`NodeTree`和`DOMTree`的基本流程。这里要注意，这是两个不同的流程，在源程序里是分步执行的，理解这个非常重要


#### NodeTree

1. 新建一个`Node`节点，调用`this.setField`方法设置其键名
2. 判断值是否是对象或者数组
3. 如果不是，则设置`this.value`
4. 如果是，则历遍对象或数组所有的项，并逐一为其新建一个`Node`节点，调用`this.appendChild`方法，作为子节点加入到整棵`NodeTree`中


#### DOMTree

1. 调用`this.getDom`方法（内部调用`this.updateDom`方法），建立节点对应的DOM节点（为`tr`标签，以及以下内部复杂的标签结构）
2. 将新建的DOM节点插入到`DOMTree`中
3. 调用`this.expand`方法，展开起子节点
4. 在`this.expand`方法中，首先设置`this.expanded`为`true`，并调用`this.showChilds`方法以显示所有的子节点
5. 在`this.showChilds`方法中，首先调用`this.getAppend`获得一个`AppendNode`节点，并插入到当前节点之后
6. 然后历遍所有的子节点，调用`child.getDom`方法，建立子节点对应的DOM节点
7. 将新建的DOM节点插入到`DOMTree`中
8. 调用`child.showChilds`方法，以递归的方式，再次显示当前节点的所有子节点

如下图：

![流程图][3]

最后放出一个自己做的[demo[1]][4]，[demo[2]][5]来加强对上述过程的理解，大致流程一致，有小许的修改


[1]: http://www.jsoneditoronline.org/
[2]: https://github.com/josdejong/jsoneditoronline
[3]: {{ site.url }}/images/post/json-editor-20140609-001.gif
[4]: http://www.led-zero.org/demo/jsoneditor.html
[5]: http://www.led-zero.org/demo/jsoneditor-2.html