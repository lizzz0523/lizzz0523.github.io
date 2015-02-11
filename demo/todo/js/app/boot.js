define([
    'ready',
    'app/index',
    'configure/rivets-adapter',
], function (ready, app) {

    app.otherwise({
        redirectTo: 'todo'
    }).when('todo', {
        name: 'list',
        templateUrl: 'tmpl/list',
        controllerUrl: 'controller/list'
    }).when('todo/:id', {
        name: 'detail',
        templateUrl: 'tmpl/detail',
        controllerUrl: 'controller/detail'
    });

    ready(function () {
        app.bootstrap(document.body);
    });

});
