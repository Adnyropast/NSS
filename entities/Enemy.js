
const ENETRA_ENEMY = new ColorTransition([0, 255, 255, 1], [255, 0, 255, 1]);

class Enemy extends Character {
    constructor(position, size) {
        super(position, size).setStyle("#7F007F");
        this.setTypeResistance("enemy", 0);
        
        let avgsz = rectangle_averageSize(this);
        
        this.cursor.setSizeM([avgsz * 5, avgsz * 5]);// .setStyle("#FF7FFF5F");
        this.cursor.drawable.setStyle("#7F007F3F");
        this.cursorDistance = 256;
        
        this.resetEnergy(10);
        // this.setRegeneration(0.0625);
        
        this.energyBar.setEnergyTransition(ENETRA_ENEMY);
        
        this.addActset("enemyCharge");
        this.removeActset("crouch");
        
        this.addInteraction(new ThrustActor(0.25));
        
        this.setBattler(EnemyBattler.fromEntity(this));
        
        this.blacklist = OPPONENTS_;
        
        this.controllers.add(enemyController);
        
        this.stats["regeneration"] = 0;
        
        this.items = [];
        
        let count = irandom(1, 4);
        
        for(let i = 0; i < count; ++i) {
            this.items.push(new IC["apple"]());
        }
    }
    
    onadd() {
        OPPONENTS_.add(this);
        this.allies = OPPONENTS_;
        this.opponents = ALLIES_;
        
        return super.onadd();
    }
    
    ondefeat() {
        for(var angle = Math.PI / 2; angle < 2 * Math.PI + Math.PI / 2; angle += Math.PI / 3/2) {
            var cos = Math.cos(angle), sin = Math.sin(angle);
            var particle = EnemyVanishParticle.fromMiddle(this.getPositionM(), this.size);
            particle.setSpeed((new Vector(cos, sin)).normalize(rectangle_averageSize(this)/16+Math.random()));
            // particle.drag(this.speed);
            
            addEntity(particle);
        }
        
        for(let i = 0; i < this.items.length; ++i) {
            let pickableItem = PickableItem.fromMiddle(this.getPositionM(), [8, 8]);
            pickableItem.addItem(this.items[i]);
            
            pickableItem.setSpeed((new Vector(1, 0)).rotate(Math.random() * 2*Math.PI));
            
            addEntity(pickableItem);
        }
        
        return super.ondefeat();
    }
    
    onremove() {
        OPPONENTS_.remove(this);
        
        return super.onremove();
    }
}

EC["enemy"] = Enemy;

class EnemyVanishParticle extends Particle {
    constructor() {
        super(...arguments);
        
        this.setLifespan(64);
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(24, 12, 16)).multiplySize(rectangle_averageSize(this)/16));
        this.setStyle(new ColorTransition([127, 0, 127, 1], [0, 255, 255, 1], 64));
        this.setSizeTransition(new ColorTransition(this.size, [0, 0], 32));
        
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

class EnemyCharge extends BusyAction {
    constructor() {
        super();
        this.setId("enemyCharge");
        
        this.hitbox = new Hitbox([0, 0], [0, 0]);
        this.hitbox.addInteraction(new TypeDamager());
        this.hitbox.addInteraction(new VacuumDragActor(-2));
        this.hitbox.setLifespan(16);
        this.hitbox.addInteraction(new StunActor(8));
        
        this.hitbox.setTypeOffense("enemy", 8);
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

EC["dummy"] = class Dummy extends Character {
    constructor() {
        super(...arguments);
        
        this.resetEnergy(1024);
        
        this.setStyle("#7F3F00");
        this.addInteraction(new DragRecipient(1));
        // this.addActset("regeneration");
        // this.addAction(new Regeneration(0.125));
        this.stats["regeneration"] = 0.125;
    }
    
    onadd() {
        OPPONENTS_.add(this);
        this.allies = OPPONENTS_;
        this.opponents = ALLIES_;
        
        return super.onadd();
    }
    
    onremove() {
        OPPONENTS_.remove(this);
        
        return super.onremove();
    }
};

class SniperProjectile extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle("#7F007F");
        
        this.addInteraction(new TypeDamageable());
        
        this.addInteraction(new TypeDamager());
        this.setTypeOffense("enemy", 4);
    }
}

class EnemySnipe extends BusyAction {
    constructor() {
        super();
        this.setId("enemySnipe");
    }
    
    use() {
        if(this.phase == 12) {
            let direction = this.user.getCursorDirection();
            
            let hitbox = SniperProjectile.fromMiddle(direction.normalized(rectangle_averageSize(this.user)/2).plus(this.user.getPositionM()), [8, 8]);
            
            hitbox.shareBlacklist(this.user.getBlacklist());
            hitbox.setSpeed(direction.normalized(4));
            hitbox.addInteraction(new ReplaceRecipient());
            hitbox.setLifespan(32);
            hitbox.addInteraction(new ContactVanishRecipient(1));
            
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
        
        this.addActset("enemySnipe");
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
            
            // if(this.hasState("grounded") && worldCounter % 16 == 0) this.removeActionsWithConstructor(Jump);
            
            if(this.cursor.target != null) {
                this.addAction(new PositionCursorTarget());
                
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

EC["sniperEnemy"] = SniperEnemy;
