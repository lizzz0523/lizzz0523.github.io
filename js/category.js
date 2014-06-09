(function(_, B, window){

var tmpl = [
        '<%= category %> [<%= size %>]'
    ].join('');


var Category = B.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        }
    }),

    Categories = B.Collection.extend({
        model : Category,
    });


var CategoryItem = B.View.extend({
        template : _.template(tmpl),

        tagName : 'option',

        initialize : function(options) { },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    }),

    CategoryList = B.View.extend({
        initialize : function() {
            this.listenTo(this.collection, 'reset', this.addAll);
        },

        addAll : function() {
            this.collection.each(this.addOne, this)
        },

        addOne : function(model) {
            var item = new CategoryItem({
                model : model,
                id : 'category-item-' + model.get('order')
            });

            this.$el.append(item.render().el);
        }
    });


(function() {

var categories = new Categories(),

    categoryList = new CategoryList({
        el : B.$('#category-list')[0],
        collection : categories
    });

B.$.getJSON('http://lizzz0523.github.io/data/categories.json?' + Math.random(), function(data) {
    _.each(data, function(data) {
        categories.add(data, {silent : true});
    });

    categories.trigger('reset');
});

})();
    
})(_, Backbone, this);