/**
* 游戏类操作
* author:memoryza(jincai.wang@foxmail.com)
**/
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
    this.canCreateGird = true;
    //清空画布
    this.context.clearRect(0, 0, 400, 400);
    //重绘页面
    this.init();
}

game.prototype.dirUp = function() {
    var transform = [[], [], [], []],
        tempData = [];
    //矩阵转换
    for(var i = 0; i < this.gridNum; i++) {
        this.cacheList[i] = this.resList[i].slice(0);
        for(var j = 0; j < this.gridNum; j++) {
            transform[j].push(this.resList[i][j]);
        }
    }
    for(var i = 0; i < this.gridNum; i++) {
        tempData = this.mergeItems(transform[i]);
        for(var j = 0; j < this.gridNum; j++) {
            this.resList[j][i] = tempData[j];
        }
    }

    //重置状态
    this.resetGridStatus();
    //如果什么都没有变则不需要充值格子,需要提炼（上，下左右）
    this.canCreateGird = !this.cacheList.equal(this.resList);
    if(this.canCreateGird) {
        //记录历史数据
        this.history();
        //重置格子
        this.resetGrid();
    }
    this.drawEntity();
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
            this.score += newItems[i];
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

//绘制数值
game.prototype.drawEntity = function() {
    var num = this.getRandomNum(),
        pos = this.getIdleGrid();

    if(!pos) {
        this.message('5_5 游戏结束');
        return false;
    }
    this.setGridStatus(pos[0], pos[1], 1);
    this.setResListData(pos[0], pos[1], num);
    this.fillGrid(pos[0], pos[1], num);
}
