
const DEF_CAMPOS = [0, 0, -256];
const DEF_CAMSIZE = [448, 252, 0];

class Camera extends Entity {
    constructor(position, size = DEF_CAMSIZE) {
        let position_ = [], size_ = [];
        
        for(let dim = 0; dim < 3; ++dim) {
            position_[dim] = typeof position[dim] == "undefined" ? DEF_CAMPOS[dim] : position[dim];
            size_[dim] = typeof size[dim] == "undefined" ? DEF_CAMSIZE[dim] : size[dim];
        }
        
        super(position_, size_);
        // this.setCollidable(true);
        this.setSelfBrake(1.25);
        // this.setEffectFactor("default", 0);
        
        this.ratio = 1;
        this.accVal = 1.125;
        this.accVal = 4;
        this.cameraControllable = true;
        
        this.addActset(AS_MOVEMENT);
        
        this.addInteraction(new CameraReplaceRecipient());
        
        this.movementTo = (new MovementTo(this.accVal)).setUseCost(0);
        
        this.cursorDistance = this.range = 512;
        this.direction = new Vector(0, 0, this.range);
        this.vx = new Vector(-this.range, 0, 0);
        this.vy = new Vector(0, -this.range, 0);
        
        this.maxSize = [480, 270];
        this.minSize = [256, 144];
    }
    
    static fromData(data) {
        if(Array.isArray(data.positionM)) {
            let camera = this.fromMiddle(data.positionM);
            
            if(Array.isArray(data.minSize)) {
                camera.minSize = Array.from(data.minSize);
            }
            
            if(Array.isArray(data.maxSize)) {
                camera.maxSize = Array.from(data.maxSize);
            }
            
            if(Array.isArray(data.size)) {
                for(let dim = 0; dim < data.size.length; ++dim) {
                    camera.setSizeM(dim, data.size[dim]);
                }
            }
            
            return camera;
        }
        
        return null;
    }
    
    getOffsetX() {
        return this.getXM() - this.getWidth() / 2;
    }
    
    getOffsetY() {
        return this.getYM() - this.getHeight() / 2;
    }
    
    getOffset() {
        return new Vector(this.getOffsetX(), this.getOffsetY());
    }
    
    getRatio() {
        return this.ratio;
    }
    
    setRatio(ratio) {
        this.ratio = ratio;
        
        return this;
    }
    
    update() {
        /**/
        var a = 1.03125;// 1.00025;
        
        if(keyList.value(107) == 1) {
            // this.setSizeM(Vector.from(this.getSize()).divide(a));
            this.setSizeM(0, this.size[0] - 16);
            if(this.size[0] < this.minSize[0]) {this.setSizeM(0, this.minSize[0])}
            this.setSizeM(1, this.size[1] - 9);
            if(this.size[1] < this.minSize[1]) {this.setSizeM(1, this.minSize[1])}
        } if(keyList.value(109) == 1) {
            // this.setSizeM(Vector.from(this.getSize()).multiply(a));
            this.setSizeM(0, this.size[0] + 16);
            if(this.size[0] > this.maxSize[0]) {this.setSizeM(0, this.maxSize[0])}
            this.setSizeM(1, this.size[1] + 9);
            if(this.size[1] > this.maxSize[1]) {this.setSizeM(1, this.maxSize[1])}
        }
        if(this.cameraControllable) {
            if(keyList.value(100)) {
                this.drag([-this.accVal, 0]);
            } if(keyList.value(104)) {
                this.drag([0, -this.accVal]);
            } if(keyList.value(102)) {
                this.drag([+this.accVal, 0]);
            } if(keyList.value(101)) {
                this.drag([0, +this.accVal]);
            }
        }
        /**/
        
        if(this.target != null) {
            this.route = this.target.getPositionM();
            this.addAction(this.movementTo);
        } else if(this.route != null) {
            this.route = null;
            this.removeAction(this.movementTo);
        }
        
        /**/
        
        return super.update();
    }
    
    getDestX() {
        return this.position[0] + this.direction[0];
    } getDestY() {
        return this.position[1] + this.direction[1];
    } getDestZ() {
        return this.position[2] + this.direction[2];
    } getDest() {
        return this.direction.plus(this.position);
    }
    
    normalize() {
        let normX = 0, normY = 0, normZ = 0;
        
        for(let dim = 0; dim < 3; ++dim) {
            normX += Math.pow(this.vx[dim], 2);
            normY += Math.pow(this.vy[dim], 2);
            normZ += Math.pow(this.direction[dim], 2);
        }
        
        normX = Math.sqrt(normX);
        normY = Math.sqrt(normY);
        normZ = Math.sqrt(normZ);
        
        for(let dim = 0; dim < 3; ++dim) {
            this.vx[dim] *= this.range / normX;
            this.vy[dim] *= this.range / normY;
            this.direction[dim] *= this.range / normZ;
        }
        
        return this;
    }
    
    getRange() {return this.range;}
    setRange(range) {this.range = range; return this.normalize();}
    
    getPlanePoint(position) {
        // if(position.length != 3) return this;
        
        let pointer = Vector.subtraction(position, this.getPositionM());
        let scalar = 0;
        
        for(let dim = 0; dim < 3; ++dim) {
            scalar += this.direction[dim] * pointer[dim];
        }
        
        if(scalar <= 0) {
            return new Vector(NaN, NaN, NaN);
        }
        
        const k = this.direction.scalar(this.direction) / scalar;
        
        return pointer.multiply(k).add(this.getPositionM());
    }
    
    projectPoint(position) {
        let pp = this.getPlanePoint(position);
        
        let baseX = this.vx.normalized(-1);
        let baseY = this.vy.normalized(-1);
        
        let matrix = gaussianElimination([
            [baseX[0], baseY[0], pp[0] - (this.getPositionM(0) + this.direction[0])],
            [baseX[1], baseY[1], pp[1] - (this.getPositionM(1) + this.direction[1])],
            [baseX[2], baseY[2], pp[2] - (this.getPositionM(2) + this.direction[2])]
        ]);
        
        let projection = new Vector();
        
        projection.set(1, matrix[1][2] / matrix[1][1]);
        projection.set(0, (matrix[0][2] - matrix[0][1] * projection.get(1)) / matrix[0][0]);
        
        return projection;
    }
    
    getWProp() {return CANVAS.width / this.width;}
    getHProp() {return CANVAS.height / this.height;}
    getSizeProp(dimension) {
        if(arguments.length == 0) {
            return [this.getWProp(), this.getHProp()];
        } if(dimension == 0) {
            return this.getWProp();
        } if(dimension == 1) {
            return this.getHProp();
        }
        
        return null;
    }
}

class CameraBoundary extends Entity {
    constructor(position, size) {
        super(position, size);
        // this.setReplaceId(-1);
        // this.setEffectFactor("default", 0);
        
        this.addInteraction(new CameraReplaceActor());
        this.setStyle("#FF0000");
    }
}

EC["cameraBoundary"] = CameraBoundary;

function gaussianElimination(matrix) {
    // Square matrix
    
    for(let y = 0; y < matrix.length; ++y) {
        let pivot;
        let limit = y;
        
        while((pivot = matrix[y][y]) == 0 && limit < matrix.length) {
            matrix.push(matrix[y]);
            matrix.splice(y, 1);
            ++limit;
        }
        
        if(pivot != 0) {
            for(let y2 = y + 1; y2 < matrix.length; ++y2) {
                let first = matrix[y2][y];
                
                if(first != 0) {
                    for(let x = y; x < matrix[y].length; ++x) {
                        matrix[y2][x] = matrix[y2][x] * pivot - first * matrix[y][x];
                    }
                }
            }
        }
    }
    
    return matrix;
}
