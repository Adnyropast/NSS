
var effectiveGrowth = true;

const ALMOST_ZERO = Math.pow(2, -10);

var WORLD_PACE = 16;

const BASEWIDTH = 640;
const BASEHEIGHT = 360;
const BASESIZE = [BASEWIDTH, BASEHEIGHT];

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
var K_JUMP = [32];
var K_FOCUS = [223];
var K_PRESSFOCUS = [191];

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
    const position = Vector.subtraction(mouse.position, [CANVAS.offsetLeft, CANVAS.offsetTop]).multiply([CANVAS.width / CANVAS.clientWidth, CANVAS.height / CANVAS.clientHeight]);
    
    if(arguments.length == 1) {
        return position[dimension] / [wprop, hprop][dimension] + CAMERA.getOffset()[dimension];
    }
    
    return position.divide([wprop, hprop]).add(CAMERA.getOffset());
}

function makeMaze(width, height) {
    var maze = [];
    
    for(var y = 0; y < height; ++y) {
        maze[y] = [];
        for(var x = 0; x < width; ++x) {
            maze[y][x] = {"walls" : 15, "visited" : 0};
        }
    }
    
    for(var x = 0; x < width; ++x) {
        maze[0][x].walls -= 4;
        maze[height - 1][x].walls -= 8;
    } for(var y = 0; y < height; ++y) {
        maze[y][0].walls -= 1;
        maze[y][width - 1].walls -= 2;
    }
    
    var x = 0, y = 0;
    
    ++maze[x][y].visited;
    
    
    
    return maze;
}

function rsAddEntity(rectangle) {
    return "addEntity((new " + rectangle.constructor.name + "(" + rectangle.getX() + ", " + rectangle.getY() + ", " + rectangle.getWidth() + ", " + rectangle.getHeight() + ")))";
}

function rsJSON(rectangle) {
    return "{}";
}

function getMap(rectangles, rsFunction = rsAddEntity) {
    var prefix = "", suffix = ";", separator = "\n";
    
    var string = "";
    
    for(var i = 0; i < rectangles.length; ++i) {
        string += prefix + rsFunction(rectangles[i]) + suffix;
        
        if(i < rectangles.length - 1) {
            string += separator;
        }
    }
    
    return string;
}

function camelToSentence(string) {
    return string.replace(/^./, function(c) {
        return c.toUpperCase();
    }).replace(/.[A-Z]/g, function(str) {
        return str[0] + " " + str[1];
    });
}

function gather() {
    let res = [];
    
    if(arguments.length > 1) {
        let arrays = [];
        
        for(var i = 0; i < arguments.length; ++i) {
            // res.push.apply(res, gather(arguments[i]));
            arrays[i] = gather(arguments[i]);
            
            for(var j = 0; j < arrays[i].length; ++j) {
                if(res.indexOf(arrays[i][j]) == -1) {
                    res.push(arrays[i][j]);
                }
            }
        }
    } else if(arguments.length == 1 && Array.isArray(arguments[0])) {
        let arrays = [];
        
        for(var i = 0; i < arguments[0].length; ++i) {
            // res.push.apply(res, gather(arguments[0][i]));
            arrays[i] = gather(arguments[0][i]);
            
            for(var j = 0; j < arrays[i].length; ++j) {
                if(res.indexOf(arrays[i][j]) == -1) {
                    res.push(arrays[i][j]);
                }
            }
        }
    } else if(arguments.length == 1 && !Array.isArray(arguments[0])) {
        res.push(arguments[0]);
    }
    
    return res;
}

/* https://en.wikipedia.org/wiki/B%C3%A9zier_curve */

function cubicBezier(p0, p1, p2, p3) {
    return function b(t) {
        if(0 <= t && t <= 1) {
            return Math.pow(1 - t, 3) * p0   +   3 * Math.pow(1 - t, 2) * t * p1   +   3 * (1 - t) * t*t * p2   +   t*t*t * p3;
        }
        
        return NaN;
    };
}

const bezierLinear = cubicBezier(0, 0, 1, 1);
const bezierEase = cubicBezier(.25,.1,.25,1);
const bezierEaseIn = cubicBezier(.42,0,1,1);
const bezierEaseOut = cubicBezier(0,0,.58,1);
const bezierEaseInOut = cubicBezier(.42,0,.58,1);

var color1 = [255, 0, 255], color2 = [0, 255, 255];

var bezierF = bezierLinear;

function getColor(t) {
    var color = [0, 0, 0];
    
    for(var dim = 0; dim < 3; ++dim) {
        color[dim] = color1[dim] + bezierF(t) * (color2[dim] - color1[dim]);
    }
    
    return color;
}

var t = 0 / 64;

function rgba(r = 0, g = 0, b = 0, a = 1) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}
