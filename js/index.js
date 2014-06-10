seajs.use(['underscore', 'backbone', 'app/model/Project', 'app/view/ProjectList'], function(_, B, Projects, ProjectList) {
    var projects = new Projects(),

        projectList = new ProjectList({
            el : B.$('#project-list')[0],
            collection : projects,
        });

    B.$.getJSON('http://lizzz0523.github.io/data/projects.json?' + Math.random(), function(data) {
        _.each(data, function(data) {
            projects.add(data, {silent : true});
        });

        projects.trigger('reset');
    });
});