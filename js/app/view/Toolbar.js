define(function(require, exports, module) {

var queue = require('tool/queue'),

    B = require('backbone'),
    _ = require('underscore');


var tmpl = [
        '<span><%= oldTitle %></span>',
        '<span><%= title %></span>'
    ].join('');


var Toolbar = B.View.extend({
        template : _.template(tmpl),

        initialize : function() {
            this.$title = this.$('h3');

            this.$fake = B.$('<div />');
            this.$fake.height(this.$el.outerHeight(true))
            this.$fake.hide();

            this.$el.before(this.$fake);

            this.offsetTop = this.$el.offset().top;
            this.curTitle = this.$title.html();
            this.animated = false;
        },

        updatePos : function(scrollTop) {
            if (scrollTop >= this.offsetTop) {
                this.$el.addClass('full-fixed');
                this.$fake.show();

                return true;
            } else {
                this.$el.removeClass('full-fixed');
                this.$fake.hide();

                return false;
            }
        },

        setTitle : function(title) {
            var isEmpty = !queue.size('slide'),
                fx = 'slide';

            queue.clear(fx);

            queue.add(fx, function() {
                _.delay(function() {
                    queue.next(fx);
                }, 160);
            }, this);

            queue.add(fx, function() {
                this.slideTitle(title, function() {
                    queue.next(fx);
                });
            }, this);

            if (isEmpty && !this.animated) {
                queue.next(fx);
            }
        },

        slideTitle : function(title, callback) {
            if (title == this.curTitle) return;

            this.animated = true;

            this.$title.html(this.template({
                title : title,
                oldTitle : this.curTitle
            }));

            this.$title.animate({scrollTop : 28}, 300, _.bind(function() {
                this.$title.html(title);
                this.curTitle = title;
                this.animated = false;

                callback && callback();
            }, this));
        }
    });

    
module.exports = Toolbar;

});