
const INVISIBLE = "#00000000";

// 

var loadCounter = 0;
var IMGS = [];

function loadImage(src) {
    var image = document.createElement("img");
    ++loadCounter;
    image.onload = function onload() {
        --loadCounter;
    };
    
    IMGS.push(image);
    
    image.src = src;
    
    return image;
}

var IMG_SEED = loadImage("images/seed.png");

var IMG_SKY = loadImage("images/sky1.png");

var IMG_GRASSTILE = loadImage("images/grasstile.png");
var IMG_GRASSTILE_C = loadImage("images/grasstile-c.png");
var IMG_HPP_C0 = loadImage("images/hpp-c0.png");

const IMG_FIST_LEFT = loadImage("images/fist-left-tp.png");

var IMGS_HAPLE_RUN_RIGHT = [
    loadImage("images/run-right0.png"),
    loadImage("images/run-right1.png"),
    loadImage("images/run-right2.png"),
    loadImage("images/run-right3.png")
];

var IMGS_HAPLE_RUN_LEFT = [
    loadImage("images/run-left0.png"),
    loadImage("images/run-left1.png"),
    loadImage("images/run-left2.png"),
    loadImage("images/run-left3.png")
];

var IMG_HAPLE_STD_RIGHT = loadImage("images/std-right.png");
var IMG_HAPLE_STD_LEFT = loadImage("images/std-left.png");

var IMG_HAPLE_JUMP_RIGHT = loadImage("images/jump-right.png");
var IMG_HAPLE_JUMP_LEFT = loadImage("images/jump-left.png");

var IMG_HAPLE_FALL_RIGHT = loadImage("images/fall-right.png");
var IMG_HAPLE_FALL_LEFT = loadImage("images/fall-left.png");

var IMG_MAP_DRAFT = loadImage("images/map-draft.png");
var IMG_MAP_GRASS = loadImage("images/map-grassc.png");

var IMG_WALLTILE = loadImage("images/wall-c.png");
var IMG_OBSTACLETILE = loadImage("images/obstacle-c.png");

var IMG_DCRT_L3 = loadImage("images/decoration-level3.png");

// 

var PTRN_GRASS1;

IMG_GRASSTILE.addEventListener("load", function() {
    var c = document.createElement("canvas");
    c.width = 64 * wprop; c.height = 64 * hprop;
    
    var ctx = c.getContext("2d");
    
    ctx.fillStyle = "#3F3F00";
    ctx.fillRect(0, 0, 64 * wprop, 64 * hprop);
    ctx.drawImage(IMG_GRASSTILE, 0, 0, 16 * wprop, 16 * hprop);
    ctx.drawImage(IMG_GRASSTILE, 16 * wprop, 16 * wprop, 32 * hprop, 32 * hprop);
    
    PTRN_GRASS1 = CANVAS.getContext("2d").createPattern(c, "no-repeat");
});

var PTRN_WALL;

IMG_WALLTILE.addEventListener("load", function() {
    PTRN_WALL = CANVAS.makePattern(this, 8 * wprop, 8 * hprop, "repeat");
});

var PTRN_OBSTACLE;

IMG_OBSTACLETILE.addEventListener("load", function() {
    PTRN_OBSTACLE = CANVAS.makePattern(this, 8 * wprop, 8 * hprop, "repeat");
});

var PTRN_SMOKE;

(function() {
    var c = document.createElement("canvas");
    c.width = 64, c.height = 64;
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    PTRN_SMOKE = CANVAS.makePattern(c, 16 * wprop, 16 * hprop, "no-repeat");
})();
