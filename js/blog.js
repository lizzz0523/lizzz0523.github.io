seajs.use([
    'jquery',
    'tool/queue',

    'app/model/Categories',
    'app/model/Tags',
    'app/model/Posts',
    'app/view/CategoryList',
    'app/view/TagList',
    'app/view/PostList',
    'app/view/Toolbar'
], function($, queue, Categories, Tags, Posts, CategoryList, TagList, PostList, Toolbar) {

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


    function switchCategory(value) {
        posts.each(function(post) {
            var categories = post.get('categories'),
                dataOpts = {
                    silent : true
                };

            if (value != 'all') {
                post.set({'selected' : false}, dataOpts);
                post.trigger('select', false);
            } else {
                post.set({'selected' : true}, dataOpts);
                post.trigger('select', true);
            }

            $.each(categories, function(index, category) {
                if (category == value) {
                    post.set({'selected' : true}, dataOpts);
                    post.trigger('select', true);
                }
            });
        });

        posts.trigger('update');
    }


    queue.add('data', function() {
        $.getJSON('http://lizzz0523.github.io/data/categories.json?' + Math.random(), function(data) {
            var total = 0,
                dataOpts = {
                    silent : true,
                    parse : true
                };

            $.each(data, function(index, data) {
                categories.add(data, dataOpts);
                total += data['size'] || 0;
            });

            categories.unshift({
                'text'  : '全部文章',
                'size'  : total,
                'value' : 'all'
            }, dataOpts);

            categories.trigger('reset');

            queue.next('data');
        });
    });

    queue.add('data', function() {
        $.getJSON('http://lizzz0523.github.io/data/tags.json?' + Math.random(), function(data) {
            var dataOpts = {
                    silent : true
                };

            $.each(data, function(index, data) {
                tags.add(data, dataOpts);
            });

            tags.trigger('reset');

            queue.next('data');
        });
    });

    queue.add('data', function() {
        $.getJSON('http://lizzz0523.github.io/data/posts.json?' + Math.random(), function(data) {
            var dataOpts = {
                    silent : true
                };

            $.each(data, function(index, data) {
                posts.add(data, dataOpts);
            });

            posts.trigger('reset');

            queue.next('data');
        });
    });

    queue.add('data', function() {
        categoryList.on('change', switchCategory);
        categoryList.select('all');

        queue.next('data');
    });

    queue.next('data');


    $(window).on('scroll', function() {
        var scrollTop = $(window).scrollTop(),
            title = postList.getCurDate(scrollTop),
            fixed = toolbar.updatePos(scrollTop);
        
        toolbar.setTitle(!fixed ? 'Latest' : title || 'Latest');
    });
    
});