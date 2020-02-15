
/* 06/11/2018 */

class Color {
    
    /* 06/11/2018 */
    
    constructor() {
        this.values = [0, 0, 0, 255];
        
        if(arguments.length == 1 && typeof arguments[0] == "string") {
            
        } else if(arguments.length == 3 || arguments.length == 4) {
            for(var i = 0; i < arguments.length; i++) {
                this.values[i] = Color.correctValue(arguments[i]);
            }
        }
    }
    
    /* 07/05/2019 */
    
    static decToHex(dec) {
        return ((dec < 16) ? '0' : "") + Math.floor(dec).toString(16);
    }
    
    /* 07/05/2019 */
    
    getHex() {
        var hex = "#";
        
        for(var i = 0; i < 4; ++i) {
            hex += Color.decToHex(this.values[i]);
        }
        
        return hex;
    }
    
    /* 07/05/2019 */
    
    getRGBA() {
        var rgba = "rgba("
        
        for(var i = 0; i < 3; ++i) {
            rgba += this.values[i] + ", ";
        }
        
        rgba += this.getAlpha() / 255;
        
        return rgba + ")";
    }
    
    /* 07/05/2019 */
    
    toArray() {
        return this.values;
    }
    
    /* 07/05/2019 */
    
    getRed() {      return this.values[0];  }
    getGreen() {    return this.values[1];  }
    getBlue() {     return this.values[2];  }
    getAlpha() {    return this.values[3];  }
    
    /* 07/05/2019 */
    
    setRed(red) {       this.values[0] = red;       return this;    }
    setGreen(green) {   this.values[1] = green;     return this;    }
    setBlue(blue) {     this.values[2] = blue;      return this;    }
    setAlpha(alpha) {   this.values[3] = alpha;     return this;    }
    
    /* 06/11/2018 */
    
    static correctValue(n) {
        if(n < 0) {
            return 0;
        } else if(n > 255) {
            return 255;
        }
        
        return n;
    }
    
    /* 06/11/2018 */
    
    get red() {     return this.values[0];  }
    get green() {   return this.values[1];  }
    get blue() {    return this.values[2];  }
    get alpha() {   return this.values[3];  }
    
    set red(red) {      this.values[0] = red;       return this;    }
    set green(green) {  this.values[1] = green;     return this;    }
    set blue(blue) {    this.values[2] = blue;      return this;    }
    set alpha(alpha) {  this.values[3] = alpha;     return this;    }
    
    /* 06/11/2018 */
    
    get hex() {
        var res = "#";
        
        for(var i = 0; i < 4; i++) {
            var h = this.values[i].toString(16).toUpperCase();
            
            if(h.length < 2) {
                h = "0" + h;
            }
            
            res += h;
        }
        
        return res;
    }
    
    /* 06/11/2018 */
    
    get rgba() {
        return "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + (this.alpha / 255) + ")";
    }
    
    /* 06/11/2018 */
    
    toString() {
        return this.getRGBA();
    }
    
    copy() {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }
    
    add() {
        if(arguments.length == 1 && arguments[0] instanceof Color) {
            for(var i = 0; i < 4; i++) {
                this.values[i] = Color.correctValue(this.values[i] + arguments[0].values[i]);
            }
        }
        
        return this;
    } plus() {
        var copy = this.copy();
        
        return copy.add.apply(copy, arguments);
    }
    
    subtract() {
        if(arguments.length == 1 && arguments[0] instanceof Color) {
            for(var i = 0; i < 4; i++) {
                this.values[i] = Color.correctValue(this.values[i] - arguments[0].values[i]);
            }
        }
        
        return this;
    } minus() {
        var copy = this.copy();
        
        return copy.subtract.apply(copy, arguments);
    }
}

var colorCyan = new Color(0, 255, 255, 255);

const INVISIBLE = "#00000000";

const CV_WHITE = [255, 255, 255, 1];
const CV_BLACK = [0, 0, 0, 1];
const CV_INVISIBLE = [0, 0, 0, 0];
const CV_RED = [255, 0, 0, 1];
const CV_GREEN = [0, 255, 0, 1];
const CV_BLUE = [0, 0, 255, 1];
const CV_GRAY = [127, 127, 127, 1];
const CV_CYAN = [0, 255, 255, 1];
const CV_YELLOW = [255, 255, 0, 1];
const CV_MAGENTA = [255, 0, 255, 1];

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
        let vector = this.getCurrent();
        
        return rgba(vector);
    }
}

class MultiColorTransition extends ColorTransition {
    constructor(colorVectors, duration = 1, timing = bezierLinear) {
        super();
        
        this.vectors = Vector.from(colorVectors);
        this.duration = duration;
        this.step = 0;
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
    
    getNext() {
        const vector = this.getCurrent();
        
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
        
        return vector;
    }
    
    setLoopType(loopType) {this.loopType = loopType; return this;}
}

const CT_RAINBOW = (new MultiColorTransition([[255, 0, 0, 1], [255, 127, 0, 1], [255, 255, 0, 1], [127, 255, 0, 1], [0, 255, 0, 1], [0, 255, 127, 1], [0, 255, 255, 1], [0, 127, 255, 1], [0, 0, 255, 1], [127, 0, 255, 1], [255, 0, 255, 1], [255, 0, 127, 1], [255, 0, 0, 1]])).setLoopType("repeat");

function colorVector_brighten(colorVector, value) {
    colorVector = Array.from(colorVector);
    
    for(let i = 0; i < 3; ++i) {
        colorVector[i] += value;
        
        if(colorVector[i] > 255) {colorVector[i] = 255;}
        if(colorVector[i] < 0) {colorVector[i] = 0;}
    }
    
    return colorVector;
}

function makeRandomSaturatedColor() {
    let color = [
        irandom(191, 255),
        irandom(0, 255),
        irandom(0, 63)
    ];
    
    array_swap(color, 0, irandom(0, 2));
    array_swap(color, 1, irandom(0, 2));
    array_swap(color, 2, irandom(0, 2));
    
    color[3] = 1;
    
    return color;
}

function colorVector_alterAlpha(color, value) {
    color = Array.from(color);
    
    color[3] += value;
    
    if(color[3] < 0) {color[3] = 0;}
    if(color[3] > 1) {color[3] = 1;}
    
    return color;
}

function rgbaStringToVector(rgbaString) {
    let matches = rgbaString.match(/rgba?\((\d*\.?\d*)\s*,\s*(\d*\.?\d*)\s*,\s*(\d*\.?\d*)\s*,?\s*(\d*\.?\d*)\)/);
    
    let red = Number(matches[1]);
    let blue = Number(matches[2]);
    let green = Number(matches[3]);
    let alpha = matches[4] === "" ? 1 : Number(matches[4]);
    
    return [red, blue, green, alpha];
}
