/**
* 游戏类数据存储
* author:memoryza(jincai.wang@foxmail.com)
**/

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
//重置表格状态，todo：每次产生变动的点进行状态重置
game.prototype.resetGridStatus = function() {
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
//填充格子(坐标_
game.prototype.fillGrid = function(x, y, num) {
    this.context.font = 'bold ' + this.baseNum + 'px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline ='middle';
    var posY = this.startPoint + (1 + x * 2) * this.gWidth/2,
        posX= this.startPoint + (1 + y * 2) * this.gWidth/2;
    this.context.fillText(num, posX, posY);
}
//清空格子
game.prototype.clearGrid = function(x, y) {
    var xPoint = this.startPoint + x * this.gWidth,
        yPoint = this.startPoint + y * this.gWidth;
    this.context.clearRect(xPoint+1, yPoint+1, this.gWidth-4, this.gWidth-4);
}
//重置格子
game.prototype.resetGrid = function() {
    var prevHistory = this.getPrevHistory();
    for(var i = 0; i < this.gridNum; i++) {
        for(var j = 0; j < this.gridNum; j++) {
            //移动前 格子里有值才重绘
            if(prevHistory[i][j]) {
                this.clearGrid(j, i);
            }
            if(this.resList[i][j]) {
                this.fillGrid(i, j, this.resList[i][j]);
            }
        }
    }
}
//历史记录
game.prototype.history = function() {
    var cacheList = [],x2yList = [];
    //矩阵转换
    for(var i = 0; i < this.gridNum; i++) {
        cacheList[i] = this.cacheList[i].slice(0);
    }
    var his = {
        data: cacheList,
        score: this.score
    };
    //只存5步
    if(this.historyList.length > 4) {
        this.historyList.reverse();
        this.historyList.length = 4;
    }
    this.historyList.push(his);
}
game.prototype.getPrevHistory = function() {
    var len = this.historyList.length;
    if(!len) {
        return this.initArray();
    }
    return this.historyList[len - 1].data;
}
//bNum回复几步，连续两次则绘制一次,暂定回退5步
game.prototype.back = function(bNum) {
    bNum = parseInt(bNum) ? bNum : 1;
    bNum = bNum > this.historyCount ? this.historyCount : bNum;
    bNum = bNum > this.historyList.length ? this.historyList.length : bNum;
    var his;
    for(var i = 0; i < bNum; i++) {
        his = this.historyList.pop();
    }
    //回退步数
    this.historyCount -= bNum;
    this.score = his.score;
    this.resList = his.data;
    this.resetGridStatus();
    this.resetGrid();
}
