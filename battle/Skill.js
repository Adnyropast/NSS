
let SKILLS = {};

class Skill {
    static getIcon() {
        return null;
    }
    
    static getLabel() {
        return new CommandLabel(camelToSentence(this.name));
    }
    
    constructor() {
        this.user = null;
        
        this.priority = 0;
        this.targets = new SetArray();
    }
    
    getPriority() {return this.priority;}
    setPriority(priority) {this.priority = priority; return this;}
    
    use(actIC) {
        this.end();
        
        return this;
    }
    
    end(endid = 0) {
        this.onend();
        SKILLS_QUEUE.remove(this);
        
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
}

class EnemyAttackSkill extends Skill {
    constructor() {
        super();
    }
    
    use(actIC) {
        if(actIC == 0) {
            const userPositionM = this.user.drawable.getPositionM();
            const userAvgsz = rectangle_averageSize(this.user.drawable);
            
            {
                const drawable = RectangleDrawable.fromMiddle(userPositionM, [userAvgsz*4, userAvgsz*4]);
                drawable.setLifespan(32);
                
                drawable.setStyle(makeRadialGradientCanvas("purple", "#FF00FF00"));
                const sizeTransition = new VectorTransition(Array.from(drawable.size), [0, 0], drawable.lifespan, powt(2));
                drawable.controllers.add(function() {
                    this.setSizeM(sizeTransition.getNext());
                });
                
                BATTLELOOP.addDrawable(drawable);
            }
            
        } else if(actIC == 32) {
            for(let i = 0; i < this.targets.length; ++i) {
                const target = this.targets[i];
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
        } else if(actIC === 36) {
            for(let i = 0; i < this.targets.length; ++i) {
                const target = this.targets[i];
                
                const targetPositionM = target.drawable.getPositionM();
                const targetAvgsz = rectangle_averageSize(target.drawable);
                
                makeBurstDrawables(16, targetPositionM, targetAvgsz).forEach(function(drawable) {
                    drawable.multiplySize(1/2);
                    drawable.setStyle(new ColorTransition([255, 127, 255, 1], [127, 0, 127, 0.5], drawable.lifespan));
                    BATTLELOOP.addDrawable(drawable);
                });
                
                {
                    const drawable = makeShockwaveBattleDrawable(targetPositionM, targetAvgsz/2);
                    drawable.setStyle(new ColorTransition([255, 191, 255, 1], [191, 63, 191, 0.5], drawable.lifespan));
                    BATTLELOOP.addDrawable(drawable);
                }
                
                target.hurt(1);
            }
            
            this.end();
        }
        
        return this;
    }
}

SKILLS["enemyAttack"] = EnemyAttackSkill;

SKILLS["flee"] = class FleeSkill extends Skill {
    static getLabel() {return new CommandLabel("Flee");}
    
    constructor() {
        super().setPriority(-Infinity);
    }
    
    use(actIC) {
        let user = this.user.drawable;
        
        if(actIC == 0) {
            let count = irandom(8, 12);
            // let angleTransition = new VectorTransition([-Math.PI/2 - Math.PI/3], [-Math.PI/2 + Math.PI/3]);
            let angleTransition = new VectorTransition([0], [2*Math.PI]);
            
            for(let i = 0; i < count; ++i) {
                let angle = angleTransition.at(i/(count-1))[0];
                let direction = Vector.fromAngle(angle);
                
                let drawable = PolygonDrawable.from(makeRandomPolygon(128, 15.5, 16));
                
                drawable.setLifespan(64);
                
                drawable.setStyle(new ColorTransition([255, 255, 255, 1], [191, 191, 191, 0.75], drawable.lifespan));
                
                let positionM = user.getPositionM();
                
                let positionTransition = new VectorTransition(positionM, direction.normalized(irandom(12, 14)).add(positionM), drawable.lifespan, function(t) {
                    return Math.pow(t, 1/6);
                });
                let avgsz = rectangle_averageSize(user);
                let sizeTransition = new VectorTransition([avgsz/2], [avgsz/1.25], drawable.lifespan, function(t) {
                    return Math.pow(t, 1/6);
                });
                
                drawable.multiplySize(avgsz/32);
                drawable.initImaginarySize(sizeTransition.at(0)[0]);
                
                drawable.controllers.add(function() {
                    this.setPositionM(positionTransition.getNext());
                    this.setImaginarySize(sizeTransition.getNext()[0]);
                });
                
                drawable.setCamera(user.camera).setCameraMode(user.cameraMode);
                
                BATTLEDRAWABLES.add(drawable);
            }
        }
        
        if(actIC >= 64) {
            removeBattler(this.user);
            this.end();
        }
        
        return this;
    }
};

SKILLS["attack"] = class AttackSkill extends Skill {
    static getLabel() {return new CommandLabel("Attack");}
    
    use(actIC) {
        const userDrawable = this.user.drawable;
        
        if(actIC == 0) {
            const userPositionM = this.user.drawable.getPositionM();
            const userAvgsz = rectangle_averageSize(this.user.drawable);
            
            {
                const drawable = RectangleDrawable.fromMiddle(userPositionM, [userAvgsz*4, userAvgsz*4]);
                drawable.setLifespan(32);
                
                drawable.setStyle(makeRadialGradientCanvas("cyan", "#00FFFF00"));
                const sizeTransition = new VectorTransition(Array.from(drawable.size), [0, 0], drawable.lifespan, powt(2));
                drawable.controllers.add(function() {
                    this.setSizeM(sizeTransition.getNext());
                });
                
                BATTLELOOP.addDrawable(drawable);
            }
            
            let count = 8;
            
            for(let i = 0; i < count; ++i) {
                const angle = ((i+Math.random())/count) * 2*Math.PI;
                
                const drawable = PolygonDrawable.from(roundparticle);
                drawable.setLifespan(32);
                drawable.setStyle(new ColorTransition([0, 255, 255, 0], [0, 0, 255, 1], drawable.lifespan));
                drawable.multiplySize(1/8);
                const positionTransition = new VectorTransition(Vector.addition(userPositionM, Vector.fromAngle(angle).normalize(userAvgsz * random(1.75, 2.25))), userPositionM, drawable.lifespan, powt(random(1/2, 2)));
                
                drawable.controllers.add(function() {
                    this.setPositionM(positionTransition.getNext());
                });
                
                drawable.setShadowBlur(8);
                
                BATTLELOOP.addDrawable(drawable);
            }
        } if(actIC == 32) {
            for(let i = 0; i < this.targets.length; ++i) {
                const target = this.targets[i];
                const targetDrawable = target.drawable;
                
                const drawable = PolygonDrawable.from(makeBurstPolygon2(new ColorTransition([2], [4], 8*2, function() {return Math.random();}), new ColorTransition([16], [20], 8*2, Math.random), 6)).rotate(Math.random());
                
                drawable.multiplySize(1/4);
                drawable.setLifespan(16);
                drawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 0.5], drawable.lifespan));
                
                let positionTransition = new VectorTransition(userDrawable.getPositionM(), targetDrawable.getPositionM(), drawable.lifespan, powt(1/1.5));
                
                drawable.controllers.add(function() {
                    this.setPositionM(positionTransition.getNext());
                });
                
                BATTLELOOP.addDrawable(drawable);
            }
        } if(actIC == 48) {
            const opponents = this.targets;
            
            for(let i = 0; i < opponents.length; ++i) {
                const opponent = opponents[i];
                opponent.hurt(3);
                
                const opponentPositionM = opponent.drawable.getPositionM();
                const opponentAvgsz = rectangle_averageSize(opponent.drawable);
                
                /**/
                
                const bothAvgsz = average(rectangle_averageSize(opponent.drawable), 5);
                
                entityExplode.randomAngleVariation = 1;
                entityExplode(irandom(7, 9), GoldSmokeParticle, opponentPositionM, [bothAvgsz/2, bothAvgsz/2], 1)
                .forEach(function(entity) {
                    entity.speed.multiply(irandom(bothAvgsz/12, bothAvgsz/10));
                    // entity.setLifespan(32);
                    entity.setSelfBrake(1.03125);
                });
                entityExplode.randomAngleVariation = 0;
                
                /*/
                
                makeBurstDrawables(8, opponentPositionM, opponentAvgsz).forEach(function(drawable) {
                    drawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 0.5], drawable.lifespan));
                    BATTLELOOP.addDrawable(drawable);
                });
                
                /**/
                
                makeShockwave(opponentPositionM, opponentAvgsz/3);
                
                /**
                
                {
                    const drawable = makeShockwaveBattleDrawable(opponentPositionM, opponentAvgsz/2);
                    drawable.setStyle(new ColorTransition([255, 255, 255, 1], [0, 255, 255, 0.5], drawable.lifespan));
                    BATTLELOOP.addDrawable(drawable);
                }
                
                /**/
            }
            
            // this.user.hurt(8);
        } if(actIC == 64) {
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
