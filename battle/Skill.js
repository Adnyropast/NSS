
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
        this.targets = [];
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
                let avgsz = rectangle_averagesize(user);
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
}

SKILLS["attack"] = class AttackSkill extends Skill {
    static getLabel() {return new CommandLabel("Attack");}
    
    use(actIC) {
        let userDrawable = this.user.drawable;
        
        if(actIC < 1) {
            console.log(this.targets);
        } if(actIC == 16) {
            for(let i = 0; i < this.targets.length; ++i) {
                let target = this.targets[i];
                let targetDrawable = target.drawable;
                
                let drawable = PolygonDrawable.from(makeBurstPolygon2(new ColorTransition([2], [4], 8*2, function() {return Math.random();}), new ColorTransition([16], [20], 8*2, Math.random), 6)).rotate(Math.random());
                
                drawable.multiplySize(1/4);
                drawable.setLifespan(32);
                drawable.setStyle(new ColorTransition([0, 255, 255, 1], [0, 0, 255, 0.5], drawable.lifespan));
                drawable.setCamera(userDrawable.camera).setCameraMode(userDrawable.cameraMode);
                
                let positionTransition = new VectorTransition(userDrawable.getPositionM(), targetDrawable.getPositionM(), drawable.lifespan, function(t) {
                    return Math.pow(t, 1/1.25);
                });
                
                drawable.controllers.add(function() {
                    this.setPositionM(positionTransition.getNext());
                });
                
                BATTLEDRAWABLES.add(drawable);
            }
        } if(actIC == 48) {
            let opponents = this.user.getOpponents();
            opponents = this.targets;
            
            for(let i = 0; i < opponents.length; ++i) {
                opponents[i].hurt(3);
            }
            
            this.user.hurt(8);
            
            this.end();
        }
        
        return this;
    }
}
