
const INVISIBLE = "#00000000";

const CV_WHITE = [255, 255, 255, 1];
const CV_BLACK = [0, 0, 0, 1];
const CV_INVISIBLE = [0, 0, 0, 0];

function hexToColorVector(hex) {
    hex = hex.replace(/#/, "")
    
    let red = 255, green = 255, blue = 255, alpha = 1;
    
    if(hex.length == 3 || hex.length == 4) {
        red = parseInt(hex.substr(0, 1), 16) * 17;
        green = parseInt(hex.substr(1, 1), 16) * 17;
        blue = parseInt(hex.substr(2, 1), 16) * 17;
        
        if(hex.length == 4) {
            alpha = parseInt(hex.substr(3, 1), 16) / 15;
        }
    } else if(hex.length == 6 || hex.length == 8) {
        red = parseInt(hex.substr(0, 2), 16);
        green = parseInt(hex.substr(2, 2), 16);
        blue = parseInt(hex.substr(4, 2), 16);
        
        if(hex.length == 8) {
            alpha = parseInt(hex.substr(6, 2), 16) / 255;
        }
    }
    
    return [red, green, blue, alpha];
}

function isColorHex(color) {
    return typeof color == "string" && color.match(/^#(?:[\da-fA-F]{3}|[\da-fA-F]{4}|[\da-fA-F]{6}|[\da-fA-F]{8})$/) != null;
}

function rgba(r = 0, g = 0, b = 0, a = 1) {
    if(arguments.length == 1 && Array.isArray(arguments[0])) {
        return rgba.apply(this, arguments[0]);
    }
    
    return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

class ColorTransition {
    constructor(initialColor, endColor, duration = 1, timing = bezierLinear) {
        if(isColorHex(initialColor)) {
            this.initialColor = hexToColorVector(initialColor);
        } else {
            this.initialColor = initialColor;
        }
        
        if(isColorHex(endColor)) {
            this.endColor = hexToColorVector(endColor);
        } else {
            this.endColor = endColor;
        }
        
        this.duration = duration;
        this.step = -1;
        
        this.timing = timing;
        
        this.stepDirection = +1;
        this.loop = false;
    }
    
    static from(colorTransition) {
        return new this(colorTransition.initialColor, colorTransition.endColor, colorTransition.duration, colorTransition.timing).setLoop(colorTransition.loop);
    }
    
    at(t) {
        var color = new Vector();
        
        for(var dim = 0; dim < this.initialColor.length; ++dim) {
            color[dim] = this.initialColor[dim] + this.timing(t) * (this.endColor[dim] - this.initialColor[dim]);
        }
        
        return color;
    }
    
    getStyleAt(t) {
        var color = this.at(t);
        
        return rgba(color);
    }
    
    getProgress() {
        return this.step / this.duration;
    }
    
    getNext() {
        this.step += this.stepDirection;
        
        if(this.step > this.duration) {
            this.step = this.duration;
            
            if(this.loop) {
                this.stepDirection *= -1;
            }
        } if(this.step < 0) {
            this.step = 0;
            
            if(this.loop) {
                this.stepDirection *= -1;
            }
        }
        
        return this.at(this.getProgress());
    }
    
    getNextStyle() {
        var color = this.getNext();
        
        return rgba(color);
    }
    
    getCurrentStyle() {
        let vector = this.at(this.getProgress());
        
        return rgba(vector);
    }
    
    setDuration(duration) {
        this.duration = duration;
        this.step = -1;
        this.stepDirection = +1;
        
        return this;
    }
    
    setLoop(loop) {this.loop = loop; return this;}
    
    copy() {
        return this.constructor.from(this);
    }
}

class AnimatedImages {
    constructor(images = []) {
        this.images = images;
        
        this.icpf = 12;
        this.icount = 0;
        this.iindex = 0;
        
        this.alpha = Array(images.length).fill(1);
    }
    
    static from(anim) {
        var res = new this(anim.images);
        res.icpf = anim.icpf;
        res.alpha = anim.alpha;
        
        return res;
    }
    
    setIcpf(icpf) {this.icpf = icpf; return this;}
    
    getNext() {
        if(this.images.length > 0) {
            ++this.icount;
            
            if(this.icount >= this.icpf) {
                this.icount = 0;
                ++this.iindex; this.iindex %= this.images.length;
            }
            
            return this.images[this.iindex];
        }
        
        return null;
    }
    
    setImages(images) {
        this.icount = 0;
        
        return this;
    }
    
    setAlphaAt(i, alpha) {
        this.alpha[i] = alpha;
        
        return this;
    }
    
    addImage(image, alpha = 1) {
        this.images.push(image);
        this.alpha.push(alpha);
        
        return this;
    }
    
    getCurrent() {
        return this.images[this.iindex];
    }
    
    copy() {
        return this.constructor.from(this);
    }
}

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

var IMG_GRASSTILE = loadImage("images/grasstile.png");
var IMG_GRASSTILE_C = loadImage("images/grasstile-c.png");
var IMG_HPP_C0 = loadImage("images/hpp-c0.png");

const IMG_FIST_LEFT = loadImage("images/fist-left-tp.png");

var ANIM_HAPLE = {
    "std-right" : new AnimatedImages([loadImage("images/haple/std-right.png")]),
    "std-left" : new AnimatedImages([loadImage("images/haple/std-left.png")]),
    "run-right" : (new AnimatedImages([loadImage("images/haple/run-right0.png"), loadImage("images/haple/run-right1.png"), loadImage("images/haple/run-right2.png"), loadImage("images/haple/run-right3.png")])).setIcpf(12),
    "run-left" : (new AnimatedImages([loadImage("images/haple/run-left0.png"), loadImage("images/haple/run-left1.png"), loadImage("images/haple/run-left2.png"), loadImage("images/haple/run-left3.png")])).setIcpf(12),
    "jump-right" : new AnimatedImages([loadImage("images/haple/jump-right.png")]),
    "jump-left" : new AnimatedImages([loadImage("images/haple/jump-left.png")]),
    "fall-right" : new AnimatedImages([loadImage("images/haple/fall-right.png")]),
    "fall-left" : new AnimatedImages([loadImage("images/haple/fall-left.png")]),
    "cling-right" : new AnimatedImages([loadImage("images/haple/cling-right.png")]),
    "cling-left" : new AnimatedImages([loadImage("images/haple/cling-left.png")]),
    "swim-right" : (new AnimatedImages([loadImage("images/haple/swim-right0.png"), loadImage("images/haple/swim-right1.png")])).setIcpf(32),
    "swim-left" : (new AnimatedImages([loadImage("images/haple/swim-left0.png"), loadImage("images/haple/swim-left1.png")])).setIcpf(32),
    "hurt-right" : new AnimatedImages([loadImage("images/haple/hurt-right.png")]),
    "hurt-left" : new AnimatedImages([loadImage("images/haple/hurt-left.png")]),
    "crouch-right" : new AnimatedImages([loadImage("images/haple/crouch-right.png")]),
    "crouch-left" : new AnimatedImages([loadImage("images/haple/crouch-left.png")])
};

let CT_TEN = (new ColorTransition(CV_WHITE, [0, 255, 255, 1], 32)).setLoop(true);

let ANIM_TEN = {
    "std-right" : CT_TEN,
    "std-left" : CT_TEN,
    "run-right" : ColorTransition.from(CT_TEN).setDuration(8),
    "run-left" : ColorTransition.from(CT_TEN).setDuration(8),
    "jump-right" : ColorTransition.from(CT_TEN).setDuration(16),
    "jump-left" : ColorTransition.from(CT_TEN).setDuration(16),
    "fall-right" : ColorTransition.from(CT_TEN).setDuration(8),
    "fall-left" : ColorTransition.from(CT_TEN).setDuration(8),
    "cling-right" : ColorTransition.from(CT_TEN).setDuration(24),
    "cling-left" : ColorTransition.from(CT_TEN).setDuration(24),
    "swim-right" : ColorTransition.from(CT_TEN).setDuration(48),
    "swim-left" : ColorTransition.from(CT_TEN).setDuration(48),
    "hurt-right" : ColorTransition.from(CT_TEN).setDuration(2),
    "hurt-left" : ColorTransition.from(CT_TEN).setDuration(2),
    "crouch-right" : (new ColorTransition([0, 255, 0, 1], [127, 255, 127, 1], 64)).setLoop(true),
    "crouch-left" : (new ColorTransition([0, 255, 0, 1], [127, 255, 127, 1], 64)).setLoop(true)
};

var IMG_MAP_DRAFT = loadImage("images/map-draft.png");
var IMG_MAP_GRASS = loadImage("images/map-grassc.png");

var IMG_WALLTILE = loadImage("images/wall-c.png");
var IMG_OBSTACLETILE = loadImage("images/obstacle-c.png");

var IMG_DCRT_L3 = loadImage("images/decoration-level3.png");

const IMG_TREETRUNK = loadImage("images/treetrunk.png");
const IMG_TREEBACKGROUND = loadImage("images/treebackground.png");

// 

const CTILE_WIDTH = 16;

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

var PTRNS_SMOKE = new AnimatedImages([]).setIcpf(1);

{
    let count = 33;
    
    let tcolor = new ColorTransition([255, 255, 255, 255 / 255], [127, 127, 127, 31 / 255], count, bezierEaseInOut);
    
    for(var i = 0; i < count; ++i) {
        let c = document.createElement("canvas");
        c.width = 64, c.height = 64;
        let ctx = c.getContext("2d");
        
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.beginPath();
        ctx.arc(32, 32, 32 - 32 * (i / count), 0, Math.PI * 2);
        // ctx.arc(32, 32, ((count / 2) - Math.abs(i - (count / 2))), 0, Math.PI * 2);
        ctx.fillStyle = tcolor.getNextStyle();
        // console.log(ctx.fillStyle, tcolor.at(tcolor.getProgress())[3]);
        ctx.fill();
        // PTRNS_SMOKE.addImage(CANVAS.makePattern(c, 16 * wprop, 16 * hprop, "no-repeat"));
        PTRNS_SMOKE.addImage(c);
        // document.body.appendChild(c);
    }
};

var PTRN_SKY = makeSkyPattern(1024);

function makeSkyPattern(verticalCount) {
    return makeGradientCTilesCanvas(1, verticalCount, new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1]), new ColorTransition([0, 15, 239, 1], [0, 239, 239, 1]));
}

function makeGradientCTilesCanvas(horizontalCount, verticalCount, bgTransition, shTransition) {
    let width = horizontalCount * CTILE_WIDTH;
    let height = verticalCount * CTILE_WIDTH;
    
    let c = document.createElement("canvas");
    c.width = width, c.height = height;
    let ctx = c.getContext("2d");
    
    let n = c.width + c.height - CTILE_WIDTH;
    
    bgTransition.duration = shTransition.duration = n / CTILE_WIDTH;
    
    for(let i = 0; i < n; i += CTILE_WIDTH) {
        var a = i / CTILE_WIDTH, b = n / CTILE_WIDTH;
        ctx.fillStyle = makeCTile(bgTransition.getNextStyle(), shTransition.getNextStyle());
        
        for(let x = i, y = 0; x > i - c.height && y < c.height; x -= CTILE_WIDTH, y += CTILE_WIDTH) {
            ctx.translate(x, y);
            ctx.fillRect(0, 0, CTILE_WIDTH, CTILE_WIDTH); 
            ctx.translate(-x, -y);
        }
    }
    
    return c;
}

function makeGradientCTilesPattern(horizontalCount, verticalCount, bgTransition, shTransition) {
    // return CANVAS.makePattern(makeGradientCTilesCanvas(horizontalCount, verticalCount, bgTransition, shTransition), width / 2 * wprop, height / 2 * hprop, "repeat");
    return CANVAS.makePattern(makeGradientCTilesCanvas(horizontalCount, verticalCount, bgTransition, shTransition), horizontalCount * CTILE_WIDTH, verticalCount * CTILE_WIDTH, "repeat");
}

// makeGradientCTiles(64, 64, new ColorTransition([255, 0, 0, 1], [0, 255, 255, 1], 7), new ColorTransition([255, 255, 255, 1], [0, 0, 0, 1], 7));
// makeGradientCTiles(16, 256, new ColorTransition([255, 0, 0, 1], [0, 255, 255, 1]), new ColorTransition([255, 255, 255, 1], [0, 0, 0, 1]));

function makeTextCanvas(content, font = "Luckiest Guy", fillStyle = "black", strokeStyle) {
    let c = document.createElement("canvas");
    c.width, c.height;
    let ctx = c.getContext("2d");
    
    ctx.textBaseline = "top";
    ctx.font = c.height + "px " + font;
    c.width = ctx.measureText(content).width;
    ctx.textBaseline = "top";
    ctx.font = c.height + "px " + font
    
    ctx.fillStyle = fillStyle;
    ctx.fillText(content, 0, 0);
    
    if(typeof strokeStyle != "undefined") {
        ctx.strokeStyle = strokeStyle;
        ctx.strokeText(content, 0, 0);
    }
    
    return c;
}

function makeTextFit(content, width, height, font = "Luckiest Guy", fillStyle = "black", strokeStyle) {
    let c = document.createElement("canvas");
    c.width = width, c.height = height;
    let ctx = c.getContext("2d");
    
    let oc = makeTextCanvas(content, font, fillStyle, strokeStyle);
    
    if(oc.width != 0) {
        ctx.drawImage(oc, 0, 0, oc.width * height / oc.height, height);
    }
    
    return c;
}

function makeUnderwaterPattern(height) {
    return makeGradientCTiles(1, height, new ColorTransition([0, 255, 255, 0.125], [0, 0, 255, 0.125]), new ColorTransition([0, 15, 239, 0.125], [0, 239, 239, 0.125]));
}

function makeStyledCanvas(style, width, height) {
    let c = document.createElement("canvas");
    c.width = width; c.height = height;
    let ctx = c.getContext("2d");
    ctx.fillStyle = style;
    ctx.fillRect(0, 0, width, height);
    
    return c;
}

function makeCommandLabel(label, font = "Segoe UI", fillStyle = "#00007F", strokeStyle) {
    let c = document.createElement("canvas");
    c.width = CANVAS.width / 2, c.height = CANVAS.height / 9;
    let ctx = c.getContext("2d");
    
    let oc = makeTextFit(label, CANVAS.width / 2 - 32, CANVAS.height / 9 - 32, font, fillStyle);
    
    ctx.fillStyle = "#FFFF1F";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(oc, 16, 16);
    
    return c;
}

function makeCheckerPattern(style1, style2) {
    let c = document.createElement("canvas");
    c.width = 32, c.height = 16;
    let ctx = c.getContext("2d");
    
    ctx.fillStyle = style1;
    ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = style2;
    ctx.fillRect(16, 0, 16, 16);
    
    return CANVAS.getContext("2d").createPattern(c, "repeat");
}

function makeGradientCanvas(ColorTransition, width = 16, height = 16) {
    let c = document.createElement("canvas");
    c.width = width, c.height = height;
    let ctx = c.getContext("2d");
    
    let n = width + height - 1;
    
    ColorTransition.duration = n;
    
    for(let i = 0; i < n; ++i) {
        ctx.fillStyle = ColorTransition.getNextStyle();
        
        for(let x = i, y = 0; x > i - height && y < height; --x, ++y) {
            ctx.translate(x, y);
            ctx.fillRect(0, 0, 1, 1);
            ctx.translate(-x, -y);
        }
    }
    
    return c;
}

const CANVAS_WATER = makeGradientCanvas(new ColorTransition([0, 191, 255, 1], [64, 159, 191, 1]), 4, 4);

function addBorder(c = document.createElement("canvas"), width = 8, height = 8) {
    let ctx = c.getContext("2d");
    
    
}

function makeSelectCommandLabel(label, font = "Segoe UI", fillStyle = "#00FFFF", strokeStyle) {
    let c = document.createElement("canvas");
    c.width = CANVAS.width / 2, c.height = CANVAS.height / 9;
    let ctx = c.getContext("2d");
    
    let oc = makeTextFit(label, CANVAS.width / 2 - 32, CANVAS.height / 9 - 32, font, fillStyle);
    
    ctx.fillStyle = "#FFEF3F";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(oc, 16, 16);
    
    return c;
}
