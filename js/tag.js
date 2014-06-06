(function(_, B, window){

var tmpl = [
        '<%= tag %>'
    ].join('');


var Tag = B.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        }
    }),

    Tags = B.Collection.extend({
        model : Tag,
    });


var TagItem = B.View.extend({
        template : _.template(tmpl),

        tagName : 'span',

        initialize : function(options) {
            this.size = options.size;
        },

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


(function() {

var tags = new Tags(),

    tagList = new TagList({
        el : B.$('#tag-list')[0],
        collection : tags,
    });

B.$.getJSON('http://lizzz0523.github.io/data/tags.json?' + Math.random(), function(data) {
    _.each(data, function(data) {
        tags.add(data, {silent : true});
    });

    tags.trigger('reset');
});

})();
    
})(_, Backbone, this);