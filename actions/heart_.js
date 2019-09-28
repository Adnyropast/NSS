
const AS_HEART = set_gather("bloodShot", "heartBlowout", "veinSweep");

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
            
            var projectile = BloodProjectile.fromMiddle([initialPosition[0], initialPosition[1]], [4, 4]);
            
            projectile.setSpeed(Vector.subtraction(targetPosition, initialPosition).normalize(4));
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

AC["bloodShot"] = BloodShot;

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
            var projectile = BloodProjectile.fromMiddle(this.user.getPositionM(), [4, 4]);
            projectile.setSpeed(new Vector(Math.cos(this.angle), Math.sin(this.angle)).normalize(4));
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

AC["blowoutShots"] = BlowoutShots;

class VeinSweep extends SlashAction {
    constructor() {
        super();
        this.setId("veinSweep");
        
        this.slashDuration = 12;
        this.det = 3;
        
        this.hitbox.removeInteractorWithId("damage");
        this.hitbox.addInteraction(new TypeDamager({type:FX_HEART_, value:1}));
        // console.log(this.hitbox.findInteractorWithId("damage"));
    }
    
    updateTrailDrawableStyle(detProgress) {
        let ct = new ColorTransition([63, 255, 255, 1], [0, 0, 255, 0], 8, bezierLinear);
        this.trailDrawable.trailStyle = new ColorTransition(ct.at((1-detProgress)/ct.duration), ct.at(1), 8, bezierLinear);
        
        return this;
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        
        if(face[0] != 0) {
            this.baseAngleTransition = new ColorTransition([-Math.PI/2 + face[0] * Math.PI/4], [-Math.PI/2 + face[0] * 3/4 * Math.PI]);
            this.baseDistanceTransition = new ColorTransition([0], [16]);
            this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * 3/4 * Math.PI], [-Math.PI/2 + face[0] * 3/2 * Math.PI]);
            this.bladeWidthTransition = new ColorTransition([32], [32], 1, function(t) {return Math.pow((t - 0.5) / 0.5, 2)});
        }
        
        return this;
    }
}

AC["veinSweep"] = VeinSweep;
