function $(id) {
        return document.getElementById(id);
    }

    function game(canvas) {
        var nil = null;
        this.context = nil;
        this.score = 0;
        this.x2y = nil;
        this.movePoint = nil;
        this.endPoint = nil;
        this.bgColor = nil;
        this.startPoint = 1;//坐标起点
        this.baseNum = 40;
        this.gWidth = this.baseNum * 2;//格子宽度
        this.canvas = canvas;
        this.gridNum = 0;
        this.resList = nil;
    }
    //初始化参数
    game.prototype.init = function() {
        var startPoint = this.startPoint,
            fWidth = this.getWidth(1),
            sWidth = this.getWidth(2),
            tGrid = this.getWidth(3),
            fourGrid = this.getWidth(4);

        this.context = this.canvas.getContext('2d');
        this.x2y = this.initArray();//只存0、1做状态标记
        this.resList = this.initArray();//存用户拼装的数据
        this.gridNum = this.x2y.length;
        this.movePoint = [
            [startPoint, startPoint], [startPoint, fWidth], [startPoint, sWidth], [startPoint, tGrid], [startPoint, fourGrid],//横轴
            [startPoint, startPoint], [fWidth, startPoint], [sWidth, startPoint], [tGrid, startPoint], [fourGrid, startPoint],//竖轴
        ];
        this.endPoint = [
            [fourGrid, startPoint], [fourGrid, fWidth], [fourGrid, sWidth], [fourGrid, tGrid], [fourGrid, fourGrid],//横轴
            [startPoint, fourGrid], [fWidth, fourGrid], [sWidth, fourGrid], [tGrid, fourGrid], [fourGrid, fourGrid],//竖轴
        ];
        this.bgColor = ['#fff', '#ffb', '#fa3', '#f51', '#f33', '#f00', '#ff3', '#ff0', '#ee0', '#bb0', '#0a0'];//todo

        this.drawGrid();
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
    //绘制格子
    game.prototype.drawGrid = function() {
        this.context.beginPath();
        this.context.strokeStyle = '#fb6';
        this.context.lineWidth = 2;
        for(var i = 0, _len = this.movePoint.length; i < _len; i++) {
            this.context.moveTo(this.movePoint[i][0], this.movePoint[i][1]);
            this.context.lineTo(this.endPoint[i][0], this.endPoint[i][1]);
        }
        this.context.stroke();
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
    //设置填充状态
    game.prototype.getGridStatus = function(one, dim) {
        if(one < this.gridNum && dim < this.gridNum) {
            return this.x2y[one][dim];
        }
        return false;
    }
    //获取填充状态
    game.prototype.setGridStatus = function(one, dim, flag) {
        if(one < this.gridNum && dim < this.gridNum) {
            this.x2y[one][dim] = flag;
        }
    }
    //检查并重置表格状态，todo：每次产生变动的点进行状态重置
    game.prototype.checkGridStatus = function() {
        for(var i = 0; i < this.gridNum; i++) {
            for(var j = 0; j < this.gridNum; j++) {
                this.setGridStatus(i, j, (this.getResListData(i,j) == 0 ? 0 : 1));
            }
        }
    }

    //设置表格数值
    game.prototype.setResListData = function(one, dim, val) {
        if(one < this.gridNum && dim < this.gridNum) {
            this.resList[one][dim] = val;
        }
    }
    //设置表格数值,false等同于0
    game.prototype.getResListData = function(one, dim) {
        if(one < this.gridNum && dim < this.gridNum) {
            return this.resList[one][dim];
        }
    }
    //绘制数值
    game.prototype.drawEntity = function() {
        var num = this.getRandomNum(),
            pos = this.getIdleGrid();

        if(!pos) {
            this.message('^_^我的内部遇到的问题，请刷新试试');
            return false;
        }
        this.setGridStatus(pos[0], pos[1], 1);
        this.setResListData(pos[0], pos[1], num);
        this.context.font = 'bold ' + this.baseNum + 'px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline ='middle';
        var posY = this.startPoint + (1 + pos[0] * 2) * this.gWidth/2,
            posX= this.startPoint + (1 + pos[1] * 2) * this.gWidth/2;

        this.context.fillText(num, posX, posY);
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
    //开始
    game.prototype.start = function() {
        for(var i = 0; i < 2; i++) {
            this.drawEntity();
        }
    }
    //重新开始
    game.prototype.reStart = function() {
        //todo:考虑将积分、排行本地存储
        //清空积分
        this.score = 0;
        //清空画布
        this.context.clearRect(0, 0, 400, 400);
        //重绘页面
        this.init();
    }

    game.prototype.dirUp = function() {
        var transform = [[], [], [], []];
        //矩阵转换
        for(var i = 0; i < this.gridNum; i++) {
            for(var j = 0; j < this.gridNum; j++) {
                transform[j].push(this.resList[i][j]);
            }
        }
        for(var i = 0; i < this.gridNum; i++) {
            this.mergeItems(transform[i]);
        }
        //矩阵转换回来
        for(var i = 0; i < this.gridNum; i++) {
            for(var j = 0; j < this.gridNum; j++) {
                this.resList[j].push(transform[i][j]);
            }
        }
        //检查并重置状态
        this.checkGridStatus();
    }
    //合并格子里的值
    game.prototype.mergeItems(items) {

    }


    //尽量做到一个参数控制整个布局，计算量会比固定数值的大一点
    var canvas  = $('grid'),
        gameObj = null;
    if(canvas.getContext) {
        gameObj = new game(canvas);
        gameObj.init();
        $('restart').addEventListener('click', function() {
            gameObj.reStart();
        }, false);
    }
