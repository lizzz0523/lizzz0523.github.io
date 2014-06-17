define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


var tmpl = [
        '<div class="proj_thumbnail">',
            '<h3 class="proj_name fx-500"><%= name %></h3>',
            '<p>',
                '<img src="<%= thumbnail %>" />',
                '<span class="proj_shadow fx-500">&nbsp;</span>',
            '</p>',
        '</div>',
        '<div class="proj_intro fx-500">',
            '<p>',
                '<a href="<%= url %>" target="_blank"><span><%= intro %></span></a>',
            '</p>',
        '</div>'
    ].join('');


var ProjectItem = Backbone.View.extend({
        template : _.template(tmpl),

        tagName : 'li',

        initialize : function() { },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    }),

    ProjectList = Backbone.View.extend({
        initialize : function() {
            this.listenTo(this.collection, 'reset', this.addAll);
        },

        addAll : function() {
            this.collection.each(this.addOne, this)
        },

        addOne : function(model) {
            var item = new ProjectItem({
                    model : model,
                    id : 'project-item-' + model.get('order')
                });

            this.$el.append(item.render().$el);
        }
    });


module.exports = ProjectList;
    
});