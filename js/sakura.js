var stop, staticx;
var img = new Image();
img.src = "/images/sakura.png"; // 确保图片路径正确

var sakuraNum = 21;
var limitTimes = 2;
var limitArray = new Array(sakuraNum).fill(limitTimes);

function Sakura(x, y, s, r, fn, idx) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.r = r;
    this.fn = fn;
    this.idx = idx;
}

Sakura.prototype.draw = function(cxt) {
    cxt.save();
    cxt.translate(this.x, this.y);
    cxt.rotate(this.r);
    cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s);
    cxt.restore();
}

Sakura.prototype.update = function() {
    this.x = this.fn.x(this.x, this.y);
    this.y = this.fn.y(this.y, this.y);
    this.r = this.fn.r(this.r);

    if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
        if (limitArray[this.idx] == -1 || limitArray[this.idx] > 0) {
            this.r = getRandom('fnr');
            if (Math.random() > 0.4) {
                this.x = getRandom('x');
                this.y = 0;
            } else {
                this.x = window.innerWidth;
                this.y = getRandom('y');
            }
            this.s = getRandom('s');
            this.r = getRandom('r');

            if (limitArray[this.idx] > 0) {
                limitArray[this.idx]--;
            }
        }
    }
}

function getRandom(option) {
    var ret, random;
    switch (option) {
        case 'x': ret = Math.random() * window.innerWidth; break;
        case 'y': ret = Math.random() * window.innerHeight; break;
        case 's': ret = Math.random(); break;
        case 'r': ret = Math.random() * 6; break;
        case 'fnx': ret = (x, y) => x + 0.5 * (Math.random() - 0.5) - 1.7; break;
        case 'fny': ret = (x, y) => y + 1.5 + Math.random() * 0.7; break;
        case 'fnr': ret = (r) => r + Math.random() * 0.03; break;
    }
    return ret;
}

function startSakura() {
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame;

    var canvas = document.createElement('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style = "position: fixed;left: 0;top: 0;pointer-events: none;";
    canvas.id = "canvas_sakura";
    document.body.appendChild(canvas);

    var cxt = canvas.getContext('2d');
    var sakuraList = new SakuraList();

    for (var i = 0; i < sakuraNum; i++) {
        var sakura = new Sakura(getRandom('x'), getRandom('y'), getRandom('s'), getRandom('r'), {
            x: getRandom('fnx'),
            y: getRandom('fny'),
            r: getRandom('fnr')
        }, i);
        sakura.draw(cxt);
        sakuraList.push(sakura);
    }

    stop = requestAnimationFrame(function animate() {
        cxt.clearRect(0, 0, canvas.width, canvas.height);
        sakuraList.update();
        sakuraList.draw(cxt);
        stop = requestAnimationFrame(animate);
    });
}

function stopp() {
    var child = document.getElementById("canvas_sakura");
    if (child) {
        child.parentNode.removeChild(child);
        window.cancelAnimationFrame(stop);
        staticx = false;
        console.log("樱花动画已停止。");
    } else {
        console.log("樱花动画已启动。");
        startSakura();
    }
}

img.onload = startSakura;
img.onerror = function () {
    console.warn("樱花图片加载失败！仍然启动动画。");
    startSakura();
}

window.onresize = function () {
    var canvasSakura = document.getElementById('canvas_sakura');
    if (canvasSakura) {
        canvasSakura.width = window.innerWidth;
        canvasSakura.height = window.innerHeight;
    }
}
