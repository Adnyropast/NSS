
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
            
            // console.log(entities);
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
    
    oninteraction(interactor) {
        let actor = interactor.getActor();
        let recipient = this.getRecipient();
        
        if(recipient == PLAYER) {++hitsCount;}
        
        return this;
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
    constructor(timeout = 24) {
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

typeImpacts[FX_SHARP] = function onimpact(actor, recipient) {
    const bothAvgsz = (actor.getWidth() + actor.getHeight() + recipient.getWidth() + recipient.getHeight()) / 4;
    const actorPositionM = actor.getPositionM();
    const recipientPositionM = recipient.getPositionM();
    const middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    addDrawable(new CutDrawable(middlePosition, [Math.random() * 2- 1, Math.random() * 2 - 1]).multiplySize(bothAvgsz/16));
    
    let c = irandom(4, 8);
    
    for(let i = 0; i < c; ++i) {
        let angle = i * 2*Math.PI/c;
        
        let particle = DiamondParticle.fromMiddle(middlePosition, [0, 0]);
        
        particle.setSpeed((new Vector(irandom(bothAvgsz/12, bothAvgsz/8), 0)).rotate(angle + Math.random()));
        particle.getDrawable().rotate(particle.speed.getAngle()).multiplySize(bothAvgsz/16);
        
        addEntity(particle);
    }
    
    // 
    
    c = 3;
    let startAngle = 0, endAngle = 0;
    let multiCrescent = new MultiPolygonDrawable();
    
    for(let i = 0; i < c; ++i) {
        endAngle += 2*Math.PI/c;
        
        let angleTransition = new VectorTransition([startAngle], [endAngle]);
        
        let drawable = PolygonDrawable.from(makeCrescentPolygon(16, angleTransition, new VectorTransition([18], [16], 1, function(t) {return ovalTransition(t/2);}), new VectorTransition([6], [16], 1, function(t) {return ovalTransition(t/2);})));
        
        drawable.setStyle(new ColorTransition([255, 255, 255, 1], [255, 255, 255, 0], 16));
        
        // addDrawable(drawable);
        multiCrescent.push(drawable);
        
        startAngle += 2*Math.PI/c;
    }
    
    multiCrescent.setLifespan(16);
    multiCrescent.rotate(Math.random() * 2*Math.PI/c);
    multiCrescent.setPositionM(recipient.getPositionM());
    
    let recipient_avgsz = rectangle_averagesize(recipient);
    multiCrescent.multiplySize(recipient_avgsz/64);
    multiCrescent.initImaginarySize(recipient_avgsz);
    
    let sizeTransition = new VectorTransition([recipient_avgsz], [recipient_avgsz*4], 16);
    
    multiCrescent.controllers.add(function() {
        this.setImaginarySize(sizeTransition.getNext()[0]);
    });
    
    addDrawable(multiCrescent);
};

typeImpacts[FX_GOLD_] = function onimpact(actor, recipient) {
    const bothAvgsz = (actor.getWidth() + actor.getHeight() + recipient.getWidth() + recipient.getHeight()) / 4;
    const actorPositionM = actor.getPositionM();
    const recipientPositionM = recipient.getPositionM();
    const middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    let count = 8;
    
    for(let i = 0; i < count; ++i) {
        var particle = GoldSmokeParticle.fromMiddle(Vector.addition(actor.getPositionM(), recipient.getPositionM()).divide(2), [bothAvgsz/1.5, bothAvgsz/1.5]);
        
        let direction = getDD(actor.locate(recipient))[0];
        let vector = actor.speed.normalized();
        vector[direction.dimension] += direction.sign;
        particle.setSpeed(vector.rotate(irandom(-1, 1)/8).normalize(Math.random() * (bothAvgsz / 8)));
        
        addEntity(particle);
    }
    
    for(let i = 0; i < count; ++i) {
        let angle = i * 2*Math.PI/count;
        
        let particle = GoldSmokeParticle.fromMiddle(recipient.getPositionM(), [bothAvgsz, bothAvgsz]);
        
        let direction = Vector.fromAngle(angle);
        
        particle.setSpeed(direction.normalized(irandom(bothAvgsz/16, bothAvgsz/8)).rotate(Math.random()));
        
        addEntity(particle);
    }
};

typeImpacts[FX_FIRE] = function onimpact(actor, recipient) {
    const bothAvgsz = (actor.getWidth() + actor.getHeight() + recipient.getWidth() + recipient.getHeight()) / 4;
    const actorPositionM = actor.getPositionM();
    const recipientPositionM = recipient.getPositionM();
    const middlePosition = Vector.addition(actorPositionM, recipientPositionM).divide(2);
    
    let particle = FireParticle.fromMiddle(recipient.getPositionM(), recipient.getSize());
    particle.drawable.multiplySize((recipient.getWidth() + recipient.getHeight())/2/16);
    particle.drawable.setZIndex(Math.random() - 0.25);
    particle.setSpeed([Math.random(), Math.random()]);
    
    addEntity(particle);
    
    let avgsz = rectangle_averagesize(recipient);
    
    let radialGradient = RectangleDrawable.fromMiddle(recipient.getPositionM(), [avgsz, avgsz]);
    radialGradient.setStyle(makeRadialGradientCanvas("#FFFF00FF", "#FF000000"));
    radialGradient.setLifespan(12);
    
    let sizeTransition = new ColorTransition(radialGradient.size, Vector.multiplication(radialGradient.size, 1.5), radialGradient.lifespan);
    
    radialGradient.controllers.add(function() {
        this.setSizeM(sizeTransition.getNext());
    });
    
    addDrawable(radialGradient);
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
    
    let avgsz = rectangle_averagesize(recipient);
    
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
    let positionM = recipient.getPositionM();
    let avgsz = rectangle_averagesize(recipient);
    
    for(let i = 0; i < count; ++i) {
        let angle = ((i+Math.random())/count) * 2*Math.PI;
        let direction = Vector.fromAngle(angle);
        
        let particle = PaintDroplet.fromMiddle(direction.normalized(avgsz/8).add(positionM), [avgsz, avgsz]);
        particle.setSpeed(direction.normalized(irandom(2, avgsz/2)/8));
        
        addEntity(particle);
    }
};
