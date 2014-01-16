(function($, window, undefined){

$.getJSON('http://lizzz0523.github.io/data/blog-list.json?' + Math.random(), function(data){
    console.log(data);
});
    
})(jQuery, this);