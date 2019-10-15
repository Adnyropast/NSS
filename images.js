
const INVISIBLE = "#00000000";

const CV_WHITE = [255, 255, 255, 1];
const CV_BLACK = [0, 0, 0, 1];
const CV_INVISIBLE = [0, 0, 0, 0];
const CV_RED = [255, 0, 0, 1];
const CV_GREEN = [0, 255, 0, 1];
const CV_BLUE = [0, 0, 255, 1];

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

class ColorTransition extends VectorTransition {
    constructor(initialColor, endColor, duration = 1, timing = bezierLinear) {
        if(isColorHex(initialColor)) {
            initialColor = hexToColorVector(initialColor);
        }
        
        if(isColorHex(endColor)) {
            endColor = hexToColorVector(endColor);
        }
        
        super(initialColor, endColor, duration, timing);
    }
    
    getStyleAt(t) {
        var color = this.at(t);
        
        return rgba(color);
    }
    
    getNextStyle() {
        var color = this.getNext();
        
        return rgba(color);
    }
    
    getCurrentStyle() {
        let vector = this.at(this.getProgress());
        
        return rgba(vector);
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

var IMG_GRASSTILE = loadImage("images/grass_tile.png");

const IMGCHAR = {};

IMGCHAR["haple"] = {
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
    "water-right" : (new AnimatedImages([loadImage("images/haple/swim-right0.png"), loadImage("images/haple/swim-right1.png")])).setIcpf(32),
    "water-left" : (new AnimatedImages([loadImage("images/haple/swim-left0.png"), loadImage("images/haple/swim-left1.png")])).setIcpf(32),
    "hurt-right" : new AnimatedImages([loadImage("images/haple/hurt-right.png")]),
    "hurt-left" : new AnimatedImages([loadImage("images/haple/hurt-left.png")]),
    "crouch-right" : new AnimatedImages([loadImage("images/haple/crouch-right.png")]),
    "crouch-left" : new AnimatedImages([loadImage("images/haple/crouch-left.png")]),
    "swim-right" : (new AnimatedImages([loadImage("images/haple/swim-right0.png"), loadImage("images/haple/swim-right1.png")])).setIcpf(12),
    "swim-left" : (new AnimatedImages([loadImage("images/haple/swim-left0.png"), loadImage("images/haple/swim-left1.png")])).setIcpf(12),
    "battle-right" : (new AnimatedImages([loadImage("images/haple/battle-right.png")])),
    "icon" : loadImage("images/haple/icon.png"),
    "attack-right" : loadImage("images/haple/attack-right.png"),
    "attack-left" : loadImage("images/haple/attack-left.png"),
    "attack-up" : loadImage("images/haple/attack-up.png"),
    "attack-down" : loadImage("images/haple/attack-down.png")
};

let CT_TEN = (new ColorTransition(CV_WHITE, [0, 255, 255, 1], 32)).setLoop(true);

IMGCHAR["ten"] = {
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
    "water-right" : ColorTransition.from(CT_TEN).setDuration(48),
    "water-left" : ColorTransition.from(CT_TEN).setDuration(48),
    "hurt-right" : ColorTransition.from(CT_TEN).setDuration(2),
    "hurt-left" : ColorTransition.from(CT_TEN).setDuration(2),
    "crouch-right" : (new ColorTransition([0, 255, 0, 1], [127, 255, 127, 1], 64)).setLoop(true),
    "crouch-left" : (new ColorTransition([0, 255, 0, 1], [127, 255, 127, 1], 64)).setLoop(true),
    "swim-right" : ColorTransition.from(CT_TEN).setDuration(12),
    "swim-right" : ColorTransition.from(CT_TEN).setDuration(12),
    "icon" : loadImage("images/ten/icon.png")
};

const IMG_TREETRUNK = loadImage("images/treetrunk.png");
const IMG_TREEBACKGROUND = loadImage("images/treebackground.png");

const IMG_DEFBLOCK = loadImage("images/def_block.png");
const IMG_SKYTILE = loadImage("images/sky_tile.png");
const IMG_TREE2 = loadImage("images/tree2.png");

IMGCHAR["adnyropast"] = {
    "icon" : loadImage("images/adnyropast/icon.png"),
};

// 

const CTILE_WIDTH = 16;

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
    let ctx = c.getContext("2d");
    
    const fontHeight = 75;
    
    c.height = fontHeight;
    
    ctx.textBaseline = "top";
    ctx.font = fontHeight + "px " + font;
    c.width = ctx.measureText(content).width;
    ctx.textBaseline = "top";
    ctx.font = fontHeight + "px " + font
    
    ctx.fillStyle = fillStyle;
    ctx.fillText(content, 0, 0);
    
    if(typeof strokeStyle != "undefined") {
        ctx.strokeStyle = strokeStyle;
        ctx.strokeText(content, 0, 0);
    }
    
    return c;
}

const tfparams = {
    "positioning" : 0,
    "padding-left" : 0,
    "positioning-y" : 0,
    "padding-top" : 0
};

function makeTextFit(content, width, height, font = "Luckiest Guy", fillStyle = "black", strokeStyle) {
    let finalCanvas = document.createElement("canvas");
    finalCanvas.width = width, finalCanvas.height = height;
    let ctx = finalCanvas.getContext("2d");
    
    let textCanvas = makeTextCanvas(content, font, fillStyle, strokeStyle);
    
    if(textCanvas.width != 0) {
        // ctx.drawImage(textCanvas, 0, 0, textCanvas.width * height / textCanvas.height, height);
        ctx.drawImage(textCanvas, tfparams["padding-left"] + tfparams.positioning * (finalCanvas.width - textCanvas.width * height / textCanvas.height), tfparams["padding-top"], textCanvas.width * height / textCanvas.height, height);
    }
    
    return finalCanvas;
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

function canvas_clone(canvas) {
    let clone = document.createElement("canvas");
    
    clone.width = canvas.width;
    clone.height = canvas.height;
    
    clone.getContext("2d").drawImage(canvas, 0, 0);
    
    return clone;
}

class MultiColorTransition extends ColorTransition {
    constructor(colorVectors, duration = 1, timing = bezierLinear) {
        super();
        
        this.vectors = Vector.from(colorVectors);
        this.duration = duration;
        this.step = -1;
        this.timing = timing;
        this.stepDirection = +1;
        this.loopType = ["none", "alternate", "repeat"][0];
    }
    
    static from(multiColorTransition) {
        return (new this(multiColorTransition.vectors, multiColorTransition.duration, multiColorTransition.timing)).setLoopType(multiColorTransition.loopType);
    }
    
    getDimension() {
        return this.vectors[0].length;
    }
    
    at(t) {
        let vector = Vector.filled(this.getDimension(), 0);
        
        for(let i = 0; i < this.vectors.length - 1; ++i) {
            let vector0 = this.vectors[i];
            let progress0 = i / (this.vectors.length - 1);
            let vector1 = this.vectors[i+1];
            let progress1 = (i+1) / (this.vectors.length - 1);
            
            if(progress0 <= t && t <= progress1) {
                let tt = (t - progress0) / (progress1 - progress0);
                
                let ttt = this.timing(tt);
                
                for(let dim = 0; dim < vector.length; ++dim) {
                    vector[dim] = vector0[dim] + ttt * (vector1[dim] - vector0[dim]);
                }
                
                break;
            }
        }
        
        return vector;
    }
    
    getProgress() {return this.step / this.duration;}
    
    getNext() {
        this.step += this.stepDirection;
        
        if(this.step > this.duration) {
            this.step = this.duration;
            
            if(this.loopType === "alternate") {
                this.stepDirection *= -1;
            } else if(this.loopType === "repeat") {
                this.step = 0;
            }
        } if(this.step < 0) {
            this.step = 0;
            
            if(this.loopType === "alternate") {
                this.stepDirection *= -1;
            } else if(this.loopType === "repeat") {
                this.step = this.duration;
            }
        }
        
        return this.at(this.getProgress());
    }
    
    setDuration(duration) {
        this.duration = duration;
        this.step = -1;
        this.stepDirection = +1;
        
        return this;
    }
    
    getDuration() {return this.duration;}
    
    setLoopType(loopType) {this.loopType = loopType; return this;}
    
    copy() {return this.constructor.from(this);}
    
    setStep(step) {this.step = step; return this;}
    getStep() {return this.step;}
    
    getStyleAt(t) {
        return rgba(this.at(t));
    }
    
    getNextStyle() {
        return rgba(this.getNext());
    }
    
    getCurrentStyle() {
        return rgba(this.at(this.getProgress()));
    }
}

const CT_RAINBOW = (new MultiColorTransition([[255, 0, 0, 1], [255, 127, 0, 1], [255, 255, 0, 1], [127, 255, 0, 1], [0, 255, 0, 1], [0, 255, 127, 1], [0, 255, 255, 1], [0, 127, 255, 1], [0, 0, 255, 1], [127, 0, 255, 1], [255, 0, 255, 1], [255, 0, 127, 1], [255, 0, 0, 1]])).setLoopType("repeat");

const IMGBG = {};

IMGBG["sky0"] = loadImage("images/background/sky0.png");
IMGBG["sky1"] = loadImage("images/background/sky1.png");
IMGBG["sky2"] = loadImage("images/background/sky2.png");
IMGBG["sky3"] = loadImage("images/background/sky3.png");
