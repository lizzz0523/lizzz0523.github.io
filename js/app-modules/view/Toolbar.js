define(function(require, exports, module) {

var B = require('backbone'),
    _ = require('underscore');


var Toolbar = B.View.extend({
        initialize : function() {
            this.$fake = B.$('<div />');
            this.$fake.height(this.$el.outerHeight(true))
            this.$fake.hide();

            this.$el.before(this.$fake);

            this.offsetTop = this.$el.offset().top;
        },

        updatePos : function(scrollTop) {
            if (scrollTop >= this.offsetTop) {
                this.$el.addClass('full-fixed');
                this.$fake.show();
            } else {
                this.$el.removeClass('full-fixed');
                this.$fake.hide();
            }
        }
    });

    
module.exports = Toolbar;

});