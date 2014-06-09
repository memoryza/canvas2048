/**
* 游戏类数据存储
* author:memoryza(jincai.wang@foxmail.com)
**/

game.prototype.getScore = function() {
    return this.score;
}
game.prototype.setScore = function(num) {
   this.score = num;
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
    //绘制背景
    this.context.fillStyle = this.bgColor[num];
    this.context.fillRect(3 + y * this.gWidth, 3 + x * this.gWidth,  this.gWidth-4, this.gWidth-4);
    //绘制文字
    this.context.font = 'bold ' + this.baseNum + 'px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline ='middle';
    this.context.fillStyle = '#000';
    var posY = this.startPoint + (1 + x * 2) * this.gWidth/2,
        posX= this.startPoint + (1 + y * 2) * this.gWidth/2;
    this.context.fillText(num, posX, posY);
}
//清空格子
game.prototype.clearGrid = function(x, y) {
    var xPoint = this.startPoint + x * this.gWidth,
        yPoint = this.startPoint + y * this.gWidth;
    this.context.clearRect(xPoint+1, yPoint+1, this.gWidth-2, this.gWidth-2);
}
//重置格子
game.prototype.resetGrid = function(step) {
    var that = this;
    step = !isNaN(step) && step ? step : 1;
    var prevHistory = this.resetDataList || this.getSomeHistory(step).data;//优先撤销功能
    for(var i = 0; i < this.gridNum; i++) {
        this.animate(i, function() {
            for(var j = 0; j < that.gridNum; j++) {
                //移动前 格子里有值才重绘
                if(prevHistory[i][j]) {
                    that.clearGrid(j, i);
                }
                if(that.resList[i][j]) {
                    that.fillGrid(i, j, that.resList[i][j]);
                }
            }  
        });
        
    }
}
//历史记录
game.prototype.history = function() {
    var cacheList = [];
    cacheList = this.cacheList.copyTo(cacheList);
    var his = {
        data: cacheList,
        score: this.prevScore
    };
    //只存5步
    if(this.historyList.length > 4) {
        this.historyList.reverse();
        this.historyList.length = 4;
        this.historyList.reverse();
    }
    this.historyList.push(his);
}
game.prototype.getSomeHistory = function(i) {
    var len = this.historyList.length;
    if(!len) {
        return {data: this.initArray(0), score:0};
    }
    if(i >= len) {
        i = 1;
    }
    return this.historyList[len - i];
}
//bNum回复几步，连续两次则绘制一次,暂定回退5步
game.prototype.back = function(bNum) {
    bNum = parseInt(bNum);
    if(isNaN(bNum) || !parseInt(bNum)) {
        return false;
    }
    if(bNum > this.historyList.length) {
        return false;
    }
    if(bNum > this.historyCount) {
        return false;
    }
    this.resetDataList = this.resList.copyTo(this.resetDataList);
    var his = this.getSomeHistory(bNum);
    this.resList = his.data.copyTo(this.resList);
    this.setScore(his.score);

    this.historyCount -= bNum;
    this.resetGridStatus();
    this.resetGrid(bNum);
    this.resetDataList = null;
    //后pop，先处理数据
    for(var i = 0; i < bNum; i++) {
        this.historyList.pop();
    }
    this.isGameOver = false;
}
