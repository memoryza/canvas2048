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
        return typeof ev.charCode == 'number' ? ev.charCode : ev.keyCode;
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
