/**
* 游戏类定义
* author:memoryza(jincai.wang@foxmail.com)
**/

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
    this.canCreateGird = true;
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
