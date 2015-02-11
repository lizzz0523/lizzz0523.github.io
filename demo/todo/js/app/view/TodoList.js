define([
    'rivets',
    'jquery',
    'underscore',
    'backbone',
    'iscroll'
], function (rivets, $, _, B, IScroll) {

    var TodoList = B.View.extend({
        initialize: function () {
            var self = this,
                todos = self.collection;

            self.scroller = new IScroll(self.$('.module_body').get(0));

            self.listenTo(todos, 'add remove reset sort', function () {
                _.defer(function () {
                    self.scroller.refresh();
                });
            });
        },

        render: function () {
            var self = this,
                elem = self.el,
                todos = self.collection;

            self.binding = rivets.bind(elem, {
                data: {
                    todos: todos
                },

                add: function (event, data) {
                    event.preventDefault();
                    self._add(data);
                },

                edit: function (event, data) {
                    event.preventDefault();
                    self._toggle(data, true);
                },

                close: function (event, data) {
                    var code;

                    if (event.type === 'keyup') {
                        code = event.keyCode;

                        if (code !== 13) {
                            return;
                        }
                    }

                    event.preventDefault();
                    self._toggle(data, false);
                },

                done: function (event, data) {
                    event.preventDefault();
                    self._done(data);
                }
            });

            return self;
        },

        remove: function () {
            var self = this,
                binding = self.binding;

            if (binding) {
                binding.unbind();
            }

            return self;
        },

        _add: function () {
            var self = this,
                todos = self.collection;

            todos.create({
                editing: true,
                description: '新任务',
                timestamp: Date.now()
            });
        },

        _toggle: function (data, editing) {
            var todo = data.todo;
            todo.set('editing', editing);
        },

        _done: function (data) {
            var todo = data.todo,
                done = todo.get('done');

            todo.set('done', !done);
        }
    });

    return TodoList;

});
