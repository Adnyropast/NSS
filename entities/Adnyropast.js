
class Adnyropast extends PlayableCharacter {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setRegeneration(0.0625);
        
        this.groundCheck = false;
        this.gravityDirection = new Vector(0, 0);
        
        this.cursorDistance = 32;
        
        this.backSmoke = new BackSmoke();
    }
    
    oncollision(other) {
        super.oncollision(other);
        
        if(other instanceof Obstacle) {
            this.groundCheck = true;
        }
        
        this.gravityDirection.add(other.force);
        
        return this;
    }
    
    update() {
        this.setStyle("rgb(255, " + (this.energy / this.realEnergy * 255) + ", 0)");
        
        if(keyList.value(80) == 1) {
            this.addAction(new ProjectileShot(this.cursor.getPositionM()));
        }
        
        if(mouse.value(1) == 1 || keyList.value(13) == 1) {
            // this.addAction(new TargetAttack(this.cursor.getPositionM()));
        } if(mouse.value(1) || keyList.value(13)) {
            this.addAction(new Movement(1));
        }
        
        this.direction.fill(0);
        
        if(keyList.value(LEFT)) {
            this.direction.add(0, -1);
        } if(keyList.value(UP)) {
            this.direction.add(1, -1);
        } if(keyList.value(RIGHT)) {
            this.direction.add(0, +1);
        } if(keyList.value(DOWN)) {
            this.direction.add(1, +1);
        }
        
        if(keyList.value(107)) {
            ++this.cursorDistance;
        } if(keyList.value(109)) {
            --this.cursorDistance;
        }
        
        this.direction.normalize();
        
        if(!this.direction.isZero()) {
            this.cursor.setPositionM(this.direction.times(this.cursorDistance).add(this.getPositionM()));
        }
        
        if(keyList.value(LEFT) || keyList.value(UP) || keyList.value(RIGHT) || keyList.value(DOWN)) {
            if(this.groundCheck) {
                this.addAction(new Movement(1.125));
            } else {
                this.addAction(new Movement(0.125));
            }
        }
        
        if(keyList.value(32) == 1 && this.groundCheck) {
            // this.drag(Vector.from(this.gravityDirection).normalize(-16));
            this.addAction(new Jump());
        }
        
        if(keyList.value(K_DIRECTION) || keyList.value(K_JUMP)) {
            // this.addAction(this.backSmoke);
        }
        
        if(keyList.value(84) == 1) {
            this.addAction(new Teleportation(this.cursor.getPositionM(), 20, 20));
        }
        
        if(keyList.value(66) == 1) {
            this.addAction(new BlowoutShots(this.cursor.getPositionM()));
        }
        
        super.update();
        
        this.groundCheck = false;
        this.gravityDirection.fill(0);
        
        return this;
    }
}
