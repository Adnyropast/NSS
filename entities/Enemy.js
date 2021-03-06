
class Enemy extends Character {
    constructor(position, size) {
        super(position, size).setStyle("#7F007F");
        this.setTypeResistance(FX_PURPLE_, 0);
        
        let avgsz = rectangle_averageSize(this);
        
        this.cursor.setSizeM([avgsz * 5, avgsz * 5]);// .setStyle("#FF7FFF5F");
        this.cursor.drawable.setStyle("#7F007F3F");
        this.cursorDistance = 256;
        
        this.energyBar.setEnergyTransition(ENETRA_ENEMY);
        
        this.addInteraction(new ThrustActor(0.25));
        
        this.setBattler(EnemyBattler.fromEntity(this));
        
        this.blacklist = OPPONENTS_;
        
        this.controllers.add(enemyController);
        
        this.setStats({
            "energy.real": 10,
            "energy.effective": 10,
            "regeneration": 0.0625,
            "regeneration": 0,
            "walk-speed-tired.effective": 0.25,
            "walk-speed.real": 0.25,
            "walk-speed.effective": 0.25,
            "swim-speed-tired.effective": 0.25,
            "swim-speed.effective": 0.25,
            "air-speed-tired.effective": 0.25,
            "air-speed.effective": 0.25
        });
        
        this.resetEnergy();
        
        this.items = [];
        
        this.setEventListener("defeat", "vanish", function() {
            const positionM = this.getPositionM();
            const size = this.size;
            
            makeBurstEffect(EnemyVanishParticle2, positionM, size, this.speed);
            
            entityExplode(12, EnemyVanishParticle, positionM, size, 6);
        });
        
        this.actionParams["EnemyCharge"] = {};
        this.actionParams["EnemySnipe"] = {};
    }
    
    onadd() {
        OPPONENTS_.add(this);
        this.allies = OPPONENTS_;
        this.opponents = ALLIES_;
        
        return super.onadd();
    }
    
    ondefeat() {
        dropItems(this.getPositionM(), this.items);
        
        return this;
    }
    
    onremove() {
        OPPONENTS_.remove(this);
        
        return super.onremove();
    }
}

class EnemyVanishParticle extends Particle {
    constructor() {
        super(...arguments);
        
        this.setLifespan(64);
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(24, 12, 16)).multiplySize(rectangle_averageSize(this)/16));
        this.setStyle(new ColorTransition([127, 0, 127, 1], [0, 255, 255, 1], 64));
        this.setSizeTransition(new VectorTransition(this.size, [0, 0], 32));
        
        this.collidable = true;
        this.addInteraction(new DragRecipient(0.5));
        this.addInteraction(new ReplaceRecipient());
        this.setSelfBrake(1.0625);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(1/1.0625);
        
        return super.updateDrawable();
    }
}

class EnemyVanishParticle2 extends CharacterVanishParticle {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(new ColorTransition([255, 0, 255, 1], [0, 255, 255, 1], this.lifespan));
        this.drawable.setStrokeStyle(new ColorTransition([223, 0, 223, 1], [0, 223, 223, 1], this.lifespan));
    }
}

class EnemyCharge extends BusyAction {
    constructor() {
        super();
        
        this.hitbox = new Hitbox([0, 0], [0, 0]);
        this.hitbox.addInteraction(new VacuumDragActor(-2));
        this.hitbox.setLifespan(16);
        this.hitbox.setStats({"stun-timeout": 8});
        
        this.hitbox.setTypeOffense(FX_PURPLE_, 8);
    }
    
    use() {
        if(this.phase == 0) {
            this.hitbox.size = this.user.size;
            this.hitbox.position = this.user.position;
            this.hitbox.shareBlacklist(this.user.getBlacklist());
            addEntity(this.hitbox);
            
            let thrust = this.user.findState("thrust");
            
            if(typeof thrust == "undefined") {thrust = 0;}
            else {thrust = thrust.value;}
            
            this.user.drag(this.user.getCursorDirection().normalize(thrust * 16));
            
            this.setRemovable(false);
        } else if(this.phase == 16) {
            removeEntity(this.hitbox);
        } else if(this.phase == 32) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
    
    onend() {
        removeEntity(this.hitbox);
        
        return super.onend();
    }
}

class SniperProjectile extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle("#7F007F");
        
        this.addInteraction(new TypeDamageable());
        
        this.setTypeOffense(FX_PURPLE_, 4);
        this.addInteraction(new ReplaceRecipient());
        this.setLifespan(32);
        this.addInteraction(new ContactVanishRecipient(CVF_OBSTACLE));
    }
    
    oncontactvanish() {
        entityExplode(8, Entity, this.getPositionM(), this.size, 2)
        .forEach(function(entity) {
            entity.setLifespan(32);
            entity.setSelfBrake(1.0625);
            entity.getDrawable().setStyle(new ColorTransition([127, 0, 127, 1], [0, 0, 0, 0.5], entity.lifespan));
        });
        
        return this;
    }
}

class EnemySnipe extends BusyAction {
    constructor() {
        super();
    }
    
    use() {
        if(this.phase == 12) {
            let direction = this.user.getCursorDirection();
            
            let hitbox = SniperProjectile.fromMiddle(direction.normalized(rectangle_averageSize(this.user)/2).plus(this.user.getPositionM()), [8, 8]);
            
            hitbox.shareBlacklist(this.user.getBlacklist());
            hitbox.setSpeed(direction.normalized(4));
            
            addEntity(hitbox);
        } if(this.phase == 64) {
            this.end();
        }
        
        return this;
    }
}

class SniperEnemy extends Enemy {
    constructor() {
        super(...arguments);
        
        this.controllers.clear().add(function() {
            var targets = [];
            
            for(var i = 0; i < this.cursor.collidedWith.length; ++i) {
                if(this.opponents.includes(this.cursor.collidedWith[i])) {
                    targets.push(this.cursor.collidedWith[i]);
                }
            }
            
            var positionM = this.getPositionM();
            
            this.cursor.target = null;
            var max = this.cursorDistance;
            
            for(var i = 0; i < targets.length; ++i) {
                var distance = Vector.distance(targets[i].getPositionM(), positionM);
                
                if(distance < max) {
                    max = distance;
                    this.cursor.target = targets[i];
                }
            }
            
            if(this.cursor.target != null) {
                // this.route = this.cursor.getPositionM();
                // this.addAction(new Movement());
                // this.addAction(new EnemyCharge());
                this.addAction(new EnemySnipe());
                
                // if(this.cursor.target.getY2() < this.getY()) {
                    // let jump = new Jump();
                    // jump.initialForce = 1;
                    
                    // this.addAction(jump);
                // }
            } else {
                this.cursor.setPositionM(this.getPositionM());
                // this.route = null;
                // this.removeActionsWithConstructor(Movement);
            }
        });
    }
}
