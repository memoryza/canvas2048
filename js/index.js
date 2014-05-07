;eventUtil.addHandler(window, 'load', function() {
    function $(id) {
        return document.getElementById(id);
    }

    //尽量做到一个参数控制整个布局，计算量会比固定数值的大一点
    var canvas  = $('grid'),
        gameObj = null;
    if(canvas.getContext) {
        gameObj = new game(canvas);
        gameObj.init();
        //绑定重玩事件
        eventUtil.addHandler($('restart'), 'click', function() {
            gameObj.reStart()
        });
        //向上合并
        eventUtil.addHandler($('up'), 'click', function() {
            gameObj.dirUp();
        });
    }
});
