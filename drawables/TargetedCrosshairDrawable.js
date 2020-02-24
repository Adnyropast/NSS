
class TargetedCrosshairDrawable extends MultiPolygonDrawable {
    constructor(position) {
        super();
        
        this.setZIndex(-1000);
        
        for(let i = 0, count = 8; i < count; ++i) {
            const angle = i/count * 2*Math.PI;
            const vector = Vector.fromAngle(angle).normalize(12);
            
            const hair = new PolygonDrawable(makePathPolygon([vector.times(0), vector.times(1/2), vector.times(1)], 1));
            
            this.push(hair);
        }
        
        this.circle = new PolygonDrawable(makePathPolygon(makeOvalPath(64, 24, 24), 1));
        this.circle.setPositionM(position);
        
        this.hairSpeed = 1;
        this.hairTransition = new NumberTransition(24, 6, 8, powt(1/12));
        this.circleTransition = new NumberTransition(24, 12, 8, powt(1/6));
        
        this.setPositionM(position);
        this.targetPosition = position;
        this.setStyle(new ColorTransition([0, 255, 255, 1], [127, 255, 255, 0.75], 512).setLoop(true));
        
        this.setShadowBlur(8);
    }
    
    update() {
        this.circle.update();
        super.update();
        
        const hairDistance = this.hairTransition.getNext();
        
        for(let i = 0, count = this.size(); i < count; ++i) {
            const angle = i/count * 2*Math.PI;
            const hair = this.getPolygon(i);
            const vector = Vector.fromAngle(angle);
            
            hair.setPositionM(vector.normalize(hairDistance));
        }
        
        this.circle.multiplySize(this.circleTransition.getNext()/polygon_averageSize(this.circle));
        
        return this;
    }
    
    draw(context) {
        this.circle.draw(context);
        super.draw(context);
        
        return this;
    }
    
    setStyle(style) {
        this.circle.setStyle(style);
        super.setStyle(style);
        
        return this;
    }
    
    setCamera(camera) {
        this.circle.setCamera(camera);
        super.setCamera(camera);
        
        return this;
    }
    
    setShadowBlur(shadowBlur) {
        this.circle.setShadowBlur(shadowBlur);
        super.setShadowBlur(shadowBlur);
        
        return this;
    }
}
