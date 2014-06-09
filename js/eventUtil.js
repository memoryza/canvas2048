/**
 * 事件原型
 * author:memoryza(jincai.wang@foxmail.com)
 * */
var eventUtil ={
    addHandler: function(el, type, handler) {
        if(window.addEventListener) {
            el.addEventListener(type, handler, false);
        } else if(window.attachEvent) {
            el.attachEvent('on' + type, handler);
        } else {
            el['on' + type] = handler;
        }
    },
    getCharCode: function(ev) {
        return ev.charCode || ev.keyCode || ev.witch;
    },
    getEvent: function(ev) {
        return ev ? ev : window.event;
    },
    getTarget: function(ev) {
        return ev.target || ev.srcElement;
    },
    preventDefault: function(ev) {
        if(ev.preventDefault) {
            ev.prevDefault();
        } else {
            ev.returnValue =  false;
        }
    },
    removeHandler: function(el, type, handler) {
        if(el.removeEventListener) {
            el.removeEventListener(type, handler, false);
        } else if(el.detachEvent) {
            el.detachEvent('on'+type, handler);
        } else {
            el['on' + type] =null;
        }
    },
    stopPropagation: function(ev) {
        if(ev.stopPropagation) {
            ev.stopPropagation();
        } else {
            ev.cancelBubble = true;
        }
    }
}

// ;(function() {
//     var lastTime = 0;
//     var vendors = ['webkit', 'moz'];
//     for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
//         window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
//                                       window[vendors[x] + 'CancelRequestAnimationFrame'];
//     }

//     if (!window.requestAnimationFrame) {
//         window.requestAnimationFrame = function(callback, element) {
//             var currTime = new Date().getTime();
//             var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
//             var id = window.setTimeout(function() {
//                 callback(currTime + timeToCall);
//             }, timeToCall);
//             lastTime = currTime + timeToCall;
//             return id;
//         };
//     }
//     if (!window.cancelAnimationFrame) {
//         window.cancelAnimationFrame = function(id) {
//             clearTimeout(id);
//         };
//     }
// }());