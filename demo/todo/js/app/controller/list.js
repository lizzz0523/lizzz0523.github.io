define([
    'jquery',
    'underscore',
    'model/Todos',
    'view/TodoList'
], function ($, _, Todos, TodoList) {

    return function (app) {
        var todos = new Todos(),

            todoList = new TodoList({
                el: app.$('#todo').get(0),
                collection: todos
            });

        todoList.render();

        todos.reset([{
            done: true,
            description: '在backbone中加入rivet',
            timestamp: Date.now()
        }, {
            done: false,
            description: '编写自己的adapter',
            timestamp: Date.now() + 1
        }]);
    };

});
