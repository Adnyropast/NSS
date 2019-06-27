
/**
 * The Circle class represents a n-sphere in a multi-dimensional space.
 */

class Circle {
    constructor(center, radius) {
        this.center = new Array(center.length);
        this.radius = 0;
        
        this.setCenter(center);
        this.setRadius(radius);
    }
    
    /**
     *
     */
    
    getDimension() {
        return this.center.length;
    }
    
    /* 26/02/2019 */
    
    getX() {
        return this.center[0];
    } getY() {
        return this.center[1];
    } getZ() {
        return this.center[2];
    }
    
    /**
     * 
     * 23/04/2019
     */
    
    getPosition(dimension) {
        if(arguments.length == 0) {
            return this.center;
        }
        
        return this.center[dimension];
    }
    getRadius() {
        return this.radius;
    }
    
    /**
     *
     */
    
    setCenter(center) {
        this.center = new Array(center.length);
        for(var i = 0; i < center.length; i++) {
            this.center[i] = center[i];
        }
        return this;
    }
    setRadius(radius) {
        this.radius = radius;
        
        return this;
    }
    
    /***/
    
    static collision(o, p) {
        if((o instanceof this) && (p instanceof this)) {
            if(o.getDimension() != p.getDimension())
                return false;
            
            var distance = 0;
            for(var i = 0; i < o.getDimension(); i++)
                distance += Math.pow(p.getPositionM(i) - o.getPositionM(i), 2);
            distance = Math.sqrt(distance);
            
            return distance < (o.getRadius() + p.getRadius());
        } else if((o instanceof Rectangle) && (p instanceof this)) {
            return this.collision(p, o);
        } else if((o instanceof this) && (p instanceof Rectangle)) {
            if(o.getDimension() != 2 || p.getDimension() != 2) {
                return false;
            }
            
            var vector = [];
            var distance = 0;
            
            for(var dim = 0; dim < o.getDimension(); ++dim) {
                vector[dim] = o.getPosition(dim) - p.getPositionM(dim);
                distance += Math.pow(vector[dim], 2);
            }
            
            distance = Math.sqrt(distance);
            
            var cos = vector[0] / distance, sin = vector[1] / distance;
            
            return distance < (o.getRadius() + p.sizeAt(Math.atan2(sin, cos)));
            
        }
        
        return false;
    }
    
    /**
     * Returns a string representation of the circle.
     * @return a string representation of the circle.
     */
    
    toString() {
        return "{[" + this.getPosition() + "], " + this.getRadius() + "}";
    }
    
    basicDraw(context, fillStyle, strokeStyle) {
        context.beginPath();
        context.arc(this.getX(), this.getY(), this.getRadius(), 0, Math.PI * 2);
        context.fillStyle = fillStyle;
        context.fill();
        
        return this;
    }
}

/**/

var circle = new Circle([64, 64], 32);
var circle0 = circle;
var circle1 = new Circle([64, 96], 16);

/**/
