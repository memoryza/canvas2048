;(function() {
    'use strict';
    function isType(type) {
        return function(obj) {
            return {}.toString.call(obj) == "[object " + type + "]"
        }
    }
    Array.isArray = Array.isArray || isType("Array");
    //只做简单的数值比较
    if(typeof Array.prototype.equal != 'function') {
        Array.prototype.equal = function(target) {
            if(!Array.isArray(target)) return false;
            if(this.length != target.length) return false;
            for(var i = 0, _len = this.length; i < _len; i++) {
                //多维数组
                if(Array.isArray(this[i]) && Array.isArray(target[i])) {
                    if(this[i].equal(target[i])) continue;
                }
                if(target[i] !== this[i]) return false;
            }
            return true;
        }
    }
})();
