
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
        
        this.energyBar.setEnergyTransition(ENETRA_ENEMY);
        
        this.addInteraction(new TypeDamageable([{"type" : "enemy", "factor" : 0}]));
        
        this.addActset("entityCharge");
        this.removeActset("crouch");
        
        this.addInteraction(new ThrustActor(0.25));
        
        this.setBattler(EnemyBattler.fromEntity(this));
        
        this.blacklist = OPPONENTS_;
        
        this.controllers.add(enemyController);
        
        this.stats["regeneration"] = 0;
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
            particle.setSpeed((new Vector(cos, sin)).normalize(rectangle_averagesize(this)/16+Math.random()));
            // particle.drag(this.speed);
            
            addEntity(particle);
        }
        
        return this;
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
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(24, 12, 16)).multiplySize(rectangle_averagesize(this)/16));
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

EC["dummy"] = class Dummy extends Character {
    constructor() {
        super(...arguments);
        
        this.resetEnergy(1024);
        
        this.setStyle("#7F3F00");
        this.addInteraction(new DragRecipient(0));
        this.addInteraction(new TypeDamageable({"default" : 0}));
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
