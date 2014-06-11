define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


var tmpl = [
        '<%= tag %><sup><%= size %></sup>'
    ].join('');


var TagItem = B.View.extend({
        template : _.template(tmpl),

        tagName : 'span',

        initialize : function(options) { },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    }),

    TagList = B.View.extend({
        initialize : function() {
            this.listenTo(this.collection, 'reset', this.addAll);
        },

        addAll : function() {
            this.collection.each(this.addOne, this)
        },

        addOne : function(model) {
            var item = new TagItem({
                model : model,
                id : 'tag-item-' + model.get('order')
            });

            this.$el.append(item.render().el);
        }
    });


module.exports = TagList;

});