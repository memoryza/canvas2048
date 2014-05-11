/**
 * javascript Document
 * author:memoryza
 * 简陋的dom
 * */
;(function(window, undefined) {
    function $(id) {
        var $this = document.getElementById(id)
        $this.data = function(key, val) {
            if(val === undefined) {
                return this.key;
            }
            this.key = val;
            return this;
        }
        return $this;
    }
    window.$ = $;
})(window);
