
class Drawable {
    constructor() {
        this.zIndex = 0;
        this.camera = null;
        this.cameraMode = "none";
        this.lifespan = -1;
        
        this.style = INVISIBLE;
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    draw(context) {return this;}
    update() {
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
}

class RectangleDrawable extends Rectangle {
    constructor(position, size) {
        super(position, size);
        
        this.zIndex = 0;
        this.style = "#000000";
        this.pattern = null;
        
        this.cameraMode = "basic";
        
        this.lifespan = -1;
        
        this.camera = null;
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    
    getStyle() {
        return Drawable.prototype.getStyle.bind(this)();
    }
    
    getAlpha() {
        if(this.style instanceof AnimatedImages) {
            return this.style.alpha[this.style.iindex];
        }
        
        return 1;
    }
    
    setStyle(style) {
        this.style = style;
        
        return this;
    }
    
    update() {
        return Drawable.prototype.update.bind(this)();
    }
    
    setCameraMode(cameraMode) {this.cameraMode = cameraMode; return this;}
    
    draw(context) {
        let camera = this.camera;
        
        var x = this.getX();
        var y = this.getY();
        var width = this.getWidth();
        var height = this.getHeight();
        
        if(this.cameraMode == "advanced" && camera != null) {
            let point1 = camera.projectPoint(this.getPosition1().concat(this.getZIndex()));
            let point2 = camera.projectPoint(this.getPosition2().concat(this.getZIndex()));
            
            x = point1[0] + CANVAS.width / 2;
            y = point1[1] + CANVAS.height / 2;
            width = point2[0] - point1[0];
            height = point2[1] - point1[1];
        }
        
        if(this.cameraMode == "basic" && camera != null) {
            var wprop = camera.getWProp();
            var hprop = camera.getHProp();
            
            x += -camera.getOffsetX();
            y += -camera.getOffsetY();
            
            x *= wprop;
            y *= hprop;
            width *= wprop;
            height *= hprop;
        }
        
        if(x == -Infinity) {
            x = 0;
        } if(y == -Infinity) {
            y = 0;
        } if(width == Infinity) {
            width = CANVAS.width;
        } if(height == Infinity) {
            height = CANVAS.height;
        }
        
        var style = this.getStyle();
        var alpha = this.getAlpha();
        context.globalAlpha = alpha;
        
        this.actuallyDraw(context, style, x, y, width, height);
        
        context.globalAlpha = 1;
        
        return this;
    }
    
    setLifespan(lifespan) {this.lifespan = lifespan; return this;}
    
    actuallyDraw(context, style, x, y, width, height) {
        context.translate(x, y);
        
        try {
        
        if(style instanceof HTMLImageElement || style instanceof HTMLCanvasElement) {
            context.drawImage(style, 0, 0, width, height);
        } else {
            context.fillStyle = style;
            
            context.fillRect(0, 0, width, height);
        }
        
        } catch(error) {
            if(!this.sss) {
                this.sss = true;
                console.log(style);
                ENTITIES.forEach(function(e) {
                    if(e.drawable === this) {
                        console.log(e);
                    }
                });
            }
        }
        
        context.translate(-x, -y);
        
        return this;
    }
    
    setCamera(camera) {this.camera = camera; return this;}
    getCamera() {return this.camera;}
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
            
            if(i == 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }
        
        context.closePath();
        
        context.fillStyle = this.getStyle();
        context.fill();
        context.strokeStyle = this.getStrokeStyle();
        context.lineWidth = this.lineWidth;
        context.stroke();
        
        return this;
    }
    
    update() {
        return Drawable.prototype.update.bind(this)();
    }
    
    setLifespan(lifespan) {this.lifespan = lifespan; return this;}
    
    getStrokeStyle() {
        if(this.strokeStyle instanceof ColorTransition) {
            return this.strokeStyle.getCurrentStyle();
        }
        
        return this.strokeStyle;
    }
    
    setStrokeStyle(strokeStyle) {this.strokeStyle = strokeStyle; return this;}
    
    setCamera(camera) {this.camera = camera; return this;}
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
        // context.fillText(PLAYER.energy, 66.75 * CANVAS.height / BASEHEIGHT, 0);
        // context.fillText(PLAYER.energy, 0, 16);
        // context.fillText(PLAYER.energy, 0, 32);
        // context.fillText(PLAYER.energy, 0, 48);
        // context.fillText(PLAYER.energy, 0, 64);
        
        return this;
    }
    
    update() {
        return this;
    }
}

/**/

class SkyDrawable extends RectangleDrawable {
    constructor(position, size) {
        super(position, size);
        
        this.setZIndex(Infinity);
        this.setStyle(PTRN_SKY);
    }
}

class TrailDrawable {
    constructor() {
        this.zIndex = 0;
        
        this.closePoints = [];
        this.farPoints = [];
        this.edgePoints = [];
        
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
    
    addStep(closePoint, farPoint, edgePoint) {
        this.closePoints.push(closePoint);
        this.farPoints.push(farPoint);
        this.edgePoints.push(edgePoint);
        
        if(this.getCount() > 1) {
            let lastIndex = this.getCount() - 2;
            let currentIndex = this.getCount() - 1;
            
            this.polygonDrawables.push((new PolygonDrawable([this.farPoints[lastIndex], this.farPoints[currentIndex], this.closePoints[currentIndex], this.closePoints[lastIndex]])).setStyle(ColorTransition.from(this.trailStyle)).setLifespan(12).setCamera(this.camera));
            this.polygonDrawables.push((new PolygonDrawable([this.farPoints[lastIndex], this.farPoints[currentIndex], this.edgePoints[currentIndex], this.edgePoints[lastIndex]])).setStyle(ColorTransition.from(this.edgeStyle)).setLifespan(12).setCamera(this.camera));
        }
        
        this.lifespan = Math.max(this.lifespan, Math.max(this.trailStyle.duration, this.edgeStyle.duration));
        
        return this;
    }
    
    addSized(closePoint, angle, farWidth, edgeWidth) {
        let farPoint = [], edgePoint = [];
        
        farPoint[0] = closePoint[0] + Math.cos(angle) * farWidth;
        farPoint[1] = closePoint[1] + Math.sin(angle) * farWidth;
        edgePoint[0] = closePoint[0] + Math.cos(angle) * edgeWidth;
        edgePoint[1] = closePoint[1] + Math.sin(angle) * edgeWidth;
        
        this.addStep(closePoint, farPoint, edgePoint);
        
        return this;
    }
    
    draw(context) {
        for(let i = 0; i < this.polygonDrawables.length; ++i) {
            this.polygonDrawables[i].draw(context);
        }
        
        return this;
    }
    
    update() {
        if(this.lifespan > 0) {
            --this.lifespan;
        } else if(this.lifespan == 0) {
            removeDrawable(this);
            
            return this;
        }
        
        for(let i = this.polygonDrawables.length - 1; i >= 0; --i) {
            this.polygonDrawables[i].update();
            
            if(this.polygonDrawables[i].lifespan == 0) {
                this.polygonDrawables.splice(i, 1);
            }
        }
        
        return this;
    }
    
    setCamera(camera) {
        this.camera = camera;
        
        for(let i = 0; i < this.polygonDrawables.length; ++i) {
            this.polygonDrawables[i].setCamera(camera);
        }
        
        return this;
    }
}

class TransitionDrawable extends RectangleDrawable {
    constructor() {
        super([0, 0], [CANVAS.width, CANVAS.height]);
        this.setCameraMode("none");
        this.lifespan = 16;
        this.stepDirection = +1;
        this.setStyle(new ColorTransition(CV_INVISIBLE, CV_BLACK, this.lifespan/2));
    }
    
    update() {
        if(this.lifespan > 0) {
            --this.lifespan;
        } else if(this.lifespan == 0) {
            removeDrawable(this);
            
            return this;
        }
        
        if(this.style.getProgress() == 1) {
            this.stepDirection *= -1;
        }
        
        this.style.step += this.stepDirection;
        
        return this;
    }
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
        this.shrinkM([0.25, 0]);
        this.stretchM([0, 1]);
        
        // this.multiplySize(1/1.0625);
        this.rotate(+this.angle);
        
        return super.update();
    }
}

let flameparticle = new PolygonDrawable([[16, 0], [14.782072520180588, 6.1229349178414365], [11.313708498984761, 11.31370849898476], [6.122934917841437 - 1, 14.782072520180588], [0, 14], [-16, 8], [-8, 4], [-24, 0], [-8, -4], [-16, -8], [0, -14], [6.122934917841437 - 1, -14.782072520180588], [11.313708498984761, -11.31370849898476], [14.782072520180588, -6.1229349178414365]]);

let diamondparticle = new PolygonDrawable([[0, -16], [2, 0], [0, 16], [-2, 0]]);

let roundparticle;

{
    let count = 12;
    let points = [];
    
    for(let i = 0; i < count; ++i) {
        let angle = i * 2*Math.PI/count;
        
        points.push([16 * Math.cos(angle), 16 * Math.sin(angle)]);
    }
    
    roundparticle = new PolygonDrawable(points);
}

function makeFireParticle() {
    let fireparticle = PolygonDrawable.from(makeRandomPolygon(16, 4, 16));
    
    fireparticle.splice(0, 8);
    
    let baseparticle = PolygonDrawable.from(makeRandomPolygon(16, 8, 16));
    
    baseparticle.splice(8, 16);
    
    fireparticle.setPoints(fireparticle.concat(baseparticle));
    
    fireparticle.setStyle(new ColorTransition([255, 255, 127, 1], [255, 0, 0, 0.375], 24, function(t) {return Math.pow(t, 1)}));
    fireparticle.setLifespan(24);
        
    return fireparticle;
}

class LightningDrawable extends PolygonDrawable {
    constructor(start, end) {
        let vector = Vector.subtraction(end, start);
        let normal = (new Vector(-vector[1], vector[0])).normalize();
        
        let steps = Math.floor(Math.random() * 3 + 12);
        
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
        
        super(actualPolygon);
        
        this.setLifespan(12);
        this.setStyle(new ColorTransition(CV_WHITE, [255, 255, 255, 0.5], this.lifespan));
        this.setStrokeStyle(new ColorTransition([127, 0, 191, 1], [127, 0, 191, 0.5], this.lifespan));
    }
}

class TextRectangleDrawable extends RectangleDrawable {
    constructor() {
        super(...arguments);
        
        this.setContent("");
        this.setStyle("white");
        
        this.textEnhance = 1;
    }
    
    setContent(content) {
        this.content = content;
        // this.contentStyle = makeTextCanvas(content);
        this.contentStyle = makeTextFit(content, this.getWidth() * this.textEnhance, this.getHeight() * this.textEnhance);
        
        return this;
    }
    
    actuallyDraw(context, style, x, y, width, height) {
        super.actuallyDraw(...arguments);
        
        context.translate(x, y);
        
        context.drawImage(this.contentStyle, 0, 0, width, height);
        
        context.translate(-x, -y);
        
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
            
            let distance = maxDistance + timingFunction(j/(transitionDuration-1)) * (minDistance - maxDistance);
            
            let x = distance * Math.cos(angle);
            let y = distance * Math.sin(angle);
            
            points.push([x, y]);
        }
    }
    
    return points;
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
}
