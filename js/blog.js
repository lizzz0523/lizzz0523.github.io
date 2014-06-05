(function(_, B, window){

var tmpl = [
        '<div class="expt_date"><%= date %></div>',
        '<h3><a href="<%= url %>"<%= title %></a></h3>',
        '<%= excerpt %>'
    ].join('');


var Post = B.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        }
    }),

    Posts = B.Collection.extend({
        model : Post,
    });


var PostItem = B.View.extend({
        template : _.template(tmpl),

        tagName : 'li',

        initialize : function() { },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    }),

    PostList = B.View.extend({

        initialize : function() {
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

            this.$el.append(item.render().el);
        }
    });


(function() {

var posts = new Posts(),

    postList = new PostList({
        el : B.$('#post-list')[0],
        collection : posts,
    });

B.$.getJSON('http://lizzz0523.github.io/data/posts.json?' + Math.random(), function(data) {
    _.each(data, function(data) {
        posts.add(data, {silent : true});
    });

    posts.trigger('reset');
});

})();
    
})(_, Backbone, this);