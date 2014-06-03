(function(_, B, window){

var tmpl = [
        '<a href="<%= url %>" target="_blank">',
            '<p class="project_thumbnail">',
                '<img src="<%= thumbnail %>" />',
                '<i class="project_shadow">&nbsp;</i>',
            '</p>',
            '<h3><%= name %></h3>',
            '<p class="project_intro">',
                '<span><%= intro %></span>',
            '</p>',
        '</a>'
    ].join('');


var Project = B.Model.extend({

    }),

    Projects = B.Collection.extend({
        model : Project,
    });


var ProjectItem = B.View.extend({
        template : _.template(tmpl),

        tagName : 'li',

        initialize : function() { },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    }),

    ProjectList = B.View.extend({

        initialize : function() {
            this.listenTo(this.collection, 'reset', this.addAll);
        },

        addAll : function() {
            this.collection.each(this.addOne, this)
        },

        addOne : function(model) {
            var item = new ProjectItem({
                model : model
            });

            this.$el.append(item.render().el);
        }
    });


(function() {

var projects = new Projects(),

    projectList = new ProjectList({
        el : B.$('#project-list')[0],
        collection : projects,
    });

B.$.getJSON('http://lizzz0523.github.io/data/projects.json?' + Math.random(), function(data) {
    _.each(data, function(data) {
        var project = new Project(data);
        projects.push(project, {silent : true});
    });

    projects.trigger('reset');
});

})();
    
})(_, Backbone, this);