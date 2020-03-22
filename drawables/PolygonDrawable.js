
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

class CutDrawable extends PolygonDrawable {
    constructor(centerPoint, angle = Math.PI/4, size = 16) {
        super(makePathPolygon([[0, -size], [0, 0], [0, +size]], 2));
        
        this.setPositionM(centerPoint);
        this.setImaginaryAngle(angle);
        this.setLifespan(12);
        this.setStyle(new ColorTransition(CV_WHITE, [255, 255, 255, 0.5], this.lifespan));
    }
    
    update() {
        this.shrinkBase([1/(this.lifespan + 1), 0]);
        this.stretchBase([0, this.lifespan]);
        
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
    
    setStyle(style) {
        for(let i = 0; i < this.size(); ++i) {
            this.getPolygon(i).setStyle(style_clone(style));
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

class ConcentratedLineworkFrameDrawable extends MultiPolygonDrawable {
    constructor(lineCount = irandom(64, 128)) {
        super();
        
        const center = [320, 180], size = [640, 360];
        const screen = Rectangle.fromMiddle(center, size);
        
        for(let i = 0; i < lineCount; ++i) {
            const angle = i/lineCount * 2*Math.PI;
            const cos = size[0]/2 * Math.cos(angle);
            const sin = size[1]/2 * Math.sin(angle);
            const vector = new Vector(cos, sin);
            
            const polygon = makePathPolygon([[0, 0], vector, vector.times(2)], random(2, 4));
            
            polygon.setPositionM(Vector.addition(center, vector.times(random(1.5, 1.75))));
            
            this.addPolygon(PolygonDrawable.from(polygon));
        }
        
        this.setCameraMode("reproportion");
        this.setLifespan(8);
        this.setStyle(new ColorTransition(CV_BLACK, [0, 0, 0, 0], this.lifespan, powt(1)));
    }
}
