
/**/
const K_ESC = [27];
const K_CONFIRM = [13];

var K_LEFT = [37, 65, 81];
var K_UP = [38, 87, 90];
var K_RIGHT = [39, 68];
var K_DOWN = [40, 83];

var K_CLEFT = [72];
var K_CUP = [85];
var K_CDOWN = [74];
var K_CRIGHT = [75];
/**/
var K_DIRECTION = K_LEFT.concat(K_UP).concat(K_RIGHT).concat(K_DOWN);
var K_JUMP = [32];
var K_FOCUS = [223];
var K_PRESSFOCUS = [191];

var K_CDIRECTION = K_CLEFT.concat(K_CUP).concat(K_CDOWN).concat(K_CRIGHT);

var K_FLURRY = [70];
/**/

class KeyboardEventsRecorder {
    constructor() {
        Object.defineProperty(this, "array", {"value" : [], "enumerable" : false, "writable" : true});
        Object.defineProperty(this, "limit", {"value" : 255, "enumerable" : false, "writable" : true});
        
        Object.defineProperty(this, "eventKeydown", {"enumerable" : false, "writable" : true, "value" : (function(event) {
            if(event.keyCode == 112) {event.preventDefault();}
            if(this.value(112)) {console.log(event.key + " : " + event.keyCode);}
            if(event.keyCode == 113) {console.log(this + "");}
            
            this.hold(event.keyCode);
        }).bind(this)});
        Object.defineProperty(this, "eventKeyup", {"enumerable" : false, "writable" : true, "value" : (function(event) {
            this.release(event.keyCode);
        }).bind(this)});
        Object.defineProperty(this, "eventBlur", {"enumerable" : false, "writable" : true, "value" : (function(event) {
            this.clear();
        }).bind(this)});
        
        this.addEventsListenerTo(arguments[0]);
    }
    
    /**
     * Returns the value associated with a held key (or the maximum of the values for an array of keyCodes).
     * @param keyCode a single key code to check the value for.
     * @param keyCodes an array of key codes to check the maximum value for.
     * @return 0 if the key is not pressed, a number > 0 otherwise, corresponding to how long a key has been pressed
     */
    
    value() {
        if(Array.isArray(arguments[0])) {
            var keyCodes = arguments[0];
            var max = 0;
            
            for(var i = 0; i < this.array.length; ++i) {
                for(var j = 0; j < keyCodes.length; ++j) {
                    if(this.array[i].keyCode == keyCodes[j] && this.array[i].value > max) {
                        max = this.array[i].value;
                    }
                }
            }
            
            return max;
        }
        
        for(var i = 0; i < this.array.length; ++i) {
            if(this.array[i].keyCode == arguments[0]) {
                return this.array[i].value;
            }
        }
        
        return 0;
    }
    
    hold(keyCode, value) {
        if(typeof value == "undefined") {
            value = 1;
        }
        
        for(var i = 0; i < this.array.length; ++i) {
            if(this.array[i].keyCode == keyCode) {
                if(value > this.array[i].value) {
                    this.array[i].value = value;
                    this.array[i].released = 0;
                }
                
                return this;
            }
        }
        
        this.array.push({"keyCode" : keyCode, "value" : value, "released" : 0});
        
        return this;
    }
    
    increment() {
        for(var i = this.array.length - 1; i >= 0; --i) {
            if(this.array[i].value == 0) {
                if(this.array[i].released > 0) {
                    if(this.array[i].released < this.limit) {
                        ++this.array[i].released;
                    } else {
                        this.array.splice(i, 1);
                    }
                }
            } else if(this.array[i].value < this.limit) {
                ++this.array[i].value;
            }
        }
        
        return this;
    }
    
    release(keyCode) {
        for(var i = 0; i < this.array.length; ++i) {
            if(this.array[i].keyCode == keyCode) {
                // this.array.splice(i, 1);
                this.array[i].value = 0;
                this.array[i].released = 1;
            }
        }
        
        return this;
    }
    
    clear() {
        Object.defineProperty(this, "array", {"value" : [], "enumerable" : false, "writable" : true});
        
        return this;
    }
    
    reset() {
        this.array = [];
        
        return this;
    }
    
    toString() {
        var string = "";
        
        for(var i = 0; i < this.array.length; ++i) {
            string += "{" + this.array[i].keyCode + " : " + this.array[i].value + "}";
            
            if(i < this.array.length - 1) {
                string += ", "; 
            }
        }
        
        return "[" + string + "]";
    }
    
    addEventsListenerTo(element) {
        if(typeof element == "object" && typeof element.addEventListener == "function") {
            element.addEventListener("keydown", this.eventKeydown);
            element.addEventListener("keyup", this.eventKeyup);
            element.addEventListener("blur", this.eventBlur);
        }
        
        return this;
    }
    
    removeEventsListenerFrom(element) {
        if(typeof element == "object" && typeof element.removeEventListener == "function") {
            element.removeEventListener("keydown", this.eventKeydown);
            element.removeEventListener("keyup", this.eventKeyup);
            element.removeEventListener("blur", this.eventBlur);
        }
        
        return this;
    }
    
    justReleased() {
        if(arguments.length > 1) {
            for(let i = 0; i < arguments.length; ++i) {
                if(this.justReleased(arguments[i])) {
                    return true;
                }
            }
        } else if (arguments.length == 1 && Array.isArray(arguments[0])) {
            for(let i = 0; i < arguments[0].length; ++i) {
                if(this.justReleased(arguments[0][i])) {
                    return true;
                }
            }
        } else if(arguments.length == 1) {
            for(let i = 0; i < this.array.length; ++i) {
                if(this.array[i].keyCode == arguments[0]) {
                    return this.array[i].released == 1;
                }
            }
        }
        
        return false;
    }
}

//* 12/01/2019 * class KeyelBoard */
//* 06/03/2019 * KMap : associates keyCodes with functions */
// 23/07/2019 : EventsRecorder

/**
 * 25/09/2018
 * 26/04/2019 : Mouse class
 * 
 */

const CLICKLEFT = 1;
const CLICKMIDDLE = 2;
const CLICKRIGHT = 3;

class MouseEventsRecorder {
    constructor() {
        Object.defineProperty(this, "position", {"value" : [], "enumerable" : false, "writable" : true});
        Object.defineProperty(this, "array", {"value" : [], "enumerable" : false, "writable" : true});
        Object.defineProperty(this, "limit", {"value" : 255, "enumerable" : false, "writable" : true});
        Object.defineProperty(this, "moveValue", {"value" : this.limit, "enumerable" : false, "writable" : true});
        
        Object.defineProperty(this, "eventMousedown", {"enumerable" : false, "writable" : true, "value" : (function(event) {
            this.setPosition(event.pageX, event.pageY);
            this.hold(event.which);
            
            if(event.ctrlKey) {
                console.log(this + "");
            }
        }).bind(this)});
        Object.defineProperty(this, "eventMouseup", {"enumerable" : false, "writable" : true, "value" : (function(event) {
            this.setPosition(event.pageX, event.pageY);
            this.release(event.which);
        }).bind(this)});
        Object.defineProperty(this, "eventMousemove", {"enumerable" : false, "writable" : true, "value" : (function(event) {
            this.setPosition(event.pageX, event.pageY);
            
            this.moveValue = 1;
        }).bind(this)});
        
        this.addEventsListenerTo(arguments[0]);
    }
    
    getX() {
        return this.position[0];
    }
    
    getY() {
        return this.position[1];
    }
    
    getPosition(dimension) {
        if(arguments.length == 1) {
            return this.position[dimension];
        }
        
        return this.position;
    }
    
    setPosition(x, y) {
        this.position[0] = x;
        this.position[1] = y;
        
        return this;
    }
    
    value(which) {
        if(Array.isArray(which)) {
            var max = 0;
            
            for(var i = 0; i < this.array.length; ++i) {
                for(var j = 0; j < which.length; ++j) {
                    if(this.array[i].which == which[j] && this.array[i].value > max) {
                        max = this.array[i].value;
                    }
                }
            }
            
            return max;
        }
        
        for(var i = 0; i < this.array.length; ++i) {
            if(this.array[i].which == which) {
                return this.array[i].value;
            }
        }
        
        return 0;
    }
    
    hold(which, value = 1) {
        for(var i = 0; i < this.array.length; ++i) {
            if(this.array[i].which == which) {
                if(value > this.array[i].value) {
                    this.array[i].value = value;
                    this.array[i].released = 0;
                }
                
                return this;
            }
        }
        
        this.array.push({"which" : which, "value" : value, "released" : 0});
        
        return this;
    }
    
    release(which) {
        for(var i = 0; i < this.array.length; ++i) {
            if(this.array[i].which == which) {
                // this.array.splice(i, 1);
                this.array[i].value = 0;
                this.array[i].released = 1;
            }
        }
        
        return this;
    }
    
    increment() {
        for(var i = this.array.length - 1; i >= 0; --i) {
            if(this.array[i].value == 0) {
                if(this.array[i].released > 0) {
                    if(this.array[i].released < this.limit) {
                        ++this.array[i].released;
                    } else {
                        this.array.splice(i, 1);
                    }
                }
            } else if(this.array[i].value < this.limit) {
                ++this.array[i].value;
            }
        }
        
        if(this.moveValue < this.limit) {
            ++this.moveValue;
        }
        
        return this;
    }
    
    toString() {
        var string = "{x : " + this.getX() + ", y : " + this.getY() + ", which : [";
        
        for(var i = 0; i < this.array.length; ++i) {
            string += "{" + this.array[i].which + " : " + this.array[i].value + "}";
            
            if(i < this.array.length - 1) {
                string += ", ";
            }
        }
        
        return string + "]}";
    }
    
    addEventsListenerTo(element) {
        if(typeof element == "object" && typeof element.addEventListener == "function") {
            element.addEventListener("mousedown", this.eventMousedown);
            element.addEventListener("mouseup", this.eventMouseup);
            element.addEventListener("mousemove", this.eventMousemove);
        }
        
        return this;
    }
    
    removeEventsListenerFrom(element) {
        if(typeof element == "object" && typeof element.removeEventListener == "function") {
            element.removeEventListener("mousedown", this.eventMousedown);
            element.removeEventListener("mouseup", this.eventMouseup);
            element.removeEventListener("mousemove", this.eventMousemove);
        }
        
        return this;
    }
    
    justReleased() {
        if(arguments.length > 1) {
            for(let i = 0; i < arguments.length; ++i) {
                if(this.justReleased(arguments[i])) {
                    return true;
                }
            }
        } else if(arguments.length == 1) {
            if(Array.isArray(arguments[0])) {
                for(let i = 0; i < arguments[0].length; ++i) {
                    if(this.justReleased(arguments[0][i])) {
                        return true;
                    }
                }
            } else {
                for(let i = 0; i < this.array.length; ++i) {
                    if(this.array[i].which == arguments[0]) {
                        return this.array[i].released == 1;
                    }
                }
            }
        }
        
        return false;
    }
}

class BlurEventRecorder {
    constructor() {
        Object.defineProperty(this, "blurValue", {"value" : 0, "enumerable" : false, "writable" : true});
        Object.defineProperty(this, "eventBlur", {"enumerable" : false, "writable" : true, "value" : (function(event) {
            this.blurValue = 1;
        }).bind(this)});
        
        this.addEventsListenerTo(arguments[0]);
    }
    
    addEventsListenerTo(element) {
        if(typeof element == "object" && typeof element.addEventListener == "function") {
            element.addEventListener("blur", this.eventBlur);
        }
        
        return this;
    }
    
    removeEventsListenerFrom(element) {
        if(typeof element == "object" && typeof element.removeEventListener == "function") {
            element.removeEventListener("blur", this.eventBlur);
        }
        
        return this;
    }
    
    blurred() {
        return this.blurValue == 1;
    }
    
    update() {
        if(this.blurValue == 1) {
            this.blurValue = 0;
        }
        
        return this;
    }
    
    blur() {
        this.blurValue = 1;
        
        return this;
    }
}

var keyList = new KeyboardEventsRecorder(window);
var keyCodes = keyList;

// var mouse = {x : undefined, y : undefined, keys : {}};
var mouse = new MouseEventsRecorder(window);

let blurEvrec = new BlurEventRecorder(window);

function eventsRecordersUpdate() {
    keyList.increment();
    mouse.increment();
    blurEvrec.update();
    gamepadRec.update();
}

function eventPreventDefault(event) {event.preventDefault();}

function disableRightClick() {window.addEventListener("contextmenu", eventPreventDefault);}
function enableRightClick() {window.removeEventListener("contextmenu", eventPreventDefault);}

disableRightClick();

const BUTTON_START = 9;
const BUTTON_SELECT = 8;
const BUTTON_HOME = 12;
const BUTTON_CAPTURE = 13;
const BUTTON_A = 2;
const BUTTON_B = 1;
const BUTTON_X = 3;
const BUTTON_Y = 0;
const BUTTON_L = 4;
const BUTTON_R = 5;
const BUTTON_ZL = 6;
const BUTTON_ZR = 7;
const BUTTON_L3 = 10;
const BUTTON_R3 = 11;

const DPAD_UT = 3.2857141494750977;
const DPAD_UP = -1;
const DPAD_UPRIGHT = -0.7142857313156128;
const DPAD_RIGHT = -0.4285714030265808;
const DPAD_DOWNRIGHT = -0.1428571343421936;
const DPAD_DOWN = 0.14285719394683838;
const DPAD_DOWNLEFT = 0.4285714626312256;
const DPAD_LEFT = 0.7142857313156128;
const DPAD_UPLEFT = 1;

class GamepadEventsRecorder {
    constructor(gamepadIndex) {
        Object.defineProperty(this, "buttons", {value : {}, enumerable : false, writable : false});
        Object.defineProperty(this, "limit", {value : 255, enumerable : false, writable : true});
        
        this.gamepadIndex = gamepadIndex;
    }
    
    value(button) {
        return this.buttons[button];
    }
    
    justReleased(button) {
        return this.buttons[button] === 0;
    }
    
    update() {
        let gamepad = this.getGamepad();
        
        if(gamepad instanceof Gamepad) {
            for(let i = 0; i < gamepad.buttons.length; ++i) {
                let button = gamepad.buttons[i];
                
                if(button.pressed) {
                    // console.log(i);
                    
                    if(this.buttons[i]) {
                        ++this.buttons[i];
                    } else {
                        this.buttons[i] = 1;
                    }
                } else {
                    if(this.buttons[i] && this.buttons[i] > 0) {
                        this.buttons[i] = 0;
                    } else if(this.buttons[i] === 0) {
                        delete this.buttons[i];
                    }
                }
            }
        }
        
        return this;
    }
    
    getGamepad() {
        return navigator.getGamepads()[this.gamepadIndex];
    }
}

let gamepadRec = new GamepadEventsRecorder(0);

function getDPADDirection(dpadValue) {
    if(dpadValue === undefined) {
        let gamepad = getGamepad(0);
        
        if(gamepad instanceof Gamepad) {
            dpadValue = gamepad.axes[9];
        }
    } else if(arguments[0] instanceof Gamepad) {
        dpadValue = arguments[0].axes[9];
    }
    
    switch(dpadValue) {
        case DPAD_UP : return new Vector(0, -1);
        case DPAD_UPRIGHT : return (new Vector(+1, -1)).normalize();
        case DPAD_RIGHT : return new Vector(+1, 0);
        case DPAD_DOWNRIGHT : return (new Vector(+1, +1)).normalize();
        case DPAD_DOWN : return new Vector(0, +1);
        case DPAD_DOWNLEFT : return (new Vector(-1, +1)).normalize();
        case DPAD_LEFT : return new Vector(-1, 0);
        case DPAD_UPLEFT : return (new Vector(-1, -1)).normalize();
        default : return new Vector(0, 0);
    }
}

function getJoyStickDirection(x, y) {
    if(x === undefined && y === undefined) {
        let gamepad = getGamepad(0);
        
        if(gamepad instanceof Gamepad) {
            x = gamepad.axes[0];
            y = gamepad.axes[1];
        } else {
            x = 0;
            y = 0;
        }
    } else if(arguments[0] instanceof Gamepad) {
        let gamepad = arguments[0];
        
        x = gamepad.axes[0];
        y = gamepad.axes[1];
    } else {
        if(x === undefined) {x = 0;}
        if(y === undefined) {y = 0;}
    }
    
    if(Math.abs(x) < 0.5) {x = 0;}
    if(Math.abs(y) < 0.5) {y = 0;}
    
    return new Vector(x, y);
}

function getGamepad(index = 0) {
    return navigator.getGamepads()[0];
}

function gamepad_getDirection(gamepad) {
    if(gamepad instanceof Gamepad) {
        return Vector.addition(getDPADDirection(gamepad), getJoyStickDirection(gamepad)).normalize();
    }
    
    return new Vector(0, 0);
}
