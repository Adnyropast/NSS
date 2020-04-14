
function positionTransitionToRoute3D() {
    if(this.route !== null) {
        const route = this.route.concat(this.getZM());
        
        const vector = Vector.subtraction(route, this.getPositionM());
        
        if(isAlmostZero(vector.getNorm())) {
            this.setPositionM(route);
        } else {
            this.speed.set(vector.divide(4));
        }
    }
}

class AdvancedCamera extends Entity {
    constructor(position, size) {
        super(position, size);
        
        this.range = 512;
        this.direction = new Vector(0, 0, 1);
        this.vX = new Vector(-1, 0, 0);
        this.vY = new Vector(0, -1, 0);
        this.normalize();
        
        this.controllers.add(positionTransitionToRoute3D);
        this.addInteraction(new CameraReplaceRecipient());
    }
    
    normalize() {
        this.direction.normalize(this.range);
        this.vX.normalize(this.range);
        this.vY.normalize(this.range);
        
        return this;
    }
    
    getPointedPosition() {
        return Vector.addition(this.getPositionM(), this.direction);
    }
    
    getPlanePoint(position) {
        const positionM = this.getPositionM();
        const vector = Vector.subtraction(position, positionM);
        const scalar = Vector.from(this.direction).scalar(vector);
        
        if(scalar <= 0) {
            return new Vector(NaN, NaN, NaN);
        }
        
        const k = this.direction.scalar(this.direction) / scalar;
        
        return Vector.addition(positionM, vector.multiply(k));
    }
    
    projectPoint(position) {
        const planePoint = this.getPlanePoint(position);
        
        const basisX = this.vX.normalized(-1);
        const basisY = this.vY.normalized(-1);
        
        const matrix = gaussianElimination([
            [basisX[0], basisY[0], planePoint[0] - (this.getXM() + this.direction[0])],
            [basisX[1], basisY[1], planePoint[1] - (this.getYM() + this.direction[1])],
            [basisX[2], basisY[2], planePoint[2] - (this.getZM() + this.direction[2])],
        ]);
        
        const projection = new Vector(2);
        
        projection.set(1, matrix[1][2] / matrix[1][1]);
        projection.set(0, (matrix[0][2] - matrix[0][1] * projection.get(1)) / matrix[0][0]);
        
        return projection;
    }
    
    projectPolygon(polygon) {
        const projection = new Polygon();
        
        for(let i = 0; i < polygon.size(); ++i) {
            projection.push(this.projectPoint(polygon.getPoint(i)));
        }
        
        return projection;
    }
    
    projectRectangle(rectangle) {
        const point1 = this.projectPoint(rectangle.getPosition1());
        const point2 = this.projectPoint(rectangle.getPosition2());
        
        return new Rectangle(point1, Vector.subtraction(point2, point1));
    }
    
    update() {
        const rectangle = makeEncompassingRectangle(this.targets);
        
        this.route = rectangle.getPositionM();
        
        super.update();
        
        return this;
    }
    
    getRange() {
        return this.range;
    }
}
