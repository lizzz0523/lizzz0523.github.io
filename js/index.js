seajs.use(['app/model/Projects', 'app/view/ProjectList'], function(Projects, ProjectList) {
    var projects = new Projects(),

        projectList = new ProjectList({
            el : $('#project-list')[0],
            collection : projects,
        });

    $.getJSON('http://lizzz0523.github.io/data/projects.json?' + Math.random(), function(data) {
        _.each(data, function(data) {
            projects.add(data, {silent : true});
        });

        projects.trigger('reset');
    });
});