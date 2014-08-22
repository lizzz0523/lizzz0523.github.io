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
            this.height = this.$el.outerHeight(true);
            this.offsetTop = this.$el.offset().top;

            this.$fake = B.$('<div />');
            this.$fake.height(this.height)
            this.$fake.hide();
            this.$el.before(this.$fake);

            this.fixed = false;


            this.$title = this.$('h3');

            this.curTitle = this.$title.html();
            this.animated = false;
        },

        updatePos : function(scrollTop) {
            var $elem = this.$el,
                $fake = this.$fake;

            if (scrollTop >= this.offsetTop + this.height && !this.fixed) {
                $elem.addClass('full-fixed');
                $fake.show();

                $elem.css('top', -this.height);
                _.delay(function() {
                    $elem.animate({top : 0}, 'fast');
                }, 300);

                this.fixed = true;

                return true;
            } 

            if (scrollTop <= this.offsetTop && this.fixed) {
                this.$el.removeClass('full-fixed');
                this.$fake.hide();

                this.fixed = false;

                return false;
            }
        },

        setTitle : function(title) {
            var isEmpty = queue.size('slide') == 0,
                fx = 'slide';

            queue.clear(fx);

            queue.add(fx, function() {
                _.delay(function() {
                    queue.next(fx);
                }, 100);
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
                this.$title.scrollTop(0);
                this.$title.html(title);
                this.curTitle = title;
                this.animated = false;

                callback && callback();
            }, this));
        }
    });

    
module.exports = Toolbar;

});