seajs.use([
    'jquery',
    'app/model/Projects',
    'app/view/ProjectList'
], function($, Projects, ProjectList) {

    var firebase = new Firebase('shining-fire-8063.firebaseIO.com'),
        visitor = firebase.get('visitor');

    var projects = new Projects(),

        projectList = new ProjectList({
            el : $('#project-list')[0],
            collection : projects,
        });

    $.getJSON('http://lizzz0523.github.io/data/projects.json?' + Math.random(), function(data) {
        $.each(data, function(index, data) {
            projects.add(data, {silent : true});
        });

        projects.trigger('reset');
    });

    console.log(visitor);
    visitor++;

    firebase.set('visitor');
});