
/**
 * The Rectangle class represents a hyperrectangle in a multi-dimensional space.
 */

class Rectangle {
    constructor(position, size) {
        this.position = [];
        this.size = [];
        
        /**
        
        if(Array.isArray(position) && Array.isArray(size)) {
            if(position.length == size.length) {
                this.setDimension(position.length);
                
                for(var dim = 0; dim < this.getDimension(); ++dim) {
                    this.position[dim] = Number(position[dim]);
                    this.size[dim] = Number(size[dim]);
                }
            } else {
                throw "Dimension error : position and size dimensions are not equal";
            }
        } else {
            
        }
        
        /**/
        
        this.setDimension(0);
        
        if(Array.isArray(position)) {
            if(position.length > this.getDimension()) {this.setDimension(position.length);}
            
            for(let dim = 0; dim < position.length; ++dim) {
                this.position[dim] = Number(position[dim]);
            }
        } if(Array.isArray(size)) {
            if(size.length > this.getDimension()) {this.setDimension(size.length);}
            
            for(let dim = 0; dim < size.length; ++dim) {
                this.size[dim] = Number(size[dim]);
            }
        }
    }
    
    static fromPoints(point1, point2) {
        if(!Array.isArray(point1) || !Array.isArray(point2) || point1.length != point2.length) {
            return null;
        }
        
        var min = [];
        var position = [];
        var size = [];
        
        for(var i = 0; i < point1.length; ++i) {
            min[i] = Math.min(point1[i], point2[i]);
            
            if(!isFinite(point2[i]) && !isFinite(point1[i])) {
                position[i] = Math.min(point1[i], point2[i]);
                size[i] = Math.max(point1[i], point2[i]);
            } else if(!isFinite(point1[i])) {
                position[i] = point2[i];
                size[i] = point1[i];
            } else {
                position[i] = point1[i];
                size[i] = point2[i] - point1[i];
            }
        }
        
        return new this(position, size);
    }
    
    static fromObject(object) {
        if(typeof object != "object" || object == null) {
            return null;
        }
        
        var rectangle = new this();
        
        if(Array.isArray(object.size)) {
            rectangle.setSize(object.size);
            Object.defineProperty(rectangle, "dimension", {"enumerable" : false, "value" : object.size.length});
        }
        
        if(Array.isArray(object.position) && object.position.length == rectangle.getDimension()) {
            rectangle.setPosition1(object.position);
        }
        
        if(Array.isArray(object.positionM) && object.positionM.length == rectangle.getDimension()) {
            rectangle.setPositionM(object.positionM);
        }
        
        return rectangle;
    }
    
    static fromData(data) {
        /**
        
        var clone = {};
        Object.assign(clone, data);
        data = clone;
        
        /**/
        
        var position = undefined, size = undefined;
        
        if(data.hasOwnProperty("width")) {
            if(typeof size == "undefined") {size = [];}
            size[0] = data.width;
            delete data.width;
        } if(data.hasOwnProperty("height")) {
            if(typeof size == "undefined") {size = [];}
            size[1] = data.height;
            delete data.height;
        } if(data.hasOwnProperty("depth")) {
            if(typeof size == "undefined") {size = [];}
            size[2] = data.depth;
            delete data.depth;
        } if(Array.isArray(data.size)) {
            if(typeof size == "undefined") {size = [];}
            
            for(var dim = 0; dim < data.size.length; ++dim) {
                size[dim] = data.size[dim];
            }
            
            delete data.size;
        }
        
        if(data.hasOwnProperty("x")) {
            if(typeof position == "undefined") {position = [];}
            position[0] = data.x;
            // delete data.x;
        } if(data.hasOwnProperty("y")) {
            if(typeof position == "undefined") {position = [];}
            position[1] = data.y;
            // delete data.y;
        } if(data.hasOwnProperty("z")) {
            if(typeof position == "undefined") {position = [];}
            position[2] = data.z;
            // delete data.z;
        } if(data.hasOwnProperty("x1")) {
            if(typeof position == "undefined") {position = [];}
            position[0] = data.x1;
            // delete data.x1;
        } if(data.hasOwnProperty("y1")) {
            if(typeof position == "undefined") {position = [];}
            position[1] = data.y1;
            // delete data.y1;
        } if(data.hasOwnProperty("z1")) {
            if(typeof position == "undefined") {position = [];}
            position[2] = data.z1;
            // delete data.z1;
        } if(data.hasOwnProperty("xM")) {
            if(typeof position == "undefined") {position = [];}
            
            if(typeof size != "undefined" && typeof size[0] != "undefined") {
                position[0] = data.xM - size[0] / 2;
            } else {
                // throw "error : width not defined";
            }
            
            // delete data.xM;
        } if(data.hasOwnProperty("yM")) {
            if(typeof position == "undefined") {position = [];}
            
            if(typeof size != "undefined" && typeof size[1] != "undefined") {
                position[1] = data.yM - size[1] / 2;
            } else {
                // throw "error : height not defined";
            }
            
            // delete data.yM;
        } if(data.hasOwnProperty("zM")) {
            if(typeof position == "undefined") {position = [];}
            
            if(typeof size != "undefined" && typeof size[2] != "undefined") {
                position[2] = data.zM - size[2] / 2;
            } else {
                // throw "error : depth not defined";
            }
            
            // delete data.zM;
        } if(data.hasOwnProperty("x2")) {
            if(typeof position == "undefined") {position = [];}
            
            if(typeof size != "undefined" && typeof size[0] != "undefined") {
                position[0] = data.x2 - size[0];
            } else {
                // throw "error : width not defined";
            }
            
            // delete data.x2;
        } if(data.hasOwnProperty("y2")) {
            if(typeof position == "undefined") {position = [];}
            
            if(typeof size != "undefined" && typeof size[1] != "undefined") {
                position[1] = data.y2 - size[1];
            } else {
                // throw "error : height not defined";
            }
            
            // delete data.y2;
        } if(data.hasOwnProperty("z2")) {
            if(typeof position == "undefined") {position = [];}
            
            if(typeof size != "undefined" && typeof size[2] != "undefined") {
                position[2] = data.z2 - size[2];
            } else {
                // throw "error : depth not defined";
            }
            
            // delete data.z2;
        } if(Array.isArray(data.position)) {
            if(typeof position == "undefined") {position = [];}
            
            for(var dim = 0; dim < data.position.length; ++dim) {
                position[dim] = data.position[dim];
            }
            
            // delete data.position;
        } if(Array.isArray(data.positionM)) {
            if(typeof position == "undefined") {position = [];}
            
            for(var dim = 0; dim < data.positionM.length; ++dim) {
                if(typeof size != "undefined" && typeof size[dim] != "undefined") {
                    position[dim] = data.positionM[dim] - size[dim] / 2;
                } else {
                    // throw "Dimension error";
                }
            }
            
            // delete data.positionM;
        }
        
        var rectangle = new this(position, size);
        
        if(data.hasOwnProperty("x")) {
            rectangle.setX(data.x);
            
            // if(typeof position == "undefined") {position = [];}
            // position[0] = data.x;
            delete data.x;
        } if(data.hasOwnProperty("y")) {
            rectangle.setY(data.y);
            
            // if(typeof position == "undefined") {position = [];}
            // position[1] = data.y;
            delete data.y;
        } if(data.hasOwnProperty("z")) {
            rectangle.setZ(data.z);
            
            // if(typeof position == "undefined") {position = [];}
            // position[2] = data.z;
            delete data.z;
        } if(data.hasOwnProperty("x1")) {
            rectangle.setX(data.x1);
            
            // if(typeof position == "undefined") {position = [];}
            // position[0] = data.x1;
            delete data.x1;
        } if(data.hasOwnProperty("y1")) {
            rectangle.setY(data.y1);
            
            // if(typeof position == "undefined") {position = [];}
            // position[1] = data.y1;
            delete data.y1;
        } if(data.hasOwnProperty("z1")) {
            rectangle.setZ(data.z1);
            
            // if(typeof position == "undefined") {position = [];}
            // position[2] = data.z1;
            delete data.z1;
        } if(data.hasOwnProperty("xM")) {
            rectangle.setXM(data.xM);
            
            // if(typeof position == "undefined") {position = [];}
            
            // if(typeof size != "undefined" && typeof size[0] != "undefined") {
                // position[0] = data.xM - size[0] / 2;
            // } else {
                // throw "error : width not defined";
            // }
            
            delete data.xM;
        } if(data.hasOwnProperty("yM")) {
            rectangle.setYM(data.yM);
            
            // if(typeof position == "undefined") {position = [];}
            
            // if(typeof size != "undefined" && typeof size[1] != "undefined") {
                // position[1] = data.yM - size[1] / 2;
            // } else {
                // throw "error : height not defined";
            // }
            
            delete data.yM;
        } if(data.hasOwnProperty("zM")) {
            rectangle.setZM(data.zM);
            
            // if(typeof position == "undefined") {position = [];}
            
            // if(typeof size != "undefined" && typeof size[2] != "undefined") {
                // position[2] = data.zM - size[2] / 2;
            // } else {
                // throw "error : depth not defined";
            // }
            
            delete data.zM;
        } if(data.hasOwnProperty("x2")) {
            rectangle.setX2(data.x2);
            
            // if(typeof position == "undefined") {position = [];}
            
            // if(typeof size != "undefined" && typeof size[0] != "undefined") {
                // position[0] = data.x2 - size[0];
            // } else {
                // throw "error : width not defined";
            // }
            
            delete data.x2;
        } if(data.hasOwnProperty("y2")) {
            rectangle.setY2(data.y2);
            
            // if(typeof position == "undefined") {position = [];}
            
            // if(typeof size != "undefined" && typeof size[1] != "undefined") {
                // position[1] = data.y2 - size[1];
            // } else {
                // throw "error : height not defined";
            // }
            
            delete data.y2;
        } if(data.hasOwnProperty("z2")) {
            rectangle.setZ2(data.z2);
            
            // if(typeof position == "undefined") {position = [];}
            
            // if(typeof size != "undefined" && typeof size[2] != "undefined") {
                // position[2] = data.z2 - size[2];
            // } else {
                // throw "error : depth not defined";
            // }
            
            delete data.z2;
        } if(Array.isArray(data.position)) {
            rectangle.setPosition(data.position);
            
            // if(typeof position == "undefined") {position = [];}
            
            // for(var dim = 0; dim < data.position.length; ++dim) {
                // position[dim] = data.position[dim];
            // }
            
            delete data.position;
        } if(Array.isArray(data.positionM)) {
            rectangle.setPositionM(data.positionM);
            
            // if(typeof position == "undefined") {position = [];}
            
            // for(var dim = 0; dim < data.positionM.length; ++dim) {
                // if(typeof size != "undefined" && typeof size[dim] != "undefined") {
                    // position[dim] = data.positionM[dim] - size[dim] / 2;
                // } else {
                    // throw "Dimension error";
                // }
            // }
            
            delete data.positionM;
        }
        
        // Object.assign(rectangle, data);
        
        return rectangle;
    }
    
    static fromMiddle(positionM, size) {
        /**
        
        var position = [];
        
        for(var dim = 0; dim < positionM.length; ++dim) {
            position[dim] = positionM[dim] - size[dim] / 2;
        }
        
        return new this(position, size);
        
        /**/
        
        let rectangle = new this(positionM, size);
        rectangle.setPositionM(positionM);
        
        return rectangle;
    }
    
    static from(rectangle) {
        return new this(rectangle.position, rectangle.size);
    }
    
    static shared(rectangle) {
        let res = new this(rectangle.position, rectangle.size);
        res.setDimension(rectangle.getDimension());
        res.position = rectangle.position;
        res.size = rectangle.size;
        // res.sharePosition(rectangle.position);
        // res.shareSize(rectangle.size);
        
        return res;
    }
    
    /**
     *
     */
    
    sharePosition(position) {
        this.setDimension(position.length);
        this.position = position;
        
        return this;
    }
    
    shareSize(size) {
        this.setDimension(size.length);
        this.size = size;
        
        return this;
    }
    
    /* 24/10/2019 */
    
    sharePositionWith(rectangle) {
        return this.sharePosition(rectangle.position);
    }
    
    /* 24/10/2019 */
    
    shareSizeWith(rectangle) {
        return this.shareSize(rectangle.size);
    }
    
    /**
     * 26/04/2019
     */
    
    setPosition() {
        return this.setPosition1.apply(this, arguments);
    }
    
    /**
     * 
     * 23/04/2019
     */
    
    setPosition1(position1) {
        if(arguments.length == 2) {
            return this.setCoordinate1(arguments[0], arguments[1]);
        }
        
        this.setDimension(position1.length);
        
        for(let dim = 0; dim < position1.length; ++dim) {
            this.position[dim] = position1[dim];
        }
        
        return this;
    }
    
    setCoordinate1(dimension, coordinate) {
        // if(dimension > this.getDimension()) {this.setDimension(dimension);}
        
        this.position[dimension] = coordinate;
        
        return this;
    }
    
    /**
     * 13/02/2019
     * 23/04/2019
     */
    
    setPositionM(positionM) {
        if(arguments.length == 2) {
            return this.setCoordinateM(arguments[0], arguments[1]);
        }
        
        this.setDimension(positionM.length);
        
        for(let dim = 0; dim < positionM.length; ++dim) {
            this.position[dim] = positionM[dim] - this.size[dim] / 2;
        }
        
        return this;
    }
    
    setCoordinateM(dimension, coordinate) {
        // if(dimension > this.getDimension()) {this.setDimension(dimension);}
        
        this.position[dimension] = coordinate - this.size[dimension] / 2;
        
        return this;
    }
    
    /**
     * 13/02/2019
     * 23/04/2019
     */
    
    setPosition2(position2) {
        if(arguments.length == 2) {
            return this.setCoordinate2(arguments[0], arguments[1]);
        }
        
        this.setDimension(position2.length);
        
        for(let dim = 0; dim < position2.length; ++dim) {
            this.position[dim] = position2[dim] - this.size[dim];
        }
        
        return this;
    }
    
    setCoordinate2(dimension, coordinate) {
        // if(dimension > this.getDimension()) {this.setDimension(dimension);}
        
        this.position[dimension] = coordinate - this.size[dimension];
        
        return this;
    }
    
    setSize(size) {
        if(arguments.length == 2) {
            return this.setSide(arguments[0], arguments[1]);
        }
        
        this.setDimension(size.length);
        
        for(let dim = 0; dim < size.length; ++dim) {
            this.size[dim] = size[dim];
        }
        
        return this;
    }
    
    setSide(dimension, width) {
        // if(dimension > this.getDimension()) {this.setDimension(dimension);}
        
        this.size[dimension] = width;
        
        return this;
    }
    
    /* 18/06/2019 */
    
    setSizeM(size) {
        if(arguments.length == 2) {
            return this.setSideM(arguments[0], arguments[1]);
        }
        
        this.setDimension(size.length);
        
        for(let dim = 0; dim < size.length; ++dim) {
            this.setSideM(dim, size[dim]);
        }
        
        return this;
    }
    
    setSideM(dimension, width) {
        // if(dimension > this.getDimension()) {this.setDimension(dimension);}
        
        this.position[dimension] = this.position[dimension] + (this.size[dimension] - width) / 2
        
        // this.position[dimension] = this.position[dimension] + this.size[dimension] / 2;
        this.size[dimension] = width;
        // this.position[dimension] = this.position[dimension] - this.size[dimension] / 2;
        
        return this;
    }
    
    roundPosition(gridunit = 8) {
        for(var dim = 0; dim < this.getDimension(); ++dim) {
            this.position[dim] = Math.round(this.position[dim] / gridunit) * gridunit;
        }
        
        return this;
    }
    
    /* 03/07/2019 */
    
    fillPositionM(positionM) {
        let minDim = Math.min(this.getDimension(), positionM.length);
        
        for(let dim = 0; dim < minDim; ++dim) {
            this.position[dim] = positionM[dim] - this.size[dim] / 2;
        }
        
        return this;
    }
    
    /**
     * 26/04/2019
     * Multiplies the size of the rectangle (the center position remains the same).
     * @param factor the value to multiply the size by.
     * @return the rectangle itself.
     */
    
    multiplySize(factor) {
        for(var i = 0; i < this.getDimension(); ++i) {
            this.position[i] = this.position[i] + this.size[i] / 2;
            this.size[i] *= factor;
            this.position[i] = this.position[i] - this.size[i] / 2;
        }
        
        return this;
    }
    
    /**
     * 21/06/2019
     */
    
    setPositionSize(position, size) {
        if(Array.isArray(position) && Array.isArray(size) && position.length == size.length) {
            this.setDimension(position.length);
            
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                this.position[dim] = position[dim];
                this.size[dim] = size[dim];
            }
        }
        
        return this;
    }
    
    /**
     * 21/06/2019
     */
    
    setDimension(dimension) {
        Object.defineProperty(this, "dimension", {"enumerable" : false, "value" : dimension, "writable" : true});
        this.position.length = dimension;
        this.size.length = dimension;
        
        return this;
    }
    
    /**
     * 23/01/2019
     * 23/04/2019
     * Accesses the dimension of the rectangle.
     * @return the dimension.
     */
    
    getDimension() {
        return this.dimension;
    }
    
    getPosition(dimension, factor) {
        if(typeof factor == "undefined") {
            if(typeof dimension == "undefined") {
                return this.position;
            }
            
            return this.position[dimension];
        }
        
        return this.position[dimension] + this.size[dimension] * factor;
    }
    
    /*  * 22/11/2018 */
    
    getPosition1(dim) {
        if(arguments.length == 0) {
            return Array.from(this.position);
        }
        
        return this.position[dim];
    } getPositionM(dim) {
        if(arguments.length == 0) {
            var positionM = [];
            
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                positionM[dim] = this.position[dim] + this.size[dim] / 2;
            }
            
            return positionM;
        }
        
        return this.position[dim] + this.size[dim] / 2;
    } getPosition2(dim) {
        if(arguments.length == 0) {
            var position2 = [];
            
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                position2[dim] = this.position[dim] + this.size[dim];
            }
            
            return position2;
        }
        
        return this.position[dim] + this.size[dim];
    }
    getSize(dim) {
        if(arguments.length == 0) {
            return Array.from(this.size);
        }
        
        return this.size[dim];
    }
    
    /* 14/01/2019 */
    
    getX() {
        return this.position[0];
    } getY() {
        return this.position[1];
    } getZ() {
        return this.position[2];
    } getXM() {/* 25/01/2019 */
        return this.position[0] + this.size[0] / 2;
    } getYM() {
        return this.position[1] + this.size[1] / 2;
    } getZM() {
        return this.position[2] + this.size[2] / 2;
    } getX2() {
        return this.position[0] + this.size[0];
    } getY2() {
        return this.position[1] + this.size[1];
    } getZ2() {
        return this.position[2] + this.size[2];
    }
    
    /* 29/09/2019 */
    
    getX1() {return this.position[0];}
    getY1() {return this.position[1];}
    getZ1() {return this.position[2];}
    
    getWidth() {/* 14/01/2019 */
        return this.size[0];
    } getHeight() {
        return this.size[1];
    } getDepth() {
        return this.size[2];
    }
    
    /* 15/06/2019 */
    
    setX(x) {this.position[0] = x; return this;}
    setY(y) {this.position[1] = y; return this;}
    setZ(z) {this.position[2] = z; return this;}
    setXM(xM) {this.position[0] = xM - this.size[0] / 2; return this;}
    setYM(yM) {this.position[1] = yM - this.size[1] / 2; return this;}
    setZM(zM) {this.position[2] = zM - this.size[2] / 2; return this;}
    setX2(x2) {this.position[0] = x2 - this.size[0]; return this;}
    setY2(y2) {this.position[1] = y2 - this.size[1]; return this;}
    setZ2(z2) {this.position[2] = z2 - this.size[2]; return this;}
    
    setX1(x1) {this.position[0] = x1; return this;}
    setY1(y1) {this.position[1] = y1; return this;}
    setZ1(z1) {this.position[2] = z1; return this;}
    
    setWidth(width) {this.size[0] = width; return this;}
    setHeight(height) {this.size[1] = height; return this;}
    setDepth(depth) {this.size[2] = depth; return this;}
    
    /* 02/11/2018 */
    
    get position1() {
        return this.position;
    } get positionM() {
        var positionM = [];
        
        for(var i = 0; i < this.dimension; ++i) {
            positionM[i] = this.position[i] + this.size[i] / 2;
        }
        
        return positionM;
    } get position2() {
        var position2 = [];
        
        for(var i = 0; i < this.dimension; ++i) {
            position2[i] = this.position[i] + this.size[i];
        }
        
        return position2;
    }
    
    /* 03/11/2018 */
    
    set position1(position1) {
        if(Array.isArray(position1)) {
            this.position = [];
            
            for(var i = 0; i < position1.length; ++i) {
                this.position[i] = position1[i];
            }
        }
    } set positionM(positionM) {
        if(Array.isArray(positionM)) {
            this.position = [];
            
            for(var i = 0; i < positionM.length; ++i) {
                this.position[i] = positionM[i] - this.size[i] / 2;
            }
        }
    } set position2(position2) {
        if(Array.isArray(position2)) {
            this.position = [];
            
            for(var i = 0; i < position2.length; ++i) {
                this.position[i] = position2[i] - this.size[i];
            }
        }
    }
    
    /* 03/11/2018 */
    
    get x() {
        return this.position[0];
    } get y() {
        return this.position[1];
    } get z() {
        return this.position[2];
    } get _t() {
        return this.position[3];
    }
    
    set x(x) {
        this.position[0] = x;
    } set y(y) {
        this.position[1] = y;
    } set z(z) {
        this.position[2] = z;
    } set _t(t) {
        this.position[3] = t;
    }
    
    get width() {
        return this.size[0];
    } get height() {
        return this.size[1];
    } get depth() {
        return this.size[2];
    } get _duration() {
        return this.size[3];
    }
    
    set width(width) {
        this.size[0] = width;
    } set height(height) {
        this.size[1] = height;
    } set depth(depth) {
        this.size[2] = depth;
    } set _duration(duration) {
        this.size[3] = duration;
    }
    
    /**
     * 23/01/2019
     * Translates the rectangle according to a vector.
     * @param vector the vector that should move the rectangle.
     * @return the rectangle itself.
     */
    
    translate(vector) {
        var minDimension = Math.min(this.getDimension(), vector.length);
        
        for(var dimension = 0; dimension < minDimension; ++dimension) {
            this.position[dimension] += vector[dimension];
        }
        
        return this;
    }
    
    getPolygons() {
        if(this.getDimension() === 2) {
            return new Polygon([
                [this.getX1(), this.getY1()],
                [this.getX2(), this.getY1()],
                [this.getX2(), this.getY2()],
                [this.getX1(), this.getY2()]
            ]);
        }
        
        else if(this.getDimension() === 3) {
            var res = new Array(6);
            
            for(var i = 0; i < 6; i++) {
                
            }
            
            var x1 = this.position[0]; var x2 = this.position[0] + this.size[0];
            var y1 = this.position[1]; var y2 = this.position[1] + this.size[1];
            var z1 = this.position[2]; var z2 = this.position[2] + this.size[2];
            
            var res = new Array(6);
            
            res[2] = new Polygon([
                [x1, y1, z1],
                [x1, y1, z2],
                [x1, y2, z2],
                [x1, y2, z1]
            ]);
            
            res[1] = new Polygon([
                [x2, y1, z1],
                [x2, y1, z2],
                [x2, y2, z2],
                [x2, y2, z1]
            ]);
            
            res[3] = new Polygon([
                [x1, y1, z1],
                [x1, y1, z2],
                [x2, y1, z2],
                [x2, y1, z1]
            ]);
            
            res[4] = new Polygon([
                [x1, y2, z1],
                [x2, y2, z1],
                [x2, y2, z2],
                [x1, y2, z2]
            ]);
            
            res[0] = new Polygon([
                [x1, y1, z1],
                [x2, y1, z1],
                [x2, y2, z1],
                [x1, y2, z1]
            ]);
            
            res[5] = new Polygon([
                [x1, y1, z2],
                [x2, y1, z2],
                [x2, y2, z2],
                [x1, y2, z2]
            ]);
            
            return res;
        }
    }
    
    getPoints() {
        var points = new Array(Math.pow(2, this.getDimension()));
        
        /**
        000
        001
        010
        011
        100
        101
        110
        111
        **/
        
        for(var i = 0; i < points.length; ++i) {
            var point = new Vector(this.getDimension());
            
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                if(i & (dim+1)) {
                    point.set(dim, this.getPosition1(dim));
                } else {
                    point.set(dim, this.getPosition2(dim));
                }
            }
            
            points[i] = point;
        }
        
        return points;
    }
    
    /***/
    
    static collision(o, p) {
        if((o instanceof this) && (p instanceof this) && o.getDimension() == p.getDimension()) {
            for(var dim = 0; dim < o.getDimension(); ++dim) {
                if(o.getPosition1(dim) >= p.getPosition2(dim) || o.getPosition2(dim) <= p.getPosition1(dim)) {
                    return false;
                }
            }
            
            return true;
            /**
            for(var i = 0; i < dimension; i++) {
                if(Math.abs(p.getPositionM(i) - o.getPositionM(i)) >= (o.size[i] + p.size[i]) / 2) {
                    return false;
                }
            }
            
            return true;
            /**/
        }
        
        return false;
    }
    
    /* 23/01/2019 */
    
    static collisionEq(o, p) {
        if((o instanceof this) && (p instanceof this) && o.getDimension() == p.getDimension()) {
            for(var i = 0; i < o.getDimension(); i++) {
                if(o.getPosition1(i) > p.getPosition2(i) || o.getPosition2(i) < p.getPosition1(i)) {
                    return false;
                }
            }
            
            return true;
        }
        
        return false;
    }
    
    /***/
    
    collides(o) {
        return Rectangle.collision(this, o);
    }
    
    /**
     * 17/09/2018
     * 11/10/2018
     */
    
    replace(other, type) {
        if(other instanceof Rectangle) {
            var minDimension = Math.min(this.getDimension(), other.getDimension());
            var negative = true;
            var dimension = 0;
            
            while(type > 0 && dimension < minDimension) {
                if((type & 1) == 1) {
                    if(negative) {
                        other.setPosition2(dimension, this.getPosition1(dimension));
                    } else {
                        other.setPosition1(dimension, this.getPosition2(dimension));
                    }
                }
                
                
                
                negative = !negative;
                
                if(negative) {
                    ++dimension;
                }
                
                type >>= 1;
            }
        }
        
        /**
        
        if(typeof type == "number") {
            var x = type.toString(2);
            
            for(var i = x.length; i < minDimension * 2; i++) {
                x = "0" + x;
            }
            
            var array = new Array(minDimension);
            
            for(var i = 0; i < minDimension; i++) {
                array[i] = new Array(2);
                array[i][0] = Boolean(Number(x.charAt(2 * i)));
                array[i][1] = Boolean(Number(x.charAt(2 * i + 1)));
            }
            
            type = array.reverse();
        }
        
        for(var i = 0; i < minDimension; i++) {
            if(type[i][0]) {
                o.position[i] = this.position[i] - o.size[i];
                // o.speed[i] = 0;
            } if(type[i][1]) {
                o.position[i] = this.position[i] + this.size[i];
                // o.speed[i] = 0;
            }
        }
        
        /**/
        
        return this;
    }
    
    /**
     * 11/10/2018
     * 23/04/2019
     * Locates another object in space relatively to the rectangle.
     * @param other an object to locate.
     * @return a number associated with a direction.
     * Locates left : returnValue & 1 != 0
     * Locates right : returnValue & 2 != 0
     * Locates up : returnValue & 4 != 0
     * Locates down : returnValue & 8 != 0
     */
    
    locate(other) {
        if(other instanceof Rectangle) {
            var minDimension = Math.min(this.getDimension(), other.getDimension());
            var res = 0;
            
            var maxDist = -Infinity;
            
            for(var dim = 0; dim < minDimension; ++dim) {
                var posm = this.getPositionM(dim);
                var oposm = other.getPositionM(dim);
                var dist = Math.abs(posm - oposm) - (this.size[dim] + other.size[dim]) / 2;
                
                if(dist > maxDist) {
                    maxDist = dist;
                    res = 0;
                }
                
                if(dist == maxDist) {
                    if(oposm < posm) {
                        res += Math.pow(2, 2 * dim);
                    } else if(oposm > posm) {
                        res += Math.pow(2, 2 * dim + 1)
                    }
                }
            }
            
            return res;
        }
        
        return 0;
    }
    
    /**
     * Returns a string representation of the rectangle.
     * @return a string representation of the rectangle.
     */
    
    toString() {
        return "{[" + this.getPosition() + "], [" + this.getSize() + "]}";
    }
    
    basicDraw(context, fillStyle) {
        if(fillStyle instanceof HTMLImageElement) {
            context.drawRect(fillStyle, this.getX(), this.getY(), this.getWidth(), this.getHeight());
        } else {
            // context.fillStyle = fillStyle;
            context.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        }
        
        return this;
    }
    
    /**
     * 24/06/2019
     * Returns the position of the point on the border of the rectangle at a specific angle.
     * @param angle the angle at which the point should be calculated.
     * @return the position of the point on the border at the given angle.
     */
    
    pointAt(angle) {
        if(this.getDimension() != 2) {
            return null;
        }
        
        var cos = Math.cos(angle), sin = -Math.sin(angle);
        var vx = -sin, vy = cos;
        
        if(Math.abs(cos) > Math.abs(sin)) {
            var x = this.getXM() + Math.sign(cos) * this.getWidth() / 2;
            
            return [
                x,
                (   - vx * x + vx * this.getXM() + vy * this.getYM()   ) / vy
            ];
        } else {
            var y = this.getYM() + Math.sign(sin) * this.getHeight() / 2;
            
            return [
                (   + vx * this.getXM() - vy * y + vy * this.getYM()   ) / vx,
                y
            ];
        }
    }
    
    /* 24/06/2019 */
    
    sizeAt(angle) {
        if(this.getDimension() != 2) {
            return null;
        }
        
        var cos = Math.cos(angle), sin = -Math.sin(angle);
        var vx = -sin, vy = cos;
        
        if(Math.abs(cos) > Math.abs(sin)) {
            var x = this.getXM() + Math.sign(cos) * this.getWidth() / 2;
            var y = (   - vx * x + vx * this.getXM() + vy * this.getYM()   ) / vy;
        } else {
            var y = this.getYM() + Math.sign(sin) * this.getHeight() / 2;
            var x = (   + vx * this.getXM() - vy * y + vy * this.getYM()   ) / vx;
        }
        
        return Math.sqrt(Math.pow(x - this.getXM(), 2) + Math.pow(y - this.getYM(), 2));
    }
    
    /*  */
    
    collidesWithPoint(point) {
        let minDim = Math.min(this.getDimension(), point.length);
        
        for(let dim = 0; dim < minDim; ++dim) {
            if(this.getPosition1(dim) > point[dim] || this.getPosition2(dim) < point[dim]) {
                return false;
            }
        }
        
        return true;
    }
    
    getCoordinate1(dimension) {return this.position[dimension];}
    getCoordinateM(dimension) {return this.position[dimension] + this.size[dimension]/2;}
    getCoordinate2(dimension) {return this.position[dimension] + this.size[dimension];}
    
    collidesWithPolygon(polygon) {
        const p = this.getPolygons();
        
        return p.collides(polygon);
    }
    
    getData() {
        return {
            position: this.position,
            size: this.size
        };
    }
}

/**/

var rectangle = new Rectangle([0, 0, -16], [16, 16, 16]);
var rectangle0 = rectangle;
var rectangle1 = new Rectangle([16, 0, -16], [16, 16, 16]);
var rectangle2a = new Rectangle([0, 0], [16, 16]);
var rectangle2b = new Rectangle([16, 16], [16, 16]);

var rectanglesInf = [
    Rectangle.fromPoints([-Infinity], [-Infinity]),
    Rectangle.fromPoints([-Infinity], [+Infinity]),
    Rectangle.fromPoints([+Infinity], [-Infinity]),
    Rectangle.fromPoints([+Infinity], [+Infinity]),
    
    Rectangle.fromPoints([3], [-Infinity]),
    Rectangle.fromPoints([3], [+Infinity]),
    Rectangle.fromPoints([-Infinity], [3]),
    Rectangle.fromPoints([+Infinity], [3]),
    
    Rectangle.fromPoints([+3], [+32]),
    Rectangle.fromPoints([-3], [-32]),
    Rectangle.fromPoints([+3], [-32]),
    Rectangle.fromPoints([-3], [+32]),
    
    Rectangle.fromPoints([+32], [+3]),
    Rectangle.fromPoints([-32], [-3]),
    Rectangle.fromPoints([+32], [-3]),
    Rectangle.fromPoints([-32], [+3])
];

/**/

function rectangle_averageSize() {
    let sum = 0;
    let count = 0;
    
    for(let i = 0; i < arguments.length; ++i) {
        let rectangle = arguments[i];
        
        for(let dim = 0; dim < rectangle.getDimension(); ++dim) {
            sum += arguments[i].getSize(dim);
            
            ++count;
        }
    }
    
    return sum / count;
}

function makeEncompassingRectangle(rectangles, paddings = {left:0, right:0, up:0, down:0}) {
    let dimension = 0;
    
    for(let i = 0; i < rectangles.length; ++i) {
        dimension = Math.max(dimension, rectangles[i].getDimension());
    }
    
    let minPosition = (new Array(dimension)).fill(+Infinity);
    let maxPosition = (new Array(dimension)).fill(-Infinity);
    
    for(let i = 0; i < rectangles.length; ++i) {
        const rectangle = rectangles[i];
        
        for(let dim = 0; dim < rectangle.getDimension(); ++dim) {
            if(rectangle.getCoordinate1(dim) < minPosition[dim]) {
                minPosition[dim] = rectangle.getCoordinate1(dim);
            } if(rectangle.getCoordinate2(dim) > maxPosition[dim]) {
                maxPosition[dim] = rectangle.getCoordinate2(dim);
            }
        }
    }
    
    minPosition[0] -= paddings["left"] || 0;
    maxPosition[0] += paddings["right"] || 0;
    minPosition[1] -= paddings["up"] || 0;
    maxPosition[1] += paddings["down"] || 0;
    
    let size = new Array(dimension);
    
    for(let dim = 0; dim < dimension; ++dim) {
        size[dim] = maxPosition[dim] - minPosition[dim];
    }
    
    return new Rectangle(minPosition, size);
}
