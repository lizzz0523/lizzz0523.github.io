(function(_, B, window){

var tmpl = [
        '<div class="expt_date fx-300"><%= date %></div>',
        '<h3><a class="fx-300" href="<%= url %>" target="_blank"><%= title %></a></h3>',
        '<%= _.unescape(excerpt) %>'
    ].join('');


var Post = B.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        }
    }),

    Posts = B.Collection.extend({
        model : Post
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

            if (this.curOffset.left <= this.curOffset.right) {
                this.$left.append(item.render().el);
                this.curOffset.left += item.$el.outerHeight(true);
            } else {
                this.$right.append(item.render().el);
                this.curOffset.right += item.$el.outerHeight(true);
            }
        }
    }),

    Toolbar = B.View.extend({
        initialize : function() {
            this.$fake = B.$('<div />');
            this.$fake.height(this.$el.outerHeight(true))
            this.$fake.hide();

            this.$el.before(this.$fake);

            this.offsetTop = this.$el.offset().top;
        },

        updatePos : function(scrollTop) {
            if (scrollTop >= this.offsetTop) {
                this.$el.addClass('full-fixed');
                this.$fake.show();
            } else {
                this.$el.removeClass('full-fixed');
                this.$fake.hide();
            }
        }
    });


(function() {

var $win = B.$(window);

var posts = new Posts(),

    postList = new PostList({
        el : B.$('#post-list')[0],
        collection : posts
    }),

    toolbar = new Toolbar({
        el : B.$('#post-toolbar')[0]
    });

B.$.getJSON('http://lizzz0523.github.io/data/posts.json?' + Math.random(), function(data) {
    _.each(data, function(data) {
        posts.add(data, {silent : true});
    });

    posts.trigger('reset');
});

$win.on('scroll', function() {
    toolbar.updatePos($win.scrollTop());
});

})();
    
})(_, Backbone, this);