;eventUtil.addHandler(window, 'load', function() {
    //尽量做到一个参数控制整个布局，计算量会比固定数值的大一点
    var Index = {
        controller: function(dir) {
            switch(dir) {
                case 'up':
                    gameObj.dirUp();
                    break;
                case 'down':
                    gameObj.dirDown();
                    break;
                case 'left':
                    gameObj.dirLeft();
                    break;
                case 'right':
                    gameObj.dirRight();
                    break;
                default:
                    return false;
            }
            Index.changeInfo();
        },
        isMobileDevice: function() {
            if((navigator.userAgent.indexOf('iPhone') != -1)
            || (navigator.userAgent.indexOf('iPod') != -1)
            || (navigator.userAgent.indexOf('iPad') != -1)) {
                return true;
            }
            if(navigator.userAgent.match(/Android/i)) {
                return true;
            }
        },
        init: function() {
            //初始化撤销数据
            $('undo').data('backCount', 5);
            //绑定重玩事件
            eventUtil.addHandler($('restart'), 'click', function() {
                gameObj.reStart();
                $('undo').data('backCount', 5);
                $('undoNum').innerHTML = 5;
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
            if(Index.isMobileDevice()) {
                Index.initTouch();
            } else {
                Index.initPC();
            }
        },
        initPC: function() {
            //上
            eventUtil.addHandler($('up'), 'click', function() {
                Index.controller('up');
            });
             //下
            eventUtil.addHandler($('down'), 'click', function() {
                Index.controller('down');
            });
            //左
            eventUtil.addHandler($('left'), 'click', function() {
                Index.controller('left');
            });
            //右
            eventUtil.addHandler($('right'), 'click', function() {
                Index.controller('right');
            });

            eventUtil.addHandler(document, 'keyup', function(e) {
                var ev = eventUtil.getEvent(e),
                    code = eventUtil.getCharCode(ev);
                switch(code) {
                    case 37:
                        Index.controller('left');
                        break;
                    case 38:
                        Index.controller('up');
                        break;
                    case 39:
                        Index.controller('right');
                        break;
                    case 40:
                        Index.controller('down');
                        break;
                }
            })
        },
        //移动设备
        initTouch: function() {
            $('controller').style.display = 'none';
            var startX, startY;
            eventUtil.addHandler($('grid'), 'touchstart', function(e) {
                var touch = e.targetTouches[0];
                startX = touch.pageX,
                startY = touch.pageY;
            });
            eventUtil.addHandler($('grid'), 'touchend', function(end) {
                var touchEnd = end.changedTouches[0],
                    endX = touchEnd.pageX,
                    endY = touchEnd.pageY,
                    dirUOrD = endY - startY,
                    dirLOrR = endX - startX;
                if(dirLOrR > 100) {
                    Index.controller('right');
                    return;
                } else if(dirLOrR < -100) {
                    Index.controller('left');
                    return;
                }

                if(dirUOrD > 50) {
                    Index.controller('down');
                } else if(dirUOrD < -50) {
                    Index.controller('up');
                }
            });
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
        Index.init();
    }
});
