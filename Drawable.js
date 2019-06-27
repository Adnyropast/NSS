
class Drawable {
    getZIndex() {}
    draw(context) {}
}

class RectangleDrawable extends Rectangle {
    constructor(position, size) {
        super(position, size);
        
        this.zIndex = 0;
        this.style = "#000000";
        
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    
    getStyle() {
        if(this.style instanceof AnimatedImages) {
            return this.style.getNext();
        } else if(this.style instanceof TransitionColor) {
            return this.style + "";
        }
        
        return this.style;
    }
    
    getAlpha() {
        if(this.style instanceof AnimatedImages) {
            return this.style.alpha[this.style.iindex];
        }
        
        return 1;
    }
    
    setStyle(style) {
        if(style instanceof AnimatedImages) {
            if(!(this.style instanceof AnimatedImages) || this.style.images != style.images) {
                this.style = style;
            }
        } else {
            this.style = style;
        }
        
        return this;
    }
    
    updateStyle() {
        return this;
    }
    
    draw(context) {
        var x = this.getX();
        var y = this.getY();
        var width = this.getWidth();
        var height = this.getHeight();
        
        var wprop = CANVAS.width / CAMERA.width;// BASEWIDTH;
        var hprop = CANVAS.height / CAMERA.height;// BASEHEIGHT;
        
        x += -CAMERA.getOffsetX();
        y += -CAMERA.getOffsetY();
        
        x *= wprop;
        y *= hprop;
        width *= wprop;
        height *= hprop;
        
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
        
        if(style instanceof HTMLImageElement) {
            context.drawImage(style, x, y, width, height);
        } else {
            context.fillStyle = style;
            
            // context.fillRect(x, y, width, height);
            context.translate(x, y);
            context.fillRect(0, 0, width, height);
            context.translate(-x, -y);
        }
        
        context.globalAlpha = 1;
        
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
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    
    getStyle() {
        if(this.style instanceof TransitionColor) {
            return this.style + "";
        }
        
        return this.style;
    }
    
    setStyle(style) {
        this.style = style;
        
        return this;
    }
    
    draw(context) {
        context.beginPath();
        
        for(var i = 0; i < this.size(); ++i) {
            var point = this.getPoint(i);
            
            var x = point[0], y = point[1];
            
            var wprop = CANVAS.width / CAMERA.width;// BASEWIDTH;
            var hprop = CANVAS.height / CAMERA.height;// BASEHEIGHT;
            
            x += -CAMERA.getOffsetX();
            y += -CAMERA.getOffsetY();
            
            x *= wprop;
            y *= hprop;
            
            if(i == 0) {
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        }
        
        context.closePath();
        
        context.fillStyle = this.getStyle();
        // context.strokeStyle = 
        context.lineWidth = 0.5;
        // context.stroke();
        context.fill();
        
        return this;
    }
}

/**/

class TextDrawable {
    constructor(content = "") {
        this.zIndex = -Infinity;
        this.content = content;
        this.color = "black";
        this.x = 0, this.y = 0;
    }
    
    getZIndex() {return this.zIndex;}
    setZIndex(zIndex) {this.zIndex = zIndex; return this;}
    
    getX() {return this.x;}
    getY() {return this.y;}
    
    draw(context) {
        var x = this.getX(), y = this.getY();
        
        context.fillStyle = this.color;
        context.fillText(this.content, x, y);
        // context.fillText(PLAYER.energy, 66.75 * CANVAS.height / BASEHEIGHT, 0);
        // context.fillText(PLAYER.energy, 0, 16);
        // context.fillText(PLAYER.energy, 0, 32);
        // context.fillText(PLAYER.energy, 0, 48);
        // context.fillText(PLAYER.energy, 0, 64);
        
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
