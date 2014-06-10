(function(_, B, window){

var tmpl = {
        post : [
            '<div class="expt_date fx-300"><%= date %></div>',
            '<h3><a class="fx-300" href="<%= url %>" target="_blank"><%= title %></a></h3>',
            '<%= _.unescape(excerpt) %>'
        ].join(''),

        tag : [
            '<%= tag %><sup><%= size %></sup>'
        ].join(''),

        category : [
            '<%= category %> [<%= size %>]'
        ].join('')
    };


var Tag = B.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        }
    }),

    Tags = B.Collection.extend({
        model : Tag,
        comparator: function(tag1, tag2) {
            return tag1.get('size') < tag2.get('size') ? 1 : -1;
        }
    });


var Category = B.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        }
    }),

    Categories = B.Collection.extend({
        model : Category
    });


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


var TagItem = B.View.extend({
        template : _.template(tmpl.tag),

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


var CategoryItem = B.View.extend({
        template : _.template(tmpl.Category),

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


var PostItem = B.View.extend({
        template : _.template(tmpl.post),

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


var tags = new Tags(),

    categories = new Categories(),

    posts = new Posts();


var tagList = new TagList({
        el : B.$('#tag-list')[0],
        collection : tags
    }),

    categoryList = new CategoryList({
        el : B.$('#category-list')[0],
        collection : categories
    }),

    postList = new PostList({
        el : B.$('#post-list')[0],
        collection : posts
    }),

    toolbar = new Toolbar({
        el : B.$('#post-toolbar')[0]
    });


$win.queue('data', [
    function() {
        B.$.getJSON('http://lizzz0523.github.io/data/categories.json?' + Math.random(), function(data) {
            _.each(data, function(data) {
                categories.add(data, {silent : true});
            });
            categories.trigger('reset');

            $win.dequeue('data');
        });
    },

    function() {
        B.$.getJSON('http://lizzz0523.github.io/data/tags.json?' + Math.random(), function(data) {
            _.each(data, function(data) {
                tags.add(data, {silent : true});
            });
            tags.trigger('reset');

            $win.dequeue('data');
        });
    },

    function() {
        B.$.getJSON('http://lizzz0523.github.io/data/posts.json?' + Math.random(), function(data) {
            _.each(data, function(data) {
                posts.add(data, {silent : true});
            });
            posts.trigger('reset');

            $win.dequeue('data');
        });
    }
]);

$win.dequeue('data');

$win.on('scroll', function() {
    toolbar.updatePos($win.scrollTop());
});

})();
    
})(_, Backbone, this);