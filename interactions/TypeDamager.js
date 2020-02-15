
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
                    // impact(actor, recipient);
                }
            }
            
            actor.triggerEvent("hit", new EntityDamageEvent(actor, recipient));
            recipient.triggerEvent("hurt", new EntityDamageEvent(actor, recipient));
            
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
            recipients = [recipient];
            
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
