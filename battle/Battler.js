
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
        this.energyBar.setProperWidth(rectangle_averageSize(this.drawable));
        // this.energyBar.setCameraMode("none");
        this.energyBar.setCamera(BATTLECAMERA);
        
        this.picks = new SetArray();
        
        this.controllers = new SetArray();
    }
    
    static fromEntity(entity) {
        var battler = new this();
        
        battler.setEntity(entity);
        
        return battler;
    }
    
    getPriority() {
        return this.speedPriority;
    }
    
    setReady(ready) {
        this.ready = ready;
        
        this.onturnend();
        
        return this;
    }
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
        for(let i = 0; i < this.controllers.length; ++i) {
            this.controllers[i].bind(this)();
        }
        
        this.updateDrawable();
        
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
    
    oncenterin() {
        let space = 16;
        let totalWidth = 2 * space;
        
        // this.drawable.setX2(-16).setYM(0);
        
        let allies = this.getAllies();
        let opponents = this.getOpponents();
        
        allies.remove(this);
        
        let battlers = allies.concat([this], opponents);
        
        for(let i = 0; i < battlers.length; ++i) {
            let battler = battlers[i];
            
            totalWidth += battler.drawable.getWidth();
            
            if(i < battlers.length - 1) {
                totalWidth += space;
            }
        }
        
        let properHeight = BATTLECAMERA.getHeight() * totalWidth / BATTLECAMERA.getWidth();
        
        let battlerX = -totalWidth / 2 + space;
        
        for(let i = 0; i < battlers.length; ++i) {
            let battler = battlers[i];
            
            battler.drawable.setX(battlerX);
            
            battlerX += battler.drawable.getWidth() + space;
            
            let minY = -properHeight/2 + this.drawable.getHeight(), maxY = +properHeight/2 - this.drawable.getHeight();
            if(battler == this) {minY = 0; maxY = 0;}
            
            let yTransition = new ColorTransition([0, 0], [minY, maxY]);
            
            let prog = Math.abs(i - battlers.length/2) / (battlers.length/2);
            
            minY = yTransition.at(prog)[0];
            maxY = yTransition.at(prog)[1];
            
            battler.drawable.setYM(Math.floor(Math.random() * (maxY - minY) + minY));
        }
        
        /*  *
        
        let alliesWidth = 0;
        
        for(let i = 0; i < allies.length; ++i) {
            alliesWidth += allies[i].drawable.getWidth();
            
            if(i < allies.length - 1) {
                alliesWidth += space;
            }
        }
        
        for(let j = 0; j < allies.length; ++j) {
            let ally = allies[j];
            
            if(allies[j] != this) {
                // allies[j].drawable.setX((5 - j) * CANVAS.width / 16);
                // allies[j].drawable.setY(4 * CANVAS.height / 9);
                let minX = -BATTLECAMERA.getWidth()/2 + ally.drawable.getWidth();
                let maxX = -16 - this.drawable.getWidth();
                
                allies[j].drawable.setX2(Math.floor(Math.random() * (maxX - minX) + minX));
                
                let minY = (-BATTLECAMERA.getWidth() + ally.drawable.getHeight()) / 2;
                let maxY = (+BATTLECAMERA.getWidth() - ally.drawable.getHeight()) / 2;
                
                ally.drawable.setYM(Math.floor(Math.random() * (maxY - minY) + minY));
            }
        }
        
        let opponentsWidth = 0;
        
        for(let i = 0; i < opponents.length; ++i) {
            opponentsWidth += opponents[i].drawable.getWidth();
            
            if(i < opponents.length - 1) {
                opponentsWidth += space;
            }
        }
        
        let opponentX = 0;
        
        for(let j = 0; j < opponents.length; ++j) {
            let opponent = opponents[j];
            
            // opponents[j].drawable.setX((9 + j) * CANVAS.width / 16);
            // opponents[j].drawable.setY(3 * CANVAS.height / 9);
            
            let maxX = +BATTLECAMERA.getWidth()/2 - opponent.drawable.getWidth();
            let minX = +16 + this.drawable.getWidth();
            
            // opponent.drawable.setX(Math.floor(Math.random() * (maxX - minX) + minX));
            opponent.drawable.setX(opponentX);
            opponentX += this.drawable.getWidth() + space;
            
            let minY = (-BATTLECAMERA.getWidth() + opponent.drawable.getHeight()) / 2;
            let maxY = (+BATTLECAMERA.getWidth() - opponent.drawable.getHeight()) / 2;
            minY = -16; maxY = +16;
            
            opponent.drawable.setYM(Math.floor(Math.random() * (maxY - minY) + minY));
        }
        
        totalWidth = alliesWidth + space + this.drawable.getWidth() + space + opponentsWidth;
        
        /**/
        
        BATTLECAMERA.setSizeM([totalWidth, properHeight]);
        
        return this;
    }
    
    oncenterout() {
        return this;
    }
    
    updateDrawable() {
        let energyRatio = this.entity.getEnergyRatio();
        
        this.energyBar.setXM(this.drawable.getXM());
        this.energyBar.setY2(this.drawable.getY());
        this.energyBar.setEnergyRatio(energyRatio);
        
        return this;
    }
    
    addPick(skill) {
        skill.setUser(this);
        SKILLS_QUEUE.add(skill);
        this.picks.add(skill);
        
        return this;
    }
    
    onturnstart() {return this;}
    onturnend() {return this;}
}

class HapleBattler extends Battler {
    constructor() {
        super().setPlayable(true);
        
        let battler = this;
        
        this.skillset = set_gather("attack", "flee");
        this.drawable.setStyle(IMGCHAR["haple"]["battle-right"]);
        // this.drawable.setSize([16, 16]);
        
        this.visibleList = (new VisibleList()).setType("auto");
        
        this.visibleList.addItem({name:"Weak Attack", use:function use() {
            
        }});
        this.visibleList.addItem({name:"Attack", use:function use() {
            let skill = new SKILLS["attack"];
            battler.selectedMove = skill;
            battler.controltype = "targetpick";
            battler.autoReady = false;
            // battler.addPick(skill);
        }});
        this.visibleList.addItem({name:"Strong Attack", use:function use() {
            
        }});
        this.visibleList.addItem({name:"Defend", use:function use() {
            
        }});
        this.visibleList.addItem({name:"Pass", use:function use() {
            
        }});
        this.visibleList.addItem({name:"Flee", use:function use() {
            battler.addPick(new SKILLS["flee"]);
        }});
        
        this.autoReady = true;
        this.controltype = ["moveselect", "targetpick"][0];
        this.targetcursor = 0;
        this.selectedMove = null;
        
        this.targets = new SetArray();
        
        this.battlerPlayerController = function() {
            if(this.controltype === "moveselect") {
                if(keyList.value(K_UP) == 1) {
                    this.visibleList.decIndex();
                } if(keyList.value(K_DOWN) == 1) {
                    this.visibleList.incIndex();
                } if(keyList.value(13) == 1) {
                    this.visibleList.getItem().use();
                    
                    if(this.autoReady) {
                        this.setReady(true);
                    }
                }
            } else if(this.controltype === "targetpick") {
                if(keyList.value(K_LEFT) == 1) {
                    --this.targetcursor;
                    
                    if(this.targetcursor < 0) {this.targetcursor = 0;}
                } if(keyList.value(K_RIGHT) == 1) {
                    ++this.targetcursor;
                    
                    if(this.targetcursor >= BATTLERS.length) {this.targetcursor = BATTLERS.length - 1;}
                } if(keyList.value(K_UP) == 1) {
                    this.targets[this.targetcursor] = true;
                } if(keyList.value(K_DOWN) == 1) {
                    this.targets[this.targetcursor] = false;
                } if(keyList.value(K_CONFIRM) == 1) {
                    let targets = [];
                    
                    for(let i = 0; i < BATTLERS.length; ++i) {
                        if(this.targets[i]) {
                            targets.push(BATTLERS[i]);
                        }
                    }
                    
                    this.selectedMove.targets.push.apply(this.selectedMove.targets, targets);
                    this.addPick(this.selectedMove);
                    this.autoReady = true;
                    this.controltype = "moveselect";
                    this.setReady(true);
                } if(keyList.value(K_ESC) == 1) {
                    this.autoReady = true;
                    this.controltype = "moveselect";
                }
            }
        };
        
        this.multiDrawable = (new MultiDrawable()).setCamera(this.drawable.getCamera());
        this.selectedColorTransition = (new ColorTransition([255, 255, 0, 1], [255, 255, 159, 1], 128)).setLoop(true);
        
        this.targetDrawable = PolygonDrawable.from(diamondparticle);
        this.targetDrawable.setStyle((new ColorTransition([0, 255, 255, 1], [0, 191, 255, 1], 64)).setLoop(true));
        this.targetDrawable.setCamera(this.drawable.camera).setCameraMode(this.drawable.cameraMode);
        this.targetDrawable.multiplySize(1/4);
    }
    
    getCommandsPage() {
        let battler = this;
        
        return new CommandsPage(
            {"label" : new CommandLabel("something"), "onselect" : function onselect() {
                battler.setReady(true);
            }},
            {"label" : new CommandLabel("something"), "onselect" : function onselect() {
                
            }},
            {"label" : new CommandLabel("something"), "onselect" : function onselect() {
                
            }}
        );
    }
    
    updateDrawable() {
        super.updateDrawable();
        
        this.multiDrawable.drawables.clear();
        
        let visibleOptions = this.visibleList.getVisible();
        
        tfparams["positioning"] = 0.5;
        tfparams["padding-top"] = 8;
        
        for(let i = 0; i < visibleOptions.length; ++i) {
            let angle = i * Math.PI / 8;
            
            let option = (new TextRectangleDrawable([this.drawable.getXM() + 4*Math.cos(angle), this.drawable.getYM() + 4*i], [32, 4]));
            option.textEnhance = 16;
            option.setContent(visibleOptions[i].name);
            
            if(visibleOptions[i] == this.visibleList.getItem()) {
                // option.setStyle("yellow");
                option.setStyle(this.selectedColorTransition.getNextStyle());
            }
            
            this.multiDrawable.add(option);
        }
        
        tfparams["positioning"] = 0;
        tfparams["padding-top"] = 0;
        
        // this.drawable.
        
        if(this.controltype === "targetpick") {
            BATTLEDRAWABLES.add(this.targetDrawable);
            
            let drawable = BATTLERS[this.targetcursor].drawable;
            
            this.targetDrawable.setPositionM(Vector.addition(drawable.getPositionM(), [0, -drawable.getHeight()/2 - 8]));
        } else {
            BATTLEDRAWABLES.remove(this.targetDrawable);
        }
        
        return this;
    }
    
    onturnstart() {
        this.controllers.add(this.battlerPlayerController);
        BATTLEDRAWABLES.add(this.multiDrawable);
        
        return this;
    }
    
    onturnend() {
        this.controllers.remove(this.battlerPlayerController);
        BATTLEDRAWABLES.remove(this.multiDrawable);
        
        return this;
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

class BattlerDrawable extends RectangleDrawable {
    constructor(position, size = [16, 16]) {
        super(position, size);
        this.style = "white";
        // this.setCameraMode("none");
        this.setCamera(BATTLECAMERA);
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
