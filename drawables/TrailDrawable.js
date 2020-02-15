
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
