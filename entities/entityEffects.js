
const typeImpacts = {};

function interactionProperties(actor, recipient) {
    const actorAvgsz = rectangle_averageSize(actor);
    const recipientAvgsz = rectangle_averageSize(recipient);
    const bothAvgsz = rectangle_averageSize(actor, recipient);
    const actorPositionM = actor.getPositionM();
    const recipientPositionM = recipient.getPositionM();
    const middlePosition = Vector.average(actorPositionM, recipientPositionM);
    
    return {
        actorAvgsz: actorAvgsz,
        recipientAvgsz: recipientAvgsz,
        bothAvgsz: bothAvgsz,
        actorPositionM: actorPositionM,
        recipientPositionM: recipientPositionM,
        middlePosition: middlePosition
    };
}

function sharpCut(position, size) {
    const drawable = new CutDrawable(position, random(0, 2*Math.PI), size);
    
    addDrawable(drawable);
    
    return drawable;
}

function sharpImpact(position, size) {
    sharpCut(position, size);
    sharpCut(position, size);
    
    /**/
    
    sharpSparks(irandom(1, 5), position, size);
    
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
    
    makeShockwave.lineWidth = size/32;
    makeShockwave(position, size/4);
    makeShockwave.lineWidth = 1;
}

function sharpSparks(count, position, size) {
    entityExplode.randomAngleVariation = 1;
    const entities = entityExplode(count, DiamondParticle, position, [size, size], 1);
    entities.forEach(function(entity) {
        entity.setZIndex(random(-3, +1));
        entity.speed.multiply(irandom(size/12, size/8));
    });
    entityExplode.randomAngleVariation = 0;
    
    return entities;
}

typeImpacts[FX_SHARP] = function onimpact(actor, recipient) {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    const sz = Math.max(recipientAvgsz, 16);
    
    sharpImpact(middlePosition, sz);
};

typeImpacts[FX_GOLD_] = function onimpact(actor, recipient) {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    /**/
    
    directionSparks.randomAngleVariation = Math.PI/8;
    directionSparks(irandom(7, 9), GoldSmokeParticle, middlePosition, [bothAvgsz/1.5, bothAvgsz/1.5], actor.speed.normalized(bothAvgsz/8))
    .forEach(function(entity) {
        entity.speed.multiply(random(0.5, 1.5));
        entity.setZIndex(-1);
    });
    directionSparks.randomAngleVariation = 0;
    
    /**/
    
    const sz = Math.max(bothAvgsz/2, 4);
    
    entityExplode(irandom(7, 9), GoldSmokeParticle, middlePosition, [sz, sz], 1)
    .forEach(function(entity) {
        entity.speed.multiply(irandom(bothAvgsz/12, bothAvgsz/10));
    });
    
    /**/
    
    let crownCT = new ColorTransition([0, 255, 255, 1], [191, 255, 255, 0.5], 12);
    let colorTransition = new ColorTransition([0, 255, 255, 1], [0, 91, 255, 0.875], 8, powt(1/2));
    
    crownImpact(actor, recipient, crownCT.copy());
    // crownImpact(actor, recipient, crownCT.copy());
    // burstImpact(actor, recipient, colorTransition.copy());
    
    setGameTimeout(function() {
        // crownImpact(actor, recipient, crownCT.copy());
        // crownImpact(actor, recipient, crownCT.copy());
        // burstImpact(actor, recipient, colorTransition.copy());
        // burstImpact(actor, recipient, colorTransition.copy());
    }, 6);
    
    /**/
};

function flamesEffect(count, position) {
    entityExplode.randomAngleVariation = 1;
    const entities = entityExplode(count, FireParticle, position, [16, 16], 2);
    entityExplode.randomAngleVariation = 0;
    
    return entities;
}

function fireSmokes(count, position, size) {
    entityExplode.randomAngleVariation = 1;
    const entities = entityExplode(count, FireSmokeParticle, position, [size/2, size/2], size/16);
    entityExplode.randomAngleVariation = 0;
    
    return entities;
}

typeImpacts[FX_FIRE] = function onimpact(actor, recipient) {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    flamesEffect(3, middlePosition);
    
    fireSmokes(irandom(3, 4), middlePosition, bothAvgsz);
};

typeImpacts[FX_ELECTRIC] = function onimpact(actor, recipient) {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    /**/
    
    const count = irandom(1, 5);
    
    for(let i = 0; i < count; ++i) {
        let angle = i/count * 2*Math.PI + 2*(Math.random() - 0.5);
        
        let lightning = new LightningDrawable(recipient.getPositionM(), Vector.addition(recipient.getPositionM(), [bothAvgsz * Math.cos(angle), bothAvgsz * Math.sin(angle)]));
        
        addDrawable(lightning);
    }
    
    /**/
    
    entityExplode.randomAngleVariation = 0.75;
    entityExplode.initialDistance = function(i) {return random(0, recipientAvgsz);};
    entityExplode(irandom(3, 4), SparkSpark, recipientPositionM, [recipientAvgsz/4, recipientAvgsz/4], 0);
    entityExplode.randomAngleVariation = 0;
    entityExplode.initialDistance = 0;
    
    /**/
    
    const radialGradient = Entity.fromMiddle(recipient.getPositionM(), [recipientAvgsz, recipientAvgsz]);
    radialGradient.setLifespan(12);
    radialGradient.setSizeTransition(new VectorTransition(radialGradient.size, Vector.multiplication(radialGradient.size, 2.5)));
    
    radialGradient.getDrawable().setStyle(makeRadialGradientCanvas("#00FFFF1F", "#00FFFF00"));
    
    addEntity(radialGradient);
    
    /**/
};

typeImpacts["paint"] = function(actor, recipient) {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    let avgsz = 16; rectangle_averageSize(actor);
    
    entityExplode.initialDistance = avgsz/8;
    entityExplode.randomAngleVariation = 1;
    const entities = entityExplode(12, PaintDroplet, middlePosition, [avgsz, avgsz], 1);
    entityExplode.initialDistance = 0;
    entityExplode.randomAngleVariation = 0;
    entities.forEach(function(entity) {
        entity.speed.multiply(irandom(2, avgsz) / 8);
    });
};

typeImpacts[FX_HEART_] = function(actor, recipient) {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
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
    
    // 
    
    entityExplode.randomAngleVariation = 1;
    const entities = entityExplode(irandom(8, 12), HeartBloodDroplet, middlePosition, function() {
        const sz = irandom(8, 12);
        return [sz, sz];
    }, 1);
    entityExplode.randomAngleVariation = 0;
    entities.forEach(function(entity) {
        entity.speed.multiply(random(1, 4));
    });
};

typeImpacts[FX_BLUNT] = function onimpact(actor, recipient) {
    crownImpact(...arguments);
    burstImpact(...arguments);
};

function crownImpact(actor, recipient, style = "white") {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    let direction = Vector.subtraction(recipientPositionM, actorPositionM).rotate(Math.random() * 2*Math.PI);
    
    let size = Math.max(1, recipientAvgsz/32);
    let crownParticle = BluntCrownParticle.fromMiddle(middlePosition, [size, size]);
    
    crownParticle.drawable.setStyle(style);
    
    crownParticle.setSpeed(direction.normalized(Math.max(6, recipientAvgsz/5)));
    
    addEntity(crownParticle);
}

function burstImpact(actor, recipient, style = "white") {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    let size = Math.max(1, recipientAvgsz/32);
    
    entityExplode.randomAngleVariation = 1;
    const entities = entityExplode(2, BluntOvalParticle, middlePosition, [size, size], 4);
    entityExplode.randomAngleVariation = 0;
    
    entities.forEach(function(entity) {
        entity.drawables[0].setStyle(style);
    });
}

typeImpacts[FX_WIND] = function onimpact(actor, recipient) {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    entityExplode(irandom(8, 12), SmokeParticle, recipientPositionM, undefined, 2)
    .forEach(function(entity) {
        entity.drawable.setStyle(new ColorTransition([255, 255, 255, 1], [0, 255, 0, 1], entity.lifespan, powt(1/2)));
    });
    
    makeShockwave.lineWidth = 4;
    makeShockwave(recipientPositionM, recipientAvgsz/8)
    .setSpeed(Vector.fromAngle(0).normalize(0.125))
    .makeEllipse([0, 16])
    .getDrawable()
    .setStyle(new ColorTransition([255, 255, 255, 1], [0, 255, 0, 0], 24, powt(1/2)));
    
    makeShockwave.lineWidth = 4;
    makeShockwave(recipientPositionM, recipientAvgsz/8)
    .setSpeed(Vector.fromAngle(-Math.PI/3).normalize(0.125))
    .makeEllipse([0, 16])
    .getDrawable()
    .setStyle(new ColorTransition([255, 255, 255, 1], [0, 255, 0, 0], 24, powt(1/2)));
    
    makeShockwave.lineWidth = 4;
    makeShockwave(recipientPositionM, recipientAvgsz/8)
    .setSpeed(Vector.fromAngle(-2*Math.PI/3).normalize(0.125))
    .makeEllipse([0, 16])
    .getDrawable()
    .setStyle(new ColorTransition([255, 255, 255, 1], [0, 255, 0, 0], 24, powt(1/2)));
    
    makeShockwave.lineWidth = 1;
    
    for(let i = 0; i < 2; ++i) {
        
    }
};

function entityExplode(count, entityClass, position, size, power) {
    const entities = new SetArray();
    
    for(let i = 0; i < count; ++i) {
        const angleVariation = random(-Math.abs(entityExplode.randomAngleVariation), Math.abs(entityExplode.randomAngleVariation));
        const angle = entityExplode.initialAngle + (i + angleVariation)/count * 2*Math.PI;
        // const direction = Vector.fromAngle(angle);
        const direction = new Vector(Math.cos(angle) * entityExplode.xRadius, Math.sin(angle) * entityExplode.yRadius);
        
        direction.rotate(entityExplode.radiusRotate);
        
        let s;
        
        if(typeof size === "function") {
            s = size(i);
        } else {
            s = size;
        }
        
        let initialDistance = entityExplode.initialDistance;
        
        if(typeof initialDistance === "function") {
            initialDistance = initialDistance(i);
        }
        
        const entity = entityClass.fromMiddle(Vector.addition(position, direction.normalized(initialDistance)), s);
        entity.setSpeed(direction.times(power));
        
        entities.add(entity);
        addEntity(entity);
    }
    
    return entities;
}

entityExplode.initialAngle = 0;
entityExplode.randomAngleVariation = 0;
entityExplode.initialDistance = 0;
entityExplode.xRadius = 1;
entityExplode.yRadius = 1;
entityExplode.radiusRotate = 0;

function directionSparks(count, entityClass, position, size, direction) {
    const entities = new SetArray();
    
    for(let i = 0; i < count; ++i) {
        const angle = random(-Math.abs(directionSparks.randomAngleVariation), Math.abs(directionSparks.randomAngleVariation));
        
        const d = direction.rotated(angle);
        
        const entity = entityClass.fromMiddle(Vector.addition(position, d.normalized(directionSparks.initialDistance)), size);
        
        entity.setSpeed(d);
        
        entities.add(entity);
        addEntity(entity);
    }
    
    return entities;
}

directionSparks.randomAngleVariation = 0;
directionSparks.initialDistance = 0;

function makeShockwave(position, radius) {
    OvalWaveParticle.lineWidth = makeShockwave.lineWidth;
    OvalWaveParticle.lifespan = makeShockwave.lifespan;
    OvalWaveParticle.precision = makeShockwave.precision;
    
    const entity = OvalWaveParticle.fromMiddle(position, [radius, radius]);
    
    addEntity(entity);
    
    return entity;
}

makeShockwave.precision = 32;
makeShockwave.lifespan = 24;
makeShockwave.timingFunction = powt(1/2);
makeShockwave.lineWidth = 1;

function angledSparks(count, entityClass, position, size, angleTransition) {
    const entities = new SetArray();
    
    for(let i = 0; i < count; ++i) {
        const entity = entityClass.fromMiddle(position, size);
        const angle = angleTransition.at(i/(count-1));
        
        const direction = Vector.fromAngle(angledSparks.initialAngle);
        direction.rotate(angle);
        
        entity.setSpeed(direction);
        
        entities.add(entity);
        addEntity(entity);
    }
    
    return entities;
}

angledSparks.initialAngle = 0;

function drawableExplode() {
    
}

function makeBurstEffect(entityClass, position, size, speed) {
    const avgsz = array_average(size);
    const entities = new SetArray();
    
    if(speed.getNorm() < 2) {
        entityExplode(8, entityClass, position, size, avgsz/16);
        entityExplode(8, entityClass, position, size, avgsz/8);
        entityExplode(8, entityClass, position, size, avgsz/4);
    } else {
        directionSparks.randomAngleVariation = Math.PI/6;
        directionSparks(32, entityClass, position, Vector.multiply(size, random(0.75, 1.25)), speed.normalized())
        .forEach(function(entity) {
            entity.speed.multiply(random(avgsz/16, avgsz/3));
        });
        directionSparks.randomAngleVariation = 0;
    }
    
    return 
}

typeImpacts[FX_PIERCING] = function(actor, recipient) {
    const {actorAvgsz, recipientAvgsz, bothAvgsz, actorPositionM, recipientPositionM, middlePosition} = interactionProperties(actor, recipient);
    
    directionSparks.randomAngleVariation = Math.PI/6;
    directionSparks(8, BluntOvalParticle, middlePosition, [bothAvgsz/16, bothAvgsz/16], recipient.speed.normalized())
    .forEach(function(entity) {
        entity.speed.multiply(random(bothAvgsz/16, bothAvgsz/4));
    });
    directionSparks.randomAngleVariation = 0;
};
