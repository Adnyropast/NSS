
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
    var ctile = document.createElement("canvas");
    ctile.width = ctile.height = 16;
    var ctx = ctile.getContext("2d");
    let cb = 1;
    
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, ctile.width, ctile.height);
    ctx.fillStyle = shcolor2;
    ctx.fillRect(ctile.width/2 - cb, 0, cb, ctile.height);
    ctx.fillRect(0, ctile.height/2 - cb, ctile.width, cb);
    ctx.fillStyle = shcolor;
    ctx.fillRect(ctile.width - cb, 0, cb, ctile.height);
    ctx.fillRect(0, ctile.height - cb, ctile.width, cb);
    
    return CANVAS.makePattern(ctile, CTILE_WIDTH, CTILE_WIDTH, "repeat");
}
