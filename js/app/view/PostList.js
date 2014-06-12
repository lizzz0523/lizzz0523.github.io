define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


var tmpl = [
        '<div class="expt_date fx-300"><%= date %></div>',
        '<h3><a class="fx-300" href="<%= url %>" target="_blank"><%= title %></a></h3>',
        '<%= _.unescape(excerpt) %>'
    ].join('');


var PostItem = B.View.extend({
        template : _.template(tmpl),

        tagName : 'li',

        className : 'expt_item',

        initialize : function() { },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        isVisible : function() {
            return this.model.get('visible');
        },

        remove : function() {
            this.$el.detach();
            this.$el.removeClass('fade-in');
        },

        insert : function($parent) {
            var delay = Math.floor(Math.random() * 500);

            this.$el.addClass('fade-out');

            _.delay(function($el) {
                $el.removeClass('fade-out');
                $el.addClass('fade-in');
            }, delay, this.$el);

            this.$el.appendTo($parent);
        },

        height : function() {
            return this.$el.outerHeight(true);
        }
    }),

    PostList = B.View.extend({
        initialize : function() {
            this.$left = this.$('.expt_list-left');
            this.$right = this.$('.expt_list-right');
            this.$tag = this.$('.expt_tag')

            this.curOffset = {
                left : 0,
                right : this.$tag.outerHeight() + PostList.COMMENT_OFFSET
            };

            this.items = [];

            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'update', this.toggleAll);
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
            this.collection.each(this.addOne, this)
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
            this.curOffset = {
                left : 0,
                right : this.$tag.outerHeight() + PostList.COMMENT_OFFSET
            };

            _.each(this.items, this.toggleOne, this);
        },

        toggleOne : function(item) {
            item.remove();
            this.insertItem(item);
        }
    }, {
        COMMENT_OFFSET : 350
    });

    
module.exports = PostList;

});