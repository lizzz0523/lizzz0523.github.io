define([
    'jquery',
    'underscore',
    'backbone',
    'fastclick'
], function ($, _, B, FC) {

    var Main = B.View.extend({
            _inited: false,

            initialize: function (options) {
                var self = this;

                _.extend(self, _.pick(options, ['app']));

                self._inited = true;
                self._bind();
            },

            _bind: function () {
                var self = this,
                    app = self.app;

                self.listenTo(app, 'route', self._active);

                return self;
            },

            setElement: function (el) {
                var self = this,
                    res;

                res = B.View.prototype.setElement.call(self, el);

                self.$nav = self.$('[data-nav]');
                self.$view = self.$('[data-view]');

                return res;
            },

            render: function (html) {
                var self = this,

                    $view = self.$view;

                $view.html(html);

                return self;
            },

            _active: function (name) {
                var self = this,

                    $nav = self.$nav,
                    $target = self.$('[data-nav=' + name + ']');

                $nav.removeClass('active');
                $target.addClass('active');
            }
        }),

        App = B.Router.extend({
            initialize: function () {
                var self = this;
            },

            bootstrap: function (elem) {
                var self = this;

                self.view = new Main({
                    app: self,
                    el: elem
                });

                FC.attach(document.body);

                if (!B.history.started) {
                    B.history.start();
                }

                return self;
            },

            when: function (path, config) {
                var self = this,
                    name,
                    templateUrl,
                    controllerUrl;

                if ('name' in config) {
                    name = config.name;
                } else {
                    name = path;
                }

                templateUrl = config.templateUrl;
                controllerUrl = config.controllerUrl;

                if (templateUrl.indexOf('.html') !== templateUrl.length - 5) {
                    // relative path
                    templateUrl = 'text!../' + templateUrl + '.html';
                } else {
                    // absolute path
                    templateUrl = 'text!' + templateUrl;
                }

                self.route(path, name, function () {
                    var args = _.toArray(arguments);

                    require([templateUrl, controllerUrl], function (html, ctrl) {
                        self._render(html);
                        // wait for dom ready
                        _.defer(function () {
                            self._apply(ctrl, args);
                        });
                    });
                });

                return self;
            },

            otherwise: function (config) {
                var self = this;

                if ('redirectTo' in config) {
                    self.route('*error', 'error', function () {
                        self.path(config.redirectTo);
                    });
                } else {
                    self.when('*error', 'error', config);
                }

                return self;
            },

            path: function (url) {
                var self = this;

                self.navigate(url, {
                    trigger: true
                });

                return self;
            },

            $: function (selector) {
                var self = this,
                    view = self.view;

                return view.$(selector);
            },

            _render: function (html) {
                var self = this,
                    view = self.view;

                view.render(html);

                return self;
            },

            _apply: function (ctrl, args) {
                var self = this;

                if (_.isFunction(ctrl)) {
                    ctrl.apply(ctrl, [self].concat(args));
                } else {
                    throw Error('Controller isn\'t a Function');
                }

                return self;
            }
        });

    return new App();

});
