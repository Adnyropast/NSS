
let shadowBlurOn = true;

class Drawable {
    constructor() {
        this.zIndex = 0;
        this.camera = null;
        this.cameraMode = "none";
        this.lifespan = -1;
        
        this.style = INVISIBLE;
        this.controllers = new SetArray();
        
        this.globalAlpha = 1;
        this.shadowBlur = 0;
        this.shadowColor = undefined;
        this.strokeStyle = undefined;
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    draw(context) {return this;}
    update() {
        if(Array.isArray(this.controllers)) for(let i = 0; i < this.controllers.length; ++i) {
            this.controllers[i].bind(this)();
        }
        
        if(this.lifespan > 0) {
            --this.lifespan;
        } else if(this.lifespan == 0) {
            removeDrawable(this);
            
            return this;
        }
        
        if(this.style instanceof AnimatedImages) {
            this.style.getNext();
        } else if(this.style instanceof ColorTransition) {
            this.style.getNext();
        } if(this.strokeStyle instanceof ColorTransition) {
            this.strokeStyle.getNext();
        }
        
        return this;
    }
    
    getStyle() {
        if(this.style instanceof AnimatedImages) {
            return this.style.getCurrent();
        } else if(this.style instanceof ColorTransition) {
            return this.style.getCurrentStyle();
        }
        
        return this.style;
    }
    
    setCamera(camera) {this.camera = camera; return this;}
    getCamera() {return this.camera;}
    
    getStrokeStyle() {
        if(this.strokeStyle instanceof AnimatedImages) {
            return this.strokeStyle.getCurrent();
        } else if(this.strokeStyle instanceof ColorTransition) {
            return this.strokeStyle.getCurrentStyle();
        }
        
        return this.strokeStyle;
    }
    
    getShadowColor() {
        if(this.shadowColor !== undefined) {
            return this.shadowColor;
        }
        
        return this.getStyle();
    }
    
    setShadowBlur(shadowBlur) {
        this.shadowBlur = shadowBlur;
        
        return this;
    }
}

/**

class CircleDrawable extends Circle {
    constructor() {
        
    }
}

/**/

class PolygonDrawable extends Polygon {
    constructor(points) {
        super(points);
        
        this.zIndex = 0;
        this.style = "#000000";
        
        this.cameraMode = "none";
        this.cameraMode = "advanced";
        this.cameraMode = "basic";
        
        this.lifespan = -1;
        
        this.strokeStyle = INVISIBLE;
        this.lineWidth = 1;
        
        this.camera = null;
        
        this.controllers = new SetArray();
        
        this.shadowBlur = 0;
        
        this.baseWidth = 640;
        this.baseHeight = 360;
        
        this.shadowColor = undefined;
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    
    getStyle() {
        return Drawable.prototype.getStyle.bind(this)();
    }
    
    setStyle(style) {
        this.style = style;
        
        return this;
    }
    
    setCameraMode(cameraMode) {this.cameraMode = cameraMode; return this;}
    
    draw(context) {
        let camera = this.camera;
        
        context.beginPath();
        
        for(var i = 0; i < this.size(); ++i) {
            var point = this.getPoint(i);
            
            if(this.cameraMode == "advanced") {
                point = camera.projectPoint(point.concat(this.getZIndex()));
            }
            
            var x = point[0], y = point[1];
            
            if(this.cameraMode == "advanced") {
                x += CANVAS.width / 2;
                y += CANVAS.height / 2;
            }
            
            if(this.cameraMode == "basic") {
                var wprop = camera.getWProp();
                var hprop = camera.getHProp();
                
                x += -camera.getOffsetX();
                y += -camera.getOffsetY();
                
                x *= wprop;
                y *= hprop;
            }
            
            if(this.cameraMode === "reproportion") {
                let hProp = 1, vProp = 1;
                if(this.baseWidth) {hProp = CANVAS.width / this.baseWidth;}
                if(this.baseHeight) {vProp = CANVAS.height / this.baseHeight;}
                
                x *= hProp;
                y *= vProp;
            }
            
            if(i == 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }
        
        context.closePath();
        
        if(shadowBlurOn) {
            context.shadowBlur = this.shadowBlur;
            context.shadowColor = this.getShadowColor();
        }
        
        context.fillStyle = this.getStyle();
        context.fill();
        context.strokeStyle = this.getStrokeStyle();
        context.lineWidth = this.lineWidth;
        context.stroke();
        
        context.shadowBlur = 0;
        context.shadowColor = "rgba(0, 0, 0, 0)";
        
        return this;
    }
    
    update() {
        return Drawable.prototype.update.bind(this)();
    }
    
    setLifespan(lifespan) {this.lifespan = lifespan; return this;}
    
    getStrokeStyle() {
        return Drawable.prototype.getStrokeStyle.bind(this)();
    }
    
    setStrokeStyle(strokeStyle) {this.strokeStyle = strokeStyle; return this;}
    
    setCamera(camera) {this.camera = camera; return this;}
    
    getShadowColor() {
        return Drawable.prototype.getShadowColor.bind(this)();
    }
    
    setShadowBlur(shadowBlur) {
        return Drawable.prototype.setShadowBlur.bind(this)(...arguments);
    }
}

/**

class TextDrawable {
    constructor(content = "") {
        this.zIndex = -Infinity;
        this.content = content;
        this.color = "black";
        this.x = 0, this.y = 0;
        
        this.cameraAffected = false;
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    
    getX() {return this.x;}
    getY() {return this.y;}
    
    draw(context) {
        var x = this.getX(), y = this.getY();
        
        var wprop = CAMERA.getWProp();
        var hprop = CAMERA.getHProp();
        
        x += -CAMERA.getOffsetX();
        y += -CAMERA.getOffsetY();
        
        x *= wprop;
        y *= hprop;
        
        context.fillStyle = this.color;
        context.fillText(this.content, x, y);
        
        return this;
    }
    
    update() {
        return this;
    }
}

/**/

class TrailDrawable {
    constructor() {
        this.zIndex = 0;
        
        this.closePoints = [];
        this.farPoints = [];
        // this.edgePoints = [];
        
        this.trailStyle = new ColorTransition([239, 239, 0, 1], [255, 255, 0, 0], 12, bezierLinear);
        this.edgeStyle = new ColorTransition([0, 255, 255, 1], [0, 255, 255, 0], 12, bezierLinear);
        this.trailStyle = new ColorTransition([63, 255, 255, 1], [0, 0, 255, 0], 8, bezierLinear);
        this.edgeStyle = new ColorTransition([255, 255, 255, 1], [0, 255, 255, 0], 12, bezierLinear);
        // this.trailStyle = new ColorTransition([255, 0, 0, 1], [127, 0, 0, 0], 10, bezierLinear);
        // this.edgeStyle = new ColorTransition([127, 0, 0, 1], [63, 0, 0, 0], 12, bezierLinear);
        // this.trailStyle = new ColorTransition([15, 0, 127, 1], [31, 0, 255, 0], 8, bezierLinear);
        // this.edgeStyle = new ColorTransition([127, 127, 255, 1], [127, 127, 255, 0], 12, bezierLinear);
        
        this.polygonDrawables = [];
        
        this.lifespan = -1;
        
        this.controllers = new SetArray();
        
        // this.edgePolygons = [];
        
        this.curveFunction = powt(1/1.125);
        
        this.otherTrails = new SetArray();
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    
    setTrailStyle(trailStyle) {
        this.trailStyle = trailStyle;
        
        return this;
    } setEdgeStyle(edgeStyle) {
        this.edgeStyle = edgeStyle;
        
        return this;
    }
    
    getCount() {return this.closePoints.length;}
    
    /**
     * Adds a step in the trail, i.e. a point at the base and and another one on the edge.
     */
    
    addStep(closePoint, farPoint, edgePoint) {
        this.closePoints.push(closePoint);
        this.farPoints.push(farPoint);
        // this.edgePoints.push(edgePoint);
        
        let lastIndex = this.getCount() - 2;
        let currentIndex = this.getCount() - 1;
        if(lastIndex < 0) {lastIndex = 0;}
        
        let polygonDrawable = (new PolygonDrawable([this.farPoints[lastIndex], this.farPoints[currentIndex], this.closePoints[currentIndex], this.closePoints[lastIndex]])).setStyle(this.trailStyle.copy().setStep(this.trailStyle.getStep())).setLifespan(this.trailStyle.duration).setCamera(this.camera);
        
        // polygonDrawable.translate(Vector.subtraction(farPoint, closePoint).normalize(16));
        
        this.polygonDrawables.push(polygonDrawable);
        // this.edgePolygons.push((new PolygonDrawable([this.farPoints[lastIndex], this.farPoints[currentIndex], this.edgePoints[currentIndex], this.edgePoints[lastIndex]])).setStyle(ColorTransition.from(this.edgeStyle)).setLifespan(this.edgeStyle.duration).setCamera(this.camera));
        
        this.lifespan = Math.max(this.lifespan, this.trailStyle.duration, this.edgeStyle.duration);
        
        for(let i = 0; i < this.otherTrails.length; ++i) {
            let otherTrail = this.otherTrails[i];
            
            if(otherTrail.edgeWidth) {
                let vector = Vector.subtraction(farPoint, closePoint).normalize(otherTrail.edgeWidth);
                
                closePoint = farPoint;
                farPoint = vector.add(farPoint);
                
                if(otherTrail.edgeWidth < 0) {
                    let x = closePoint;
                    closePoint = farPoint;
                    farPoint = x;
                }
            }
            
            otherTrail.addStep(closePoint, farPoint);
        }
        
        return this;
    }
    
    addSized(closePoint, angle, farWidth, edgeWidth) {
        let farPoint = [], edgePoint = [];
        
        farPoint[0] = closePoint[0] + Math.cos(angle) * farWidth;
        farPoint[1] = closePoint[1] + Math.sin(angle) * farWidth;
        // edgePoint[0] = closePoint[0] + Math.cos(angle) * edgeWidth;
        // edgePoint[1] = closePoint[1] + Math.sin(angle) * edgeWidth;
        
        this.addStep(closePoint, farPoint, edgePoint);
        
        return this;
    }
    
    draw(context) {
        if(typeof this.curveFunction !== "function") {
            for(let i = 0; i < this.polygonDrawables.length; ++i) {
                this.polygonDrawables[i].draw(context);
            }
            
            // for(let i = 0; i < this.edgePolygons.length; ++i) {
                // this.edgePolygons[i].draw(context);
            // }
        } else {
            let newPolygons = [];
            let newEdges = [];
            
            for(let i = 0; i < this.polygonDrawables.length; ++i) {
                let total = Math.max(this.polygonDrawables.length-1, 1);
                
                let preprogress = Math.max(i-1, 0)/(total);
                let progression = i/(total);
                
                preprogress = this.curveFunction(preprogress);
                progression = this.curveFunction(progression);
                
                let polygonDrawable = this.polygonDrawables[i];
                let newPolygonDrawable = new PolygonDrawable([
                    polygonDrawable[0],
                    polygonDrawable[1],
                    Vector.addition(polygonDrawable[1], Vector.subtraction(polygonDrawable[2], polygonDrawable[1]).times(progression)),
                    Vector.addition(polygonDrawable[0], Vector.subtraction(polygonDrawable[3], polygonDrawable[0]).times(preprogress))
                ]);
                
                newPolygonDrawable.setStyle(polygonDrawable.style);
                newPolygonDrawable.setCamera(polygonDrawable.camera);
                newPolygonDrawable.setCameraMode(polygonDrawable.cameraMode);
                
                newPolygons.push(newPolygonDrawable);
            }
            
            // for(let i = 0; i < this.edgePolygons.length; ++i) {
                // let preprogress = (i-1)/(this.edgePolygons.length-1);
                // if(preprogress < 0) {preprogress = 0;}
                // let progression = i/(this.edgePolygons.length-1);
                
                // let polygonDrawable = this.edgePolygons[i];
                // let newPolygonDrawable = new PolygonDrawable([
                    // polygonDrawable[0],
                    // polygonDrawable[1],
                    // Vector.addition(polygonDrawable[1], Vector.subtraction(polygonDrawable[2], polygonDrawable[1]).times(progression)),
                    // Vector.addition(polygonDrawable[0], Vector.subtraction(polygonDrawable[3], polygonDrawable[0]).times(preprogress))
                // ]);
                
                // newPolygonDrawable.setStyle(polygonDrawable.style);
                // newPolygonDrawable.setCamera(polygonDrawable.camera);
                // newPolygonDrawable.setCameraMode(polygonDrawable.cameraMode);
                
                // newEdges.push(newPolygonDrawable);
            // }
            
            for(let i = 0; i < newPolygons.length; ++i) {
                newPolygons[i].draw(context);
            }
            
            // for(let i = 0; i < newEdges.length; ++i) {
                // newEdges[i].draw(context);
            // }
        }
        
        /**/
        
        for(let i = 0; i < this.otherTrails.length; ++i) {
            this.otherTrails[i].draw(context);
        }
        
        return this;
    }
    
    update() {
        Drawable.prototype.update.bind(this)();
        
        for(let i = this.polygonDrawables.length - 1; i >= 0; --i) {
            this.polygonDrawables[i].update();
            
            if(this.polygonDrawables[i].lifespan == 0) {
                this.polygonDrawables.splice(i, 1);
            }
        }
        
        // for(let i = this.edgePolygons.length - 1; i >= 0; --i) {
            // this.edgePolygons[i].update();
            
            // if(this.edgePolygons[i].lifespan == 0) {
                // this.edgePolygons.splice(i, 1);
            // }
        // }
        
        for(let i = 0; i < this.otherTrails.length; ++i) {
            this.otherTrails[i].update();
        }
        
        return this;
    }
    
    setCamera(camera) {
        this.camera = camera;
        
        for(let i = 0; i < this.polygonDrawables.length; ++i) {
            this.polygonDrawables[i].setCamera(camera);
        }
        
        // for(let i = 0; i < this.edgePolygons.length; ++i) {
            // this.edgePolygons[i].setCamera(camera);
        // }
        
        for(let i = 0; i < this.otherTrails.length; ++i) {
            this.otherTrails[i].setCamera(camera);
        }
        
        return this;
    }
    
    setCameraMode() {}
}

class CutDrawable extends PolygonDrawable {
    constructor(centerPoint, direction = [1, 1]) {
        /**
        
        super();
        
        this.centerPoint = Vector.from(centerPoint);
        this.direction = Vector.from(direction);
        
        this.distances = new ColorTransition([2, 16], [0.125, 32], this.lifespan);
        
        this.setDimension(2);
        
        /**/
        
        super(diamondparticle);
        this.direction = Vector.from(direction);
        this.angle = this.direction.getAngle();
        this.setPositionM(centerPoint);
        this.shrinkM([0, 2]);
        this.rotate(this.angle);
        this.setLifespan(12);
        this.setStyle(new ColorTransition(CV_WHITE, [255, 255, 255, 0.5], this.lifespan));
    }
    
    update() {
        /**
        
        let points = [];
        
        let size = this.distances.getNext();
        
        let xDirection = this.direction.normalized(size[0]);
        let yDirection = this.direction.rotated(Math.PI/2).normalize(size[1]);
        
        points.push(this.centerPoint.minus(xDirection));
        points.push(this.centerPoint.minus(yDirection));
        points.push(this.centerPoint.plus(xDirection));
        points.push(this.centerPoint.plus(yDirection));
        
        this.setPoints(points);
        
        /**/
        
        this.rotate(-this.angle);
        // this.shrinkM(this.direction.normalized(1));
        // this.stretchM(this.direction.normalized(4).rotate(Math.PI/2));
        this.shrinkM([0.5, 0]);
        this.stretchM([0, 8]);
        
        // this.multiplySize(1/1.0625);
        this.rotate(+this.angle);
        
        return super.update();
    }
}

function makeFireParticle() {
    let fireparticle = PolygonDrawable.from(makeFirePolygon());
    
    fireparticle.setStyle(new ColorTransition([255, 255, 127, 1], [255, 0, 0, 0.375], 24, function(t) {return Math.pow(t, 1)}));
    fireparticle.setLifespan(24);
    
    return fireparticle;
}

const purpleLightningTransition = new ColorTransition([127, 0, 191, 1], [127, 0, 191, 0.5], 12);
const yellowLightningTransition = new ColorTransition([255, 255, 0, 1], [255, 255, 0, 0.5], 12);
const cyanLightningTransition = new ColorTransition([0, 255, 255, 1], [0, 127, 255, 0.5], 12);

function lightningTiming(t) {return Math.pow(t, 5)}

class LightningDrawable extends PolygonDrawable {
    constructor(start, end) {
        let norm = Vector.subtraction(end, start).getNorm() / 4;
        
        super(makeLightningPolygon(start, end, irandom(norm - 2, norm + 2)));
        
        this.setLifespan(32);
        this.setStyle(new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0.0], 2, lightningTiming));
        // this.setStrokeStyle(array_random([purpleLightningTransition, yellowLightningTransition, cyanLightningTransition]));
        
        this.shades = new Array(6);
        let startColor, endColor;
        // let color = array_random([[127, 0, 191], [255, 255, 0], [0, 255, 255]]);
        // let color = [rv(), rv(), rv()];
        // startColor = [0, 255, 255];
        startColor = endColor = [63, 255, 63];
        
        for(let i = 0; i < this.shades.length; ++i) {
            this.shades[i] = PolygonDrawable.from(this);
            
            let alpha = (this.shades.length - i) / (this.shades.length);
            
            this.shades[i].setStyle(new ColorTransition(startColor.concat(alpha), endColor.concat(0), i+2, lightningTiming));
            this.shades[i].multiplySize(1 + i/this.shades.length/8);
        }
    }
    
    setCamera() {
        super.setCamera(...arguments);
        
        for(let i = 0; i < this.shades.length; ++i) {
            this.shades[i].setCamera(...arguments).setCameraMode(this.cameraMode);
        }
        
        return this;
    }
    
    draw(context) {
        for(let i = this.shades.length - 1; i >= 0; --i) {
            this.shades[i].draw(context);
        }
        
        super.draw(context);
        
        return this;
    }
    
    update() {
        for(let i = this.shades.length - 1; i >= 0; --i) {
            this.shades[i].update();
        }
        
        super.update();
        
        return this;
    }
}

class FireDrawable extends PolygonDrawable {
    constructor(positionM) {
        super();
        
        this.positionM = positionM;
        this.reset();
        
        this.setStyle(new ColorTransition([255, 255, 127, 1], [255, 0, 0, 0.375], 24, Math.sqrt));
        
        this.setLifespan(24);
        this.t = 0;
    }
    
    reset() {
        this.setPoints(makeFireParticle());
        
        this.setPositionM(this.positionM);
        
        return this;
    }
    
    update() {
        if(this.t == 2) {
            this.reset();
            this.t = 0;
        } else {
            ++this.t;
        }
        
        return super.update();
    }
}

class MultiDrawable extends Drawable {
    constructor() {
        super();
        this.drawables = new SetArray();
    }
    
    add(drawable) {
        this.drawables.add(drawable);
        
        drawable.setCamera(this.getCamera());
        
        return this;
    }
    
    draw(context) {
        for(let i = 0; i < this.drawables.length; ++i) {
            this.drawables[i].draw(context);
        }
        
        return this;
    }
    
    update() {
        super.update();
        
        for(let i = 0; i < this.drawables.length; ++i) {
            this.drawables[i].update();
        }
        
        return this;
    }
    
    setCamera() {
        super.setCamera(...arguments);
        
        for(let i = 0; i < this.drawables.length; ++i) {
            this.drawables[i].setCamera(...arguments);
        }
        
        return this;
    }
}

class SpikeDrawable extends PolygonDrawable {
    constructor(count, angleTransition, minDistance, maxDistance, width) {
        super();
        this.setPoints(makeSpikePolygon(...arguments));
    }
}

class MultiPolygonDrawable extends MultiPolygon {
    constructor() {
        super(...arguments);
        
        this.zIndex = 0;
        this.camera = null;
        this.cameraMode = "none";
        this.lifespan = -1;
        
        this.style = INVISIBLE;
        this.controllers = new SetArray();
    }
    
    static from(multiPolygon) {
        let multiPolygonDrawable = new this();
        
        for(let i = 0; i < multiPolygon.size(); ++i) {
            multiPolygonDrawable.push(PolygonDrawable.from(multiPolygon.getPolygon(i)));
        }
        
        return multiPolygonDrawable;
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    draw(context) {
        for(let i = 0; i < this.size(); ++i) {
            this.getPolygon(i).draw(context);
        }
        
        return this;
    }
    update() {
        Drawable.prototype.update.bind(this)();
        
        for(let i = 0; i < this.size(); ++i) {
            this.getPolygon(i).update();
        }
        
        return this;
    }
    
    getStyle() {
        if(this.style instanceof AnimatedImages) {
            return this.style.getCurrent();
        } else if(this.style instanceof ColorTransition) {
            return this.style.getCurrentStyle();
        }
        
        return this.style;
    }
    
    setCamera(camera) {
        this.camera = camera;
        
        for(let i = 0; i < this.size(); ++i) {
            this.getPolygon(i).setCamera(camera);
        }
        
        return this;
    }
    getCamera() {return this.camera;}
    
    setStyle() {
        for(let i = 0; i < this.size(); ++i) {
            this.getPolygon(i).setStyle(...arguments);
        }
        
        return this;
    }
    
    setLifespan(lifespan) {this.lifespan = lifespan; return this;}
    
    setPolygons(polygons) {
        this.length = 0;
        
        for(let i = 0; i < polygons.length; ++i) {
            this.push(new PolygonDrawable(polygons[i]));
        }
        
        return this;
    }
    
    setCameraMode(cameraMode) {
        this.cameraMode = cameraMode;
        
        for(let i = 0; i < this.size(); ++i) {
            this.getPolygon(i).setCameraMode(...arguments);
        }
        
        return this;
    }
    
    setShadowBlur(shadowBlur) {
        for(let i = 0; i < this.size(); ++i) {
            this.getPolygon(i).setShadowBlur(...arguments);
        }
        
        return this;
    }
}

let flamedrawable = PolygonDrawable.from(flameparticle);