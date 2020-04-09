
function addition_(a, b) {return a + b;}
function subtraction_(a, b) {return a - b;}
function multiplication_(a, b) {return a * b;}
function division_(a, b) {return a / b;}

/**
 * The Vector class represents a multi-dimensional vector, also used for points in a space, sizes, ...
 */

class Vector extends Array {
    
    /***/
    
    static apply(setFn, vector) {
        if(Array.isArray(arguments[2])) {
            const vector2 = arguments[2];
            const minDim = Math.min(vector.length, vector2.length);
            
            for(let dim = 0; dim < minDim; ++dim) {
                vector[dim] = setFn(vector[dim], vector2[dim]);
            }
        } else if(arguments.length === 3) {
            const k = arguments[2];
            
            for(let dim = 0; dim < vector.length; ++dim) {
                vector[dim] = setFn(vector[dim], k);
            }
        } else if(arguments.length === 4) {
            const dimension = arguments[2], k = arguments[3];
            
            vector[dimension] = setFn(vector[dimension], k);
        }
        
        return vector;
    }
    
    /***/
    
    static combine(setFn, vector) {
        if(Array.isArray(arguments[2])) {
            const vector2 = arguments[2];
            const minDim = Math.min(vector.length, vector2.length);
            const res = new this(minDim);
            
            for(let dim = 0; dim < minDim; ++dim) {
                res.set(dim, setFn(vector[dim], vector2[dim]));
            }
            
            return res;
        } else if(arguments.length === 3) {
            const k = arguments[2];
            const res = new this(vector.length);
            
            for(let dim = 0; dim < vector.length; ++dim) {
                res.set(dim, setFn(vector[dim], k));
            }
            
            return res;
        } else if(arguments.length === 4) {
            const dimension = arguments[2], k = arguments[3];
            const res = new this(vector.length);
            
            for(let dim = 0; dim < vector.length; ++dim) {
                if(dim == dimension) {
                    res.set(dim, setFn(vector[dim], k));
                } else {
                    res.set(dim, vector[dim]);
                }
            }
            
            return res;
        }
        
        return null;
    }
    
    /***/
    
    static add(vector) {
        return this.apply(addition_, ...arguments);
    }
    
    /***/
    
    static subtract(vector) {
        return this.apply(subtraction_, ...arguments);
    }
    
    /***/
    
    static multiply(vector) {
        return this.apply(multiplication_, ...arguments);
    }
    
    /***/
    
    static divide(vector) {
        return this.apply(division_, ...arguments);
    }
    
    /***/
    
    static addition(vector) {
        return this.combine(addition_, ...arguments);
    }
    
    /***/
    
    static subtraction(vector) {
        return this.combine(subtraction_, ...arguments);
    }
    
    /***/
    
    static multiplication(vector) {
        return this.combine(multiplication_, ...arguments);
    }
    
    /***/
    
    static division(vector) {
        return this.combine(division_, ...arguments);
    }
    
    /***/
    
    static normOf() {
        if(Array.isArray(arguments[0])) {
            const vector = arguments[0];
            
            let norm = 0;
            
            for(let dim = 0; dim < vector.length; ++dim) {
                norm += Math.pow(vector[dim], 2);
            }
            
            return norm = Math.sqrt(norm);
        }
        
        return -1;
    }
    
    /***/
    
    static distance(vector1, vector2) {
        if(vector1.length != vector2.length) {
            return Infinity;
        }
        
        let distance = 0;
        
        for(let dim = 0; dim < vector1.length; ++dim) {
            distance += Math.pow(vector2[dim] - vector1[dim], 2);
        }
        
        return distance = Math.sqrt(distance);
    }
    
    /***/
    
    static sum(vectors_) {
        const sum = new this();
        
        if(arguments.length > 0) {
            sum.setDimension(arguments[0].length).fill(0);
        }
        
        for(let i = 0; i < arguments.length; ++i) {
            const vector = arguments[i];
            
            if(vector.length < sum.getDimension()) {
                sum.setDimension(vector.length);
            }
            
            sum.add(vector);
        }
        
        return sum;
    }
    
    /***/
    
    static average(vectors_) {
        return this.sum(...arguments).divide(arguments.length);
    }
    
    /**
     * 
     * 24/04/2019
     * Constructs a new Vector of a certain size, filled with the same value.
     * @param dimension the size of the vector.
     * @param fillValue the value all the coordinates should have.
     * @return a new Vector instance.
     */
    
    static filled(dimension, fillValue) {
        const vector = new this(dimension);
        
        for(let dim = 0; dim < dimension; ++dim) {
            vector.set(dim, fillValue);
        }
        
        return vector;
    }
    
    /**
     * Constructs a new Vector filled with the given parameters.
     * @param the coordinates of the vector.
     * @return a vector with the coordinates.
     */
    
    static fromParameters() {
        const vector = new this(arguments.length);
        
        for(let dim = 0; dim < arguments.length; ++dim) {
            vector.set(dim, arguments[dim]);
        }
        
        return vector;
    }
    
    /**
     * Constructs a normalized 2D Vector from the angle given as a parameter.
     * @param the angle of the vector.
     * @return the vector.
     */
    
    static fromAngle(angle) {
        angle = mod(angle, 2*Math.PI);
        
        if(angle === Math.PI/2) {
            return new this(0, +1);
        }
        
        if(angle === Math.PI) {
            return new this(-1, 0);
        }
        
        if(angle === 3/2*Math.PI) {
            return new this(0, -1);
        }
        
        return new this(Math.cos(angle), Math.sin(angle));
    }
    
    static isZero(vector) {
        for(let dim = 0; dim < vector.length; ++dim) {
            if(vector[dim] != 0) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Constructs a new Vector.
     * Same as an Array.
     */
    
    constructor() {
        super(...arguments);
    }
    
    toArray() {
        return this;
    }
    
    getDimension() {return this.length;}
    
    setDimension(dimension) {this.length = dimension; return this;}
    
    size() {return this.length;}
    
    isZero() {return Vector.isZero(this);}
    
    copy() {
        const copy = new Vector(this.getDimension());
        
        for(let dim = 0; dim < this.getDimension(); ++dim) {
            copy.set(dim, this.get(dim));
        }
        
        return copy;
    }
    
    get() {
        if(arguments.length === 1) {
            return this[arguments[0]];
        }
        
        return this;
    }
    
    set() {
        if(arguments.length == 2) {
            this[arguments[0]] = arguments[1];
        }
        
        else if(arguments.length == 1 && Array.isArray(arguments[0])) {
            const vector = arguments[0];
            
            this.setDimension(vector.length);
            
            for(let dim = 0; dim < vector.length; ++dim) {
                this.set(dim, vector[dim]);
            }
        }
        
        else if(arguments.length == 1) {
            const value = arguments[0];
            
            for(let dim = 0; dim < this.getDimension(); ++dim) {
                this.set(dim, value);
            }
        }
        
        return this;
    }
    
    translate() {
        return Vector.add(this, ...arguments);
    }
    
    add() {
        return Vector.add(this, ...arguments);
    }
    
    plus() {
        return Vector.addition(this, ...arguments);
    }
    
    subtract() {
        return Vector.subtract(this, ...arguments);
    }
    
    minus() {
        return Vector.subtraction(this, ...arguments);
    }
    
    multiply() {
        return Vector.multiply(this, ...arguments);
    }
    
    times() {
        return Vector.multiplication(this, ...arguments);
    }
    
    divide() {
        return Vector.divide(this, ...arguments);
    }
    
    divided() {
        return Vector.division(this, ...arguments);
    }
    
    opposite() {
        var opposite = new Vector();
        
        for(var i = 0; i < this.size(); ++i) {
            opposite[i] = -this[i];
        }
        
        return opposite;
    } neg() {
        return this.times(-1);
    }
    
    getNorm() {
        var norm = 0;
        
        for(var i = 0; i < this.size(); ++i) {
            norm += this[i] * this[i];
        }
        
        return norm = Math.sqrt(norm);
    } norm() {
        return this.getNorm();
    }
    
    regulate(newNorm) {
        if(typeof newNorm == "undefined") {
            newNorm = 1;
        }
        
        var hyp = this.getNorm();
        
        if(hyp == 0) {
            return this;
        }
        
        for(var i = 0; i < this.size(); ++i) {
            this[i] *= newNorm / hyp;
        }
        
        return this;
    } regulated(newNorm) {
        return this.copy().regulate(newNorm);
    } normalize(newNorm) {
        return this.regulate(newNorm);
    } unit(newNorm) {
        return this.regulated(newNorm);
    } normalized(norm = 1) {
        let oldNorm = this.getNorm();
        
        if(oldNorm == 0) {
            return Vector.from(this);
        }
        
        let vector = new Vector();
        
        for(var dim = 0; dim < this.getDimension(); ++dim) {
            vector.set(dim, this.get(dim) * norm / oldNorm);
        }
        
        return vector;
    } reg(n) {
        return this.regulate(...arguments);
    }
    
    scalar(vector) {
        var product = 0;
        
        for(var i = 0; i < this.size(); i++) {
            product += this[i] * vector[i];
        }
        
        return product;
    } prod() {
        return this.scalar(...arguments);
    }
    
    dist() {
        return Vector(this, ...arguments);
    }
    
    sum() {
        var res = 0;
        
        for(var i = 0; i < this.length; i++) {
            res += this[i];
        }
        
        return res;
    }
    
    get x() {
        return this[0];
    } get y() {
        return this[1];
    } get z() {
        return this[2];
    } get t() {
        return this[3];
    }
    
    set x(x) {
        this[0] = x;
    } set y(y) {
        this[1] = y;
    } set z(z) {
        this[2] = z;
    } set t(t) {
        this[3] = t;
    }
    
    /* 01/03/2019 */
    
    getX() {
        return this.toArray()[0];
    } getY() {
        return this.toArray()[1];
    } getZ() {
        return this.toArray()[2];
    } getT() {
        return this.toArray()[3];
    } setX(x) {
        this[0] = x;
        
        return this;
    } setY(y) {
        this[1] = y;
        
        return this;
    } setZ(z) {
        this[2] = z;
        
        return this;
    } setT(t) {
        this[3] = t;
        
        return this;
    }
    
    toString() {
        return "[" + this.join(", ") + "]";
        
        /**
        
        var res = "[";
        
        for(var i = 0; i < this.size(); i++) {
            res += this[i];
            
            if(i < this.size() - 1) {
                res += ", ";
            }
        }
        
        return res + "]";
        
        /**/
    }
    
    /* 22/12/2018 */
    
    angleBetween(vector = new Vector(1, 0)) {
        if(!(vector instanceof Vector) && Array.isArray(vector)) {
            vector = Vector.from(vector);
        }
        
        let angle1 = this.getAngle();
        let angle2 = vector.getAngle();
        
        // angle1 = ((angle1 % 2*Math.PI) + 2*Math.PI) % 2*Math.PI;
        // angle2 = ((angle2 % 2*Math.PI) + 2*Math.PI) % 2*Math.PI;
        
        let angle = angle2 - angle1;
        
        // angle = ((angle % 2*Math.PI) + 2*Math.PI) % 2*Math.PI;
        
        return angle;
        
        /**
        
        var scalar = 0;
        var tnorm = 0, onorm = 0;
        
        for(var dim = 0; dim < this.getDimension(); ++dim) {
            scalar += vector[dim] * this.get(dim);
            tnorm += Math.pow(this.get(dim), 2);
            onorm += Math.pow(vector[dim], 2);
        }
        
        tnorm = Math.sqrt(tnorm);
        onorm = Math.sqrt(onorm);
        
        return Math.acos(scalar / (tnorm * onorm));
        return Math.acos(this.scalar(vector) / (this.getNorm() * vector.getNorm()));
        
        /**/
    }
    
    /* 24/06/2019 */
    
    getAngle() {
        var norm = this.getNorm();
        var cos = this.getX() / norm, sin = this.getY() / norm;
        return Math.atan2(sin, cos);
    }
    
    /* 23/01/2019 */
    
    equals(object) {
        if((object instanceof Vector) && (this.size() == object.size())) {
            var vector = object;
            
            for(var i = 0; i < this.size(); i++) {
                if(this[i] != vector[i]) {
                    return false;
                }
            }
            
            return true;
        } else if(Array.isArray(object) && (this.size() == object.length)) {
            var array = object;
            
            for(var i = 0; i < this.size(); i++) {
                if(this[i] != array[i]) {
                    return false;
                }
            }
            
            return true;
        }
        
        return false;
    }
    
    /* 22/06/2019 */
    
    rotate(angle) {
        if(this.getDimension() != 2) {
            return this;
        }
        
        var cos = Math.cos(angle), sin = Math.sin(angle);
        
        var x = cos * this.get(0) - sin * this.get(1);
        var y = sin * this.get(0) + cos * this.get(1);
        
        this.set(0, x).set(1, y);
        
        return this;
    }
    
    /* 22/06/2019 */
    
    rotated(angle) {
        if(this.getDimension() != 2) {
            return null;
        }
        
        var cos = Math.cos(angle), sin = Math.sin(angle);
        
        return new Vector(
            cos * this.get(0) - sin * this.get(1),
            sin * this.get(0) + cos * this.get(1)
        );
    }
    
    checkLeft(vector) {
        let v = Vector.from(vector).rotate(Math.PI/2);
        
        if(this.scalar(v) < 0) {
            return true;
        }
        
        return false;
    }
    
    checkRight(vector) {
        let v = Vector.from(vector).rotate(Math.PI/2);
        
        if(this.scalar(v) > 0) {
            return true;
        }
        
        return false;
    }
}

/**/

var vector = new Vector(1, 0, 0);
var vector0 = vector;
var vector1 = new Vector(-1, -1, 0);
var vector2 = Vector.from({"0" : 2, "1" : 2, "2" : 2, "length" : 3});
var vector3 = Vector.from([3, 3, 3]);
var vector4 = Vector.from(new Vector(4, 4, 4));
var vector5 = Vector.fromParameters(5, 5, 5);
var vector6 = Vector.filled(3, 6);
var vector7 = Vector.subtraction([32, 64, 96], [-10, 21, 52]);

var rgbVector1 = new Vector(0, 0, 0);
var rgbVector2 = new Vector(255, 191, 127);

/**/

class VectorTransition {
    constructor(vector1, vector2, duration = 1, timing = function timing(x) {return x;}) {
        this.vector1 = vector1;
        this.vector2 = vector2;
        this.duration = duration;
        this.step = 0;
        this.timing = timing;
        
        this.stepDirection = +1;
        this.loop = false;
    }
    
    static from(vectorTransition) {
        return new this(vectorTransition.vector1, vectorTransition.vector2, vectorTransition.duration, vectorTransition.timing).setLoop(vectorTransition.loop);
    }
    
    at(t) {
        let vector = new Vector();
        let minDim = Math.min(this.vector1.length, this.vector2.length);
        
        for(let dim = 0; dim < minDim; ++dim) {
            vector[dim] = this.vector1[dim] + this.timing(t) * (this.vector2[dim] - this.vector1[dim]);
        }
        
        return vector;
    }
    
    getProgress() {return this.step / this.duration;}
    
    getNext() {
        const vector = this.getCurrent();
        
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
        
        return vector;
    }
    
    setDuration(duration) {
        this.duration = duration;
        this.step = 0;
        this.stepDirection = +1;
        
        return this;
    }
    
    getDuration() {return this.duration;}
    
    setLoop(loop) {this.loop = loop; return this;}
    
    copy() {
        return this.constructor.from(this);
    }
    
    setStep(step) {this.step = step; return this;}
    getStep() {return this.step;}
    
    getCurrent() {return this.at(this.getProgress());}
    
    isDone() {return this.step >= this.duration;}
}

class NumberTransition extends VectorTransition {
    constructor(number1, number2, duration = 1, timing = function timing(x) {return x;}) {
        super([number1], [number2], duration, timing);
    }
    
    static from(numberTransition) {
        return new this(vectorTransition.vector1[0], vectorTransition.vector2[0], vectorTransition.duration, vectorTransition.timing).setLoop(vectorTransition.loop);
    }
    
    at() {
        return super.at(...arguments)[0];
    }
}

function toDegree(angle) {
    return angle * 180 / Math.PI;
}

function intersection(positionL1, directionL1, positionL2, directionL2) {
    // Looking for point = (x, y)
    // x = L1x + V1x * k = L2x + V2x * t
    // y = L1y + V1y * k = L2y + V2y * t
    // 
    // L1x + V1x * k - L2x - V2x * t = 0
    // L1y + V1y * k - L2y - V2y * t = 0
    // 
    // V2y * (L1x + V1x * k - L2x - V2x * t) - V2x * (L1y + V1y * k - L2y - V2y * t) = 0
    // 
    // V2y * (L1x + V1x * k - L2x) - V2y * V2x * t + V2x * V2y * t - V2x * (L1y + V1y * k - L2y) = 0
    // 
    // V2y * V1x * k - V2x * V1y * k = V2x * (L1y - L2y) - V2y * (L1x - L2x)
    // k = ( V2x * (L1y - L2y) - V2y * (L1x - L2x) )   /   ( V2y * V1x - V2x * V1y )
    
    let k = directionL2[0] * (positionL1[1] - positionL2[1]) - directionL2[1] * (positionL1[0] - positionL2[0]);
    k /= directionL2[1] * directionL1[0] - directionL2[0] * directionL1[1];
    
    let t = positionL1[0] + directionL1[0] * k - positionL2[0];
    t /= directionL2[0];
    
    if(isNaN(t)) {
        t = positionL1[1] + directionL1[1] * k - positionL2[1];
        t /= directionL2[1];
    }
    
    let pointL1 = [
        positionL1[0] + directionL1[0] * k,
        positionL1[1] + directionL1[1] * k
    ];
    
    let pointL2 = [
        positionL2[0] + directionL2[0] * t,
        positionL2[1] + directionL2[1] * t
    ];
    
    console.log(pointL1, pointL2);
    console.log(k, t);
    
    return pointL1;
}

function linesKT(positionL1, directionL1, positionL2, directionL2) {
    let k = directionL2[0] * (positionL1[1] - positionL2[1]) - directionL2[1] * (positionL1[0] - positionL2[0]);
    k /= directionL2[1] * directionL1[0] - directionL2[0] * directionL1[1];
    
    let t = positionL1[0] + directionL1[0] * k - positionL2[0];
    t /= directionL2[0];
    
    if(isNaN(t)) {
        t = positionL1[1] + directionL1[1] * k - positionL2[1];
        t /= directionL2[1];
    }
    
    return {k:k, t:t};
}
