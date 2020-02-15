
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
