define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


var 

    /*
        博客列表项的html模板
    */

    tmpl = [
        '<div class="expt_date fx-300"><%= date %></div>',
        '<h3><a class="fx-300" href="<%= url %>" target="_blank"><%= title %></a></h3>',
        '<%= _.unescape(excerpt) %>'
    ].join('');


var 
    
    /*
        博客列表项
    */

    PostItem = B.View.extend({
        template : _.template(tmpl),

        tagName : 'li',

        className : 'expt_item',

        initialize : function() { },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        insert : function($parent, silent) {
            var delay = Math.floor(Math.random() * 500);

            /*
                将列表项插入的dom树中
                并随机延时后显示
                fade-in，fade-out 是包含css3动画的类
            */

            this.$el.appendTo($parent);

            if (!silent) {
                this.$el.addClass('fade-out');

                /*
                    这里之所以会用js来控制delay
                    是因为，无法直接在elem.style属性中插入animation-delay属性
                */

                _.delay(function($el) {
                    $el.removeClass('fade-out');
                    $el.addClass('fade-in');
                }, delay, this.$el);
            }
        },

        remove : function() {
            /*
                列表项从dom树上移除
            */

            this.$el.removeClass('fade-in');

            this.$el.detach();
        },

        height : function() {
            return this.$el.outerHeight(true);
        },

        isVisible : function() {
            return this.model.get('visible');
        }
    }),

    
    /*
        博客列表
    */

    PostList = B.View.extend({
        initialize : function() {
            this.$left = this.$('.expt_list-left');
            this.$right = this.$('.expt_list-right');
            this.$tag = this.$('.expt_tag');


            /*
                当第一次加载post数据，
                collection会触发reset事件
            */

            this.listenTo(this.collection, 'reset', this.addAll);

            /*
                当post数据发送变化时，
                collection会触发update事件
            */
            this.listenTo(this.collection, 'update', this.toggleAll);
        },

        clearItems : function() {
            _.invoke(this.items, 'remove');
        },

        insertItem : function(item) {
            if (!item.isVisible()) return;

            if (this.curOffset.left <= this.curOffset.right) {
                item.insert(this.$left);
                this.curOffset.left += item.height();
            } else {
                item.insert(this.$right);
                this.curOffset.right += item.height();
            }
        },

        addAll : function() {
            /*
                首先从dom树移除所有的item
                重置curOffset和item的值
            */

            this.clearItems();

            this.curOffset = {
                left : 0,
                right : this.$tag.outerHeight()
            };
            this.items = [];

            /*
                历遍所有post数据
                从新生成新的列表项
            */

            this.collection.each(this.addOne, this);

            /*
                最后调整列表项的位置
                以放下评论框
            */

            this.adjustOffset();
        },

        addOne : function(model) {
            var item = new PostItem({
                model : model,
                id : 'post-item-' + model.get('order')
            });
            this.items.push(item);
            
            this.insertItem(item.render());
        },

        toggleAll : function() {
            /*
                首先从dom树移除所有的item
                重置curOffset
            */

            this.clearItems();

            this.curOffset = {
                left : 0,
                right : this.$tag.outerHeight()
            };

            /*
                历遍所有items
                从新生成渲染和插入dom树
            */

            _.each(this.items, this.toggleOne, this);

            /*
                最后调整列表项的位置
                以放下评论框
            */

            this.adjustOffset();
        },

        toggleOne : function(item) {
            this.insertItem(item.render());
        },

        adjustOffset : function() {
            var len = this.items.length,
                start = len,
                offset = 0,
                item,
                items = [];

            while (start--) {
                item = this.items[start];

                if (item.isVisible()) {
                    items.unshift(item);
                    offset += item.height();

                    if (offset >= PostList.COMMENT_OFFSET) {
                        break;
                    }
                }
            }

            _.invoke(items, 'insert', this.$left, true);
        }
    }, {
        COMMENT_OFFSET : 350
    });

    
module.exports = PostList;

});