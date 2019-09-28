
const AS_HEART = set_gather("bloodShot", "heartBlowout", "veinSweep");

const FX_HEART_ = effectsCount++;

class BloodProjectile extends Projectile {
    constructor() {
        super(...arguments);
        
        this.setLifespan(100);
        this.setDrawable(PolygonDrawable.from(roundparticle).multiplySize((this.getWidth() + this.getHeight())/64));
        this.drawable.setPositionM(this.getPositionM());
        this.setStyle(new ColorTransition([0, 255, 255, 1], [0, 127, 255, 1], 8));
        // this.setStyle(new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1], 8));
        this.drawable.setStrokeStyle(new ColorTransition([0, 0, 255, 1], [0, 0, 127, 1], 8));
        // this.drawable.setStrokeStyle(new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1], 8));
        
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
            let direction = this.user.getCursorDirection();
            
            var projectile = BloodProjectile.fromMiddle(direction.normalized(rectangle_averagesize(this.user) / 2).add(this.user.getPositionM()), [4, 4]);
            
            projectile.setSpeed(direction.normalize(4));
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
            let direction = new Vector(Math.cos(this.angle), Math.sin(this.angle));
            
            var projectile = BloodProjectile.fromMiddle(direction.normalized(rectangle_averagesize(this.user) / 2).add(this.user.getPositionM()), [4, 4]);
            projectile.setSpeed(direction.normalize(4));
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
        
        this.rct = new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 0], 8, bezierLinear);
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
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        face[1] = Math.sign(face[1]);
        
        if(face[0] != 0) {
            this.baseAngleTransition = new ColorTransition([-Math.PI/2 + face[0] * Math.PI/4], [-Math.PI/2 + face[0] * 3/4 * Math.PI]);
            this.baseDistanceTransition = new ColorTransition([4], [4]);
            this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * 3/4 * Math.PI], [-Math.PI/2 + face[0] * 3/2 * Math.PI]);
            this.bladeWidthTransition = new ColorTransition([32], [32], 1, function(t) {return Math.pow((t - 0.5) / 0.5, 2)});
            
            this.hitbox.addInteraction(new DragActor(face.times(0.25)));
        }
        
        return this;
    }
}

AC["veinSweep"] = VeinSweep;
