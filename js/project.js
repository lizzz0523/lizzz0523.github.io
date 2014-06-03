(function(_, B, window){

var tmpl = [
        '<div class="proj_thumbnail">',
            '<h3 class="proj_name fx-500"><%= name %></h3>',
            '<p>',
                '<img src="<%= thumbnail %>" />',
                '<span class="proj_shadow fx-500">&nbsp;</span>',
            '</p>',
        '</div>',
        '<div class="proj_intro fx-500">',
            '<p>',
                '<a href="<%= url %>" target="_blank"><span><%= intro %></span></a>',
            '</p>',
        '</div>'
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