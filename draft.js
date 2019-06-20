
var effectiveGrowth = true;

const ALMOST_ZERO = Math.pow(2, -10);

var prop = 16;

var effectsCount = 0;
const FX_SHARP = effectsCount++;
const FX_BLUNT = effectsCount++;
const FX_PIERCING = effectsCount++;
const FX_FIRE = effectsCount++;
const FX_WATER = effectsCount++;
const FX_ICE = effectsCount++;
const FX_WIND = effectsCount++;
const FX_EARTH = effectsCount++;
const FX_ELECTRIC = effectsCount++;
const FX_METAL = effectsCount++;
const FX_LIGHT = effectsCount++;
const FX_DARK = effectsCount++;
const FX_POISON = effectsCount++;

var LEFT = [37, 65, 81];
var UP = [38, 87, 90];
var RIGHT = [39, 68];
var DOWN = [40, 83];

var K_DIRECTION = LEFT.concat(UP).concat(RIGHT).concat(DOWN);
var K_JUMP = 32;
var K_FOCUS = 223;
var K_PRESSFOCUS = 191;

var CLEFT = [72];
var CUP = [85];
var CDOWN = [74];
var CRIGHT = [75];
var K_CDIRECTION = CLEFT.concat(CUP).concat(CDOWN).concat(CRIGHT);

function getKDirection(kleft = LEFT, kup = UP, kright = RIGHT, kdown = DOWN) {
    var direction = Vector.filled(2, 0);
    
    if(keyList.value(kleft)) {
        direction.add(0, -1);
    } if(keyList.value(kup)) {
        direction.add(1, -1);
    } if(keyList.value(kright)) {
        direction.add(0, +1);
    } if(keyList.value(kdown)) {
        direction.add(1, +1);
    }
    
    return direction.normalize();
}

function getMousePosition(dimension) {
    var position = Vector.subtraction(mouse.position, [CANVAS.offsetLeft, CANVAS.offsetTop]).multiply([CANVAS.width / CANVAS.clientWidth, CANVAS.height / CANVAS.clientHeight]);
    
    if(arguments.length == 1) {
        return position[dimension] + CAMERA.getOffset()[dimension];
    }
    
    return Vector.addition(position, CAMERA.getOffset());
}

var imageCounter = 0;

function loadImage(src) {
    var image = document.createElement("img");
    ++imageCounter;
    image.onload = function onload() {
        --imageCounter;
    };
    
    image.src = src;
    
    return image;
}

var IMG_SEED = loadImage("seed.png");

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
