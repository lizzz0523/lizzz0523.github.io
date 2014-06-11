define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');

var Project = Backbone.Model.extend({
        defaults : function() {
            return {
                order : this.collection.length
            }
        }
    }),

    Projects = Backbone.Collection.extend({
        model : Project,
    });

module.exports = Projects;
    
});