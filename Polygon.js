
/**
 * 02/11/2018
 * The Polygon class represents a list of points in a common multi-dimensional space.
 */

class Polygon extends Array {
    /**
     * Constructs a new Polygon with the given points.
     * @param points the array of points forming the polygon.
     */
    
    constructor(points) {
        super();
        
        Object.defineProperty(this, "dimension", {"writable" : true, "enumerable" : false, "value" : 0});
        Object.defineProperty(this, "center", {"writable" : true, "enumerable" : false, "value" : []});
        
        this.setPoints(points);
        
        Object.defineProperty(this, "imaginaryAngle", {"writable" : true, "enumerable" : false, "value" : 0});
        Object.defineProperty(this, "imaginarySize", {"writable" : true, "enumerable" : false, "value" : 1});
    }
    
    /**
     * Accesses the dimension of the polygon, which should be the dimension of all the points included in it.
     * @return the dimension.
     */
    
    getDimension() {
        return this.dimension;
    }
    
    /**
     * 28/03/2019
     * Returns the number of points composing the polygon.
     * @return the number of points.
     */
    
    size() {
        return this.length;
    }
    
    /**
     * Returns the array of points forming the polygon.
     * @return an array of points.
     */
    
    getPoints() {
        return Array.from(this);
    }
    
    /**
     * 28/03/2019
     * Returns the point at the specified index.
     * @param index the index of the point.
     * @return the point at the specified index.
     */
    
    getPoint(index) {
        return this[index];
    }
    
    /**
     * Replaces the point at the specified index with the given point.
     * @param index the index of the point.
     * @param point the new point to put in the polygon.
     * @return the polygon itself.
     */
    
    setPoint(index, point) {
        if(Array.isArray(point) && point.length == this.getDimension()) {
            this[index] = [];
            
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                this[index][dim] = point[dim];
            }
        }
        
        return this;
    }
    
    /**
     * Adds a point at the end of the list.
     * @param point the new point to put in the polygon.
     * @return the polygon itself.
     */
    
    push(point) {
        super.push(...arguments);
        
        let maxDim = this.getDimension();
        
        for(let i = 0; i < arguments.length; ++i) {
            maxDim = Math.max(maxDim, arguments[i].length);
        }
        
        this.setDimension(maxDim);
        
        return this.setCenter();
        // return this.setPoint(this.size(), point);
    }
    
    /**
     * Adds a point at the specified index.
     * @param index the index where the point should be added.
     * @param point the new point to put in the polygon.
     * @return the polygon itself.
     */
    
    addPoint(index, point) {
        if(index >= 0 && index <= this.size()) {
            for(var i = this.size(); i > index; --i) {
                this.setPoint(i, this.getPoint(i - 1));
            }
            
            this.setPoint(index, point);
        }
        
        return this;
    }
    
    /**
     * Removes the point at the specified index.
     * @param index the index where a point should be removed.
     * @return the polygon itself.
     */
    
    removePoint(index) {
        if(index >= 0 && index < this.size()) {
            for(var i = this.size() - 1; i > index; --i) {
                this.setPoint(i - 1, this.getPoint(i));
            }
            
            this.pop();
        }
        
        return this;
    }
    
    /**
     * Accesses the center (average) point of the polygon.
     * @return a point representing the center of the polygon.
     */
    
    getCenter() {
        return this.center;
    }
    
    /**
     * Updates the center (average) point of the polygon.
     * @param dim the dimension of the center point that should be updated (optional ; if omitted, updates all the dimensions).
     * @return the polygon itself.
     */
    
    setCenter(dim) {
        if(typeof dim == "undefined") {
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                this.center[dim] = 0;
                
                for(var i = 0; i < this.size(); i++) {
                    this.center[dim] += this[i][dim];
                }
                
                this.center[dim] /= this.size();
            }
        } else {
            this.center[dim] = 0;
            
            for(var i = 0; i < this.size(); i++) {
                this.center[dim] += this[i][dim];
            }
            
            this.center[dim] /= this.size();
        }
        
        return this;
    }
    
    /**
     * 19/11/2018
     * Translates the polygon according to a vector.
     * @param vector the vector in the same space that should move all the points in the polygon.
     * @return the polygon itself.
     */
    
    translate(vector) {
        var minDimension = Math.min(this.getDimension(), vector.length);
        
        for(var i = 0; i < this.size(); ++i) {
            for(var dim = 0; dim < minDimension; ++dim) {
                this.getPoint(i)[dim] += vector[dim];
            }
        }
        
        for(let dim = 0; dim < minDimension; ++dim) {
            this.center[dim] += vector[dim];
        }
        
        return this;
    }
    
    /**
     * Returns a string representation of the polygon.
     * @return a string representation of the polygon.
     */
    
    toString() {
        var string = "";
        
        for(var i = 0; i < this.size(); ++i) {
            string += "(";
            
            for(var dim = 0; dim < this.getDimension(); ++dim) {
                string += this.getPoint(i)[dim];
                
                if(dim < this.getDimension() - 1) {
                    string += ", ";
                }
            }
            
            string += ")";
            
            if(i < this.size() - 1) {
                string += ", ";
            }
        }
        
        return "[" + string + "]";
    }
    
    /* 02/11/2018 */

    basicDraw(context) {
        context.beginPath();
        var point = this.getPoint(0);
        
        context.moveTo(point[0], point[1]);
        
        for(var i = 1; i < this.size(); ++i) {
            point = this.getPoint(i);
            
            context.lineTo(point[0], point[1]);
        }
        
        context.closePath();
        
        context.fill();
        context.stroke();
        
        return this;
    }
    
    /**
     * 21/07/2019
     */
    
    setDimension(dimension) {
        this.dimension = dimension;
        
        for(let i = 0; i < this.size(); ++i) {
            this.getPoint(i).length = dimension;
        }
        
        return this;
    }
    
    /**
     * 21/07/2019
     */
    
    setPoints(points) {
        // this.splice(0, this.size());
        this.length = 0;
        
        if(Array.isArray(points)) {
            for(var i = 0; i < points.length; ++i) {
                /**
                
                // The first point determines the dimension of the polygon *
                
                if(typeof this.dimension == "undefined") {
                    this.setDimension(points[i].length);
                }
                
                // The polygon isn't properly built if any point has a different dimension from the first
                
                else if(points[i].length != this.dimension) {
                    throw "Dimension error : [" + points[i] + "] should have " + this.dimension + " coordinates instead of " + points[i].length;
                }
                
                /**/
                
                this.setDimension(Math.max(this.getDimension(), points[i].length));
                
                this.setPoint(i, points[i]);
            }
        }
        
        this.setCenter();
        
        return this;
    }
    
    /**
     * 05/08/2019
     */
    
    rotate(angle, center = Vector.from(this.getCenter())) {
        if(this.getDimension() != 2) {return this;}
        
        for(let i = 0; i < this.size(); ++i) {
            let point = this.getPoint(i);
            
            let vector = new Vector();
            
            for(let dim = 0; dim < this.getDimension(); ++dim) {
                vector[dim] = point[dim] - center[dim];
            }
            
            vector.rotate(angle);
            
            for(let dim = 0; dim < this.getDimension(); ++dim) {
                point[dim] = center[dim] + vector[dim];
            }
        }
        
        return this;
    }
    
    /**
     * 05/08/2019
     */
    
    multiplySize(factor) {
        let center = Vector.from(this.getCenter());
        
        for(let i = 0; i < this.size(); ++i) {
            let vector = Vector.subtraction(this.getPoint(i), center);
            
            this.setPoint(i, center.plus(vector.multiply(factor)));
        }
        
        return this;
    }
    
    /**
     * 05/08/2019
     */
    
    static from(polygon) {
        let points = [];
        
        for(let i = 0; i < polygon.size(); ++i) {
            points.push(Array.from(polygon.getPoint(i)));
        }
        
        return new this(points);
    }
    
    setPositionM(positionM) {
        let minDim = Math.min(this.getDimension(), positionM.length);
        
        for(let i = 0; i < this.size(); ++i) {
            let point = this.getPoint(i);
            
            for(let dim = 0; dim < minDim; ++dim) {
                point[dim] += positionM[dim] - this.center[dim];
            }
        }
        
        for(let dim = 0; dim < this.getDimension(); ++dim) {
            this.center[dim] = positionM[dim];
        }
        
        return this;
    }
    
    /* 12/08/2019 */
    
    getMinPosition(dimension) {
        if(arguments.length == 1) {
            let min = +Infinity;
            
            for(let i = 0; i < this.size(); ++i) {
                let point = this.getPoint(i);
                
                if(min > point[dimension]) {
                    min = point[dimension];
                }
            }
            
            return min;
        } else if(arguments.length == 0) {
            let minPosition = [];
            
            for(let dim = 0; dim < this.getDimension(); ++dim) {
                minPosition[dim] = this.getMinPosition(dim);
            }
            
            return minPosition;
        }
    }
    
    /* 12/08/2019 */
    
    getMaxPosition(dimension) {
        if(arguments.length == 1) {
            let max = -Infinity;
            
            for(let i = 0; i < this.size(); ++i) {
                let point = this.getPoint(i);
                
                if(max < point[dimension]) {
                    max = point[dimension];
                }
            }
            
            return max;
        } else if(arguments.length == 0) {
            let maxPosition = [];
            
            for(let dim = 0; dim < this.getDimension(); ++dim) {
                maxPosition[dim] = this.getMaxPosition(dim);
            }
            
            return maxPosition;
        }
    }
    
    stretch(vector) {
        let minPosition = this.getMinPosition();
        let maxPosition = this.getMaxPosition();
        
        for(let i = 0; i < this.size(); ++i) {
            let point = this.getPoint(i);
            
            for(let dim = 0; dim < this.getDimension(); ++dim) {
                if(maxPosition[dim] != minPosition[dim]) {
                    if(vector[dim] > 0) {
                        let vect = maxPosition[dim] - minPosition[dim];
                        let proportion = (point[dim] - minPosition[dim]) / vect;
                        
                        point[dim] += proportion * vector[dim];
                    } else if(vector[dim] < 0) {
                        let vect = maxPosition[dim] - minPosition[dim];
                        let proportion = (maxPosition[dim] - point[dim]) / vect;
                        
                        point[dim] += proportion * vector[dim];
                    }
                }
            }
        }
        
        this.setCenter();
        
        return this;
    }
    
    stretchM(vector) {
        let center = Array.from(this.getCenter());
        
        this.stretch(vector);
        
        return this.setPositionM(center);
    }
    
    shrink(vector) {
        let minPosition = this.getMinPosition();
        let maxPosition = this.getMaxPosition();
        
        for(let i = 0; i < this.size(); ++i) {
            let point = this.getPoint(i);
            
            for(let dim = 0; dim < this.getDimension(); ++dim) {
                if(maxPosition[dim] != minPosition[dim]) {
                    if(vector[dim] < 0) {
                        let vect = maxPosition[dim] - minPosition[dim];
                        let proportion = (point[dim] - minPosition[dim]) / vect;
                        
                        // console.log(dim, point[dim], proportion);
                        
                        point[dim] += proportion * vector[dim];
                    } else if(vector[dim] > 0) {
                        let vect = maxPosition[dim] - minPosition[dim];
                        let proportion = (maxPosition[dim] - point[dim]) / vect;
                        
                        point[dim] += proportion * vector[dim];
                    }
                }
            }
        }
        
        this.setCenter();
        
        return this;
    }
    
    shrinkM(vector) {
        let center = Array.from(this.getCenter());
        
        this.shrink(vector);
        
        return this.setPositionM(center);
    }
    
    /* 22/08/2019 */
    
    initImaginaryAngle(imaginaryAngle) {this.imaginaryAngle = imaginaryAngle; return this;}
    
    /* 22/08/2019 */
    
    getImaginaryAngle() {return this.imaginaryAngle;}
    
    /* 22/08/2019 */
    
    setImaginaryAngle(imaginaryAngle) {
        let angle = imaginaryAngle - this.imaginaryAngle;
        
        this.rotate(angle);
        
        this.imaginaryAngle = imaginaryAngle;
        
        return this;
    }
    
    /* 23/08/2019 */
    
    getPositionM() {
        return this.center;
    }
    
    /* 13/09/2019 */
    
    initImaginarySize(imaginarySize) {this.imaginarySize = imaginarySize; return this;}
    getImaginarySize() {return this.imaginarySize;}
    setImaginarySize(imaginarySize) {
        this.multiplySize(imaginarySize / this.imaginarySize);
        
        this.imaginarySize = imaginarySize;
        
        return this;
    }
    
    collidesWithPoint(point) {
        let lr = "left";
        
        for(let i = 0; i < this.size(); ++i) {
            let corner = this.getPoint(i);
            let next = this.getPoint((i+1 >= this.size()) ? 0 : i+1);
            
            let postVector = Vector.subtraction(next, corner);
            let pointDirection = Vector.subtraction(point, corner);
            
            if(i === 0) {
                if(postVector.checkLeft(pointDirection)) {
                    lr = "left";
                } else {
                    lr = "right";
                }
            } else {
                if(lr === "left" && !postVector.checkLeft(pointDirection)) {
                    return false;
                } if(lr === "right" && !postVector.checkRight(pointDirection)) {
                    return false;
                }
            }
        }
        
        return true;
        
        /**
        
        for(let i = 0; i < this.size(); ++i) {
            let corner = this.getPoint(i);
            let previous = this.getPoint((i-1 < 0) ? this.size()-1 : i-1);
            let next = this.getPoint((i+1 >= this.size()) ? 0 : i+1);
            
            let preVector = Vector.subtraction(previous, corner);
            let postVector = Vector.subtraction(next, corner);
            let pointDirection = Vector.subtraction(point, corner);
            
        }
        
        return true;
        
        /**/
    }
    
    collides(polygon) {
        for(let i = 0; i < polygon.size(); ++i) {
            if(this.collidesWithPoint(polygon[i])) {
                return true;
            }
        }
        
        for(let i = 0; i < this.size(); ++i) {
            let vector1 = Vector.subtraction(this[(i+1 >= this.size()) ? (0) : (i+1)], this[i]);
            
            for(let j = 0; j < polygon.size(); ++j) {
                let vector2 = Vector.subtraction(polygon[(j+1 >= polygon.size()) ? (0) : (j+1)], polygon[j]);
                
                let kt = linesKT(this[i], vector1, polygon[j], vector2);
                
                if(kt.k >= 0 && kt.k <= 1 && kt.t >= 0 && kt.t <= 1) {
                    return true;
                }
            }
        }
        
        return false;
        
        /**
        
        let center = (new Array(this.getDimension())).fill(0);
        let count = 0;
        
        for(let dim = 0; dim < this.getDimension(); ++dim) {
            for(let i = 0; i < this.size(); ++i) {
                center[dim] += this[i][dim];
            }
            
            for(let i = 0; i < polygon.size(); ++i) {
                center[dim] += polygon[i][dim];
            }
            
            center[dim] /= this.size() + polygon.size();
        }
        
        return this.collidesWithPoint(center) && polygon.collidesWithPoint(center);
        
        /**/
    }
    
    /* 16/10/2019 */
    
    getXM() {
        let xM = 0;
        
        for(let i = 0; i < this.size(); ++i) {
            xM += this.getPoint(i)[0];
        }
        
        xM /= this.size();
        
        return xM;
    }
    
    /* 16/10/2019 */
    
    getYM() {
        let yM = 0;
        
        for(let i = 0; i < this.size(); ++i) {
            yM += this.getPoint(i)[1];
        }
        
        yM /= this.size();
        
        return yM;
    }
    
    /* 16/10/2019 */
    
    getZM() {
        let zM = 0;
        
        for(let i = 0; i < this.size(); ++i) {
            zM += this.getPoint(i)[2];
        }
        
        zM /= this.size();
        
        return zM;
    }
}

/**/

var polygon = new Polygon([[0, 32, 64], [32, 0, 64], [320, 180, 128]]);

var polygons = [
    polygon,
    new Polygon([[32, 0, 64], [608, 0, 64], [320, 180, 128]]),
    new Polygon([[0, 32, 64], [32, 0, 64], [320, 180, 128]]),
    new Polygon([[0, 32, 64], [32, 0, 64], [320, 180, 128]]),
    new Polygon([[0, 32, 64], [32, 0, 64], [320, 180, 128]])
];

/**/

let flameparticle = new Polygon([[16, 0], [14.782072520180588, 6.1229349178414365], [11.313708498984761, 11.31370849898476], [6.122934917841437 - 1, 14.782072520180588], [0, 14], [-16, 8], [-8, 4], [-24, 0], [-8, -4], [-16, -8], [0, -14], [6.122934917841437 - 1, -14.782072520180588], [11.313708498984761, -11.31370849898476], [14.782072520180588, -6.1229349178414365]]);

let diamondparticle = new Polygon([[0, -16], [2, 0], [0, 16], [-2, 0]]);

let roundparticle = makeRegularPolygon(12, 16);

function makeFirePolygon() {
    let polygon = makeRandomPolygon(16, 2, 16);
    
    polygon.splice(0, 8);
    
    let base = makeRandomPolygon(16, 10, 16);
    
    base.splice(8, Infinity);
    
    polygon.setPoints(polygon.concat(base));
    
    return polygon
}

function makeLightningPolygon(start, end, steps = Math.floor(Math.random() * 3 + 12)) {
    let vector = Vector.subtraction(end, start);
    let normal = (new Vector(-vector[1], vector[0])).normalize();
    
    let pointsPath = new PointsPath();
    
    pointsPath.addStep(0, start);
    pointsPath.addStep(1, end);
    
    const v = 16;
    
    for(let i = 0; i < steps; ++i) {
        let progression = Math.random();
        let point = pointsPath.at(progression);
        
        pointsPath.addStep(progression, Vector.addition(point, normal.normalized(v*Math.random()-v/2)));
    }
    
    let points = pointsPath.getPoints();
    let polygon = [], reverse = [];
    
    for(let i = 1; i < points.length - 1; ++i) {
        polygon.push(normal.plus(points[i]));
        reverse.push(normal.opposite().plus(points[i]));
    }
    
    reverse.reverse();
    
    let actualPolygon = [start].concat(polygon, [end], reverse);
    
    return actualPolygon;
}

function makeRandomPolygon(pointsCount = 16, minDistance = 0, maxDistance = 16) {
    let points = new Polygon();
    
    for(i = 0; i < pointsCount; ++i) {
        let angle = i / pointsCount * 2*Math.PI;
        
        let x = (minDistance + Math.random() * (maxDistance - minDistance)) * Math.cos(angle);
        let y = (minDistance + Math.random() * (maxDistance - minDistance)) * Math.sin(angle);
        
        points.push([x, y]);
    }
    
    return points;
}

function starTiming(t) {
	return Math.pow((t - 0.5) / 0.5, 2);
}

function makeStarPolygon(cornersCount = 5, minDistance = 8, maxDistance = 16, transitionDuration = 2, timingFunction = bezierLinear) {
    let points = new Polygon();
    
    for(let i = 0; i < cornersCount; ++i) {
        for(let j = 0; j < transitionDuration; ++j) {
            let angle = (i + j / transitionDuration) / cornersCount * 2*Math.PI;
            
            let distance = minDistance + timingFunction(j/(transitionDuration-1)) * (maxDistance - minDistance);
            
            let x = distance * Math.cos(angle);
            let y = distance * Math.sin(angle);
            
            points.push([x, y]);
        }
    }
    
    return points;
}

let eightstar = makeStarPolygon(4, 6, 16, 4, function(t) {
	if(t === 0/3) {return 0;}
	if(t === 1/3) {return 0.75;}
	if(t === 2/3) {return 0;}
	if(t === 3/3) {return 1;}
});

function makeSpikePolygon(count, angleTransition, minDistance, maxDistance, width) {
    let path = new Array(2 * count + 1);
    let reverse = [];
    
    for(let i = 0; i < path.length; ++i) {
        let angle = angleTransition.at(i / (path.length - 1))[0];
        
        let cos = Math.cos(angle), sin = Math.sin(angle);
        
        if(i % 2 == 1) {
            let maxD = maxDistance;
            
            if(maxDistance instanceof ColorTransition) {maxD = maxDistance.at(Math.floor(i/2)/(count-1))[0]}
            else if(typeof maxDistance == "function") {maxD = maxDistance(Math.floor(i/2)/(count-1));}
            
            path[i] = [maxD * cos, maxD * sin];
            reverse.push([(maxD - width) * cos, (maxD - width) * sin]);
        } else {
            let minD = minDistance;
            
            if(minDistance instanceof ColorTransition) {minD = minDistance.at(i/2/count)[0];}
            else if(typeof minDistance == "function") {minD = minDistance(i/2/count);}
            
            path[i] = [minD * cos, minD * sin];
            
            if(i != 0 && i != path.length - 1) {
                reverse.push([(minD - width) * cos, (minD - width) * sin]);
            }
        }
    }
    
    reverse.reverse();
    
    return new Polygon(path.concat(reverse));
}

function makeBurstPolygon(minTransition, maxTransition) {
    let count = Math.min(minTransition.duration, maxTransition.duration);
    let polygon = new Polygon();
    
    for(let i = 0; i < count; ++i) {
        let progress = i / (count-1);
        
        let minAngle = i/count * 2*Math.PI;
        let minDist = minTransition.at(progress)[0];
        
        polygon.push([Math.cos(minAngle) * minDist, Math.sin(minAngle) * minDist]);
        
        let maxAngle = (i+.5)/count * 2*Math.PI;
        let maxDist = maxTransition.at(progress)[0];
        
        polygon.push([Math.cos(maxAngle) * maxDist, Math.sin(maxAngle) * maxDist]);
    }
    
    return polygon;
}

function makeBurstPolygon2(minTransition, maxTransition, width) {
    let count = Math.min(minTransition.duration, maxTransition.duration);
    let points = [];
    let reverse = [];
    
    for(let i = 0; i < count; ++i) {
        let progress = i / (count-1);
        
        let minAngle = i/count * 2*Math.PI;
        let minDist = minTransition.at(progress)[0];
        
        reverse.push([Math.cos(minAngle) * minDist, Math.sin(minAngle) * minDist]);
        minDist += width;
        points.push([Math.cos(minAngle) * minDist, Math.sin(minAngle) * minDist]);
        
        let maxAngle = (i+.5)/count * 2*Math.PI;
        let maxDist = maxTransition.at(progress)[0];
        
        points.push([Math.cos(maxAngle) * maxDist, Math.sin(maxAngle) * maxDist]);
        maxDist -= width;
        reverse.push([Math.cos(maxAngle) * maxDist, Math.sin(maxAngle) * maxDist]);
    }
    
    reverse.reverse();
    return new Polygon(points.concat(reverse));
}

/* 25/09/2019 */

class MultiPolygon extends Array {
    constructor() {
        super(...arguments);
        
        Object.defineProperty(this, "imaginaryAngle", {"writable" : true, "enumerable" : false, "value" : 0});
        Object.defineProperty(this, "imaginarySize", {"writable" : true, "enumerable" : false, "value" : 1});
    }
    
    static from(multiPolygon) {
        let res = new MultiPolygon();
        
        for(let i = 0; i < multiPolygon.length; ++i) {
            res.push(multiPolygon[i]);
        }
        
        return res;
    }
    
    polygonCount() {return this.length;}
    size() {return this.length;}
    getPolygon(index) {return this[index];}
    
    getDimension() {
        return this[0][0].length;
    }
    
    getCenter() {
        let sum = (new Array(this.getDimension())).fill(0);
        let count = 0;
        
        for(let i = 0; i < this.size(); ++i) {
            let polygon = this.getPolygon(i);
            
            for(let j = 0; j < polygon.size(); ++j) {
                for(let dim = 0; dim < this.getDimension(); ++dim) {
                    sum[dim] += polygon[j][dim];
                }
                
                ++count;
            }
        }
        
        for(let dim = 0; dim < sum.length; ++dim) {
            sum[dim] /= count;
        }
        
        return sum;
    }
    
    getPositionM() {return this.getCenter();}
    
    translate(vector) {
        let minDim = Math.min(this.getDimension(), vector.length);
        
        for(let i = 0; i < this.size(); ++i) {
            let polygon = this.getPolygon(i);
            
            for(let j = 0; j < polygon.size(); ++j) {
                let point = polygon[j];
                
                for(let dim = 0; dim < minDim; ++dim) {
                    point[dim] += vector[dim];
                }
            }
        }
    }
    
    rotate(angle) {
        let center = this.getCenter();
        
        for(let i = 0; i < this.size(); ++i) {
            let polygon = this.getPolygon(i);
            
            for(let j = 0; j < polygon.size(); ++j) {
                let point = polygon.getPoint(j);
                
                let vector = new Vector();
                
                for(let dim = 0; dim < this.getDimension(); ++dim) {
                    vector[dim] = point[dim] - center[dim];
                }
                
                vector.rotate(angle);
                
                for(let dim = 0; dim < this.getDimension(); ++dim) {
                    point[dim] = center[dim] + vector[dim];
                }
            }
        }
        
        return this;
    }
    
    multiplySize(factor) {
        let center = this.getCenter();
        
        for(let i = 0; i < this.size(); ++i) {
            let polygon = this.getPolygon(i);
            
            for(let j = 0; j < polygon.size(); ++j) {
                let point = polygon.getPoint(j);
                
                let vector = [];
                
                for(let dim = 0; dim < this.getDimension(); ++dim) {
                    vector[dim] = point[dim] - center[dim];
                    
                    point[dim] = center[dim] + factor * (point[dim] -  center[dim]);
                }
            }
        }
        
        return this;
    }
    
    setPositionM(positionM) {
        let center = this.getCenter();
        
        for(let i = 0; i < this.size(); ++i) {
            let polygon = this.getPolygon(i);
            
            for(let j = 0; j < polygon.size(); ++j) {
                let point = polygon.getPoint(j);
                
                for(let dim = 0; dim < this.getDimension(); ++dim) {
                    point[dim] += positionM[dim] - center[dim];
                }
            }
        }
        
        return this;
    }
    
    initImaginaryAngle(imaginaryAngle) {
        this.imaginaryAngle = imaginaryAngle;
        
        return this;
    }
    
    setImaginaryAngle(imaginaryAngle) {
        this.rotate(imaginaryAngle - this.imaginaryAngle);
        
        this.imaginaryAngle = imaginaryAngle;
        
        return this;
    }
    
    initImaginarySize(imaginarySize) {
        this.imaginarySize = imaginarySize;
        
        return this;
    }
    
    setImaginarySize(imaginarySize) {
        this.multiplySize(imaginarySize / this.imaginarySize);
        
        this.imaginarySize = imaginarySize;
        
        return this;
    }
}

function makeSwordMultiPolygon() {
    let multiPolygon = new MultiPolygon();
    
    // Blade
    
    multiPolygon.push(new Polygon([
        [0, -4],
        [16, -6],
        [24, 0],
        [16, +6],
        [0, +4]
    ]));
    
    multiPolygon.push(new Polygon([
        [-2, -8],
        [+2, -8],
        [+2, +8],
        [-2, +8]
    ]));
    
    multiPolygon.push(new Polygon([
        [-6, -2],
        [0, -2],
        [0, +2],
        [-6, +2]
    ]));
    
    multiPolygon.push(new Polygon([
        [-6, -2],
        [-6, +2],
        [-8, +3],
        [-11, 0],
        [-8, -3]
    ]));
    
    return multiPolygon;
}

function makeCrescentPolygon(count, angleTransition, closeDistanceTransition, farDistanceTransition) {
    let crescentPolygon = new Polygon();
    let reverse = [];
    
    for(let i = 0; i < count; ++i) {
        let angle = angleTransition.at(i/(count-1))[0];
        let closeDistance = closeDistanceTransition.at(i/(count-1))[0];
        let farDistance = farDistanceTransition.at(i/(count-1))[0];
        
        crescentPolygon.push([farDistance * Math.cos(angle), farDistance * Math.sin(angle)]);
        reverse.push([closeDistance * Math.cos(angle), closeDistance * Math.sin(angle)]);
    }
    
    return new Polygon(crescentPolygon.concat(reverse.reverse()));
}

function makeRegularPolygon(count = 3, distance = 16) {
    let polygon = new Polygon();
    
    for(let i = 0; i < count; ++i) {
        let angle = i/count * 2*Math.PI;
        
        polygon.push([distance * Math.cos(angle), distance * Math.sin(angle)]);
    }
    
    return polygon;
}

function makePathPolygon(path, width=2, type) {
    let polygon = [];
    let reverse = [];
    
    polygon.push(path[0]);
    
    for(let i = 1; i < path.length - 1; ++i) {
        let point = path[i];
        let vector = Vector.subtraction(point, path[i-1]);
        
        if(type === "progressive") {
            let w = width;
            let middle = Math.floor(path.length/2);
            w = powt(1/1)(1 - Math.abs(i - middle) / middle) * width;
            
            let normal = (new Vector(-vector[1], vector[0]));
            
            let innerWidth = w / 2;
            
            polygon.push(Vector.addition(point, normal.normalize(innerWidth)));
            reverse.push(Vector.subtraction(point, normal.normalize(w-innerWidth)));
        } else {
            let normal = (new Vector(-vector[1], vector[0])).normalize(width/2);
            
            polygon.push(Vector.addition(point, normal));
            reverse.push(Vector.subtraction(point, normal));
        }
    }
    
    polygon.push(path[path.length - 1]);
    polygon.push.apply(polygon, reverse.reverse());
    
    return polygon;
}

function makeArcPath(pointsCount, radius, startAngle, endAngle) {
    let path = [];
    
    for(let i = 0; i < pointsCount; ++i) {
        let angle = startAngle + (i/(pointsCount-1)) * (endAngle - startAngle);
        
        path.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
    }
    
    return path;
}

function makeRandomPointsSet(count, minX, maxX, minY, maxY) {
    let points = [];
    
    for(let i = 0; i < count; ++i) {
        points.push([minX + Math.random() * (maxX - minX), minY + Math.random() * (maxY - minY)]);
    }
    
    return points;
}

function makeRockTexture(count=16, minX=-16, maxX=16, minY=-16, maxY=16) {
    let points = makeRandomPointsSet(count, minX, maxX, minY, maxY);
    let polygons = new MultiPolygon();
    
    for(let i = 0; i < points.length; ++i) {
        let focusPoint = points[i];
        
        points.sort(function(a, b) {
            let distA = Vector.distance(a, focusPoint);
            let distB = Vector.distance(b, focusPoint);
            
            return distA - distB;
        });
        
        for(let j = 0; j < points.length/2; ++j) {
            if(i != j) {
                polygons.push((new PolygonDrawable([focusPoint, points[j]])));
            }
        }
    }
    
    mpd = MultiPolygonDrawable.from(polygons);
    mpd.cameraMode = "basic";
    
    for(let i = 0; i < mpd.size(); ++i) {
        let v = irandom(0, 255);
        mpd[i].setStrokeStyle(rgba(v, v, v));
    }
    
    return mpd;
}

function rockOnCanvas() {
    let canvas = document.createElement("canvas");
    canvas.width = 320; canvas.height = 320;
    let ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#BFBFBF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.translate(canvas.width/2, canvas.height/2);
    
    let rockTexture = makeRockTexture(16, -160, 160, -160, 160);
    
    for(let i = 0; i < rockTexture.size(); ++i) {
        ctx.strokeStyle = "#7F7F7F";
        rockTexture.getPolygon(i).basicDraw(ctx);
    }
    
    ctx.translate(-canvas.width/2, -canvas.height/2);
    
    return canvas;
}

function points_center() {
    let dimension = Array.isArray(arguments[0]) ? arguments[0].length : 0;
    let center = new Array(dimension);
    
    for(let dim = 0; dim < dimension; ++dim) {
        center[dim] = 0;
        
        for(let i = 0; i < arguments.length; ++i) {
            let point = arguments[i];
            
            center[dim] += point[dim];
        }
        
        center[dim] /= arguments.length;
    }
    
    return center;
}

function polygon_averageSize() {
    let sum = 0;
    let count = 0;
    
    for(let i = 0; i < arguments.length; ++i) {
        let polygon = arguments[i];
        
        // let center = points_center.apply(points_center, polygon);
        let center = polygon.getCenter();
        
        for(let j = 0; j < polygon.size(); ++j) {
            let point = polygon.getPoint(j);
            let vector = Vector.subtraction(point, center);
            
            sum += vector.getNorm();
            ++count;
        }
    }
    
    return sum / count * 2;
}
