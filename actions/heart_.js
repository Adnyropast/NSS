
const AS_HEART = set_gather("BloodShot", "BlowoutShots", "VeinSweep");

class BloodProjectile extends Projectile {
    constructor() {
        super(...arguments);
        
        const avgsz = rectangle_averageSize(this);
        
        this.setLifespan(96);
        this.setDrawable(PolygonDrawable.from(roundparticle).multiplySize((this.getWidth() + this.getHeight())/64));
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setStyle("blue");
        this.drawable.setStrokeStyle("darkBlue");
        
        this.addInteraction(new ContactVanishRecipient(CVF_OBSTACLE | CVF_CHARACTER));
        
        this.setTypeOffense(FX_HEART_, 1);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
    
    oncontactvanish(event) {
        const cvFlags = event.flags;
        
        if(cvFlags & CVF_OBSTACLE) {
            entityExplode.randomAngleVariation = 1;
            entityExplode(irandom(2, 3), HeartBloodDroplet, this.getPositionM(), function() {
                const sz = irandom(8, 12);
                return [sz, sz];
            }, 1)
            .forEach(function(entity) {
                entity.speed.multiply(random(1, 4));
            });
        }
        
        return this;
    }
}

class BloodShot extends Action {
    constructor() {
        super();
        this.setUseCost(4);
        
        this.initialPosition = null;
        this.targetPosition = null;
        this.projectile = null;
    }
    
    use() {
        if(this.phase === 0) {
            if(this.user.spendEnergy(this.getUseCost())) {
                
            } else {
                return this.end();
            }
        }
        
        if(this.phase <= 1) {
            let direction = this.user.getCursorDirection();
            
            var projectile = BloodProjectile.fromMiddle(direction.normalized(rectangle_averageSize(this.user) / 2).add(this.user.getPositionM()), [4, 4]);
            
            projectile.setSpeed(direction.normalize(4));
            projectile.launchDirection = projectile.speed.normalized(1);
            projectile.shareBlacklist(this.user.getBlacklist());
            
            addEntity(projectile);
        }
        
        if(this.phase >= 10) {
            this.end();
        }
        
        return this;
    }
}

class BlowoutShots extends Action {
    constructor() {
        super();
        this.setUseCost(0.5);
        
        this.angle = 0;
        this.inc = 6;
        this.pace = 1;
    }
    
    use() {
        if(this.phase == 0) {
            var vector = this.user.getCursorDirection();
            var norm = vector.getNorm();
            var cos = vector[0] / norm;
            var sin = vector[1] / norm;
            this.angle = Math.atan2(sin, cos);
            
            if(this.angle != this.angle) {
                return this.end();
            }
        }
        
        if(this.phase % this.pace == 0) {
            if(this.user.spendEnergy(this.getUseCost())) {
                let direction = new Vector(Math.cos(this.angle), Math.sin(this.angle));
                
                var projectile = BloodProjectile.fromMiddle(direction.normalized(rectangle_averageSize(this.user) / 2).add(this.user.getPositionM()), [4, 4]);
                projectile.setSpeed(direction.normalize(4));
                projectile.launchDirection = direction.normalized(1);
                projectile.shareBlacklist(this.user.getBlacklist());
                projectile.setLifespan(20);
                projectile.setEventListener("hit", "freeze", function freeze(event) {
                    set_gather(event.actor.getBlacklist(), event.recipient.getBlacklist())
                    .forEach(function(entity) {
                        entity.setFreeze(2);
                    });
                });
                
                addEntity(projectile);
            }
        }
        
        this.angle += this.inc;
        // this.inc += Math.random();
        this.angle %= 2 * Math.PI;
        
        return this;
    }
}

class VeinSweep extends SlashAction {
    constructor() {
        super();
        
        this.slashDuration = 12;
        this.det = 3;
        
        this.hitbox = new Hitbox([NaN, NaN], [1, 1]);
        
        this.rct = new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 0], 8, bezierLinear);
        
        this.hitbox.setTypeOffense(FX_HEART_, 1);
    }
    
    updateTrailDrawableStyle(detProgress) {
        /**
        
        let ct = new ColorTransition([63, 255, 255, 1], [0, 0, 255, 0], 8, bezierLinear);
        this.trailDrawable.trailStyle = new ColorTransition(ct.at((1-detProgress)/ct.duration), ct.at(1), 8, bezierLinear);
        
        /**
        
        ct = this.rct;
        this.trailDrawable.trailStyle = new ColorTransition(ct.at((1-detProgress)/ct.duration), ct.at(1), 8, bezierLinear);
        
        this.trailDrawable.edgeStyle = this.trailDrawable.trailStyle;
        
        /**/
        
        let ct = new ColorTransition([0, 127, 255, 1], [0, 0, 192, 0], 8, bezierLinear);
        this.trailDrawable.trailStyle = new ColorTransition(ct.at((1-detProgress)/ct.duration), ct.at(1), 8, bezierLinear);
        this.trailDrawable.edgeStyle = this.trailDrawable.trailStyle;
        
        /**/
        
        return this;
    }
    
    transitionsSetup() {
        let direction = this.user.getCursorDirection();
        let face = Vector.from(direction);
        face[0] = Math.sign(face[0]);
        face[1] = Math.sign(face[1]);
        
        if(face[0] == 0  && face[1] == 0) {
            
        } else if(Math.abs(direction[0]) >= Math.abs(direction[1])) {
            this.baseAngleTransition = new ColorTransition([-Math.PI/2 + face[0] * Math.PI/4], [-Math.PI/2 + face[0] * 3/4 * Math.PI]);
            this.baseDistanceTransition = new ColorTransition([4], [4]);
            this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * 3/4 * Math.PI], [-Math.PI/2 + face[0] * 3/2 * Math.PI]);
            this.bladeWidthTransition = new ColorTransition([32], [32], 1, function(t) {return Math.pow((t - 0.5) / 0.5, 2)});
        } else {
            this.baseAngleTransition = new VectorTransition([face[1] * Math.PI/2 - Math.PI], [face[1] * Math.PI/2 + Math.PI]);
            this.baseDistanceTransition = new VectorTransition([4], [4]);
            this.bladeAngleTransition = this.baseAngleTransition;
            this.bladeWidthTransition = new VectorTransition([32], [32]);
        }
        
        this.hitbox.launchDirection = face.times(1);
        
        const user = this.user;
        this.hitbox.addEventListener("hit", function() {
            user.heal(1);
        });
        
        return this;
    }
}

class HeartBloodDroplet extends WaterDroplet {
    constructor() {
        super(...arguments);
        
        this.getDrawable().setStyle(new ColorTransition([0, 63, 255, 1], [0, 63, 255, 0], 16, powt(8)));
        this.getDrawable().setStrokeStyle(new ColorTransition([0, 0, 191, 1], [0, 0, 191, 0], 16, powt(8)));
    }
}
