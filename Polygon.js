
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
        
        if(Array.isArray(points)) {
            for(var i = 0; i < points.length; ++i) {
                // The first point determines the dimension of the polygon
                
                if(typeof this.dimension == "undefined") {
                    Object.defineProperty(this, "dimension", {"enumerable" : false, "value" : points[i].length});
                }
                
                // The polygon isn't properly built if any point has a different dimension from the first
                
                else if(points[i].length != this.dimension) {
                    throw "Dimension error : [" + points[i] + "] should have " + this.dimension + " coordinates";
                }
                
                this.setPoint(i, points[i]);
            }
        }
        
        Object.defineProperty(this, "center", {"writable" : true, "enumerable" : false, "value" : []});
        this.setCenter();
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
        Object.defineProperty(this, "dimension", {"value":dimension});
        
        return this;
    }
    
    /**
     * 21/07/2019
     */
    
    setPoints(points) {
        this.splice(0, this.size());
        
        this.push.apply(this, points);
        
        return this;
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
