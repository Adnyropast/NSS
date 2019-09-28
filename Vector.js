
/**
 * 28/08/2018
 * 08/10/2018 11:59
 * The Vector class represents a multi-dimensional vector, also used for points in a space, sizes, ...
 */

class Vector extends Array {
    
    /***/
    
    static add(v1, v2) {
        for(var i = 0; i < v1.length; i++)
            v1[i] += v2[i];
        
        return v1;
    }
    static subtract(v1, v2) {
        for(var i = 0; i < v1.length; i++)
            v1[i] -= v2[i];
        
        return v1;
    }
    static multiply(v, k) {
        for(var i = 0; i < v.length; i++)
            v[i] *= k;
        
        return v;
    }
    
    /***/
    
    static addition(v1, v2) {
        var res = new this(v1.length);
        
        for(var i = 0; i < v1.length; i++)
            res[i] = v1[i] + v2[i];
        
        return res;
    }
    static subtraction(v1, v2) {
        let minDim = Math.min(v1.length, v2.length);
        
        var res = new this(minDim);
        
        for(var dim = 0; dim < minDim; ++dim)
            res[dim] = v1[dim] - v2[dim];
        
        return res;
    }
    static multiplication(v, k) {
        if(Array.isArray(arguments[1])) {
            var v2 = arguments[1];
            var res = new this(v.length);
            
            for(var i = 0; i < res.length; ++i) {
                res.set(i, v[i] * v2[i]);
            }
            
            return res;
        }
        
        var res = new this(v.length);
        
        for(var i = 0; i < v.length; i++)
            res[i] = v[i] * k;
        
        return res;
    }
    
    static normOf() {
        if(arguments[0] instanceof this) {
            return arguments[0].getNorm();
        }
        
        if(Array.isArray(arguments[0])) {
            var array = arguments[0];
            
            var norm = 0;
            
            for(var i = 0; i < array.length; ++i) {
                norm += Math.pow(array[i], 2);
            }
            
            return norm = Math.sqrt(norm);
        }
        
        return -1;
    }
    
    static distance(vector1, vector2) {
        if(vector1.length != vector2.length) {
            return Infinity;
        }
        
        var dist = 0;
        
        for(var i = 0; i < vector1.length; ++i) {
            dist += Math.pow(vector2[i] - vector1[i], 2);
        }
        
        return Math.sqrt(dist);
    }
    
    
    
    
    
    /**
     * 06/03/2019
     * Constructs a new Vector copied from an array of values.
     * @param array the array that should be copied.
     * @return a new Vector instance.
     */
    
    static fromArray(array) {
        if(!Array.isArray(array)) {
            throw "Error : parameter is not an array";
        }
        
        var vector = new this();
        
        for(var i = 0; i < array.length; ++i) {
            vector[i] = array[i];
        }
        
        return vector;
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
        var vector = new this();
        
        for(var dim = 0; dim < dimension; ++dim) {
            vector.set(dim, fillValue);
        }
        
        return vector;
    }
    
    /**
     * 24/04/2019
     * Constructs a new Vector copied from another vector.
     * @param vector the vector that should be copied.
     * @return a new Vector instance.
     */
    
    static fromVector(vector) {
        if(!(vector instanceof this)) {
            throw "Error : parameter not an instance of the Vector class";
        }
        
        var copy = new this();
        
        for(var dim = 0; dim < vector.getDimension(); ++dim) {
            copy.set(dim, vector.get(dim));
        }
        
        return copy;
    }
    
    /**
     * 24/04/2019
     * Constructs a new Vector filled with the given parameters.
     * @param the values the vector should be filled with.
     * @return a new Vector instance.
     */
    
    static fromParameters() {
        var vector = new this();
        
        for(var dim = 0; dim < arguments.length; ++dim) {
            vector.set(dim, arguments[dim]);
        }
        
        return vector;
    }
    
    /* 23/07/2019 */
    
    static fromAngle(angle) {
        return new this(Math.cos(angle), Math.sin(angle));
    }
    
    
    
    
    /**
     * Constructs a new Vector
     */
    
    constructor() {
        super();
            
        if(arguments.length == 1 && typeof arguments[0] == "number") {
            this.length = arguments[0];
        } else for(var i = 0; i < arguments.length; ++i) {
            this[i] = arguments[i];
        }
    }
    
    /* 01/03/2019 */
    
    toArray() {
        return this;
    }
    
    getDimension() {
        return this.length;
    } setDimension(dim) {
        this.length = dim;
        
        return this;
    }
    
    /* 23/01/2019 */
    
    size() {
        return this.toArray().length;
    }
    
    isZero() {
        for(var i = 0; i < this.size(); ++i) {
            if(this.get(i) != 0) {
                return false;
            }
        }
        
        return true;
    }
    
    copy() {
        var copy = new Vector();
        
        for(var i = 0; i < this.length; ++i) {
            copy[i] = this[i];
        }
        
        return copy;
    }
    
    /* 01/03/2019 */
    
    get() {
        if(arguments.length == 0) {
            return this.toArray();
        }
        
        else if(arguments.length == 1) {
            return this.toArray()[arguments[0]];
        }
        
        return undefined;
    }
    
    set() {
        if(arguments.length == 2) {
            var i = arguments[0], x = arguments[1];
            
            this[i] = x;
        } else if(arguments.length == 1 && arguments[0] instanceof Array) {
            var array = arguments[0];
            
            this.setDimension(0);
            
            for(var i = 0; i < array.length; ++i) {
                this[i] = array[i];
            }
        } else if(arguments.length == 1) {
            var x = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] = x;
            }
        }
        
        return this;
    }
    
    translate(array) {
        if(Array.isArray(array) && array.length == this.size()) {
            this.add.apply(this, arguments);
        }
        
        return this;
    }
    
    add() {
        if(arguments.length == 1 && arguments[0] instanceof Array) {
            var array = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] += array[i];
            }
        } else if(arguments.length == 1) {
            var x = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] += x;
            }
        } else if(arguments.length == 2) {
            var i = arguments[0], x = arguments[1];
            
            this[i] += x;
        }
        
        return this;
    } plus() {
        var copy = new Vector();
        
        if(arguments.length == 1 && arguments[0] instanceof Array) {
            var array = arguments[0];
            var minDim = Math.min(this.getDimension(), array.length);
            
            for(var dim = 0; dim < minDim; ++dim) {
                copy[dim] = this[dim] + array[dim];
            }
        } else if(arguments.length == 1) {
            var x = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                copy[i] = this[i] + x;
            }
        } else if(arguments.length == 2) {
            var i = arguments[0], x = arguments[1];
            
            for(var j = 0; j < this.size(); ++j) {
                copy[j] = (i == j) ? this[j] + x : this[j];
            }
        }
        
        return copy;
        
        var copy = this.copy();
        
        return copy.add.apply(copy, arguments);
    }
    
    subtract() {
        if(arguments.length == 1 && arguments[0] instanceof Array) {
            var array = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] -= array[i];
            }
        } else if(arguments.length == 1) {
            var x = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] -= x;
            }
        } else if(arguments.length == 2) {
            var i = arguments[0], x = arguments[1];
            
            this[i] -= x;
        }
        
        return this;
    } minus() {
        var res = this.copy();
        
        return res.subtract.apply(res, arguments);
    }
    
    multiply() {
        if(arguments.length == 1 && arguments[0] instanceof Array) {
            var array = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] *= array[i];
            }
        } else if(arguments.length == 1) {
            var x = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] *= x;
            }
        } else if(arguments.length == 2) {
            var i = arguments[0], x = arguments[1];
            
            this[i] *= x;
        }
        
        return this;
    } times() {
        var res = this.copy();
        
        return res.multiply.apply(res, arguments);
    }
    
    divide() {
        if(arguments.length == 1 && arguments[0] instanceof Array) {
            var array = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] /= array[i];
            }
        } else if(arguments.length == 1) {
            var x = arguments[0];
            
            for(var i = 0; i < this.size(); ++i) {
                this[i] /= x;
            }
        } else if(arguments.length == 2) {
            var i = arguments[0], x = arguments[1];
            
            this[i] /= x;
        }
        
        return this;
    } divided() {
        var res = this.copy();
        
        return res.divide.apply(res, arguments);
    }
    
    opposite() {
        var opposite = new Vector();
        
        for(var i = 0; i < this.size(); ++i) {
            opposite[i] = -this[i];
        }
        
        return opposite;
    }
    
    getNorm() {
        var norm = 0;
        
        for(var i = 0; i < this.size(); ++i) {
            norm += this[i] * this[i];
        }
        
        return norm = Math.sqrt(norm);
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
    }
    
    scalar(vector) {
        var product = 0;
        
        for(var i = 0; i < this.size(); i++) {
            product += this[i] * vector[i];
        }
        
        return product;
    }
    
    dist(array) {
        if(this.size() != array.length) {
            return Infinity;
        }
        
        var res = 0;
        
        for(var i = 0; i < this.length; i++) {
            res += Math.pow(array[i] - this[i], 2);
        }
        
        return Math.sqrt(res);
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
        var res = "[";
        
        for(var i = 0; i < this.size(); i++) {
            res += this[i];
            
            if(i < this.size() - 1) {
                res += ", ";
            }
        }
        
        return res + "]";
    }
    
    /* 22/12/2018 */
    
    angleBetween(vector = new Vector(1, 0)) {
        if(!(vector instanceof Vector) && Array.isArray(vector)) {
            vector = Vector.from(vector);
        }
        
        return vector.getAngle() - this.getAngle();
        
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
}

/**/

var vector = new Vector(1, 0, 0);
var vector0 = vector;
var vector1 = new Vector(-1, -1, 0);
var vector2 = Vector.from({"0" : 2, "1" : 2, "2" : 2, "length" : 3});
var vector3 = Vector.fromArray([3, 3, 3]);
var vector4 = Vector.fromVector(new Vector(4, 4, 4));
var vector5 = Vector.fromParameters(5, 5, 5);
var vector6 = Vector.filled(3, 6);
var vector7 = Vector.subtraction([32, 64, 96], [-10, 21, 52]);

var rgbVector1 = new Vector(0, 0, 0);
var rgbVector2 = new Vector(255, 191, 127);

/**/
