
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
        SKILLS_QUEUE.remove(this);
        
        return this;
    }
    
    setUser(user) {this.user = user; return this;}
    getUser() {return this.user;}
    
    getTargetables() {
        return BATTLERS;
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
        if(actIC >= 16) {
            removeBattler(this.user);
            this.end();
        }
        
        return this;
    }
}

SKILLS["attack"] = class AttackSkill extends Skill {
    static getLabel() {return new CommandLabel("Attack");}
    
    use(actIC) {
        if(actIC < 1) {
            
        } if(actIC == 64) {
            let opponents = this.user.getOpponents();
            
            for(let i = 0; i < opponents.length; ++i) {
                opponents[i].hurt(3);
            }
            
            this.user.hurt(8);
            
            this.end();
        }
        
        return this;
    }
}
