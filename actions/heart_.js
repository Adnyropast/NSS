
const AS_HEART = set_gather("bloodShot", "heartBlowout");

const FX_HEART_ = effectsCount++;

class BloodProjectile extends Projectile {
    constructor() {
        super(...arguments);
        
        this.setLifespan(100);
        this.setDrawable(PolygonDrawable.from(roundparticle).multiplySize((this.getWidth() + this.getHeight())/64));
        this.drawable.setPositionM(this.getPositionM());
        this.setStyle(new ColorTransition([0, 255, 255, 1], [0, 127, 255, 1], 8));
        this.drawable.setStrokeStyle(new ColorTransition([0, 0, 255, 1], [0, 0, 127, 1], 8));
        
        this.addInteraction(new TypeDamager({"type" : FX_HEART_, "value" : 1}));
        this.addInteraction(new ContactVanishRecipient(3));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}

class BloodShot extends Action {
    constructor() {
        super();
        this.id = "bloodShot";
        this.setUseCost(5);
        this.setUseCost(0);
        
        this.initialPosition = null;
        this.targetPosition = null;
        this.projectile = null;
    }
    
    use() {
        if(this.phase <= 1) {
            var initialPosition = this.user.getPositionM();
            var targetPosition = this.user.getCursor().getPositionM();
            
            var projectile = BloodProjectile.fromMiddle([initialPosition[0], initialPosition[1]], [12, 12]);
            
            projectile.setSpeed(Vector.subtraction(this.user.getCursor().getPositionM(), initialPosition).normalize(16));
            projectile.addInteraction(new DragActor(projectile.speed.normalized(1)));
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
        this.id = "heartBlowout";
        
        this.angle = 0;
        this.inc = 6;
        this.pace = 1;
    }
    
    use() {
        if(this.phase == 0) {
            var vector = Vector.subtraction(this.user.getCursor().getPositionM(), this.user.getPositionM());
            var norm = vector.getNorm();
            var cos = vector[0] / norm;
            var sin = vector[1] / norm;
            this.angle = Math.atan2(sin, cos);
            
            if(this.angle != this.angle) {
                return this.end();
            }
        }
        
        if(this.phase % this.pace == 0) {
            var projectile = BloodProjectile.fromMiddle(this.user.getPositionM(), [8, 8]);
            projectile.setSpeed(new Vector(Math.cos(this.angle), Math.sin(this.angle)).normalize(8));
            projectile.shareBlacklist(this.user.getBlacklist());
            projectile.setLifespan(20);
            addEntity(projectile);
        }
        
        this.angle += this.inc;
        // this.inc += Math.random();
        this.angle %= 2 * Math.PI;
        
        return this;
    }
}
