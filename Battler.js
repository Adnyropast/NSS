
class Battler {
    constructor() {
        this.speedPriority = 0;
        this.pick = null;
        this.ready = false;
        
        this.statuses = [];
        this.entity = null;
        
        this.image = "black";
        
        this.playable = false;
        
        this.skillset = set_gather("flee");
        
        this.drawable = new BattlerDrawable([0, 0]);
        
        this.energyBar = new EnergyBarDrawable([0, 0]);
        this.energyBar.setCameraMode("none");
        
        this.picks = [];
    }
    
    static fromEntity(entity) {
        var battler = new this();
        
        battler.setEntity(entity);
        
        return battler;
    }
    
    getPriority() {
        return this.speedPriority;
    }
    
    setReady(ready) {this.ready = ready; return this;}
    isReady() {return this.ready;}
    
    updateStatuses() {
        for(var i = this.statuses.length; i >= 0; --i) {
            --this.statuses[i].turns;
            
            if(this.statuses[i].turns <= 0) {
                this.statuses.splice(i, 1);
            }
        }
        
        return this;
    }
    
    setEntity(entity) {this.entity = entity; return this;}
    getEntity() {return this.entity;}
    
    isPlayable() {return this.playable;}
    setPlayable(playable) {this.playable = playable; return this;}
    
    getSkills() {
        let skills = [];
        
        for(let i = 0; i < this.skillset.length; ++i) {
            if(SKILLS.hasOwnProperty(this.skillset[i])) {
                skills.push(SKILLS[this.skillset[i]]);
            }
        }
        
        return skills;
    }
    
    onadd() {
        BATTLEDRAWABLES.add(this.drawable);
        BATTLEDRAWABLES.add(this.energyBar);
        
        return this;
    }
    
    onremove() {
        BATTLEDRAWABLES.remove(this.drawable);
        BATTLEDRAWABLES.remove(this.energyBar);
        
        return this;
    }
    
    getAllies() {
        let entities = this.entity.allies;
        let allies = new SetArray();
        
        for(let i = 0; i < entities.length; ++i) {
            if(BATTLERS.includes(entities[i].getBattler())) {
                allies.add(entities[i].getBattler());
            }
        }
        
        return allies;
    }
    
    getOpponents() {
        let entities = this.entity.opponents;
        let opponents = new SetArray();
        
        for(let i = 0; i < entities.length; ++i) {
            if(BATTLERS.includes(entities[i].getBattler())) {
                opponents.add(entities[i].getBattler());
            }
        }
        
        return opponents;
    }
    
    hurt() {
        this.entity.hurt(...arguments);
        
        return this;
    }
    
    getEnergy() {return this.entity.getEnergy();}
    
    update() {
        let energyRatio = this.entity.getEnergyRatio();
        
        this.energyBar.setXM(this.drawable.getXM());
        this.energyBar.setY2(this.drawable.getY());
        this.energyBar.setEnergyRatio(energyRatio);
        
        return this;
    }
    
    getCommandsPage() {
        return new CommandsPage(
            {"label" : new CommandLabel("Moves"), "onselect" : function onselect() {
                let commandsPage = new CommandsPage();
                
                let skills = this.battler.getSkills();
                
                for(let i = 0; i < skills.length; ++i) {
                    commandsPage.push({"label" : skills[i].getLabel(), "onselect" : function onselect() {
                        let skill = (new skills[i]()).setUser(this.battler);
                        
                        /**/
                        
                        SKILLS_QUEUE.push(skill);
                        this.battler.picks.push(skill);
                        commands.pop();
                        
                        /**
                        
                        let commandsPage = new CommandsPage();
                        
                        commandsPage.push({"label" : new CommandLabel("OK"), "onselect" : function onselect() {
                            SKILLS_QUEUE.push(skill);
                            this.battler.picks.push(skill);
                            commands.pop(); commands.pop();
                        }, "battler" : this.battler});
                        
                        let opponents = this.battler.getOpponents();
                        let opponentsPart = [];
                        
                        for(let j = 0; j < opponents.length; ++j) {
                            opponentsPart.push({"label" : new CommandLabel(camelToSentence(opponents.constructor.name)), "onselect" : function onselect() {
                                
                            }, "battler" : this.battler});
                        }
                        
                        commandsPage.push({"label" : new CommandLabel("All opponents"), "onselect" : function onselect() {
                            
                        }, "battler" : this.battler});
                        
                        commands.push(commandsPage);
                        
                        /**/
                    }, "battler" : this.battler});
                }
                
                commands.push(commandsPage);
            }, "battler" : this},
            {"label" : new CommandLabel("Cancel"), "onselect" : function onselect() {
                SKILLS_QUEUE.remove(this.battler.picks.pop());
            }, "battler" : this},
            {"label" : new CommandLabel("Done"), "onselect" : function onselect() {
                this.battler.setReady(true);
                commands.pop();
            }, "battler" : this}
        );
    }
}

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

class HapleBattler extends Battler {
    constructor() {
        super().setPlayable(true);
        
        this.skillset = set_gather("attack", "flee");
        this.drawable.setStyle(ANIM_HAPLE["std-right"]);
        // this.drawable.setSize([16, 16]);
    }
}

class EnemyBattler extends Battler {
    constructor() {
        super();
        
        this.skillset = set_gather("enemyAttack");
        this.drawable.setStyle("purple");
        // this.drawable.setSize([24, 24]);
        
        this.energyBar.setEnergyTransition(ENETRA_ENEMY);
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

class BattlerDrawable extends RectangleDrawable {
    constructor(position, size = [2 * CANVAS.width / 16, 2 * CANVAS.height / 9]) {
        super(position, size);
        this.style = "black";
        this.setCameraMode("none");
    }
}

class CommandLabel extends RectangleDrawable {
    constructor(label) {
        super([0, 0], [CANVAS.width/2, CANVAS.height/9]);
        this.setCameraMode("none");
        
        this.normalStyle = makeCommandLabel(label);
        this.selectStyle = makeSelectCommandLabel(label);
    }
    
    draw(context) {
        this.style = this.normalStyle;
        
        return super.draw(context);
    }
    
    drawSelect(context) {
        this.style = this.selectStyle;
        
        return super.draw(context);
    }
}
