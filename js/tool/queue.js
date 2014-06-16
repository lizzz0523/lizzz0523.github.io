define(function(require, exports, module) {

var $ = require('jquery');

var $win = $(window),
    
    queue = {
        add : function(name, callback, context) {
            return $win.queue(name, $.proxy(callback, context || window));
        },

        next : function(name) {
            return $win.dequeue(name);
        },

        clear : function(name) {
            return $win.clearQueue(name);
        },

        size : function(name) {
            return $win.queue(name).length == 0;
        }
    };


module.exports = queue;
    
});