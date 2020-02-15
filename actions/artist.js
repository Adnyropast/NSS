
const AS_ARTIST = set_gather("brushSlash", "paintBomb", "paintSpray");

class PaintDroplet extends WaterDroplet {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(MultiColorTransition.from(CT_RAINBOW).setDuration(24).setStep(irandom(0, 23)));
    }
}

class BrushSlash extends SlashAction {
    constructor() {
        super();
        this.setId("brushSlash");
        
        this.trailDrawable.trailStyle = MultiColorTransition.from(CT_RAINBOW).setDuration(12);
        this.trailDrawable.curveFunction = powt(1/4);
        
        this.hitbox.clearTypeOffenses();
        this.hitbox.setTypeOffense("paint", 1);
    }
    
    transitionsSetup() {
        let direction = this.user.getCursorDirection();
        let angle = direction.getAngle();
        
        this.baseDistanceTransition = new VectorTransition([0], [12], 1, ovalTransition);
        if(Math.floor(Math.random() * 2)) {
            this.baseAngleTransition = new VectorTransition([angle + 3/4*Math.PI], [angle - 3/4*Math.PI]);
        } else {
            this.baseAngleTransition = new VectorTransition([angle - 3/4*Math.PI], [angle + 3/4*Math.PI]);
        }
        // this.bladeAngleTransition = new VectorTransition([3/4*Math.PI], [-3/4*Math.PI]);
        this.bladeAngleTransition = this.baseAngleTransition;
        this.bladeWidthTransition = new VectorTransition([0], [12], 1, ovalTransition);
        
        // this.hitbox.addInteraction(new DragActor(direction.normalized(1)));
        this.hitbox.launchDirection = direction.normalized(3);
        
        return this;
    }
    
    use() {
        super.use();
        
        if(this.phase >= 4 && this.phase <= 8) {
            const count = 6 - Math.abs(5 - this.phase);
            const positionM = this.hitbox.getPositionM();
            const avgsz = rectangle_averageSize(this.hitbox);
            
            entityExplode.initialDistance = avgsz/2;
            entityExplode.randomAngleVariation = 1;
            entityExplode(count, PaintDroplet, positionM, [12, 12], 1)
            .forEach(function(entity) {
                entity.speed.multiply(irandom(2, 16)/8);
            });
            entityExplode.initialDistance = 0;
            entityExplode.randomAngleVariation = 0;
        }
        
        return this;
    }
    
    updateTrailDrawableStyle(detProgress) {
        this.trailDrawable.trailStyle.step = 16 * (1-detProgress) / this.trailDrawable.trailStyle.duration;
        
        return this;
    }
}

AC["brushSlash"] = BrushSlash;

class PaintBombEntity extends Hitbox {
    constructor() {
        super(...arguments);
        
        let avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(makeRegularPolygon(16, avgsz/2)));
        this.drawable.setStyle(MultiColorTransition.from(CT_RAINBOW).setDuration(32));
        this.drawable.initImaginarySize(avgsz);
        
        this.addInteraction(new DragRecipient(0.5));
        this.addInteraction(new ContactVanishRecipient(CVF_OBSTACLE | CVF_CHARACTER));
        this.setTypeOffense("paint", 4);
        this.addInteraction(new BrakeRecipient(0.5));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
    
    oncontactvanish() {
        typeImpacts["paint"](this, this);
        
        return super.onremove();
    }
    
    update() {
        super.update();
        
        if(this.speed.isZero()) {
            removeEntity(this);
        }
        
        return this;
    }
}

class PaintBomb extends BusyAction {
    constructor() {
        super();
        this.setId("paintBomb");
    }
    
    use() {
        if(this.phase == 3) {
            let direction = this.user.getCursorDirection();
            
            let bomb = PaintBombEntity.fromMiddle(Vector.addition(this.user.getPositionM(), direction.normalized(rectangle_averageSize(this.user)/2)), [8, 8]);
            bomb.setSpeed(direction.normalized(4));
            bomb.launchDirection = bomb.speed;
            bomb.shareBlacklist(this.user.getBlacklist());
            
            addEntity(bomb);
        } if(this.phase == 16) {
            this.end();
        }
        
        return this;
    }
}

AC["paintBomb"] = PaintBomb;

class PaintCloud extends Hitbox {
    constructor(position, size) {
        super(...arguments);
        
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(32, 14, 16)));
        let ct = MultiColorTransition.from(CT_RAINBOW).setDuration(64);
        for(let i = 0; i < ct.vectors.length; ++i) {
            ct.vectors[i] = Array.from(ct.vectors[i]);
            ct.vectors[i][3] = 0.375;
        }
        this.drawable.setStyle(ct);
        this.setLifespan(256);
        
        this.drawable.initImaginarySize(rectangle_averageSize(this));
        
        let sizeTransition = new MultiColorTransition([[1, 1], size, size, size, size, [0, 0]], this.lifespan);
        
        this.controllers.add(function() {
            this.setSizeM(sizeTransition.getNext());
        });
        
        this.addInteraction(new BrakeRecipient(1));
        this.findInteractorWithId("damage").setRehit(32);
        this.setTypeOffense("paint", 0.125);
        this.setStats({"stun-timeout": 0});
        
        this.removeAutoHitListeners();
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
    
    onhit(event) {
        const {actor, recipient} = event;
        const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
        
        const currentColorVector = actor.getDrawable().style.getCurrent();
        
        makeShockwave.lineWidth = recipientAvgsz/8;
        const shockwave = makeShockwave(middlePosition, recipientAvgsz/6);
        shockwave.getDrawable().setStyle(new ColorTransition(colorVector_alterAlpha(currentColorVector, +1.0), colorVector_alterAlpha(currentColorVector, -1.0), shockwave.lifespan, powt(1/2)));
        makeShockwave.lineWidth = 1;
    }
}

class PaintSpray extends BusyAction {
    constructor() {
        super();
        this.setId("paintSpray");
    }
    
    use() {
        this.phase %= this.phaseLimit;
        
        if(this.phase % 8 == 0) {
            let direction = this.user.getCursorDirection();
            
            let cloud = PaintCloud.fromMiddle(Vector.addition(this.user.getPositionM(), direction.normalized(rectangle_averageSize(this.user)/2)), [16, 16]);
            cloud.setSpeed(direction.normalized(1));
            cloud.shareBlacklist(this.user.getBlacklist());
            
            addEntity(cloud);
        }
        
        return this;
    }
}

AC["paintSpray"] = PaintSpray;
