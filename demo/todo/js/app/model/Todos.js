define([
    'underscore',
    'backbone'
], function (_, B) {

    var Todo = B.Model.extend({
            defaults: {
                done: false,
                editing: false
            }
        }),

        Todos = B.Collection.extend({
            model: Todo
        });

    return Todos;

});
