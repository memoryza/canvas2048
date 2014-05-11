;eventUtil.addHandler(window, 'load', function() {
    //尽量做到一个参数控制整个布局，计算量会比固定数值的大一点
    var Index = {
        initDom: function() {
            //初始化撤销数据
            $('undo').data('backCount', 5);

            var canvas  = $('grid'),
                gameObj = null;
            if(canvas.getContext) {
                gameObj = new game(canvas);
                gameObj.init();
                //绑定重玩事件
                eventUtil.addHandler($('restart'), 'click', function() {
                    gameObj.reStart();
                    $('undo').data('backCount', 5);
                    $('score').innerHTML = gameObj.getScore();
                });
                //上
                eventUtil.addHandler($('up'), 'click', function() {
                    gameObj.dirUp();
                    $('score').innerHTML = gameObj.getScore();
                });
                 //下
                eventUtil.addHandler($('down'), 'click', function() {
                    gameObj.dirDown();
                    $('score').innerHTML = gameObj.getScore();
                });
                //左
                eventUtil.addHandler($('left'), 'click', function() {
                    gameObj.dirLeft();
                    $('score').innerHTML = gameObj.getScore();
                });
                //右
                eventUtil.addHandler($('right'), 'click', function() {
                    gameObj.dirRight();
                    $('score').innerHTML = gameObj.getScore();
                });
                //撤销
                eventUtil.addHandler($('undo'), 'click', function() {
                    var count = parseInt(this.data('backCount'));
                    if(!isNaN(count) && count > 0) {
                        if(false !== gameObj.back(1)) {
                            $('undoNum').innerHTML = --count;
                            this.data('backCount', count);
                            $('score').innerHTML = gameObj.getScore();
                        }
                    } else {
                        $('undoNum').innerHTML = '0';
                    }
                });
            }
        }
    }
    Index.initDom();
});
