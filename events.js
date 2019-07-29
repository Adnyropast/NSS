
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
}

function eventPreventDefault(event) {event.preventDefault();}

function disableRightClick() {window.addEventListener("contextmenu", eventPreventDefault);}
function enableRightClick() {window.removeEventListener("contextmenu", eventPreventDefault);}

disableRightClick();
