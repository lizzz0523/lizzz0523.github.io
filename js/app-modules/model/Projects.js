define(function(require, exports, module) {

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