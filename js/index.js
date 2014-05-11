;eventUtil.addHandler(window, 'load', function() {
    //尽量做到一个参数控制整个布局，计算量会比固定数值的大一点
    var Index = {
        initDom: function() {
            //初始化撤销数据
            $('undo').data('backCount', 5);
            //绑定重玩事件
            eventUtil.addHandler($('restart'), 'click', function() {
                gameObj.reStart();
                $('undo').data('backCount', 5);
                Index.changeInfo();
            });
            //上
            eventUtil.addHandler($('up'), 'click', function() {
                gameObj.dirUp();
                Index.changeInfo();
            });
             //下
            eventUtil.addHandler($('down'), 'click', function() {
                gameObj.dirDown();
                Index.changeInfo();
            });
            //左
            eventUtil.addHandler($('left'), 'click', function() {
                gameObj.dirLeft();
                Index.changeInfo();
            });
            //右
            eventUtil.addHandler($('right'), 'click', function() {
                gameObj.dirRight();
                Index.changeInfo();
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
            eventUtil.addHandler(document, 'keyup', function(e) {
                var ev = eventUtil.getEvent(e),
                    code = eventUtil.getCharCode(ev);
                switch(code) {
                    case 37:
                        $('left').click();
                        break;
                    case 38:
                        $('up').click();
                        break;
                    case 39:
                        $('right').click();
                        break;
                    case 40:
                        $('down').click();
                        break;
                }
            })
        },
        //会加入其他改动信息
        changeInfo: function() {
            $('score').innerHTML = gameObj.getScore();
        }
    }

    var canvas  = $('grid'),
        gameObj = null;
    if(canvas.getContext) {
        gameObj = new game(canvas);
        gameObj.init();
        Index.initDom();
    }
});
