seajs.use([
    'jquery',
    'app/model/Categories',
    'app/model/Tags',
    'app/model/Posts',
    'app/view/CategoryList',
    'app/view/TagList',
    'app/view/PostList',
    'app/view/Toolbar'
], function($, Categories, Tags, Posts, CategoryList, TagList, PostList, Toolbar) {

    var $win = $(window);


    var categories = new Categories(),

        tags = new Tags(),

        posts = new Posts();


    var categoryList = new CategoryList({
            el : $('#category-list')[0],
            collection : categories
        }),

        tagList = new TagList({
            el : $('#tag-list')[0],
            collection : tags
        }),

        postList = new PostList({
            el : $('#post-list')[0],
            collection : posts
        }),

        toolbar = new Toolbar({
            el : $('#post-toolbar')[0]
        });


    $win.queue('data', [
        function() {
            $.getJSON('http://lizzz0523.github.io/data/categories.json?' + Math.random(), function(data) {
                $.each(data, function(index, data) {
                    categories.add(data, {silent : true});
                });
                categories.trigger('reset');

                $win.dequeue('data');
            });
        },

        function() {
            $.getJSON('http://lizzz0523.github.io/data/tags.json?' + Math.random(), function(data) {
                $.each(data, function(index, data) {
                    tags.add(data, {silent : true});
                });
                tags.trigger('reset');

                $win.dequeue('data');
            });
        },

        function() {
            $.getJSON('http://lizzz0523.github.io/data/posts.json?' + Math.random(), function(data) {
                $.each(data, function(index, data) {
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
    
});