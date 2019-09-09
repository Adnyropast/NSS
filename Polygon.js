
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
        
        Object.defineProperty(this, "dimension", {"writable" : true, "enumerable" : false, "value" : undefined});
        Object.defineProperty(this, "center", {"writable" : true, "enumerable" : false, "value" : []});
        
        this.setPoints(points);
        
        Object.defineProperty(this, "imaginaryAngle", {"writable" : true, "enumerable" : false, "value" : 0});
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
    
    push_(point) {
        return this.setPoint(this.size(), point);
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

    basicDraw(context, fillStyle, strokeStyle) {
        context.beginPath();
        var point = this.getPoint(0);
        
        context.moveTo(point[0], point[1]);
        
        for(var i = 1; i < this.size(); ++i) {
            point = this.getPoint(i);
            
            ctx.lineTo(point[0], point[1]);
        }
        
        ctx.closePath();
        
        ctx.fillStyle = ctx.strokeStyle = "#000000";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.fill();
        
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
                // The first point determines the dimension of the polygon
                
                if(typeof this.dimension == "undefined") {
                    this.setDimension(points[i].length);
                }
                
                // The polygon isn't properly built if any point has a different dimension from the first
                
                else if(points[i].length != this.dimension) {
                    throw "Dimension error : [" + points[i] + "] should have " + this.dimension + " coordinates instead of " + points[i].length;
                }
                
                this.setPoint(i, points[i]);
            }
        }
        
        this.setCenter();
        
        return this;
    }
    
    /**
     * 05/08/2019
     */
    
    rotate(angle) {
        if(this.getDimension() != 2) {return this;}
        
        let center = Vector.from(this.getCenter());
        
        for(let i = 0; i < this.size(); ++i) {
            let vector = Vector.subtraction(this.getPoint(i), center);
            
            this.setPoint(i, center.plus(vector.rotate(angle)));
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
                        
                        console.log(dim, point[dim], proportion);
                        
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
