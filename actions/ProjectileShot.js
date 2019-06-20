
class Projectile extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.style = "#FF0000";
        this.setBlockable(true);
        this.setBrakeExponent(0);
        this.setForceFactor(0);
        this.setRegeneration(-1);
        this.setOffense(FX_PIERCING, 1);
    }
    
    oncollision(other) {
        super.oncollision(other);
        
        if(other.getReplaceID() != 0) {
            var particle = new TpParticle(NaN, NaN, 32, 32);
            particle.setPositionM(this.getPositionM());
            particle.setColorTransition([255, 0, 0, 255], [255, 0, 0, 0], 10);
            particle.setLifespan(10);
            
            addEntity(particle);
            this.setEnergy(0);
        }
        
        return this;
    }
}

class ProjectileShot extends Action {
    constructor() {
        super();
        this.id = 2;
        this.setUseCost(5);
        this.setUseCost(0);
        
        this.initialPosition = null;
        this.targetPosition = null;
        this.projectile = null;
    }
    
    use() {
        if(this.phase == 0) {
            var initialPosition = this.user.getPositionM();
            var targetPosition = this.user.getCursor().getPositionM();
            
            var projectile = Projectile.fromMiddle(initialPosition[0], initialPosition[1], 12, 12);
            
            projectile.speed = Vector.subtraction(this.user.getCursor().getPositionM(), initialPosition).normalize(16);
            projectile.setBlacklist(this.user.getBlacklist());
            projectile.setLifespan(100);
            
            addEntity(projectile);
        }
        
        if(this.phase >= 0) {
            this.end();
        }
        
        return this;
    }
}

class BlowoutShots extends Action {
    constructor(targetPosition) {
        super();
        this.id = "whatever";
        
        this.targetPosition = targetPosition;
        this.angle = 0;
        this.inc = 6;
        this.pace = 1;
    }
    
    use() {
        if(this.phase == 0) {
            var vector = Vector.subtraction(this.targetPosition, this.user.getPositionM());
            var norm = vector.getNorm();
            var cos = vector[0] / norm;
            var sin = vector[1] / norm;
            this.angle = Math.atan2(sin, cos);
            
            if(this.angle != this.angle) {
                return this.end();
            }
        }
        
        if(this.phase % this.pace == 0) {
            var projectile = new Projectile(this.user.getPositionM(0), this.user.getPositionM(1), 16, 16);
            projectile.setPositionM(this.user.getPositionM());
            projectile.speed = new Vector(Math.cos(this.angle), Math.sin(this.angle)).normalize(8);
            projectile.setBlacklist(this.user.getBlacklist());
            projectile.setLifespan(20);
            addEntity(projectile);
        }
        
        this.angle += this.inc;
        this.inc += Math.random();
        this.angle %= 2 * Math.PI;
        
        if(!keyList.value(66)) {
            this.end();
        }
        
        return this;
    }
}
