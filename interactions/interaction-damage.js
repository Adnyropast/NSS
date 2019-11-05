
/**
 *
 */

class TypeDamager extends Interactor {
    constructor() {
        super();
        this.setId("damage");
        
        this.value = 0;
        this.values = {};
        this.hit = new SetArray();
        this.rehit = -1;
    }
    
    interact(interrecipient) {
        var actor = this.getActor();
        var recipient = interrecipient.getRecipient();
        
        if(!this.hit.includes(interrecipient)) {
            let offenses = actor.offenses;
            
            for(let type in offenses) {
                let negotiatedDamage = interrecipient.negotiateDamage(type, offenses[type]);
                
                recipient.hurt(negotiatedDamage);
                
                let impact = typeImpacts[type];
                
                if(typeof impact === "function") {
                    impact(actor, recipient);
                }
            }
            
            actor.onhit(recipient);
            recipient.onhurt(actor);
            
            this.hit.add(interrecipient);
            
            let hit = this.hit;
            
            if(this.rehit > 0) {
                setGameTimeout(function() {
                    hit.splice(0, hit.length);
                }, this.rehit);
            }
            
            /**
            worldFreeze = 3;
            setGameTimeout(function() {
                worldFreeze = 2;
            }, 1);/**/
            
            /**
            
            let ts;
            
            if(ts = CAMERA.findActionWithId("transitionSize")) {
                CAMERA.setSizeM(ts.sizeTransition.vector2);
            }
            
            CAMERA.removeActionsWithId("transitionSize");
            
            CAMERA.addAction(new TransitionSize(new ColorTransition(Vector.subtraction(CAMERA.getSize(), [2 * totalDamage, 2 * totalDamage, 0]), CAMERA.getSize(), 12, function timing(t) {
                let sign = (t * 5) % 2 == 0 ? -1 : 1;
                let val = 1 - t;
                
                return 1 + sign * val;
            })));
            
            /**
            
            let saveReplaceRecipient = CAMERA.findInterrecipientWithId("cameraReplace");
            CAMERA.removeInterrecipientWithId("cameraReplace")
            
            let vector = new Vector(0, 1);
            vector.rotate(Math.random() * 2*Math.PI);
            
            let norm = Math.pow(Math.floor(negotiatedDamage), 1/16) / 128;
            
            vector.normalize(norm);
            
            let index = CAMERA.controllers.length;
            let timeout = 16; Math.min(negotiatedDamage * 2, 16);
            
            let c = 0;
            
            let positionM = CAMERA.getPositionM();
            
            let f = function() {
                vector.divide(-2);
                
                this.setPositionM(vector.plus(positionM));
                
                
                ++c;
                
                if(timeout > 0) {
                    --timeout;
                    
                    for(let dim = 0; dim < vector.length; ++dim) {
                        if(!isAlmostZero(vector[dim])) {
                            return;
                        }
                    }
                }
                
                this.controllers.remove(f);
                this.addInteraction(saveReplaceRecipient);
            };
            
            CAMERA.controllers.add(f);
            
            /**/
            
            let entities = [];
            
            entities.push.apply(entities, actor.getBlacklist());
            entities.push.apply(entities, recipient.getBlacklist());
            
            for(let i = 0; i < entities.length; ++i) {
                const entity = entities[i];
                
                // entity.setFreeze(2);
            }
            
            let recipients = recipient.getBlacklist();
            
            for(let i = 0; i < recipients.length; ++i) {
                const entity = recipients[i];
                
                let state = entity.findState("originalPositionM");
                
                if(state === undefined) {
                    state = {name:"originalPositionM", value:entity.getPositionM(), count:1};
                    entity.addStateObject(state);
                } else {
                    ++state.count;
                }
                
                let positionM = state.value;
                
                let avgsz = rectangle_averageSize(entity);
                
                entity.setPositionM(Vector.addition(positionM, (new Vector(Math.random(), Math.random())).normalize(avgsz/16)));
                
                setGameTimeout(function() {
                    entity.setPositionM(Vector.addition(positionM, (new Vector(Math.random(), Math.random())).normalize(avgsz/32)));
                    
                    setGameTimeout(function() {
                        entity.setPositionM(positionM);
                        --state.count;
                        
                        if(state.count <= 0) {
                            entity.removeState("originalPositionM");
                        }
                    }, 1);
                }, 1);
            }
        } else {/**
            ++interrecipient.rehitTimer;
            
            if(interrecipient.rehitTimer == this.rehit) {
                interrecipient.rehitTimer = 0;
                this.hit.remove(interrecipient);
            }**/
        }
        
        return this;
    }
    
    setRehit(rehit) {this.rehit = rehit; return this;}
    
    onhit(interrecipient) {return this;}
}

class TypeDamageable extends Interrecipient {
    constructor() {
        super();
        this.setId("damage");
        
        this.factor = 1;
        this.factors = {};
        this.rehitTimer = 0;
    }
    
    negotiateDamage(type, damage) {
        const recipient = this.getRecipient();
        const resistance = (recipient.resistances.hasOwnProperty(type))
            ? recipient.resistances[type]
            : recipient.resistances["default"]
        ;
        
        if(typeof resistance === "number") {
            return resistance * damage;
        } if(typeof resistance === "function") {
            return resistance(damage);
        }
        
        return 0;
    }
    
    setRecipient(recipient) {
        super.setRecipient(recipient);
        
        if(!recipient.resistances.hasOwnProperty("default")) {
            recipient.setTypeResistance("default", 1);
        }
        
        return this;
    }
}

/**
 *
 */

class StunActor extends Interactor {
    constructor(timeout = 16) {
        super();
        this.setId("stun");
        this.timeout = timeout;
    }
    
    interact(interrecipient) {
        let negotiatedTimeout = interrecipient.negotiateTimeout(this.timeout);
        
        if(negotiatedTimeout > 0) {
            interrecipient.getRecipient().addAction(new StunState(negotiatedTimeout));
        }
        
        return this;
    }
}

class StunRecipient extends Interrecipient {
    constructor(factor = 1) {
        super();
        this.setId("stun");
        this.factor = factor;
    }
    
    negotiateTimeout(timeout) {return timeout * this.factor;}
}

const typeImpacts = {};

class OvalWaveParticle extends Entity {
    constructor() {
        super(...arguments);
        
        let avgsz = rectangle_averageSize(this);
        
        this.setDrawable(new PolygonDrawable(makePathPolygon(makeOvalPath(32, 64, 64))));
        this.setLifespan(24);
        this.drawable.setStyle(new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0], this.lifespan));
        this.drawable.rotate(Math.random() * 2*Math.PI);
        this.drawable.multiplySize(avgsz/64);
        this.drawable.initImaginarySize(avgsz);
        
        this.setSizeTransition(new VectorTransition(Array.from(this.size), Vector.multiplication(this.size, 4), this.lifespan, powt(1/2)));
        this.setSelfBrake(1.0625);
    }
    
    updateDrawable() {
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        if(Vector.normOf(this.direction) > 0) {
            this.drawable.setImaginaryAngle(0);
            this.drawable.stretchM(this.direction);
            this.drawable.setImaginaryAngle(this.speed.getAngle());
        }
        
        return this;
    }
}

typeImpacts[FX_SHARP] = function onimpact(actor, recipient) {
    const bothAvgsz = (actor.getWidth() + actor.getHeight() + recipient.getWidth() + recipient.getHeight()) / 4;
    const actorPositionM = actor.getPositionM();
    const recipientPositionM = recipient.getPositionM();
    const middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    const recipientAvgsz = rectangle_averageSize(recipient);
    
    addDrawable(new CutDrawable(middlePosition, [Math.random() * 2- 1, Math.random() * 2 - 1]).multiplySize(bothAvgsz/16));
    
    let c = 5;// irandom(4, 8);
    
    for(let i = 0; i < c; ++i) {
        let angle = i * 2*Math.PI/c;
        
        let particle = DiamondParticle.fromMiddle(middlePosition, [bothAvgsz/16, bothAvgsz/16]);
        particle.setZIndex(random(-3, +1));
        
        particle.setSpeed((new Vector(irandom(bothAvgsz/12, bothAvgsz/8), 0)).rotate(angle + Math.random()));
        
        addEntity(particle);
    }
    
    /**
    
    c = 4;
    let startAngle = 0, endAngle = 0;
    let multiCrescent = new MultiPolygonDrawable();
    
    for(let i = 0; i < c; ++i) {
        endAngle += 2*Math.PI/c;
        
        let angleTransition = new VectorTransition([startAngle], [endAngle]);
        
        let drawable = PolygonDrawable.from(makeCrescentPolygon(16, angleTransition, new MultiColorTransition([[16], [17], [16]], 1, function(t) {return powt(1)(t);}), new MultiColorTransition([[16], [16], [16]], 1, function(t) {return powt(1)(t);})));
        
        drawable.setStyle(new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0], 16));
        
        // addDrawable(drawable);
        multiCrescent.push(drawable);
        
        startAngle += 2*Math.PI/c;
    }
    
    multiCrescent.setLifespan(16);
    multiCrescent.rotate(Math.random() * 2*Math.PI/c);
    multiCrescent.setPositionM(recipient.getPositionM());
    
    multiCrescent.multiplySize(recipientAvgsz/64);
    multiCrescent.initImaginarySize(recipientAvgsz);
    
    let cST = new VectorTransition([recipientAvgsz], [recipientAvgsz*4], 16);
    
    multiCrescent.controllers.add(function() {
        this.setImaginarySize(cST.getNext()[0]);
    });
    
    addDrawable(multiCrescent);
    
    /**/
    
    let roundWave = OvalWaveParticle.fromMiddle(middlePosition, [recipientAvgsz/4, recipientAvgsz/4]);
    
    addEntity(roundWave);
};

typeImpacts[FX_GOLD_] = function onimpact(actor, recipient) {
    const bothAvgsz = (actor.getWidth() + actor.getHeight() + recipient.getWidth() + recipient.getHeight()) / 4;
    const actorPositionM = actor.getPositionM();
    const recipientPositionM = recipient.getPositionM();
    const middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    let count = irandom(7, 9);
    
    for(let i = 0; i < count; ++i) {
        var particle = GoldSmokeParticle.fromMiddle(middlePosition, [bothAvgsz/1.5, bothAvgsz/1.5]);
        
        let direction = getDD(actor.locate(recipient))[0];
        let vector = actor.speed.normalized();
        vector[direction.dimension] += direction.sign;
        particle.setSpeed(vector.rotate(irandom(-1, 1)/8).normalize(Math.random() * (bothAvgsz / 8)));
        
        // addEntity(particle);
    }
    
    for(let i = 0; i < count; ++i) {
        let angle = i * 2*Math.PI/count;
        
        let particle = GoldSmokeParticle.fromMiddle(actorPositionM, [bothAvgsz, bothAvgsz]);
        
        let direction = Vector.fromAngle(angle);
        
        particle.setSpeed(direction.normalized(irandom(bothAvgsz/12, bothAvgsz/8)).rotate(0));
        
        addEntity(particle);
    }
    
    let crownCT = new ColorTransition([0, 255, 255, 1], [191, 255, 255, 0.5], 12);
    let colorTransition = new ColorTransition([0, 255, 255, 1], [0, 91, 255, 0.875], 8, powt(1/2));
    
    crownImpact(actor, recipient, crownCT.copy());
    crownImpact(actor, recipient, crownCT.copy());
    burstImpact(actor, recipient, colorTransition.copy());
    
    setGameTimeout(function() {
        crownImpact(actor, recipient, crownCT.copy());
        crownImpact(actor, recipient, crownCT.copy());
        burstImpact(actor, recipient, colorTransition.copy());
        burstImpact(actor, recipient, colorTransition.copy());
    }, 6);
};

typeImpacts[FX_FIRE] = function onimpact(actor, recipient) {
    const bothAvgsz = (actor.getWidth() + actor.getHeight() + recipient.getWidth() + recipient.getHeight()) / 4;
    const actorPositionM = actor.getPositionM();
    const recipientPositionM = recipient.getPositionM();
    const middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    /**
    
    let particle = FireParticle.fromMiddle(recipient.getPositionM(), recipient.getSize());
    particle.drawable.multiplySize((recipient.getWidth() + recipient.getHeight())/2/16);
    particle.drawable.setZIndex(Math.random() - 0.25);
    particle.setSpeed([Math.random(), Math.random()]);
    
    addEntity(particle);
    
    let avgsz = rectangle_averageSize(recipient);
    
    let radialGradient = RectangleDrawable.fromMiddle(recipient.getPositionM(), [avgsz, avgsz]);
    radialGradient.setStyle(makeRadialGradientCanvas("#FFFF00FF", "#FF000000"));
    radialGradient.setLifespan(12);
    
    let sizeTransition = new ColorTransition(radialGradient.size, Vector.multiplication(radialGradient.size, 1.5), radialGradient.lifespan);
    
    radialGradient.controllers.add(function() {
        this.setSizeM(sizeTransition.getNext());
    });
    
    addDrawable(radialGradient);
    
    /**/
    
    let count = 1;
    
    for(let i = 0; i < count; ++i) {
        let particle = FireParticle.fromMiddle(Vector.addition(actorPositionM, (new Vector(Math.random(), Math.random())).normalize(8)), [16, 16]);
        
        addEntity(particle);
    }
    
    count = 5;
    
    for(let i = 0; i < count; ++i) {
        let angle = (i+Math.random())/count * 2*Math.PI;
        
        let particle = FireSmokeParticle.fromMiddle(middlePosition, [bothAvgsz/2, bothAvgsz/2]);
        
        particle.setSpeed(Vector.fromAngle(angle).normalize(bothAvgsz/16));
        
        addEntity(particle);
    }
    
    
};

typeImpacts[FX_ELECTRIC] = function onimpact(actor, recipient) {
    const bothAvgsz = (actor.getWidth() + actor.getHeight() + recipient.getWidth() + recipient.getHeight()) / 4;
    const actorPositionM = actor.getPositionM();
    const recipientPositionM = recipient.getPositionM();
    const middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    let count = 3;
    
    for(let i = 0; i < count; ++i) {
        let angle = i/count * 2*Math.PI + 2*(Math.random() - 0.5);
        
        let lightning = new LightningDrawable(recipient.getPositionM(), Vector.addition(recipient.getPositionM(), [bothAvgsz * Math.cos(angle), bothAvgsz * Math.sin(angle)]));
        
        addDrawable(lightning);
    }
    
    let burstDrawable = PolygonDrawable.from(makeBurstPolygon2(new ColorTransition([2], [4], 16, Math.random), new ColorTransition([0], [20], 16, Math.random), 4));
    burstDrawable.setPositionM(recipient.getPositionM());
    burstDrawable.setLifespan(8);
    burstDrawable.setStyle(new ColorTransition([0, 255, 255, 1], [255, 0, 255, 0], burstDrawable.lifespan, function(t) {return Math.pow(t, 5);}));
    
    let avgsz = rectangle_averageSize(recipient);
    
    burstDrawable.multiplySize(avgsz/24);
    let imgsizeTransition = new ColorTransition([avgsz], [2*avgsz], 16, function(t) {return Math.pow(t, 1);});
    burstDrawable.initImaginarySize(imgsizeTransition.at(0)[0]);
    
    burstDrawable.controllers.add(function() {
        this.setImaginarySize(imgsizeTransition.getNext()[0]);
    });
    
    addDrawable(burstDrawable);
    
    let radialGradient = RectangleDrawable.fromMiddle(recipient.getPositionM(), [avgsz, avgsz]);
    radialGradient.setStyle(makeRadialGradientCanvas("#00FFFF1F", "#00FFFF00"));
    let sizeTransition = new ColorTransition(radialGradient.size, Vector.multiplication(radialGradient.size, 2.5));
    
    radialGradient.controllers.add(function() {
        this.setSizeM(sizeTransition.getNext());
    });
    
    radialGradient.setLifespan(12);
    
    addDrawable(radialGradient);
};

typeImpacts["paint"] = function(actor, recipient) {
    let count = 12;
    let actorPositionM = actor.getPositionM();
    let recipientPositionM = recipient.getPositionM();
    let avgsz = 16; rectangle_averageSize(actor);
    let middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    for(let i = 0; i < count; ++i) {
        let angle = ((i+Math.random())/count) * 2*Math.PI;
        let direction = Vector.fromAngle(angle);
        
        let particle = PaintDroplet.fromMiddle(direction.normalized(avgsz/8).add(middlePosition), [avgsz, avgsz]);
        particle.setSpeed(direction.normalized(irandom(2, avgsz)/8));
        
        addEntity(particle);
    }
};

typeImpacts[FX_HEART_] = function(actor, recipient) {
    let actorPositionM = actor.getPositionM();
    let recipientPositionM = recipient.getPositionM();
    let middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    let drawable = (new PolygonDrawable(makePathPolygon(makeSpiralPath(0, 4*Math.PI, 0, 32, 32)))).setStyle(new ColorTransition([0, 63, 255, 1], [0, 63, 255, 0], 16, powt(4)));
    
    drawable.setLifespan(16);
    drawable.setPositionM(middlePosition);
    drawable.multiplySize(1/32);
    drawable.rotate(Math.random() * 2*Math.PI);
    
    let sizeTransition = new VectorTransition([1], [32], 16, powt(1/2));
    
    drawable.controllers.add(function() {
        this.setImaginarySize(sizeTransition.getNext()[0]);
        this.rotate(Math.PI/32);
    });
    
    addDrawable(drawable);
    
    let count = irandom(8, 12);
    
    for(let i = 0; i < count; ++i) {
        let angle = ((i+Math.random())/count) * 2*Math.PI;
        let direction = Vector.fromAngle(angle);
        let sz = irandom(8, 12);
        
        let particle = PaintDroplet.fromMiddle(middlePosition, [sz, sz]);
        particle.setStyle(new ColorTransition([0, 63, 255, 1], [0, 63, 255, 0], 16, powt(8)));
        particle.setSpeed(direction.normalized(irandom(1, 4)));
        
        addEntity(particle);
    }
};

class BluntCrownParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.drawable = PolygonDrawable.from(makeSpikePolygon(4, new VectorTransition([-Math.PI/5], [+Math.PI/5]), function() {return irandom(12, 24)}, function() {return irandom(32, 48)}, 16));
        
        // crownParticle.multiplySize(1/16);
        
        this.setLifespan(10);
        
        this.drawable.setZIndex(-Math.random()*16+15);
        
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(this.size, 1/2), Vector.from(this.size), Vector.multiplication(this.size, 1/2)], this.lifespan));
        
        this.setSelfBrake(1.125);
    }
    
    updateDrawable() {
        const drawable = this.getDrawable();
        
        let angle = drawable.imaginaryAngle;
        
        drawable.setImaginaryAngle(0);
        
        drawable.stretchM([0, 0.5]);
        drawable.setImaginarySize(rectangle_averageSize(this));
        drawable.setPositionM(this.getPositionM());
        
        drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
}

class BluntOvalParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(16);
        
        let avgsz = rectangle_averageSize(this);
        
        this.drawables[0] = PolygonDrawable.from(roundparticle);
        this.drawables[0]
        .multiplySize(avgsz/16)
        .stretchM([16, 0])
        .initImaginarySize(avgsz);
        
        this.setSelfBrake(1.0625);
    }
    
    updateDrawable() {
        let drawable = this.drawables[0];
        let angle = this.getDrawable().imaginaryAngle;
        
        if(this.lifeCounter < 16) {
            drawable.setImaginaryAngle(0);
            drawable.shrinkM([-1, 0]);
        }
        
        drawable.setImaginaryAngle(this.speed.getAngle());
        
        drawable.setPositionM(this.getPositionM());
        drawable.setImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
}

typeImpacts[FX_BLUNT] = function onimpact(actor, recipient) {
    crownImpact(...arguments);
    burstImpact(...arguments);
};

function crownImpact(actor, recipient, style = "white") {
    let actorPositionM = actor.getPositionM();
    let recipientPositionM = recipient.getPositionM();
    let middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    const recipientAvgsz = rectangle_averageSize(recipient);
    
    let direction = Vector.subtraction(recipientPositionM, actorPositionM).rotate(Math.random() * 2*Math.PI);
    
    let size = Math.max(1, recipientAvgsz/32);
    let crownParticle = BluntCrownParticle.fromMiddle(middlePosition, [size, size]);
    
    crownParticle.drawable.setStyle(style);
    
    crownParticle.setSpeed(direction.normalized(Math.max(6, recipientAvgsz/5)));
    
    addEntity(crownParticle);
}

function burstImpact(actor, recipient, style = "white") {
    let actorPositionM = actor.getPositionM();
    let recipientPositionM = recipient.getPositionM();
    let middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    const recipientAvgsz = rectangle_averageSize(recipient);
    
    let size = Math.max(1, recipientAvgsz/32);
    
    let count = 2;
    
    for(let i = 0; i < count; ++i) {
        let angle = ((i + Math.random()*2 - 1)/count) * 2*Math.PI;
        let direction = Vector.fromAngle(angle);
        
        let particle = BluntOvalParticle.fromMiddle(Vector.addition(middlePosition, direction.normalized(recipientAvgsz/3)), [size, size]);
        particle.drawables[0].setStyle(style);
        particle.setSpeed(direction.normalized(4));
        
        addEntity(particle);
    }
}
