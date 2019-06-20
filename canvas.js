
const CANVAS = document.getElementById("canv");
const CTX = CANVAS.getContext("2d");

var wprop = CANVAS.width / BASEWIDTH;
var hprop = CANVAS.height / BASEHEIGHT;

CTX.textBaseline = "top";
CTX.font = (16 * hprop) + "px Luckiest Guy, Consolas";

CANVAS.makePattern = function makePattern(image, width, height, repetition) {
    var tmpr = document.createElement("canvas");
    tmpr.width = width; tmpr.height = height;
    tmpr.getContext("2d").drawImage(image, 0, 0, width, height);
    
    return this.getContext("2d").createPattern(tmpr, repetition);
};

function makeCTile(bgcolor, shcolor, shcolor2 = bgcolor) {
    var tmpr = document.createElement("canvas");
    tmpr.width = tmpr.height = 16;
    var ctx = tmpr.getContext("2d");
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, tmpr.width, tmpr.height);
    ctx.fillStyle = shcolor2;
    ctx.fillRect(tmpr.width/2 - 1, 0, 1, tmpr.height);
    ctx.fillRect(0, tmpr.height/2 - 1, tmpr.width, 1);
    ctx.fillStyle = shcolor;
    ctx.fillRect(tmpr.width - 1, 0, 1, tmpr.height);
    ctx.fillRect(0, tmpr.height - 1, tmpr.width, 1);
    
    return CANVAS.getContext("2d").createPattern(tmpr, "repeat");
}
