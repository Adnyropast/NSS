
const AS_SWORD = set_gather("overheadSlash");

class SwordAbility extends BusyAction {
    constructor() {
        super();
    }
}

class SlashEffect extends Entity {
    constructor(position, size) {
        super(position, size);
        // this.setOffense(FX_SHARP, 1);
        
        this.addInteraction(new TypeDamager([{"type" : FX_SHARP, "value" : 1}]));
    }
    
    updateDrawable() {
        var grd = CANVAS.getContext("2d").createLinearGradient(0, 0, 0, this.getHeight());
        grd.addColorStop(0, "#00FFFF00");
        grd.addColorStop(1, "#00FFFFBF");
        
        this.setStyle(grd);
        this.setStyle(INVISIBLE);
        
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setSizeM(this.getSize());
        
        return this;
    }
}

class BladeTransition {
    constructor() {
        this.userPositions = [];
        
    }
    
    start(userPosition, baseAngle, baseDistance, bladeAngle) {
        
    }
    
    addStep(userPosition, baseRotateAngle, baseDistance, bladeRotateAngle) {
        this.userPositions.push(userPosition);
        
        
        return this;
    }
    
    at(t) {
        let res = {
            "userPosition" : null,
            "baseDirection" : null,
            "bladeAngle" : undefined
        };
    }
}

class OverheadSlash extends SwordAbility {
    constructor() {
        super();
        this.setId("overheadSlash");
        
        this.effect = null;
        this.face = null;
        this.center = null;
        
        this.trailDrawable = new TrailDrawable();
        
        this.setUseCost(3);
    }
    
    use() {
        if(this.phase == 0) {
            this.face = new Vector(Math.sign(this.user.getCursor().getXM() - this.user.getXM()), 0);
            this.face = Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM());
            
            if(this.user.getEnergy() <= this.getUseCost()) {
                return this.end();
            }
            
            this.user.hurt(this.getUseCost());
            
            this.center = this.user.getPositionM();
            
            this.setRemovable(false);
            
            if(this.face[0] != 0) {
                this.face[0] = Math.sign(this.face[0]);
                this.face[1] = 0;
                this.effect = SlashEffect.fromMiddle([this.face.x + this.user.getXM(), this.face.y + this.user.getYM()], [32, 32]);
                
                this.user.setFace(this.face[0]);
            } else if(this.face[1] != 0) {
                this.face[1] = Math.sign(this.face[1]);
                this.effect = SlashEffect.fromMiddle([this.face.x + this.user.getXM(), this.face.y + this.user.getYM()], [32, 32]);
            } else {
                this.effect = SlashEffect.fromMiddle([this.face.x + this.user.getXM(), this.face.y + this.user.getYM()], [32, 32]);
            }
            
            this.effect.setLifespan(16);
            this.effect.shareBlacklist(this.user.getBlacklist());
            // this.effect.setForce(this.face.multiply(2));
            this.effect.addInteraction(new DragActor(this.face.multiply(2)));
            
            addEntity(this.effect);
            
            addDrawable(this.trailDrawable);
        } if(this.phase <= 10) {
            var angle = -Math.PI / 2 + (this.phase - 2) * this.face[0] * 0.1875 + this.face[1] * (this.phase + this.face[1] * Math.PI) * -0.1875;
            
            var s = 32 - Math.abs(this.phase - 5) * 16 / 5;
            
            this.effect.setSize([s, s]);
            
            var farX = this.user.getXM() + Math.cos(angle) * 24;
            var farY = this.user.getYM() + Math.sin(angle) * 24;
            
            this.effect.setPositionM(0, farX);
            this.effect.setPositionM(1, farY);
            /**/
            if(this.prevPos) {
                let t = 6;
                
                for(let i = t; i >= 0; --i) {
                    let angle = -Math.PI / 2 + (this.phase - i/t - 2) * this.face[0] * 0.1875 + this.face[1] * (this.phase - i/t + this.face[1] * Math.PI) * -0.1875;
                    
                    var closeX = this.user.getXM() + (i/t) * (this.prevPos[0] - this.user.getXM()) + Math.cos(angle) * 12;
                    var closeY = this.user.getYM() + (i/t) * (this.prevPos[1] - this.user.getYM()) + Math.sin(angle) * 12;
                    
                    this.trailDrawable.addSized([closeX, closeY], angle, 20, 18.75);
                }
            }
            
            // var angle = -Math.PI / 2 + (this.phase - 2) * this.face[0] * 0.1875 + this.face[1] * (this.phase + this.face[1] * Math.PI) * -0.1875;
            
            // var closeX = this.user.getXM() + Math.cos(angle) * 12;
            // var closeY = this.user.getYM() + Math.sin(angle) * 12;
            
            // this.trailDrawable.addSized([closeX, closeY], angle, 20, 18.75);
            
            
            /**
            
            let vert = Math.PI / 2;
            
            let sign = Math.sign(this.face[0]);
            
            for(let i = this.phase; i <= this.phase; ++i) {
                var baseAngle = -Math.PI / 2 + (i-3) * sign * Math.PI/12;
                var bladeAngle = baseAngle - (12-i)/12 * sign * Math.PI/2
                
                let size = 20 - Math.abs(this.phase - 10);
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(8 + this.phase / 3);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, size, size * 1.125);
            }
            /**
            
            let sign = Math.sign(this.face[0]);
            
            let transition = new ColorTransition(this.prevPos, this.user.getPositionM());
            
            if(this.phase == 0) {
                var baseAngle = -Math.PI/2 - sign * Math.PI / 4;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(0);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
            } else if(this.phase == 1) {
                var baseAngle = -Math.PI/2 - sign * Math.PI/4 * 2/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(12);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 - sign * Math.PI/4 * 1/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(12);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(12);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
            } else if(this.phase == 2) {
                var baseAngle = -Math.PI/2 + sign * Math.PI/4 * 1/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/4 * 2/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/4;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/2 - sign * Math.PI/2 * 2/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/2 - sign * Math.PI/2 * 1/3;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * Math.PI/2;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                
                
                var baseAngle = -Math.PI/2 + sign * (3/4 * Math.PI/2 - Math.PI/2 * 2/3);
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * (3/4 * Math.PI - Math.PI/2 * 1/3);
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                var baseAngle = -Math.PI/2 + sign * 3/4 * Math.PI;
                var bladeAngle = baseAngle - sign * Math.PI/2;
                
                var baseDirection = (new Vector(Math.cos(baseAngle), Math.sin(baseAngle))).times(16);
                
                this.trailDrawable.addSized(baseDirection.add(this.user.getPositionM()), bladeAngle, 20, 18.75);
                
                
                
            }
            /**/
            
            
            this.prevPos = this.user.getPositionM();
        } else {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
}

class UpwardArcSlash extends SwordAbility {
    constructor() {
        super();
        this.setId("upwardArcSlash");
        
        this.trailDrawable = new TrailDrawable();
    }
    
    use() {
        
        
        return this;
    }
    
    onend() {
        removeDrawable(this.trailDrawable);
        
        return super.onend();
    }
}
