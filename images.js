
const INVISIBLE = "#00000000";

class TransitionColor {
    constructor(initialColor, endColor, duration, timing = bezierEaseIn) {
        this.initialColor = initialColor;
        this.endColor = endColor;
        this.duration = duration;
        this.step = -1;
        
        this.timing = timing;
    }
    
    static from(transitionColor) {
        return new this(transitionColor.initialColor, transitionColor.endColor, transitionColor.duration, transitionColor.timing);
    }
    
    at(t) {
        var color = new Vector();
        
        for(var dim = 0; dim < this.initialColor.length; ++dim) {
            color[dim] = this.initialColor[dim] + this.timing(t) * (this.endColor[dim] - this.initialColor[dim]);
        }
        
        return color;
    }
    
    getProgress() {
        return this.step / this.duration;
    }
    
    getNext() {
        ++this.step;
        
        if(this.step > this.duration) {
            this.step = this.duration;
        }
        
        return this.at(this.getProgress());
    }
    
    toString() {
        var color = this.getNext();
        
        return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
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

var IMG_SKY = loadImage("images/sky1.png");

var IMG_GRASSTILE = loadImage("images/grasstile.png");
var IMG_GRASSTILE_C = loadImage("images/grasstile-c.png");
var IMG_HPP_C0 = loadImage("images/hpp-c0.png");

const IMG_FIST_LEFT = loadImage("images/fist-left-tp.png");

var ANIM_HAPLE = {
    "std-right" : new AnimatedImages([loadImage("images/std-right.png")]),
    "std-left" : new AnimatedImages([loadImage("images/std-left.png")]),
    "run-right" : (new AnimatedImages([loadImage("images/run-right0.png"), loadImage("images/run-right1.png"), loadImage("images/run-right2.png"), loadImage("images/run-right3.png")])).setIcpf(12),
    "run-left" : (new AnimatedImages([loadImage("images/run-left0.png"), loadImage("images/run-left1.png"), loadImage("images/run-left2.png"), loadImage("images/run-left3.png")])).setIcpf(12),
    "jump-right" : new AnimatedImages([loadImage("images/jump-right.png")]),
    "jump-left" : new AnimatedImages([loadImage("images/jump-left.png")]),
    "fall-right" : new AnimatedImages([loadImage("images/fall-right.png")]),
    "fall-left" : new AnimatedImages([loadImage("images/fall-left.png")])
};

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

var PTRNS_SMOKE = new AnimatedImages([]).setIcpf(1);

{
    let c = document.createElement("canvas");
    c.width = 64, c.height = 64;
    let ctx = c.getContext("2d");
    
    let count = 64;
    
    let tcolor = new TransitionColor([255, 255, 255, 191 / 255], [223, 223, 223, 31 / 255], count);
    
    for(var i = 0; i < count; ++i) {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.beginPath();
        ctx.arc(32, 32, 32 - 32 * (i / count), 0, Math.PI * 2);
        ctx.fillStyle = tcolor + "";
        // console.log(ctx.fillStyle, tcolor.at(tcolor.getProgress())[3]);
        ctx.fill();
        PTRNS_SMOKE.addImage(CANVAS.makePattern(c, 16 * wprop, 16 * hprop, "no-repeat"));
        // document.body.appendChild(c);
    }
};

var PTRN_SKY = makeSkyPattern(1024);

function makeSkyPattern(height) {
    let c = document.createElement("canvas");
    c.width = 16; c.height = height;
    let ctx = c.getContext("2d");
    
    let bgTransition = new TransitionColor([0, 31, 255, 1], [0, 255, 255, 1], c.height / c.width, bezierLinear);
    let shTransition = new TransitionColor([0, 15, 239, 1], [0, 239, 239, 1], c.height / c.width, bezierLinear);
    
    for(var y = 0; y < c.height; y += c.width) {
        ctx.fillStyle = makeCTile(bgTransition + "", shTransition + "");
        ctx.translate(0, y);
        ctx.fillRect(0, 0, c.width, c.width);
        ctx.translate(0, -y);
    }
    
    return CANVAS.makePattern(c, 8 * wprop, c.height / c.width * 8 * hprop, "repeat");
}
