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
        }
    }),

    PostList = B.View.extend({
        initialize : function() {
            this.$left = this.$('.expt_list-left');
            this.$right = this.$('.expt_list-right');
            this.$tag = this.$('.expt_tag')

            this.curOffset = {
                left : 0,
                right : this.$tag.outerHeight()
            };

            this.listenTo(this.collection, 'reset', this.addAll);
        },

        addAll : function() {
            this.collection.each(this.addOne, this)
        },

        addOne : function(model) {
            var item = new PostItem({
                model : model,
                id : 'post-item-' + model.get('order')
            });

            if (!item.isVisible()) {
                item.remove();
                return;
            }

            if (this.curOffset.left <= this.curOffset.right) {
                this.$left.append(item.render().el);
                this.curOffset.left += item.$el.outerHeight(true);
            } else {
                this.$right.append(item.render().el);
                this.curOffset.right += item.$el.outerHeight(true);
            }
        }
    });

    
module.exports = PostList;

});