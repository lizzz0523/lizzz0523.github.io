define(function(require, exports, module) {

var $ = require('jquery'),
    _ = require('underscore');


var $win = $(window),
    
    queue = {
        add : function(name, callback, context) {
            return $win.queue(name, _.bind(callback, context || window));
        },

        next : function(name) {
            return $win.dequeue(name);
        },

        clear : function(name) {
            return $win.clearQueue(name);
        },

        size : function(name) {
            return $win.queue(name).length;
        }
    };


module.exports = queue;
    
});