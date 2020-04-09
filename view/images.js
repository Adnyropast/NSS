
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

const IMGCHAR = {};

IMGCHAR["Haple"] = {
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

IMGCHAR["Ten"] = {
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
const IMG_TREE = loadImage("images/tree.png");

const IMG_ROPELADDER = loadImage("images/ropeladder.png");

const IMG_GRASSPATCH = loadImage("images/grasspatch.png");

IMGCHAR["Adnyropast"] = {
    "icon" : loadImage("images/adnyropast/icon.png"),
};

// 

const CTILE_WIDTH = 16;
const TILEWIDTH = 16;

const IMGBG = {};

IMGBG["sky0"] = loadImage("images/background/sky0.png");
IMGBG["sky1"] = loadImage("images/background/sky1.png");
IMGBG["sky2"] = loadImage("images/background/sky2.png");
IMGBG["sky3"] = loadImage("images/background/sky3.png");

IMGBG["skyblur0"] = loadImage("images/background/skyblur0.png");
IMGBG["skyblur1"] = loadImage("images/background/skyblur1.png");
IMGBG["skyblur2"] = loadImage("images/background/skyblur2.png");
IMGBG["skyblur3"] = loadImage("images/background/skyblur3.png");

IMGBG["skyblur4"] = loadImage("images/background/skyblur4.png");
IMGBG["skyblur5"] = loadImage("images/background/skyblur5.png");
IMGBG["skyblur6"] = loadImage("images/background/skyblur6.png");
IMGBG["skyblur7"] = loadImage("images/background/skyblur7.png");

const IMGITEM = {
    Apple : loadImage("images/items/apple.png"),
    ChapterIdentifier : loadImage("images/items/chapterIdentifier.png"),
    Inventory : loadImage("images/items/inventory.png")
};
