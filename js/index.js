;eventUtil.addHandler(window, 'load', function() {
    function $(id) {
        return document.getElementById(id);
    }
    window.$ = $;
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
        //上
        eventUtil.addHandler($('up'), 'click', function() {
            gameObj.dirUp();
        });
         //下
        eventUtil.addHandler($('down'), 'click', function() {
            gameObj.dirDown();
        });
        //左
        eventUtil.addHandler($('left'), 'click', function() {
            gameObj.dirLeft();
        });
        //右
        eventUtil.addHandler($('right'), 'click', function() {
            gameObj.dirRight();
        });
    }
});
