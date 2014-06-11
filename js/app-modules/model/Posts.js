define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


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


module.exports = Posts;
    
});