
function cameraSizeEffect() {
    if(CAMERA.sizeTransition) {
        CAMERA.setSizeM(CAMERA.sizeTransition.at(1));
        delete CAMERA.sizeTransition;
        CAMERA.controllers.remove(sizeTransitionController);
    }
    
    const sizeTransition = new VectorTransition(Vector.division(CAMERA.getSize(), 1.00390625), Vector.from(CAMERA.getSize()), 12, function timing(t) {
        let sign = (t * 5) % 2 == 0 ? -1 : 1;
        let val = 1 - t;
        
        return 1 + sign * val;
    });
    
    CAMERA.setSizeTransition(sizeTransition);
}

function cameraPositionEffect() {
    const vector = new Vector(0, 1);
    vector.rotate(Math.random() * 2*Math.PI);
    
    const norm = Math.pow(Math.floor(1), 1/16) / 128;
    
    vector.normalize(norm);
    
    const positionM = CAMERA.getPositionM();
    
    const positionTransition = new VectorTransition(Vector.addition(positionM, vector), positionM, 16);
    
    let f = function() {
        this.setPositionM(positionTransition.getNext());
        
        if(positionTransition.isDone()) {
            this.controllers.remove(f);
        }
    };
    
    CAMERA.controllers.add(f);
}

function shakeController() {
    let state = this.findState("shake");
    
    if(state !== undefined) {
        const positionM = state.positionM;
        
        const avgsz = rectangle_averageSize(this);
        const vector = state.vector;
        
        this.setPositionM(Vector.addition(positionM, vector));
        
        vector.rotate(random(Math.PI - Math.PI/4, Math.PI + Math.PI/4));
        
        --state.timeout;
        
        if(state.timeout <= 0) {
            this.controllers.remove(shakeController);
            this.setPositionM(state.positionM);
            this.setSpeed(state.saveSpeed);
            
            this.removeState("shake");
        }
    } else {
        this.controllers.remove(shakeController);
    }
}

function entityShake(entity, duration) {
    let state = entity.findState("shake");
    
    if(state === undefined) {
        state = {
            name: "shake",
            positionM: entity.getPositionM(),
            timeout: duration,
            vector: Vector.fromAngle(random(0, 2*Math.PI)).normalize(entityShake.intensity * rectangle_averageSize(entity))
        };
        
        entity.addStateObject(state);
        entity.controllers.add(shakeController);
    } else {
        if(duration > state.timeout) {
            state.timeout = duration;
        }
    }
    
    state.saveSpeed = Vector.from(entity.speed);
    
    entityShake.reset();
}

entityShake.intensity = 1/16;

entityShake.reset = function reset() {
    this.intensity = 1/16;
};

/**
 *
 */

class TypeDamager extends Interactor {
    constructor() {
        super();
        this.setId("damage");
        
        this.value = 0;
        this.values = {};
        this.hitList = new SetArray();
        this.rehit = -1;
    }
    
    interact(interrecipient) {
        const actor = this.getActor();
        const recipient = interrecipient.getRecipient();
        
        if(!this.hitList.includes(interrecipient)) {
            const offenses = actor.offenses;
            
            for(let type in offenses) {
                const negotiatedDamage = interrecipient.negotiateDamage(type, offenses[type]);
                
                recipient.hurt(negotiatedDamage);
            }
            
            actor.triggerEvent("hit", new EntityDamageEvent(actor, recipient));
            recipient.triggerEvent("hurt", new EntityDamageEvent(actor, recipient));
            
            this.hitList.add(interrecipient);
            
            /* Clear hit list with timeout */
            
            if(this.rehit > 0) {
                const hitList = this.hitList;
                
                setGameTimeout(function() {
                    hitList.remove(interrecipient);
                }, this.rehit - 1);
            }
        } else {
            /**
            
            ++interrecipient.rehitTimer;
            
            if(interrecipient.rehitTimer == this.rehit) {
                interrecipient.rehitTimer = 0;
                this.hit.remove(interrecipient);
            }
            
            /**/
        }
        
        return this;
    }
    
    setRehit(rehit) {
        this.rehit = rehit;
        
        return this;
    }
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
