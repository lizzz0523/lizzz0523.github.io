define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


var Category = B.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        },

        initialize : function() {
            this.set('value', this.get('text'));
        }
    }),

    Categories = B.Collection.extend({
        model : Category
    });


module.exports = Categories;
    
});