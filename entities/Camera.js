
function positionTransitionToRoute() {
    if(this.route != null) {
        const vector = Vector.subtraction(this.route, this.getPositionM());
        
        if(isAlmostZero(vector.getNorm())) {
            this.setPositionM(this.route);
        } else {
            this.speed.set(vector.divide(4));
        }
    }
}

function cameraKeyController() {
    const accVal = 1.125;
    const vector = new Vector(0, 0);
    
    if(keyList.value(100)) {
        vector.add([-1, 0]);
    }
    
    if(keyList.value(104)) {
        vector.add([0, -1]);
    }
    
    if(keyList.value(102)) {
        vector.add([+1, 0]);
    }
    
    if(keyList.value(101)) {
        vector.add([0, +1]);
    }
    
    this.drag(vector.normalize(accVal));
}

function cameraZoomController() {
    // var a = 1.03125;// 1.00025;
    const newSize = Vector.from(this.size);
    
    if(poh(keyList.value(107))) {
        // this.setSizeM(Vector.from(this.getSize()).divide(a));
        
        // this.setSizeM(0, this.size[0] - 16);
        // if(this.size[0] < this.minSize[0]) {this.setSizeM(0, this.minSize[0])}
        // this.setSizeM(1, this.size[1] - 9);
        // if(this.size[1] < this.minSize[1]) {this.setSizeM(1, this.minSize[1])}
        
        newSize[0] -= 16;
        if(newSize[0] < this.minSize[0]) {
            newSize[0] = this.minSize[0];
        }
        
        newSize[1] -= 9;
        if(newSize[1] < this.minSize[1]) {
            newSize[1] = this.minSize[1];
        }
    }
    
    if(poh(keyList.value(109))) {
        // this.setSizeM(Vector.from(this.getSize()).multiply(a));
        
        // this.setSizeM(0, this.size[0] + 16);
        // if(this.size[0] > this.maxSize[0]) {this.setSizeM(0, this.maxSize[0])}
        // this.setSizeM(1, this.size[1] + 9);
        // if(this.size[1] > this.maxSize[1]) {this.setSizeM(1, this.maxSize[1])}
        
        newSize[0] += 16;
        if(newSize[0] > this.maxSize[0]) {
            newSize[0] = this.maxSize[0];
        }
        
        newSize[1] += 9;
        if(newSize[1] > this.maxSize[1]) {
            newSize[1] = this.maxSize[1];
        }
    }
    
    if(this.sizeTransition == null && Vector.distance(this.size, newSize) !== 0) {
        this.setSizeTransition(new VectorTransition(Array.from(this.size), newSize, 8, powt(1/4)));
    }
}

const DEF_CAMPOS = [0, 0, -(Math.pow(2, 9) + Math.pow(2, 8))/2];
// const DEF_CAMSIZE = [448, 252, 0];
const DEF_CAMSIZE = [416, 234, 0];
// const DEF_CAMSIZE = [16*10, 9*10, 0];

class BasicCamera extends Entity {
    constructor(position, size = DEF_CAMSIZE) {
        let position_ = [], size_ = [];
        
        for(let dim = 0; dim < 3; ++dim) {
            position_[dim] = typeof position[dim] == "undefined" ? DEF_CAMPOS[dim] : position[dim];
            size_[dim] = typeof size[dim] == "undefined" ? DEF_CAMSIZE[dim] : size[dim];
        }
        
        super(position_, size_);
        // this.setCollidable(true);
        this.setSelfBrake(1.25);
        
        this.ratio = 1;
        
        this.accVal = 4;
        
        this.addInteraction(new CameraReplaceRecipient());
        
        this.maxSize = [480, 270];
        this.minSize = [256, 144];
        
        this.originalSize = size;
        
        this.order = 1;
        
        this.controllers.add(cameraKeyController);
        this.controllers.add(cameraZoomController);
        this.controllers.add(positionTransitionToRoute);
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
            
            camera.originalSize = data.size || camera.originalSize;
            
            return camera;
        }
        
        return null;
    }
    
    static fromMiddle(positionM, size) {
        let camera = new this(positionM, size);
        
        for(let dim = 0; dim < 3; ++dim) {
            positionM[dim] = typeof positionM[dim] == "undefined" ? DEF_CAMPOS[dim] + DEF_CAMSIZE[dim]/2 : positionM[dim];
        }
        
        camera.setPositionM(positionM);
        
        return camera;
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
    
    update() {
        /**/
        
        const rect = makeEncompassingRectangle(this.targets);
        
        let willUpdate = false;
        const minDim = Math.min(rect.size.length, this.originalSize.length);
        
        for(let dim = 0; dim < minDim; ++dim) {
            if(rect.size[dim] > this.originalSize[dim]) {
                willUpdate = true;
            }
        }
        
        if(willUpdate) {
            const proportions = [16, 9, 16];
            let biggestRatio = 0;
            let biggestDimension = -1;
            
            for(let dim = 0; dim < minDim; ++dim) {
                const ratio = rect.size[dim] / proportions[dim];
                
                if(ratio > biggestRatio) {
                    biggestRatio = ratio;
                    biggestDimension = dim;
                }
            }
            
            const size = Vector.multiplication(proportions, biggestRatio);
            
            this.setSizeM(size);
        } else {
            this.setSizeM(this.originalSize);
        }
        
        if(this.targets.length > 0) {
            this.route = rect.getPositionM();
        }
        
        /**/
        
        return super.update();
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
    
    getDrawRectangle(rectangle) {
        const wProp = this.getWProp();
        const hProp = this.getHProp();
        
        return new Rectangle([(rectangle.getX() - this.getOffsetX()) * wProp, (rectangle.getY() - this.getOffsetY()) * hProp], [rectangle.getWidth() * wProp, rectangle.getHeight() * hProp]);
    }
    
    getDrawPolygon(polygon) {
        const wProp = this.getWProp();
        const hProp = this.getHProp();
        const offsetX = this.getOffsetX();
        const offsetY = this.getOffsetY();
        
        return Polygon.from(polygon).forEachPoint(function(point, index, polygon) {
            point[0] = (point[0] - offsetX) * wProp;
            point[1] = (point[1] - offsetY) * hProp;
        });
    }
}

class CameraBoundary extends Entity {
    constructor(position, size) {
        super(position, size);
        this.order = -Infinity;
        // this.setReplaceId(-1);
        
        this.addInteraction(new CameraReplaceActor());
        // this.setStyle("#FF0000");
        this.setStyle(INVISIBLE);
    }
}

class CameraBoundaryAround extends EntityAround {
    constructor() {
        super(...arguments);
        
        this.entityClass = CameraBoundary;
    }
}

/**

class FollowMe extends Action {
    constructor() {
        super();
    }
    
    use() {
        CAMERA.target = this.user;
        
        return this;
    }
    
    preventsAddition(action) {
        if(this.phase > 0 && action instanceof FollowMe) {
            this.end();
        }
        
        return super.preventsAddition(action);
    }
    
    onend() {
        CAMERA.target = null;
        
        return super.onend();
    }
}

/**/
