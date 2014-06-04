/**
* 游戏类定义
* author:memoryza(jincai.wang@foxmail.com)
**/

function game(canvas) {
    if(this instanceof game) {
        var nil = null;
        this.context = nil;
        this.score = 0;//用户分数
        this.prevScore = 0;//用户上次积分（合并数据项的时候加积分了，暂时没想到合并之后再加的好办法：除非合并函数返回object）
        this.x2y = nil;//只存格子状态标记
        this.movePoint = nil;//绘制网格的坐标
        this.endPoint = nil;//绘制网格的结束坐标
        this.bgColor = nil;//格子的背景色
        this.startPoint = 1;//坐标起点
        this.baseNum = 40;//格子基数
        this.gWidth = this.baseNum * 2;//格子宽度
        this.canvas = canvas;
        this.gridNum = 0;//格子个数
        this.resList = nil;//存用户拼装的数据
        this.cacheList = nil;//用户记录上一次操作的历史
        this.canCreateGird = true;//是否需要重新绘制数据（上一步和本步没有产生格子合并则不需要重绘）
        this.historyList = nil;//用户操作历史
        this.historyCount = 5;//可回退步数
        this.resetDataList = nil;//当前要重绘的数据
        this.isGameOver = false;
        this.animateList = []; //[{a:b, b:c, c:c,d:d}]有a移动到b
        this.direction = 0;//0=>上,1=>下， 2=>左, 3=>右
    } else {
        new game(canvas);
    }
}
 //初始化参数
game.prototype.init = function() {
    var startPoint = this.startPoint,
        fWidth = this.getWidth(1),
        sWidth = this.getWidth(2),
        tGrid = this.getWidth(3),
        fourGrid = this.getWidth(4);

    this.context = this.canvas.getContext('2d');
    this.x2y = this.initArray();
    this.resList = this.initArray();
    this.cacheList = this.initArray();
    this.gridNum = this.x2y.length;
    this.historyList = [];
    this.movePoint = [
        [startPoint, startPoint], [startPoint, fWidth], [startPoint, sWidth], [startPoint, tGrid], [startPoint, fourGrid],//横轴
        [startPoint, startPoint], [fWidth, startPoint], [sWidth, startPoint], [tGrid, startPoint], [fourGrid, startPoint],//竖轴
    ];
    this.endPoint = [
        [fourGrid, startPoint], [fourGrid, fWidth], [fourGrid, sWidth], [fourGrid, tGrid], [fourGrid, fourGrid],//横轴
        [startPoint, fourGrid], [fWidth, fourGrid], [sWidth, fourGrid], [tGrid, fourGrid], [fourGrid, fourGrid],//竖轴
    ];
    this.bgColor = {
        '2': '#eee',
        '4': '#ffb',
        '8': '#fa3',
        '16': '#f51',
        '32': '#f33',
        '64': '#f00',
        '128': '#ff3',
        '256': '#ff0',
        '512': '#ee0',
        '1024': '#bb0',
        '2048': '#0a0',
        '4096': '#0a0'
        };//todo

    this.drawGridLine();
    this.start();
    //this.message('^_^我的内部遇到的问题，请刷新试试');
}
//获取第n条线起点值
game.prototype.getWidth = function(num) {
    return this.startPoint + num * this.gWidth;
}
//获取格子初始化数据状态
game.prototype.initArray = function() {
    return  [[0, 0, 0, 0],[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
}
//生成随机数
game.prototype.getRandomNum = function(){
    return  (Math.round(Math.random() - 0.2) + 1) * 2;//降低4出现的概率
}
//绘制数值
game.prototype.drawEntity = function() {
    var num = this.getRandomNum(),
        pos = this.getIdleGrid();
    if(!pos) {
        this.gameOver();
        return false;
    }
    this.setGridStatus(pos[0], pos[1], 1);
    this.setResListData(pos[0], pos[1], num);
    this.fillGrid(pos[0], pos[1], num);
}

//获取一个格子用于填充,返回[x, y]坐标
game.prototype.getIdleGrid = function() {
    var idleGrid = [];
    //获取未站位的格子
    for(var i = 0; i < this.gridNum; i++) {
        for (var j = 0; j < this.gridNum; j++) {
            if(this.getGridStatus(i,j) == 1) {
                continue;
            }
            idleGrid.push([i,j]);
        }
    }
    if(!idleGrid.length) return false;
    var pos = Math.round(Math.random() * idleGrid.length);
    pos = (pos == idleGrid.length)? pos - 1 : pos;//fixed 随机最大值
    return idleGrid[pos];
}
//信息提示,-1永久显示，直到用户点击
game.prototype.message = function(msg, time, cb) {
    if(typeof time == 'function') {
        cb = time;
    }
    time = time || 5000;
    //todo点击确定以后的回调事件绑定
    if(typeof cb == 'function') {
    }
    $('tipContent').innerHTML = msg;
    $('message').style.display = 'block';
    if(time != -1) {
        setTimeout(function(){
            $('message').style.display = 'none';
        }, time);
    }
}

//绘制格子
game.prototype.drawGridLine = function() {
    this.context.beginPath();
    this.context.strokeStyle = '#fb6';
    this.context.lineWidth = 2;
    for(var i = 0, _len = this.movePoint.length; i < _len; i++) {
        this.context.moveTo(this.movePoint[i][0], this.movePoint[i][1]);
        this.context.lineTo(this.endPoint[i][0], this.endPoint[i][1]);
    }
    this.context.stroke();
}
//检测游戏状态
game.prototype.checkGameStatus = function() {
    //先看格子状态
    for(var i = this.gridNum; --i >= 0;) {
        for(var j = this.gridNum; --j >= 0;) {
            if(this.getGridStatus(i,j) === 0) return true;
        }
    }
    //再做数据比较
     for(var i = 0; i < this.gridNum; i++) {
        for(var j = 0; j < this.gridNum; j++) {
            if(this.resList[i][j] === this.resList[i][j+1]) return true;
            if(this.resList[i+1] && (this.resList[i][j] === this.resList[i+1][j])) return true;
        }
    }
    this.gameOver();
}
//游戏结束，要设计成多样化提示
game.prototype.gameOver = function() {
    this.isGameOver = true;
    this.message('5_5 游戏结束');
}
//合并格子里的值
game.prototype.mergeItems = function(items) {
    var retItems = [],
        newItems = items.filter(function(val){
            if(val > 0) return val;
        });
    for(var i =0, _len = newItems.length; i < _len; i++) {
        if(newItems[i] === newItems[i+1]) {
            newItems[i] = 2 * newItems[i];
            newItems[i+1] = 0;
            //每合并一次就加分
            this.setScore(this.getScore() + newItems[i]);
        }
    }
    newItems = newItems.filter(function(val) {
        if(val > 0) return val;
    });
    for(var i =0, _len = items.length; i < _len; i++) {
        retItems.push(newItems[i] ? newItems[i] : 0);
    }
    return retItems;
}
game.prototype.animate = function() {

}
