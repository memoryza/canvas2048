/**
* 游戏类操作
* author:memoryza(jincai.wang@foxmail.com)
**/

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
    this.setScore(0);
    this.prevScore = 0;
    this.resetDataList = null;
    this.canCreateGird = true;
    this.isGameOver = false;
    //清空画布
    this.context.clearRect(0, 0, 400, 400);
    //重绘页面
    this.init();
}
//移动完毕后公用部分
game.prototype.dirCommonOp = function() {
    //如果什么都没有变则不需要充值格子,需要提炼（上，下左右）
    if(this.isGameOver) {
        this.gameOver();
        return false;
    }
    this.canCreateGird = !this.cacheList.equal(this.resList);
    if(this.canCreateGird) {
        //重置状态
        this.resetGridStatus();
        //记录历史数据
        this.history();
        //重置格子
        this.resetGrid(1);

        this.prevScore = this.getScore();
        this.drawEntity();
    } else {
        //检测一下是不是游戏结束(防止结束以后反复检测状态，耗费性能)
        if(this.isGameOver) {
            this.gameOver();
        } else {
            this.checkGameStatus();
        }
    }
}
/*这里考虑到上下代码公用,左右也公用，虽然逻辑只有一行只差，但为了保证查看不便暂时不提炼*/
game.prototype.dirUp = function() {
    var transform = [[], [], [], []],
        tempData = [];
    //矩阵转换
    this.cacheList = this.resList.copyTo(this.cacheList);
    for(var i = 0; i < this.gridNum; i++) {
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
    this.dirCommonOp();
}
game.prototype.dirDown = function() {
    var transform = [[], [], [], []],
        tempData = [];
    //矩阵转换
    this.cacheList = this.resList.copyTo(this.cacheList);
    for(var i = 0; i < this.gridNum; i++) {
        for(var j = 0; j < this.gridNum; j++) {
            transform[j].push(this.resList[i][j]);
        }
    }
    for(var i = 0; i < this.gridNum; i++) {
        tempData = this.mergeItems(transform[i].reverse()).reverse();
        for(var j = 0; j < this.gridNum; j++) {
            this.resList[j][i] = tempData[j];
        }
    }
    this.dirCommonOp();
}
game.prototype.dirLeft = function() {
    var transform = [[], [], [], []];
    this.cacheList = this.resList.copyTo(this.cacheList);
    //矩阵转换
    for(var i = 0; i < this.gridNum; i++) {
        transform[i] = this.resList[i];
    }
    for(var i = 0; i < this.gridNum; i++) {
        this.resList[i] = this.mergeItems(transform[i]);
    }
    this.dirCommonOp();
}
game.prototype.dirRight = function() {
    var transform = [[], [], [], []];
    this.cacheList = this.resList.copyTo(this.cacheList);
    //矩阵转换
    for(var i = 0; i < this.gridNum; i++) {
        transform[i] = this.resList[i].reverse();
    }
    for(var i = 0; i < this.gridNum; i++) {
        this.resList[i] = this.mergeItems(transform[i]).reverse();
    }
    this.dirCommonOp();
}
