(function($, window, undefined){

$.getJSON('http://lizzz0523.github.io/data/posts.json?' + Math.random(), function(data){
    console.log(data);
});
    
})(jQuery, this);