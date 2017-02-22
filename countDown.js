var CANVAS_WIDTH = 1024;
var CANVAS_HEIGHT = 508;

var MARGIN_LEFT = 10;
var MARGIN_TOP = 50;

var RADIUS = 8;
var balls = [];

var endTime = new Date(2017, 1, 22, 24, 0);
var currentShowSeconds = 0;

const COLORS = ['#33B5E5', '0099cc', '#aa66cc', '#9933cc', '#99cc00',"#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];
window.onload = function() {

	var canvas = document.getElementById('canvas');

	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	var ctx = canvas.getContext('2d');

	/*初始化时间*/
	currentShowSeconds = getCurrentShowSeconds();

	setInterval(function() {

		render(ctx);
		update();
	}, 50);
}

function render(ctx) {
	/*清空画布*/
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	var cur_hour = parseInt(currentShowSeconds / 3600),
		cur_minute = parseInt(currentShowSeconds % 3600 / 60),
		cur_seconds = parseInt(currentShowSeconds % 60);

	renderDigit(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(cur_hour / 10), ctx);
	renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(cur_hour % 10), ctx);
	renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, ":", ctx);
	renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(cur_minute / 10), ctx);
	renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(cur_minute % 10), ctx);
	renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, ":", ctx);
	renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(cur_seconds / 10), ctx);
	renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(cur_seconds % 10), ctx);

	renderBalls(ctx);
}

/*绘制小球*/
function renderBalls(ctx) {
	for(var i = 0; i < balls.length; i++) {
		ctx.beginPath();
		ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI);
		ctx.fillStyle = balls[i].color;

		ctx.fill();
	}
}

/*更新画布*/
function update() {
	/*下一秒*/
	var nextShowSeconds = getCurrentShowSeconds();

	if(currentShowSeconds != nextShowSeconds) {

		var cur_hour = parseInt(currentShowSeconds / 3600),
			cur_minute = parseInt(currentShowSeconds % 3600 / 60),
			cur_seconds = parseInt(currentShowSeconds % 60);

		var next_hour = parseInt(nextShowSeconds / 3600),
			next_minute = parseInt(nextShowSeconds % 3600 / 60),
			next_seconds = parseInt(nextShowSeconds % 60);

		if(parseInt(cur_hour / 10) != parseInt(next_hour / 10)) {
			addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(next_hour / 10));
		}
		if(parseInt(cur_hour % 10) != parseInt(next_hour % 10)) {
			addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(next_hour % 10));
		}
		if(parseInt(cur_minute / 10) != parseInt(cur_minute / 10)) {
			addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(next_minute / 10));
		}
		if(parseInt(cur_minute % 10) != parseInt(cur_minute % 10)) {
			addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(next_minute % 10));
		}
		if(parseInt(cur_seconds / 10) != parseInt(next_seconds / 10)) {
			addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(next_seconds / 10));
		}
		if(parseInt(cur_seconds % 10) != parseInt(next_seconds % 10)) {
			addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(next_seconds % 10));
		}
		/*更新时间*/
		currentShowSeconds = nextShowSeconds;
	}

	updateBalls();
	console.log(balls.length)
}

function updateBalls() {

	/*更新小球状态*/
	for(var i = 0; i < balls.length; i++) {
		var aBall = balls[i];

		aBall.x += aBall.vx;
		aBall.y += aBall.vy;
		aBall.vy += aBall.g;
		
		/*弹跳效果*/
		if(aBall.y >=  CANVAS_HEIGHT - RADIUS){
			aBall.y = CANVAS_HEIGHT - RADIUS;
			aBall.vy = -aBall.vy*0.65;
		}
	}
	
			/*移除超出屏幕的小球*/
		var cnt = 0;
		
		for(var i = 0; i< balls.length; i++){
			if(balls[i].x > 0 - RADIUS &&balls[i].x < CANVAS_WIDTH + RADIUS){
				balls[cnt] = balls[i];
				cnt++;
			}
		}
		
		while(balls.length > Math.min(cnt,300)){
			balls.pop();
		}
}

/*添加小球*/
function addBalls(x, y, num) {

	for(var i = 0; i < NUMBERS[num].length; i++) {

		var item = NUMBERS[num][i];

		for(var j = 0; j < item.length; j++) {

			if(item[j] === 1) {

				var aBall = {
					x: x + j * 2 * (RADIUS + 1),
					y: y + i * 2 * (RADIUS + 1),
					vx: Math.pow(-1, parseInt(1000 * Math.random())) * 4 + Math.random(),
					vy: -7,
					g: 1.5 + Math.random(),
					color: COLORS[parseInt(Math.random() * COLORS.length)]
				}
				balls.push(aBall);
			}
		}
	}

}

/*渲染数字*/
function renderDigit(x, y, num, ctx) {

	for(var i = 0; i < NUMBERS[num].length; i++) {

		var item = NUMBERS[num][i];

		for(var j = 0; j < item.length; j++) {

			if(item[j] === 1) {
				ctx.beginPath();
				ctx.arc(x + j * 2 * (RADIUS + 1), y + i * 2 * (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
				ctx.closePath();

				ctx.fillStyle = 'blue';
				ctx.fill();
			}
		}
	}
}

/*获取当前时间的秒数值*/
function getCurrentShowSeconds() {

	var current = new Date();

	var ret = parseInt((endTime.getTime() - current.getTime()) / 1000);

	return ret >= 0 ? ret : 0;
}