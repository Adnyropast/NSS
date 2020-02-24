
let SKILLS = {};

class Skill {
    static getIcon() {
        return null;
    }
    
    constructor() {
        this.user = null;
        
        this.priority = 0;
        this.targets = new SetArray();
        this.phase = 0;
        
        this.endId = undefined;
        
        this.moveCountBefore = 0;
    }
    
    getPriority() {
        return this.user.getPriority() - this.moveCountBefore;
        return this.priority;
    }
    
    setPriority(priority) {
        this.priority = priority;
        return this;
    }
    
    use() {
        this.end();
        
        return this;
    }
    
    end(endId = 0) {
        this.endId = endId;
        this.onend();
        
        const user = this.user;
        user.moves.remove(this);
        this.user = null;
        
        removeMove(this);
        
        return this;
    }
    
    setUser(user) {this.user = user; return this;}
    getUser() {return this.user;}
    
    getTargetables() {
        return BATTLERS;
    }
    
    onend() {
        return this;
    }
    
    hasEnded() {
        return this.endId !== undefined;
    }
    
    getPresentTargets() {
        const targets = SetArray.from(this.targets);
        
        for(let i = targets.length - 1; i >= 0; --i) {
            if(!BATTLELOOP.battlers.includes(targets[i])) {
                targets.splice(i, 1);
            }
        }
        
        return targets;
    }
}

class EnemyAttackSkill extends Skill {
    constructor() {
        super();
    }
    
    use() {
        const targets = this.getPresentTargets();
        
        if(this.phase == 0) {
            const userPositionM = this.user.drawable.getPositionM();
            const userAvgsz = rectangle_averageSize(this.user.drawable);
            
            {
                const entity = Entity.fromMiddle(userPositionM, [userAvgsz*4, userAvgsz*4]);
                entity.setLifespan(32);
                entity.setSizeTransition(new VectorTransition(Array.from(entity.size), [0, 0], entity.lifespan, powt(2)));
                
                const drawable = entity.getDrawable();
                drawable.setStyle(makeRadialGradientCanvas("purple", "#FF00FF00"));
                
                addEntity(entity);
            }
            
        } else if(this.phase == 32) {
            for(let i = 0; i < targets.length; ++i) {
                const target = targets[i];
                const targetPositionM = target.drawable.getPositionM();
                
                const vector = new Vector(-1, +1);
                const drawable = new PolygonDrawable(diamondparticle);
                drawable.setLifespan(24);
                drawable.setStyle(new ColorTransition([255, 127, 255, 1], [127, 0, 127, 0.5], drawable.lifespan, powt(2)));
                drawable.shrinkM([2, 0]);
                drawable.setImaginaryAngle(-vector.getAngle());
                const positionTransition = new VectorTransition(Vector.addition(targetPositionM, vector.normalized(-16)), Vector.addition(targetPositionM, vector.normalized(24)), drawable.lifespan, powt(1/1.5));
                drawable.controllers.add(function() {
                    this.setPositionM(positionTransition.getNext());
                    this.shrinkBase([0, 1.5]);
                });
                
                BATTLELOOP.addDrawable(drawable);
            }
        } else if(this.phase === 36) {
            for(let i = 0; i < targets.length; ++i) {
                const target = targets[i];
                
                const targetPositionM = target.drawable.getPositionM();
                const targetAvgsz = rectangle_averageSize(target.drawable);
                
                for(let j = 0; j < 2; ++j) {
                    const drawable = sharpCut(targetPositionM, targetAvgsz);
                    drawable.setStyle(new ColorTransition([255, 0, 255, 1], [191, 0, 191, 0.5], drawable.lifespan));
                }
                
                sharpSparks(6, targetPositionM, targetAvgsz)
                .forEach(function(entity) {
                    entity.setStyle(new ColorTransition([255, 127, 255, 1], [127, 0, 127, 1], entity.lifespan, powt(1/2)));
                });
                
                makeShockwave.lifespan = 32;
                makeShockwave.lineWidth = 2;
                makeShockwave.precision = 64;
                makeShockwave(targetPositionM, targetAvgsz/3)
                .getDrawable()
                .setStyle(new ColorTransition([255, 191, 255, 1], [191, 63, 191, 0], 32));
                makeShockwave.lifespan = 24;
                makeShockwave.lineWidth = 1;
                makeShockwave.precision = 32;
                
                target.hurt(1);
            }
            
            this.end();
        }
        
        return this;
    }
}

SKILLS["enemyAttack"] = EnemyAttackSkill;

SKILLS["flee"] = class FleeSkill extends Skill {
    constructor() {
        super().setPriority(-Infinity);
    }
    
    use() {
        const user = this.user.drawable;
        
        if(this.phase == 0) {
            const positionM = user.getPositionM();
            const avgsz = rectangle_averageSize(user);
            
            for(let i = 0, count = 5; i < count; ++i) {
                const width = 16 * (1 - i/count);
                
                entityExplode(5 + (i/(count-1)) * (16 - 5), SmokeParticle, positionM, [width, width], 1)
                .forEach(function(entity) {
                    entity.setLifespan(96);
                    entity.setSizeTransition(new VectorTransition(Vector.from(entity.size), [0, 0], entity.lifespan));
                    entity.setSelfBrake(1.03125);
                    entity.speed.multiply(random(0.125, 0.5) * (i/(count-1) + 1));
                    
                    const drawable = entity.getDrawable();
                    drawable.setLifespan(entity.lifespan);
                    drawable.setZIndex(random(-3, +1));
                    drawable.setStyle(new ColorTransition([255, 255, 255, 1], [191, 191, 191, 0.75], entity.lifespan));
                });
            }
            
            entityExplode(16, OvalParticle, positionM, [avgsz/4, avgsz/4], 1)
            .forEach(function(entity) {
                entity.setLifespan(64);
                entity.setSelfBrake(1.03125);
                entity.speed.multiply(random(1.5, 2));
                
                const drawable = entity.getDrawable();
                drawable.setStyle(new ColorTransition([255, 255, 255, 1], [191, 191, 191, 0], entity.lifespan, powt(1/2)));
            });
            
            removeDrawable(user);
        }
        
        if(this.phase >= 64) {
            removeBattler(this.user);
            this.end();
        }
        
        return this;
    }
};

SKILLS["attack"] = class AttackSkill extends Skill {
    use() {
        const targets = this.getPresentTargets();
        const userDrawable = this.user.drawable;
        
        if(this.phase == 0) {
            const userPositionM = this.user.drawable.getPositionM();
            const userAvgsz = rectangle_averageSize(this.user.drawable);
            
            {
                const entity = Entity.fromMiddle(userPositionM, [userAvgsz*4, userAvgsz*4]);
                entity.setLifespan(32);
                entity.setSizeTransition(new VectorTransition(Array.from(entity.size), [0, 0], entity.lifespan, powt(2)));
                
                const drawable = entity.getDrawable();
                drawable.setStyle(makeRadialGradientCanvas("cyan", "#00FFFF00"));
                
                addEntity(entity);
            }
            
            entityExplode.randomAngleVariation = 1;
            entityExplode.initialDistance = 1;
            entityExplode(8, OvalParticle, userPositionM, [4, 4], 0)
            .forEach(function(entity) {
                entity.setLifespan(32);
                entity.setPositionM(Vector.addition(userPositionM, Vector.subtraction(entity.getPositionM(), userPositionM).normalize(userAvgsz * random(1.75, 2.25))));
                
                const positionTransition = new VectorTransition(Vector.from(entity.getPositionM()), userPositionM, entity.lifespan, powt(random(1/5, 5)));
                entity.controllers.add(function() {
                    this.setPositionM(positionTransition.getNext());
                });
                
                const drawable = entity.getDrawable();
                
                drawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 0], entity.lifespan));
                drawable.setShadowBlur(8);
            });
            entityExplode.randomAngleVariation = 0;
            entityExplode.initialDistance = 0;
        } if(this.phase == 32) {
            for(let i = 0; i < targets.length; ++i) {
                const target = targets[i];
                const targetDrawable = target.drawable;
                
                const userPositionM = userDrawable.getPositionM();
                const targetPositionM = targetDrawable.getPositionM();
                const direction = Vector.subtraction(targetPositionM, userPositionM);
                
                const drawable = PolygonDrawable.from(flameparticle).rotate(direction.getAngle());
                
                drawable.multiplySize(6/polygon_averageSize(drawable));
                drawable.setLifespan(16);
                drawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 0.5], drawable.lifespan));
                
                const positionTransition = new VectorTransition(userPositionM, targetPositionM, drawable.lifespan, powt(2));
                
                drawable.controllers.add(function() {
                    this.setPositionM(positionTransition.getNext());
                });
                
                BATTLELOOP.addDrawable(drawable);
            }
        } if(this.phase == 48) {
            for(let i = 0; i < targets.length; ++i) {
                const target = targets[i];
                target.hurt(3);
                
                const opponentPositionM = target.drawable.getPositionM();
                const opponentAvgsz = rectangle_averageSize(target.drawable);
                
                for(let i = 0, count = 2; i < count; ++i) {
                    entityExplode.randomAngleVariation = 1;
                    entityExplode(8, GoldSmokeParticle, opponentPositionM, [opponentAvgsz/3, opponentAvgsz/3], 1)
                    .forEach(function(entity) {
                        entity.setLifespan(64);
                        entity.setSelfBrake(1.03125);
                        entity.speed.multiply(random(opponentAvgsz/24, opponentAvgsz/16) * (i/(count-1) + 1));
                        
                        const drawable = entity.getDrawable();
                        
                        drawable.setZIndex(target.drawable.getZIndex() - 1);
                    });
                    entityExplode.randomAngleVariation = 0;
                }
                
                entityExplode(16, OvalParticle, opponentPositionM, [opponentAvgsz/4, opponentAvgsz/4], 1)
                .forEach(function(entity) {
                    entity.setLifespan(irandom(48, 64));
                    entity.setSelfBrake(1.0625);
                    entity.speed.multiply(random(opponentAvgsz/10, opponentAvgsz/8));
                    
                    const drawable = entity.getDrawable();
                    drawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 0], entity.lifespan));
                });
                
                makeShockwave.lifespan = 32;
                makeShockwave.lineWidth = 2;
                makeShockwave.precision = 64;
                makeShockwave(opponentPositionM, opponentAvgsz/3)
                .getDrawable()
                .setStyle(new ColorTransition([255, 255, 255, 1], [0, 255, 255, 0], 32, powt(1/2)))
                ;
                makeShockwave.lifespan = 24;
                makeShockwave.lineWidth = 1;
                makeShockwave.precision = 32;
            }
            
            repaceLoop(32);
            
            // this.user.hurt(8);
        } if(this.phase == 64) {
            repaceLoop(16);
            this.end();
        }
        
        return this;
    }
};

function makeShockwaveBattleDrawable(positionM, radius) {
    const drawable = new PolygonDrawable(makePathPolygon(makeOvalPath(64, 64, 64), 0.5));
    
    drawable.setLifespan(32);
    drawable.setStyle(new ColorTransition(CV_WHITE, [255, 255, 255, 0], drawable.lifespan));
    drawable.setPositionM(positionM);
    drawable.multiplySize(2/16);
    drawable.initImaginarySize(radius);
    const sizeTransition = new VectorTransition([radius], [radius*4], drawable.lifespan, powt(1/1.5));
    drawable.controllers.add(function() {
        this.setImaginarySize(sizeTransition.getNext()[0]);
    });
    
    return drawable;
}

function makeBurstDrawables(count, positionM, avgsz) {
    const drawables = [];
    
    for(let i = 0; i < count; ++i) {
        const angle = ((i+Math.random())/count) * 2*Math.PI;
        
        const drawable = PolygonDrawable.from(roundparticle);
        drawable.setLifespan(32);
        drawable.stretchM([48, 0]);
        drawable.setImaginaryAngle(angle);
        drawable.multiplySize(2/avgsz);
        
        const positionTransition = new VectorTransition(positionM, Vector.addition(positionM, Vector.fromAngle(angle).normalize(avgsz*random(1.75, 2.25))), drawable.lifespan, powt(1/1.75));
        
        drawable.controllers.add(function() {
            this.shrinkBase([0.125, 0]);
            this.setPositionM(positionTransition.getNext());
        });
        
        drawables.push(drawable);
    }
    
    return drawables;
}
