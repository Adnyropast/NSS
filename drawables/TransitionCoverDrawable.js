
class TransitionCoverDrawable extends RectangleDrawable {
    constructor(position = [0, 0], size = [CANVAS.width, CANVAS.height]) {
        super(position, size);
        this.setCameraMode("none");
        
        this.transitionInStyle = new ColorTransition([0, 0, 0, 0], [0, 0, 0, 1]);
        this.transitionOutStyle = new ColorTransition([0, 0, 0, 1], [0, 0, 0, 0]);
        
        this.focusPosition = this.getPositionM();
        this.direction = [0, 0];
    }
    
    initTransitionIn(duration) {
        if(this.transitionInStyle instanceof ColorTransition) {
            this.transitionInStyle.setDuration(duration);
        }
        
        this.setStyle(this.transitionInStyle);
        
        return this;
    }
    
    initTransitionOut(duration) {
        this.setLifespan(duration);
        
        if(this.transitionOutStyle instanceof ColorTransition) {
            this.transitionOutStyle.setDuration(duration);
        }
        
        this.setStyle(this.transitionOutStyle);
        
        return this;
    }
    
    setFocusPosition(focusPosition) {
        this.focusPosition = focusPosition;
        
        return this;
    }
    
    getFocusPosition() {
        return this.focusPosition;
    }
    
    setDirection(direction) {
        this.direction = direction;
        
        return this;
    }
    
    getDirection() {
        return this.direction;
    }
}

class WhiteCoverDrawable extends TransitionCoverDrawable {
    constructor() {
        super(...arguments);
        
        this.transitionInStyle = new ColorTransition([255, 255, 255, 0], [255, 255, 255, 1], 1, powt(1/4));
        this.transitionOutStyle = new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0]);
    }
}

class ScreenWipeCoverDrawable extends TransitionCoverDrawable {
    constructor() {
        super(...arguments);
        this.setStyle(INVISIBLE);
        
        this.direction = new Vector(1, 0);
        this.direction = Vector.fromAngle(random(0, 2*Math.PI));
        this.wiper = null;
        
        this.transitionInStyle = "black";
        this.transitionOutStyle = "black";
    }
    
    initTransitionIn(duration) {
        const diagonalLength = Vector.normOf(this.size);
        
        this.wiper = PolygonDrawable.from(makeRegularPolygon(4, diagonalLength).rotate(Math.PI/4));
        this.wiper.setCameraMode("none");
        
        if(this.transitionInStyle instanceof ColorTransition) {
            this.transitionInStyle.setDuration(duration);
        }
        
        this.wiper.setStyle(this.transitionInStyle);
        this.wiper.setPositionM(Vector.addition(this.getPositionM(), Vector.fromAngle(this.direction.getAngle()).normalize(-diagonalLength)));
        
        this.controllers.clear().add(function transitionInController() {
            this.wiper.setImaginaryAngle(this.direction.getAngle());
            
            const vector = Vector.subtraction(this.getPositionM(), this.wiper.getPositionM());
            this.wiper.translate(vector.divide(duration));
            --duration;
        });
        
        return this;
    }
    
    initTransitionOut(duration) {
        this.setLifespan(duration);
        
        const diagonalLength = Vector.normOf(this.size);
        
        this.wiper = PolygonDrawable.from(makeRegularPolygon(4, diagonalLength).rotate(Math.PI/4));
        this.wiper.setCameraMode("none");
        
        if(this.transitionOutStyle instanceof ColorTransition) {
            this.transitionOutStyle.setDuration(duration);
        }
        
        this.wiper.setStyle(this.transitionOutStyle);
        this.wiper.setPositionM(this.getPositionM());
        const destination = Vector.addition(this.getPositionM(), Vector.fromAngle(this.direction.getAngle()).normalize(diagonalLength));
        
        this.controllers.clear().add(function transitionOutController() {
            this.wiper.setImaginaryAngle(this.direction.getAngle());
            
            const vector = Vector.subtraction(destination, this.wiper.getPositionM());
            this.wiper.translate(vector.divide(duration));
            --duration;
        });
        
        return this;
    }
    
    update() {
        super.update();
        
        if(this.wiper) {
            this.wiper.update();
        }
        
        return this;
    }
    
    draw(context) {
        if(this.wiper) {
            this.wiper.draw(context);
        }
        
        return this;
    }
    
    setFocusPosition(focusPosition) {
        super.setFocusPosition(...arguments);
        
        const direction = Vector.subtraction([this.getWidth()/2, this.getHeight()/2], focusPosition);
        
        if(!direction.isZero()) {
            this.direction = direction;
        }
        
        return this;
    }
}

class BookTransitionCoverDrawable extends ScreenWipeCoverDrawable {
    initTransitionIn(duration) {
        super.initTransitionIn(...arguments);
        
        this.wiper.setPositionM(Vector.addition(this.getPositionM(), Vector.fromAngle(this.direction.getAngle()).normalize(Vector.normOf(this.size))));
        
        return this;
    }
}

class CartoonClosureCoverDrawable extends TransitionCoverDrawable {
    constructor() {
        super(...arguments);
        
        this.symbolRect = RectangleDrawable.from(this);
        this.symbolRect.setCameraMode("none");
        
        this.transitionOutStyle = new ColorTransition([0, 0, 0, 1], [0, 0, 0, 0]);
        this.transitionInStyle = new ColorTransition([0, 0, 0, 0], [0, 0, 0, 1]);
        
        this.symbolInDrawFnFactory = function fnFactory() {return emptyFn;};
        this.symbolOutDrawFnFactory = function fnFactory() {return emptyFn;};
        this.symbolDrawFnFactoryReset = emptyFn;
        
        switch(irandom(0, 2)) {
            case 0: {this.setSymbolCircle(); break;}
            case 1: {this.setSymbolImage(IMG_SEED); break;}
            case 2: {this.setSymbolImage(IMGITEM["Apple"]); break;}
        }
    }
    
    initTransitionIn(duration) {
        this.symbolDrawFnFactoryReset();
        
        this.controllers.clear().add(function transitionInController() {
            let surroundingColor = this.transitionInStyle;
            
            if(surroundingColor instanceof ColorTransition) {
                surroundingColor = surroundingColor.getStyleAt(1);
            }
            
            this.symbolRect.setStyle(makeClearElementCanvas(this.getWidth(), this.getHeight(), this.symbolInDrawFnFactory(duration, this.getFocusPosition()), surroundingColor));
        });
        
        return super.initTransitionIn(duration);
    }
    
    initTransitionOut(duration) {
        this.setLifespan(duration);
        
        this.symbolDrawFnFactoryReset();
        
        this.controllers.clear().add(function transitionOutController() {
            let surroundingColor = this.transitionOutStyle;
            
            if(surroundingColor instanceof ColorTransition) {
                surroundingColor = surroundingColor.getStyleAt(0);
            }
            
            this.symbolRect.setStyle(makeClearElementCanvas(this.getWidth(), this.getHeight(), this.symbolOutDrawFnFactory(duration, this.getFocusPosition()), surroundingColor));
        });
        
        return super.initTransitionOut(duration);
    }
    
    draw(context) {
        super.draw(context);
        
        this.symbolRect.draw(context);
        
        return this;
    }
    
    setSymbolCircle() {
        const radiusTransitionIn = new NumberTransition(this.getWidth(), 0, 1, powt(1/2));
        const radiusTransitionOut = new NumberTransition(0, this.getWidth(), 1, powt(4));
        
        this.symbolInDrawFnFactory = function circleInDrawFnFactory(duration, symbolPosition) {
            if(radiusTransitionIn.getDuration() !== duration - 1) {
                radiusTransitionIn.setDuration(duration - 1);
            }
            
            const radius = radiusTransitionIn.getNext();
            
            return function circleDrawFn(ctx, canvas) {
                ctx.beginPath();
                ctx.arc(symbolPosition[0], symbolPosition[1], radius, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
            };
        };
        
        this.symbolOutDrawFnFactory = function circleOutDrawFnFactory(duration, symbolPosition) {
            if(radiusTransitionOut.getDuration() !== duration - 1) {
                radiusTransitionOut.setDuration(duration - 1);
            }
            
            const radius = radiusTransitionOut.getNext();
            
            return function circleDrawFn(ctx, canvas) {
                ctx.beginPath();
                ctx.arc(symbolPosition[0], symbolPosition[1], radius, 0, 2*Math.PI);
                ctx.closePath();
                ctx.fill();
            };
        };
        
        this.symbolDrawFnFactoryReset = function() {
            radiusTransitionIn.setStep(0);
            radiusTransitionOut.setStep(0);
        };
        
        return this;
    }
    
    setSymbolImage(img) {
        const imageSizeTransitionIn = new VectorTransition([this.getWidth(), this.getWidth()], [0, 0], 1, powt(1/2));
        const imageSizeTransitionOut = new VectorTransition([0, 0], [this.getWidth(), this.getWidth()], 1, powt(4));
        
        this.symbolInDrawFnFactory = function imageInDrawFnFactory(duration, symbolPosition) {
            if(imageSizeTransitionIn.getDuration() !== duration - 1) {
                imageSizeTransitionIn.setDuration(duration - 1);
            }
            
            const imageSize = imageSizeTransitionIn.getNext();
            
            return function imageDrawFn(ctx, canvas) {
                ctx.drawImage(img, symbolPosition[0] - imageSize[0]/2, symbolPosition[1] - imageSize[1]/2, imageSize[0], imageSize[1]);
            };
        };
        
        this.symbolOutDrawFnFactory = function imageOutDrawFnFactory(duration, symbolPosition) {
            if(imageSizeTransitionOut.getDuration() !== duration - 1) {
                imageSizeTransitionOut.setDuration(duration - 1);
            }
            
            const imageSize = imageSizeTransitionOut.getNext();
            
            return function imageDrawFn(ctx, canvas) {
                ctx.drawImage(img, symbolPosition[0] - imageSize[0]/2, symbolPosition[1] - imageSize[1]/2, imageSize[0], imageSize[1]);
            };
        };
        
        this.symbolDrawFnFactoryReset = function() {
            imageSizeTransitionIn.setStep(0);
            imageSizeTransitionOut.setStep(0);
        };
        
        return this;
    }
}
