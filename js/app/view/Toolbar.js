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
            var isEmpty = !queue.size('slide');

            queue.clear('slide');

            queue.add('slide', function() {
                _.delay(function() {
                    queue.next('slide');
                });
            }, this);

            queue.add('slide', function() {
                this.slideTitle(title, function() {
                    queue.next('slide');
                });
            }, this);

            if (isEmpty && !this.animated) {
                queue.next('slide');
            }
        },

        slideTitle : function(title, callback) {
            if (title == this.curTitle) return;

            this.animated = true;

            this.$title.html(this.template({
                title : title,
                oldTitle : this.curTitle
            }));

            this.$title.animate({scrollTop : 28}, 300, $.proxy(function() {
                this.$title.html(title);
                this.curTitle = title;
                this.animated = false;

                callback && callback();
            }, this));
        }
    });

    
module.exports = Toolbar;

});