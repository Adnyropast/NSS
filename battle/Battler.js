
const BATTLESPACE_LEFT = 6;
const BATTLESPACE_RIGHT = 2;
const BATTLESPACE_ALLIES = 4;
const BATTLESPACE_OPPONENTS = 4;
const BATTLESPACE_CENTER = 16;

class Battler {
    constructor() {
        this.speedPriority = 0;
        this.pick = null;
        this.ready = false;
        
        this.statuses = [];
        this.entity = null;
        
        this.playable = false;
        
        this.skillset = set_gather("flee");
        
        this.drawable = new BattlerDrawable([0, 0]);
        
        this.energyBar = new EnergyBarDrawable([0, 0]);
        this.energyBar.setProperWidth(rectangle_averageSize(this.drawable), 10/36, 3/36);
        this.energyBar.setEnergyTransition(ENETRA_DEFMAX);
        
        this.moves = new SetArray();
        
        this.controllers = new SetArray();
        
        this.strategyControllers = new SetArray();
        
        this.autoMoveSelectController = function autoMoveSelectController() {
            const move = new SKILLS["enemyAttack"];
            Array.prototype.push.apply(move.targets, this.getOpponents());
            
            this.addMove(move);
            this.setReady(true);
        };
        
        this.strategyControllers.add(this.autoMoveSelectController);
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
        BATTLELOOP.addDrawable(this.drawable);
        BATTLELOOP.addDrawable(this.energyBar);
        
        return this;
    }
    
    onremove() {
        BATTLELOOP.removeDrawable(this.drawable);
        BATTLELOOP.removeDrawable(this.energyBar);
        
        return this;
    }
    
    getAllies() {
        let entities = this.entity.allies;
        let allies = new SetArray();
        
        for(let i = 0; i < entities.length; ++i) {
            if(BATTLELOOP.battlers.includes(entities[i].getBattler())) {
                allies.add(entities[i].getBattler());
            }
        }
        
        return allies;
    }
    
    getOpponents() {
        let entities = this.entity.opponents;
        let opponents = new SetArray();
        
        for(let i = 0; i < entities.length; ++i) {
            if(BATTLELOOP.battlers.includes(entities[i].getBattler())) {
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
        for(let i in this.controllers) {
            this.controllers[i].bind(this)();
        }
        
        this.updateDrawable();
        
        if(this.getEnergy() <= 0) {
            removeBattler(this);
        }
        
        return this;
    }
    
    /**
     * Reposition battlers so that this battler is centered, allies to the left, opponents to the right.
     */
    
    makeCenter() {
        const camera = BATTLELOOP.getCamera();
        const allies = this.getAllies();
        const opponents = this.getOpponents();
        
        allies.remove(this);
        
        const battlers = allies.concat([this], opponents);
        
        // 
        
        // let space = 16;
        let totalWidth = 0;// 2 * space;
        totalWidth += BATTLESPACE_LEFT;
        
        for(let i = 0; i < allies.length; ++i) {
            const battler = allies[i];
            
            totalWidth += battler.getLeftSpace() + battler.drawable.getWidth() + battler.getRightSpace();
            
            totalWidth += BATTLESPACE_ALLIES;
        }
        
        totalWidth += this.getLeftSpace() + this.drawable.getWidth() + this.getRightSpace();
        
        totalWidth += BATTLESPACE_CENTER;
        
        for(let i = 0; i < opponents.length; ++i) {
            const battler = opponents[i];
            
            totalWidth += battler.getLeftSpace() + battler.drawable.getWidth() + battler.getRightSpace();
            
            if(i < opponents.length - 1) {
                totalWidth += BATTLESPACE_OPPONENTS;
            }
        }
        
        totalWidth += BATTLESPACE_RIGHT;
        
        // 
        
        let properHeight = totalWidth * camera.getHeight() / camera.getWidth();
        
        let battlerX = -totalWidth / 2;// + space;
        battlerX += BATTLESPACE_LEFT;
        
        for(let i = 0; i < allies.length; ++i) {
            const battler = allies[i];
            
            battlerX += battler.getLeftSpace();
            battler.drawable.setX(battlerX);
            battlerX += battler.drawable.getWidth() + battler.getRightSpace();
            
            battlerX += BATTLESPACE_ALLIES;
        }
        
        battlerX += this.getLeftSpace();
        this.drawable.setX(battlerX);
        battlerX += this.drawable.getWidth() + this.getRightSpace();
        
        battlerX += BATTLESPACE_CENTER;
        
        for(let i = 0; i < opponents.length; ++i) {
            const battler = opponents[i];
            
            battlerX += battler.getLeftSpace();
            
            battler.drawable.setX(battlerX);
            
            battlerX += battler.drawable.getWidth() + battler.getRightSpace();// + space;
            
            if(i < opponents.length - 1) {
                battlerX += BATTLESPACE_OPPONENTS;
            }
        }
        
        // battlerX += BATTLESPACE_RIGHT;
        
        for(let i = 0; i < battlers.length; ++i) {
            const battler = battlers[i];
            
            battler.drawable.setY2(random(BATTLEMINY2, BATTLEMAXY2));
        }
        
        if(totalWidth < 112) {
            totalWidth = 112;
            properHeight = totalWidth * camera.getHeight() / camera.getWidth();
        }
        
        camera.setSizeM([totalWidth, properHeight]);
        camera.setY2(properHeight / 2 - 0.125 * (totalWidth - 112));
        camera.originalSize = camera.size;
        
        return this;
    }
    
    updateDrawable() {
        const energyRatio = this.entity.getEnergyRatio();
        
        this.energyBar.setXM(this.drawable.getXM());
        this.energyBar.setY2(this.drawable.getY1());
        this.energyBar.setEnergyRatio(energyRatio);
        
        return this;
    }
    
    addMove(move) {
        move.setUser(this);
        move.moveCountBefore = this.getMoveCount();
        
        addMove(move);
        this.moves.add(move);
        
        return this;
    }
    
    onturnstart() {
        return this;
    }
    
    onturnend() {
        return this;
    }
    
    strategyUpdate() {
        for(let i in this.strategyControllers) {
            this.strategyControllers[i].bind(this)();
        }
        
        return this;
    }
    
    setSpeedPriority(speedPriority) {
        this.speedPriority = speedPriority;
        
        return this;
    }
    
    getMoveCount() {return this.moves.length;}
    
    getLeftSpace() {
        return 0;
    }
    
    getRightSpace() {
        return 0;
    }
}

class HapleBattler extends Battler {
    constructor() {
        super().setPlayable(true);
        
        const battler = this;
        
        this.skillset = set_gather("attack", "flee");
        this.drawable.setStyle(IMGCHAR["haple"]["battle-right"]);
        // this.drawable.setSize([16, 16]);
        
        this.visibleList = (new VisibleList()).setType("auto");
        
        // this.visibleList.addItem({name:"Weak Attack", use:function use() {
            
        // }});
        this.visibleList.addItem({name:"Attack", use:function use() {
            const move = new SKILLS["attack"];
            battler.prepareMove(move);
            battler.setControlType("targetPick");
        }});
        // this.visibleList.addItem({name:"Strong Attack", use:function use() {
            
        // }});
        // this.visibleList.addItem({name:"Defend", use:function use() {
            
        // }});
        this.visibleList.addItem({name:"Flee", use:function use() {
            battler.addMove(new SKILLS["flee"]);
            battler.setReady(true);
        }});
        this.visibleList.addItem({name:"Go!"/*"Pass"*/, use:function use() {
            battler.setReady(true);
        }});
        
        this.autoReady = true;
        this.targetIndex = 0;
        this.preparedMove = null;
        
        this.moveSelectController = function moveSelectController() {
            if(keyList.value(K_UP) === 1) {
                this.visibleList.decIndex();
            } if(keyList.value(K_DOWN) === 1) {
                this.visibleList.incIndex();
            }
            
            if(keyList.value(set_gather(K_CONFIRM, KEY_SPACE)) === 1 || keyList.value(K_RIGHT) === 1) {
                this.visibleList.getItem().use();
            }
            
            if(keyList.value(KEY_ESCAPE) === 1 || keyList.value(K_LEFT) === 1) {
                removeMove(this.moves.pop());
            }
        };
        
        this.targetPickController = function targetPickController() {
            const preparedMove = this.preparedMove;
            
            // Move target cursor.
            
            if(keyList.value(K_LEFT) === 1) {
                --this.targetIndex;
            } if(keyList.value(K_RIGHT) === 1) {
                ++this.targetIndex;
            }
            
            if(this.targetIndex < 0) {this.targetIndex = 0;}
            if(this.targetIndex >= BATTLERS.length) {this.targetIndex = BATTLERS.length - 1;}
            
            // Pick / Cancel target.
            
            if(keyList.value(K_DOWN) === 1) {
                const target = getSortedBattlers()[this.targetIndex];
                
                if(preparedMove.targets.indexOf(target) === -1) {
                    preparedMove.targets.add(target);
                    
                    const crosshair = new TargetedCrosshairDrawable(target.drawable.getPositionM());
                    crosshair.target = target;
                    this.targetedCrosshairs.add(crosshair);
                    addDrawable(crosshair);
                }
            } if(keyList.value(K_UP) === 1) {
                const target = getSortedBattlers()[this.targetIndex];
                
                const crosshair = this.targetedCrosshairs.find(function(crosshair) {
                    return crosshair.target === target;
                });
                
                preparedMove.targets.remove(target);
                
                this.targetedCrosshairs.remove(crosshair);
                BATTLELOOP.removeDrawable(crosshair);
            }
            
            // Confirm target.
            
            if(keyList.value(KEY_SPACE) === 1) {
                this.addMove(preparedMove);
                this.prepareMove(null);
                this.setControlType("moveSelect");
            }
            
            if(keyList.value(K_CONFIRM) === 1) {
                this.addMove(preparedMove);
                this.prepareMove(null);
                this.setControlType("moveSelect");
                
                if(this.autoReady) {
                    this.setReady(true);
                }
            }
            
            // Cancel prepared move.
            
            if(keyList.value(K_ESC) === 1) {
                this.prepareMove(null);
                this.setControlType("moveSelect");
            }
        };
        
        this.multiDrawable = (new MultiDrawable()).setCamera(this.drawable.getCamera());
        this.selectedColorTransition = (new ColorTransition([255, 255, 0, 1], [255, 255, 159, 1], 128)).setLoop(true);
        
        this.targetDiamond = PolygonDrawable.from(diamondparticle);
        this.targetDiamond.setStyle((new ColorTransition([0, 255, 255, 1], [0, 191, 255, 1], 64)).setLoop(true));
        this.targetDiamond.multiplySize(1/4);
        
        this.controllers.clear();
        this.strategyControllers.clear();
        
        this.targetedCrosshairs = new SetArray();
    }
    
    updateDrawable() {
        super.updateDrawable();
        
        this.multiDrawable.drawables.clear();
        
        if(this.getControlType() === "moveSelect") {
            
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
        }
        
        else if(this.getControlType() === "targetPick") {
            const targetDrawable = getSortedBattlers()[this.targetIndex].drawable;
            
            this.targetDiamond.setPositionM(Vector.addition(targetDrawable.getPositionM(), [0, -targetDrawable.getHeight()/2 - 8]));
        }
        
        return this;
    }
    
    onturnstart() {
        this.setControlType("moveSelect");
        BATTLELOOP.addDrawable(this.multiDrawable);
        
        return this;
    }
    
    onturnend() {
        this.strategyControllers.clear();
        for(let i in this.strategyControllers) {
            delete this.strategyControllers[i];
        }
        
        BATTLELOOP.removeDrawable(this.multiDrawable);
        
        return this;
    }
    
    setControlType(controlType) {
        
        // Clearing stuffs associated with the previous control type.
        
        if(this.getControlType() === "targetPick") {
            BATTLELOOP.removeDrawable(this.targetDiamond);
            BATTLELOOP.removeDrawables(this.targetedCrosshairs);
            this.targetedCrosshairs.clear();
        }
        
        // Settings stuffs associated with the new control type.
        
        if(controlType === "moveSelect") {
            this.strategyControllers["main"] = this.moveSelectController;
        }
        
        else if(controlType === "targetPick") {
            this.targetIndex = this.getFirstOpponentIndex();
            BATTLELOOP.addDrawable(this.targetDiamond);
            
            this.strategyControllers["main"] = this.targetPickController;
        }
        
        return this;
    }
    
    getControlType() {
        if(this.strategyControllers["main"] === this.moveSelectController) {
            return "moveSelect";
        }
        
        if(this.strategyControllers["main"] === this.targetPickController) {
            return "targetPick";
        }
        
        return null;
    }
    
    prepareMove(move) {
        this.preparedMove = move;
        
        return this;
    }
    
    getPreparedMove() {
        return this.preparedMove;
    }
    
    getFirstOpponentIndex() {
        const battlers = getSortedBattlers();
        const opponents = this.getOpponents();
        
        for(let i = 0; i < battlers.length; ++i) {
            if(opponents.includes(battlers[i])) {
                return i;
            }
        }
        
        return -1;
    }
    
    getFirstAllyIndex() {
        const battlers = getSortedBattlers();
        const allies = this.getOpponents();
        
        for(let i = 0; i < battlers.length; ++i) {
            if(allies.includes(battlers[i])) {
                return i;
            }
        }
        
        return -1;
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
        this.style = "black";
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

function getSortedBattlers() {
    const battlers = SetArray.from(BATTLELOOP.battlers);
    
    array_bubbleSort(battlers, function(a, b) {
        const aX = a.drawable.getX();
        const bX = b.drawable.getX();
        
        if(aX > bX) {return +1;}
        if(aX < bX) {return -1;}
        return 0;
    });
    
    return battlers;
}
