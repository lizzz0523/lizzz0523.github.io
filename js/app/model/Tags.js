define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


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


module.exports = Tags;

});