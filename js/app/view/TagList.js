define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


var tmpl = [
        '<%= text %><sup><%= size %></sup>'
    ].join('');


var TagItem = B.View.extend({
        template : _.template(tmpl),

        tagName : 'span',

        className : 'fx-300',

        initialize : function() { },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    }),

    TagList = B.View.extend({
        initialize : function() {
            this.line = 0;
            this.lockLine = 0;

            this.listenTo(this.collection, 'reset', this.addAll);
        },

        insertItem : function(item) {,
            var curTop,
                top;

            if (this.lockLine !== true) {
                this.$el.append(item.render().$el);

                curTop = this.lockLine;
                top = item.$el.position().top;

                if (curTop != top) {
                    this.line++;
                }
                this.lockLine = top;

                if (this.line > TagList.MAX_LINE) {
                    this.lockLine = true;
                    item.$el.detach();
                }
            }
        },

        addAll : function() {
            this.collection.each(this.addOne, this)
        },

        addOne : function(model) {
            var item = new TagItem({
                    model : model,
                    id : 'tag-item-' + model.get('order')
                });

            this.insertItem(item);
        }
    }, {
        MAX_LINE : 3
    });


module.exports = TagList;

});