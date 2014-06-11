define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


var Project = B.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        }
    }),

    Projects = B.Collection.extend({
        model : Project,
    });


module.exports = Projects;
    
});