
const ENETRA_ENEMY = new ColorTransition([0, 255, 255, 1], [255, 0, 255, 1]);

class Enemy extends Character {
    constructor(position, size) {
        super(position, size).setStyle("#7F007F");
        // this.setEffectFactor("default", 1);
        // this.setEffectFactor("enemy", 0);
        // this.setOffense("enemy", 1);
        
        this.cursor.setSizeM([256, 256]);// .setStyle("#FF7FFF5F");
        
        this.cursorDistance = 256;
        
        this.resetEnergy(10);
        // this.setRegeneration(0.0625);
        
        this.energyBar.setEnergyTransition(ENETRA_ENEMY).setWidth(this.getWidth()).setHeight(12/36*this.getWidth()).setBorderWidth(4*this.getWidth()/36);
        
        this.addInteraction(new TypeDamageable([{"type" : "enemy", "factor" : 0}]));
        
        this.addActset("entityCharge");
        this.removeActset("crouch");
        
        this.addInteraction(new ThrustActor(0.25));
        
        this.setBattler(EnemyBattler.fromEntity(this));
        
        this.blacklist = OPPONENTS_;
        
        this.controller = enemyController;
    }
    
    onadd() {
        OPPONENTS_.add(this);
        this.allies = OPPONENTS_;
        this.opponents = ALLIES_;
        
        return super.onadd();
    }
    
    onremove() {
        for(var angle = Math.PI / 2; angle < 2 * Math.PI + Math.PI / 2; angle += Math.PI / 3) {
            var cos = Math.cos(angle), sin = Math.sin(angle);
            var particle = EnemyVanishParticle.fromMiddle(this.getPositionM(), this.size);
            particle.setSpeed([4*cos, 4*sin]);
            particle.drag(this.speed);
            
            addEntity(particle);
        }
        
        var particle = EnemyVanishParticle.fromMiddle(this.getPositionM(), this.size);
        particle.drag(this.speed);
        
        addEntity(particle);
        
        OPPONENTS_.remove(this);
        
        return super.onremove();
    }
}

EC["enemy"] = Enemy;

class EnemyVanishParticle extends Particle {
    constructor() {
        super(...arguments);
        
        this.setLifespan(512);
        this.setStyle(new ColorTransition([127, 0, 127, 1], [0, 255, 255, 1], 32));
        this.setSizeTransition(new ColorTransition(this.size, [0, 0], 32));
        
        this.collidable = true;
        this.addInteraction(new DragRecipient());
        this.addInteraction(new ReplaceRecipient());
    }
}

EC["dummy"] = class Dummy extends Character {
    constructor() {
        super(...arguments);
        
        this.resetEnergy(1024);
        
        this.setStyle("#7F3F00");
        this.addInteraction(new DragRecipient(0));
        this.addInteraction(new TypeDamageable({"default" : 0}));
        this.addActset("regeneration");
        this.addAction(new Regeneration(0.125));
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
