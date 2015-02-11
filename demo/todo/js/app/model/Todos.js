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
            model: Todo,
            comparator: function(a, b) {
                a = a.get('timestamp');
                b = b.get('timestamp');

                return a > b ? -1 : a < b ? 1 : 0;
            }
        });

    return Todos;

});
