
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
        this.globalAlpha = 1;
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
        
        return this.globalAlpha;
    }
    
    setStyle(style) {
        this.style = style;
        
        return this;
    }
    
    update() {
        return Drawable.prototype.update.bind(this)();
    }
    
    setCameraMode(cameraMode) {this.cameraMode = cameraMode; return this;}
    
    getDrawRectangle() {
        const camera = this.camera;
        
        let drawRectangle;
        
        if(this.cameraMode === "basic" && camera instanceof AdvancedCamera) {
        // if(this.cameraMode == "advanced" && camera != null) {
            let point1 = camera.projectPoint(this.getPosition1().concat(this.getZIndex()));
            let point2 = camera.projectPoint(this.getPosition2().concat(this.getZIndex()));
            
            const x = point1[0] + CANVAS.width / 2;
            const y = point1[1] + CANVAS.height / 2;
            const width = point2[0] - point1[0];
            const height = point2[1] - point1[1];
            
            drawRectangle = new Rectangle([x, y], [width, height]);
        }
        
        else if(this.cameraMode == "basic" && camera instanceof BasicCamera) {
            drawRectangle = camera.getDrawRectangle(this);
        }
        
        else if(this.cameraMode === "reproportion") {
            const hProp = CANVAS.width / this.baseWidth;
            const vProp = CANVAS.height / this.baseHeight;
            
            drawRectangle = new Rectangle(Vector.multiplication(this.position, [hProp, vProp]), Vector.multiplication(this.size, [hProp, vProp]));
        }
        
        else {
            drawRectangle = Rectangle.from(this)
        }
        
        // if(drawRectangle.getX() == -Infinity) {drawRectangle.setX(0);}
        // if(drawRectangle.getY() == -Infinity) {drawRectangle.setY(0);}
        // if(drawRectangle.getWidth() == Infinity) {drawRectangle.setWidth(CANVAS.width);}
        // if(drawRectangle.getHeight() == Infinity) {drawRectangle.setHeight(CANVAS.height);}
        
        return drawRectangle;
    }
    
    draw(context) {
        const drawRectangle = this.getDrawRectangle();
        
        const x = drawRectangle.getX();
        const y = drawRectangle.getY();
        const width = drawRectangle.getWidth();
        const height = drawRectangle.getHeight();
        
        context.translate(x, y);
        
        if(shadowBlurOn) {
            context.shadowBlur = this.getShadowBlur();
            context.shadowColor = this.getShadowColor();
        }
        
        context.globalAlpha = this.getAlpha();
        const style = this.getStyle();
        context.fillStyle = style;
        context.strokeStyle = this.getStrokeStyle();
        
        try {
            if(style instanceof HTMLImageElement || style instanceof HTMLCanvasElement) {
                context.shadowColor = "black";
                
                context.drawImage(style, 0, 0, width, height);
            } else {
                context.fillRect(0, 0, width, height);
            }
        } catch(e) {
            if(style instanceof HTMLCanvasElement && (style.width === 0 || style.height === 0)) {
                
            }
            
            else {
                console.warn(e, style);
            }
        }
        
        context.strokeRect(0, 0, width, height);
        
        this.drawContextTranslated(context, drawRectangle);
        
        context.translate(-x, -y);
        
        return this;
    }
    
    setLifespan(lifespan) {this.lifespan = lifespan; return this;}
    
    drawContextTranslated(context, drawRectangle) {
        return this;
    }
    
    setCamera(camera) {this.camera = camera; return this;}
    getCamera() {return this.camera;}
    
    setStrokeStyle(strokeStyle) {this.strokeStyle = strokeStyle; return this;}
    getStrokeStyle() {return Drawable.prototype.getStrokeStyle.bind(this)();}
    
    getShadowColor() {
        return Drawable.prototype.getShadowColor.bind(this)();
    }
    
    getLifespan() {
        return this.lifespan;
    }
    
    getShadowBlur() {
        return this.shadowBlur;
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
    
    drawContextTranslated(context, drawRectangle) {
        super.drawContextTranslated(...arguments);
        
        try {
            context.drawImage(this.contentStyle, 0, 0, drawRectangle.getWidth(), drawRectangle.getHeight());
        } catch(e) {
            
        }
        
        return this;
    }
}
