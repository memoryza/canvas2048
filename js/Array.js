/**
 * 这里的数据操作只针对于数值、常量、字符串
 * */
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
    //两层拷贝
    if(typeof Array.prototype.copyTo != 'function') {
        Array.prototype.copyTo = function(target) {
            if(!Array.isArray(target)) target = [];//不用new Array，防止this下挂参数，影响实际长度
            for(var i = 0, _len = this.length; i < _len; i++) {
                if(Array.isArray(this[i])) {
                    target[i] = this[i].slice(0);
                    continue;
                }
                target[i] = this[i];
            }
            return target;
        }
    }
})();
