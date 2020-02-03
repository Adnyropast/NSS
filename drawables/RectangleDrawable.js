
class RectangleDrawable extends Rectangle {
    constructor(position, size) {
        super(position, size);
        
        this.zIndex = 0;
        this.style = "#000000";
        this.pattern = null;
        
        this.cameraMode = "basic";
        
        this.lifespan = -1;
        
        this.camera = null;
        this.controllers = new SetArray();
        this.strokeStyle = INVISIBLE;
        
        this.baseWidth = 640;
        this.baseHeight = 360;
        
        this.shadowBlur = 0;
        this.shadowColor = undefined;
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
            
            x -= camera.getOffsetX();
            y -= camera.getOffsetY();
            
            x *= wprop;
            y *= hprop;
            width *= wprop;
            height *= hprop;
        }
        
        if(this.cameraMode === "reproportion") {
            let hProp = 1, vProp = 1;
            if(this.baseWidth) {hProp = CANVAS.width / this.baseWidth;}
            if(this.baseHeight) {vProp = CANVAS.height / this.baseHeight;}
            
            x *= hProp;
            y *= vProp;
            width *= hProp;
            height *= vProp;
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
        
        if(shadowBlurOn) {
            context.shadowBlur = this.shadowBlur;
            context.shadowColor = this.getShadowColor();
        }
        
        var style = this.getStyle();
        var alpha = this.getAlpha();
        context.globalAlpha = alpha;
        
        this.actuallyDraw(context, style, x, y, width, height);
        
        context.globalAlpha = 1;
        context.shadowBlur = 0;
        context.shadowColor = "rgba(0, 0, 0, 0)";
        
        return this;
    }
    
    setLifespan(lifespan) {this.lifespan = lifespan; return this;}
    
    actuallyDraw(context, style, x, y, width, height) {
        context.translate(x, y);
        
        try {
        
        if(style instanceof HTMLImageElement || style instanceof HTMLCanvasElement) {
            context.shadowColor = "black";
            
            context.drawImage(style, 0, 0, width, height);
        } else {
            if(style !== INVISIBLE) {
                context.fillStyle = style;
                
                context.fillRect(0, 0, width, height);
            }
        }
        
        if(this.getStrokeStyle() !== INVISIBLE) {
            context.strokeStyle = this.getStrokeStyle();
            context.strokeRect(0, 0, width, height);
        }
        
        } catch(error) {
            console.error(error, style);
        }
        
        context.translate(-x, -y);
        
        return this;
    }
    
    setCamera(camera) {this.camera = camera; return this;}
    getCamera() {return this.camera;}
    
    setStrokeStyle(strokeStyle) {this.strokeStyle = strokeStyle; return this;}
    getStrokeStyle() {return Drawable.prototype.getStrokeStyle.bind(this)();}
    
    getShadowColor() {
        return Drawable.prototype.getShadowColor.bind(this)();
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

class TextRectangleDrawable extends RectangleDrawable {
    constructor() {
        super(...arguments);
        
        this.setContent("");
        this.setStyle("white");
        
        this.textEnhance = 2;
        
        this.fontFamily = "Segoe UI";
    }
    
    setContent(content) {
        this.content = content;
        // this.contentStyle = makeTextCanvas(content);
        this.contentStyle = makeTextFit(content, this.getWidth() * this.textEnhance, this.getHeight() * this.textEnhance, this.fontFamily);
        
        return this;
    }
    
    actuallyDraw(context, style, x, y, width, height) {
        super.actuallyDraw(...arguments);
        
        context.translate(x, y);
        
        try {
            context.drawImage(this.contentStyle, 0, 0, width, height);
        } catch(e) {
            
        }
        
        context.translate(-x, -y);
        
        return this;
    }
}
