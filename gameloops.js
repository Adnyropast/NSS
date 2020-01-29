
class GameLoop {
    constructor() {
        this.drawables = new SetArray();
        this.entities = new SetArray();
        this.collidables = new SetArray();
        this.camera = null;
        
        this.counter = 0; -1;
        this.counterLimit = Infinity;
        this.controllers = new SetArray();
    }
    
    update() {
        for(let i = 0; i < this.controllers.length; ++i) {
            this.controllers[i].bind(this)();
        }
        
        ++this.counter;
        if(this.counter > this.counterLimit) {this.counter = this.counterLimit;}
        
        return this;
    }
    
    setCamera(camera) {
        this.camera = camera;
        this.addEntity(camera);
        
        return this;
    }
    
    getCamera() {return this.camera;}
    
    getDrawables() {return this.drawables;}
    addDrawable(drawable) {
        if(drawable == null) {
            return null;
        }
        
        drawable.setCamera(this.camera);
        this.drawables.add(drawable);
        
        return this;
    }
    
    removeDrawable(drawable) {
        this.drawables.remove(drawable);
        
        return this;
    }
    
    getCollidables() {return this.collidables;}
    
    addEntity(entity) {
        entity.gameLoop = this;
        entity.onadd();
        
        this.entities.add(entity);
        
        if(entity.isCollidable()) {
            this.collidables.add(entity);
        }
        
        return this;
    }
    
    getEntities() {return this.entities;}
    
    addEntities(entities) {
        for(var i = 0; i < entities.length; ++i) {
            this.addEntity(entities[i]);
        }
        
        return this;
    }
    
    removeEntity(entity) {
        if(entity instanceof Entity) {
            entity.onremove();
        }
        
        this.entities.remove(entity);
        this.collidables.remove(entity);
        
        return this;
    }
    
    clearSets() {
        this.entities.clear();
        this.collidables.clear();
        this.drawables.clear();
        
        return this;
    }
    
    draw(drawables = this.drawables) {
        const context = CANVAS.getContext("2d");
        
        for(let i = 0; i < drawables.length; ++i) {
            const drawable = drawables[i];
            
            /**
            if(i < drawables.length - 1 && drawables[i].getZIndex() < drawables[i + 1].getZIndex()) {
                var drawable = drawables[i + 1];
                drawables[i + 1] = drawables[i];
                drawables[i] = drawable;
            }
            /**/
            
            drawable.update();
            drawable.draw(context);
        }
        
        return this;
    }
}

class WorldLoop extends GameLoop {
    constructor() {
        super();
    }
    
    setCamera(camera) {
        CAMERA = camera;
        return super.setCamera(camera);
    }
    
    removeEntity(entity) {
        super.removeEntity(entity);
        
        if(entity == PLAYER) {
            PLAYER = null;
        }
        
        return this;
    }
    
    clearSets() {
        super.clearSets();
        
        ALLIES_.clear();
        OPPONENTS_.clear();
        
        return this;
    }
}

class BattleLoop extends GameLoop {
    
}

const GAMELOOP = new GameLoop();
const WORLDLOOP = new WorldLoop();
const BATTLELOOP = new BattleLoop();
const ESCAPELOOP = new GameLoop();

const NOENTITY = new SetArray();
// const ENTITIES = new SetArray();
// const COLLIDABLES = new SetArray();
// const DRAWABLES = new SetArray();
// const PLAYABLES = new SetArray();
var CAMERA = null;
var PLAYER = null;

const INTERACTORS = [];
const INTERRECIPIENTS = [];

let ALLIES_ = new SetArray();
let OPPONENTS_ = new SetArray();
let OBSTACLES = new SetArray();
let NONOBSTACLES = new SetArray();

function addEntity(entity) {
    if(gamePhase === WORLDLOOP) {
        WORLDLOOP.addEntity(entity);
    } else if(gamePhase === BATTLELOOP) {
        BATTLELOOP.addEntity(entity);
    } else if(gamePhase === ESCAPELOOP) {
        WORLDLOOP.addEntity(entity);
    }
}

function removeEntity(entity) {
    if(gamePhase === WORLDLOOP) {
        WORLDLOOP.removeEntity(entity);
    } else if(gamePhase === BATTLELOOP) {
        BATTLELOOP.removeEntity(entity);
    } else if(gamePhase === ESCAPELOOP) {
        WORLDLOOP.removeEntity(entity);
    }
}

function addDrawable(drawable) {
    if(gamePhase === WORLDLOOP) {
        WORLDLOOP.addDrawable(drawable);
    } else if(gamePhase === BATTLELOOP) {
        BATTLELOOP.addDrawable(drawable);
    } else if(gamePhase === ESCAPELOOP) {
        WORLDLOOP.addDrawable(drawable);
    }
}

function removeDrawable(drawable) {
    WORLDLOOP.removeDrawable(drawable);
    BATTLELOOP.removeDrawable(drawable);
    GAMELOOP.removeDrawable(drawable);
    
    if(drawable === COVERDRAWABLE) {
        COVERDRAWABLE = null;
    }
}

function addInteractor(interactor) {
    for(var i = 0; i < INTERACTORS.length; ++i) {
        if(INTERACTORS[i].id == interactor.getId()) {
            INTERACTORS[i].array.add(interactor);
            return;
        }
    }
    
    INTERACTORS.push({"id" : interactor.getId(), "array" : new SetArray(interactor)});
    /**
    if(INTERACTORS.hasOwnProperty(interactor.getId())) {
        INTERACTORS[interactor.getId()].add(interactor);
    } else {
        INTERACTORS[interactor.getId()] = new SetArray(interactor);
    }
    /**/
}

function addInterrecipient(interrecipient) {
    for(var i = 0; i < INTERRECIPIENTS.length; ++i) {
        if(INTERRECIPIENTS[i].id == interrecipient.getId()) {
            INTERRECIPIENTS[i].array.add(interrecipient);
            return;
        }
    }
    
    INTERRECIPIENTS.push({"id" : interrecipient.getId(), "array" : new SetArray(interrecipient)});
    /**
    if(INTERRECIPIENTS.hasOwnProperty(interrecipient.getId())) {
        INTERRECIPIENTS[interrecipient.getId()].add(interrecipient);
    } else {
        INTERRECIPIENTS[interrecipient.getId()] = new SetArray(interrecipient);
    }
    /**/
}

function removeInteractor(interactor) {
    for(var i = INTERACTORS.length - 1; i >= 0; --i) {
        if(INTERACTORS[i].id == interactor.getId()) {
            var array = INTERACTORS[i].array;
            
            for(var j = array.length - 1; j >= 0; --j) {
                if(array[j] == interactor) {
                    array.splice(j, 1);
                }
            }
            
            if(array.length == 0) {
                INTERACTORS.splice(i, 1);
            }
        }
    }
    
    /**
    if(INTERACTORS.hasOwnProperty(interactor.getId())) {
        INTERACTORS[interactor.getId()].remove(interactor);
    }
    /**/
}

function removeInterrecipient(interrecipient) {
    for(var i = INTERRECIPIENTS.length - 1; i >= 0; --i) {
        if(INTERRECIPIENTS[i].id == interrecipient.getId()) {
            var array = INTERRECIPIENTS[i].array;
            
            for(var j = array.length - 1; j >= 0; --j) {
                if(array[j] == interrecipient) {
                    array.splice(j, 1);
                }
            }
            
            if(array.length == 0) {
                INTERRECIPIENTS.splice(i, 1);
            }
        }
    }
    
    /**
    if(INTERRECIPIENTS.hasOwnProperty(interrecipient.getId())) {
        INTERRECIPIENTS[interrecipient.getId()].remove(interrecipient);
    }
    /**/
}

function setPlayer(entity) {
    PLAYER = entity;
    PLAYERS[0].entity = entity;
    entity.addInteraction(new MapWarpable);
    entity.battler.setPlayable(true);
    // CAMERA.target = entity;
    CAMERA.targets.clear().add(entity);
    
    entity.addEventListener("defeat", function() {
        setGameTimeout(function() {
            transitionIn();
        }, 48);
        setGameTimeout(function() {
            loadMap(getCurrentSave().lastMap);
            transitionOut();
        }, 64);
    });
    
    entity.addInteraction(new ItemPicker());
    
    entity.addEventListener("hurt", function() {
        ++hitsCount;
    });
    
    addEntity(entity);
}

function setCamera(camera) {
    WORLDLOOP.setCamera(camera);
}

addEventListener("blur", gamePause);
addEventListener("focus", gameResume);

/**/

let loadZone = new Entity([NaN, NaN, NaN], [896, 504, 896]);

function worldUpdate() {
    loadZone.setPositionM(this.camera.getPositionM());
    loadZone.updateReset();
    
    array_bubbleSort(this.entities, function(a, b) {
        if(a.order > b.order) {return +1;}
        if(a.order < b.order) {return -1;}
        return 0;
    });
    
    let entities = this.entities.filter(function(entity) {
        if(entity.alwaysLoad) return true;
        
        return loadZone.collides(entity) && !entity.isFrozen();
    });
    
    /**
    
    this.collidables.sort(function(a, b) {
        if(a.collide_priority < b.collide_priority) {return -1;}
        if(a.collide_priority > b.collide_priority) {return +1;}
        return 0;
    });
    
    let collidables = this.collidables.filter(function(collidable) {
        return loadZone.collides(collidable) && !collidable.isFrozen();
    });
    
    /*/
    
    let collidables = entities.filter(function(entity) {
        return entity.isCollidable();
    });
    
    /**
    
    this.drawables.sort(function(a, b) {
        /*  *
        
        let distA = Vector.subtraction(a.getPositionM(), CAMERA.position).getNorm();
        let distB = Vector.subtraction(b.getPositionM(), CAMERA.position).getNorm();
        
        if(distA < distB) {
            return -1;
        } if(distA > distB) {
            return +1;
        }
        
        /*
        
        if(a.getZIndex() > b.getZIndex()) {
            return -1;
        } if(a.getZIndex() < b.getZIndex()) {
            return +1;
        }
        
        /*  *
        
        return 0;
    });
    
    /**/
    
    array_bubbleSort(this.drawables, function(a, b) {
        if(a.getZIndex() > b.getZIndex()) {return -1;}
        if(a.getZIndex() < b.getZIndex()) {return +1;}
        return 0;
    });
    
    let drawables = this.drawables.filter(function(drawable) {
        if(drawable.cameraMode === "none" || drawable.cameraMode === "reproportion") {return true;}
        
        if(typeof drawable.getPositionM == "undefined") {return true;}
        
        if(drawable instanceof Rectangle) {
            for(let dim = 0; dim < 2; ++dim) {
                if(loadZone.getPosition1(dim) >= drawable.getPosition2(dim) || loadZone.getPosition2(dim) <= drawable.getPosition1(dim)) {
                    return false;
                }
            }
            
            return true;
        }
        
        let drawablePositionM = drawable.getPositionM();
        
        for(let dim = 0; dim < 2; ++dim) {
            if(loadZone.getPosition1() >= drawablePositionM[dim] || loadZone.getPosition2(dim) <= drawablePositionM[dim]) {
                return false;
            }
        }
        
        return true;
    });
    
    this.entities.forEach(function(entity) {
        entity.thaw();
    });
    
    for(var i = 0; i < entities.length; ++i) {
        var entity = entities[i];
        
        // entity.controller(entity);
        entity.update();
    }
    
    for(var i = 0; i < this.entities.length; ++i) {
        var entity = this.entities[i];
        entity.updateReset();
    }
    
    /**/
    
    for(let i = 0; i < collidables.length; ++i) {
        const collidable1 = collidables[i];
        
        /**/
        
        for(let j = i + 1; j < collidables.length; ++j) {
            const collidable2 = collidables[j];
            
            if(collidable1.collides(collidable2)) {
                collidable1.oncollision(collidable2);
                collidable2.oncollision(collidable1);
            }
        }
        
        /*/
        
        for(var j = 0; j < collidable1.whitelist.length; ++j) {
            if(collidable1.collides(collidable1.whitelist[j])) {
                collidable1.oncollision(collidable1.whitelist[j])
            }
        }
        
        /**/
    }
    
    /**/
    
    
    
    // DRAWING UPDATE
    
    this.draw(drawables);
}

WORLDLOOP.controllers.add(worldUpdate);

const BATTLERS = new SetArray();
const SKILLS_QUEUE = new SetArray();

var battleturn = 0;
var actorIndex = 0;

function addBattler(entity) {
    if(entity instanceof Entity && entity.isBattler()) {
        var battler = entity.getBattler();// Battler.fromEntity(entity);
        
        battler.onadd();
        
        BATTLERS.add(battler);
    }
}

function addBattlers(battlers) {
    for(var i = 0; i < battlers.length; ++i) {
        addBattler(battlers[i]);
    }
}

function removeBattler(battler) {
    if(battler == MAINBATTLER) {
        battler.oncenterout();
        MAINBATTLER = null;
    }
    
    battler.onremove();
    BATTLERS.remove(battler);
}

function addSkill(skill) {
    SKILLS_QUEUE.add(skill);
}

function removeSkill(skill) {
    SKILLS_QUEUE.remove(skill);
}

/**

BATTLERS.sort(function(a, b) {
    if(a.getPriority() > b.getPriority) return -1;
    if(a.getPriority() < b.getPriority) return +1;
    return 0;
});

/**/

var battleMode = "everyone";
/*
class CommandsPage extends Array {
    constructor() {
        super(...arguments);
        
        this.commandIndex = 0;
        this.drawables = [];
    }
    
    getIndex() {return this.commandIndex;}
    
    decIndex() {
        --this.commandIndex;
        
        if(this.commandIndex < 0) {
            this.commandIndex = 0;
        }
        
        return this;
    }
    
    incIndex() {
        ++this.commandIndex;
        
        if(this.commandIndex >= this.length) {
            this.commandIndex = this.length - 1;
        }
        
        return this;
    }
    
    confirm() {
        this[this.getIndex()].onselect();
        
        return this;
    }
    
    draw(context) {
        let blockWidth = CANVAS.width / 2;
        let blockHeight = CANVAS.height / 9;
        let x = CANVAS.width / 2;
        
        context.fillStyle = "#EFEFEF";
        context.fillRect(x, 6 * CANVAS.height / 9, blockWidth, CANVAS.height / 2);
        
        for(let i = 0; i < this.length; ++i) {
            let y = (6 + i) * CANVAS.height / 9;
            
            context.translate(x, y);
            
            if(i == this.getIndex()) {
                this[i].label.drawSelect(context);
            } else {
                this[i].label.draw(context);
            }
            
            context.translate(-x, -y);
        }
        
        return this;
    }
    
    update() {
        if(keyList.value(K_UP) == 1) {this.decIndex();}
        if(keyList.value(K_DOWN) == 1) {this.incIndex();}
        if(keyList.value(K_RIGHT) == 1 || keyList.value(13) == 1) {this.confirm();}
        if(keyList.value(K_LEFT) == 1) {commands.pop();}
        
        return this;
    }
}

let commands = [];
*/
let MAINBATTLER = null;

const BATTLEDRAWABLES = BATTLELOOP.drawables;

BATTLELOOP.setCamera(Camera.fromMiddle([0, 0, 0], [256, 144, 0]));

const BATTLECAMERA = BATTLELOOP.getCamera();

function setBattleViewPoint(mainBattler) {
    if(MAINBATTLER != null) {
        MAINBATTLER.oncenterout();
    }
    
    MAINBATTLER = mainBattler;
    
    if(MAINBATTLER != null) {
        MAINBATTLER.oncenterin();
    }
}

let battlePhase = "act";

let actIC = 0;

function battleUpdate() {
    if(battlePhase === "strategy") {
        var battlers;
        
        if(battleMode === "everyone") {
            battlers = BATTLERS;
        } else if(battleMode === "single") {
            battlers = new SetArray(BATTLERS[actorIndex]);
        }
        
        /**
        
        if(commands.length < 1 && MAINBATTLER != null) {
            commands.push(MAINBATTLER.getCommandsPage());
        }
        
        // /**
        
        let lastPage = commands[commands.length - 1];
        
        if(commands.length > 0) {
            lastPage.update();
        }
        
        /**
        
        for(var i = 0; i < battlers.length; ++i) {
            if(!battlers[i].isPlayable()) {
                battlers[i].setReady(true);
            }
        }
        
        /**/ 
        
        if(BATTLERS.length == 0) {
            transitionIn();
            switchPhase(WORLDLOOP);
            battlePhase = "act";
            transitionOut();
        } else {
            let allReady = true;
            
            for(var i = 0; i < battlers.length; ++i) {
                var battler = battlers[i];
                
                if(!battler.isReady()) {
                    allReady = false;
                }
            }
            
            if(allReady) {
                battlePhase = "act";
            }
        }
    }
    
    else if(battlePhase === "act") {
        if(SKILLS_QUEUE.length > 0) {
            SKILLS_QUEUE.sort(function() {
                return 0;
            });
            
            let skill = SKILLS_QUEUE[0];
            
            skill.use(actIC);
            
            ++actIC;
            
            if(!SKILLS_QUEUE.includes(skill)) {
                actIC = 0;
            }
        } else {
            ++actorIndex;
            actorIndex %= BATTLERS.length;
            battlePhase = "strategy";
            
            for(let i = 0; i < BATTLERS.length; ++i) {
                BATTLERS[i].setReady(false);
            }
            
            if(MAINBATTLER == null) {
                let battlers;
                
                if(battleMode === "everyone") {
                    battlers = BATTLERS;
                } else if(battleMode === "single") {
                    battlers = new SetArray(BATTLERS[actorIndex]);
                }
                
                for(let i = battlers.length - 1; i >= 0; --i) {
                    if(battlers[i].isPlayable()) {
                        setBattleViewPoint(battlers[i]);
                    }
                }
            }
            
            if(MAINBATTLER != null) {
                MAINBATTLER.onturnstart();
            }
        }
        
        for(let i = BATTLERS.length - 1; i >= 0; --i) {
            if(BATTLERS[i].getEnergy() <= 0) {
                removeBattler(BATTLERS[i]);
            }
        }
    }
    
    // Remove battlers without an opponent.
    
    for(let i = BATTLERS.length - 1; i >= 0; --i) {
        const battler = BATTLERS[i];
        const opponents = battler.getOpponents();
        
        if(opponents.length == 0) {
            removeBattler(battler);
        }
    }
    
    // 
    
    for(let i = 0; i < BATTLERS.length; ++i) {
        BATTLERS[i].update();
    }
    
    for(let i = 0; i < this.entities.length; ++i) {
        const entity = this.entities[i];
        entity.update();
    }
    
    for(let i = 0; i < this.entities.length; ++i) {
        const entity = this.entities[i];
        entity.updateReset();
    }
    
    // Draw battle things.
    
    array_bubbleSort(this.drawables, function(a, b) {
        if(a.getZIndex() > b.getZIndex()) {return -1;}
        if(a.getZIndex() < b.getZIndex()) {return +1;}
        return 0;
    });
    
    const context = CANVAS.getContext("2d");
    
    this.draw();
    
    for(let i = 0; i < SKILLS_QUEUE.length; ++i) {
        const skill = SKILLS_QUEUE[i];
        const drawable = new RectangleDrawable([i*16, 0], [16, 16]);
        drawable.setStyle((new ColorTransition([255, 255, 0, 1], [255, 255, 255, 0], 32)).setLoop(true));
        drawable.setCameraMode("reproportion");
        
        drawable.draw(context);
    }
}

BATTLELOOP.controllers.add(battleUpdate);

let escapeCounter = 0;

let itemIndex = 0;
let itemY = 0;
let displayHeight = 9;

let gpdSave = [];

const ESCDRAWABLES = ESCAPELOOP.drawables;

function escapeMenu() {
    const inventory = save_getCurrentInventory();
    
    const marginLR = 8, marginTB = 5;
    const spaceBetween = 4;
    const gridWidth = (640 - 2*marginLR);
    const gridHeight = (120 - 2*marginTB);
    
    const cellWidth = (gridWidth - spaceBetween * (inventory.displayWidth-1)) / inventory.displayWidth;
    const cellHeight = cellWidth;
    
    const hProp = CANVAS.width / 640;
    const vProp = CANVAS.height / 360;
    
    let gamepadDirection = gamepad_getDirection(getGamepad(0));
    
    if(Math.sign(gpdSave[0]) === Math.sign(gamepadDirection[0])) {gamepadDirection[0] = 0;}
    else {gpdSave[0] = gamepadDirection[0];}
    
    if(Math.sign(gpdSave[1]) === Math.sign(gamepadDirection[1])) {gamepadDirection[1] = 0;}
    else {gpdSave[1] = gamepadDirection[1];}
    
    if(keyList.value(K_LEFT) === 1 || gamepadDirection[0] < 0) {
        if(itemIndex > 0) {--itemIndex;}
    } if(keyList.value(K_RIGHT) === 1 || gamepadDirection[0] > 0) {
        if(itemIndex < inventory.items.length - 1) {++itemIndex;}
    } if(keyList.value(K_CONFIRM) === 1 || gamepadRec.value(BUTTON_A) === 1) {
        inventory.items[itemIndex].commands[0]();
    } if(keyList.value(222) === 1 || gamepadRec.value(BUTTON_L) === 1 || gamepadRec.value(BUTTON_B) === 1) {
        save_cdParentInventory();
    } if(keyList.value(K_UP) === 1 || gamepadDirection[1] < 0) {
        if(itemIndex >= inventory.displayWidth) {itemIndex -= inventory.displayWidth;}
    } if(keyList.value(K_DOWN) === 1 || gamepadDirection[1] > 0) {
        if(itemIndex < inventory.items.length - inventory.displayWidth) {itemIndex += inventory.displayWidth;}
    }
    
    if(keyList.value(KEY_SPACE) === 1) {
        let commands = inventory.items[itemIndex].commands;
        
        let commandsNames = [];
        
        for(let i = 0; i < commands.length; ++i) {
            commandsNames.push(commands[i].name);
        }
        
        let fontFamily = "Segoe UI";
        let textColor = "black";
        let strokeColor = "blue";
        
        let width = makeTextCanvas(longestText(commandsNames, fontFamily), 16, fontFamily, textColor, strokeColor).width;
        let height = 8;
        
        let x = itemIndex % inventory.displayWidth;
        let y = Math.floor(itemIndex / inventory.displayWidth) - itemY;
        
        x *= cellWidth + spaceBetween;
        y *= cellHeight + spaceBetween;
        
        x += marginLR + cellWidth / 2;
        y += marginTB + cellHeight / 2;
        
        x = Math.min(x, 640 - width);
        y = Math.min(y, 360 - width);
        
        let menu = new RectangleDrawable([x, y], [width, height]);
        
        menu.setCameraMode("reproportion");
        
        menu.baseWidth = 640;
        menu.baseHeight = 360;
        
        ESCDRAWABLES["menu"] = menu;
    }
    
    if(keyList.value(105) === 1) {
        let data = saveInventoryFile();
        
        if(data.success) {
            alert("Saved as \"" + data.filename + "\".");
        } else {
            alert("Could not save the inventory state.");
        }
    }
    
    if(itemIndex < 0) {itemIndex = 0;}
    
    if(itemIndex >= inventory.items.length) {itemIndex = inventory.items.length - 1;}
    
    if(itemIndex / inventory.displayWidth < itemY) {
        itemY = Math.max(0, Math.floor(itemIndex / inventory.displayWidth));
    } else if(itemIndex / inventory.displayWidth >= itemY + displayHeight) {
        itemY = Math.floor(itemIndex / inventory.displayWidth) - displayHeight + 1;
    }
    
    if(keyList.value(97) === 1) {
        let b64 = window.btoa(unescape(encodeURIComponent(JSON.stringify(INVENTORY.getData()))));
        
        let a = document.createElement("a");
        a.href = "data:text/json;base64," + b64;
        a.download = "inventory.json";
        
        a.click();
    } if(keyList.value(98) === 1) {
        let input = document.createElement("input");
        input.type = "file";
        
        input.onchange = function onchange() {
            if(this.files.length > 0) {
                let reader = new FileReader();
                
                reader.onload = function onload() {
                    let b64 = this.result.match(/base64,([\d\D]*)/)[1];
                    
                    try {
                        let data = JSON.parse(decodeURIComponent(escape(atob(b64))));
                        
                        INVENTORY = IC["inventory"].fromData(data);
                    } catch(error) {
                        
                    }
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        };
        
        input.click();
    }
    
    if(keyList.value(K_ESC) == 1 || gamepadRec.value(BUTTON_START) === 1) {
        switchPhase(backupPhase);
    }
    
    let context = CANVAS.getContext("2d");
    
    context.fillStyle = "#00003F";
    context.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    /**/
    
    for(let i = 0; i < inventory.items.length; ++i) {
        let width = cellWidth, height = cellHeight;
        
        let x = i % inventory.displayWidth;
        x *= width + spaceBetween;
        x += marginLR;
        let y = Math.floor(i / inventory.displayWidth) - itemY;
        y *= height + spaceBetween;
        y += 0 + marginTB;
        
        x *= hProp;
        y *= vProp;
        
        width *= hProp;
        height *= vProp;
        
        if(i === itemIndex) {context.fillStyle = "yellow";}
        else {context.fillStyle = "cyan";}
        context.fillRect(x, y, width, height);
        
        let img = inventory.items[i].getImage();
        
        if(typeof img != "undefined") {
            context.drawImage(img, x, y, width, height);
        }
    }
    
    for(let i in ESCDRAWABLES) {
        let drawable = ESCDRAWABLES[i];
        
        drawable.draw(context);
    }
}

const GLOBALDRAWABLES = new SetArray();
let COVERDRAWABLE = null;

function transitionIn(duration = 16) {
    COVERDRAWABLE = new RectangleDrawable([0, 0], [CANVAS.width, CANVAS.height]);
    COVERDRAWABLE.setCameraMode("none");
    COVERDRAWABLE.setStyle(new ColorTransition(CV_INVISIBLE, CV_BLACK, duration));
}

function transitionOut(duration = 16) {
    if(COVERDRAWABLE != null) {
        COVERDRAWABLE.setStyle(new ColorTransition(CV_BLACK, CV_INVISIBLE, duration));
        COVERDRAWABLE.lifespan = duration + 1;
    }
}

function transitionInOut(durationIn = 16, durationOut = 16) {
    transitionIn(durationIn);
    setGameTimeout(transitionOut.bind(transitionOut, durationOut), durationIn);
}

let gameTimeouts = [];

function setGameTimeout(f, timeout) {
    gameTimeouts.push({"function" : f, "timeout" : timeout});
}

let gameControllers = new SetArray();

gameControllers.add(gameEventController);

function gameUpdate() {
    if(gamePhase == WORLDLOOP) {
        WORLDLOOP.update();
        // worldUpdate();
        
        if(keyList.value(K_ESC) == 1 || gamepadRec.value(BUTTON_START) === 1) {
            backupPhase = gamePhase;
            switchPhase(ESCAPELOOP);
        }
    } else if(gamePhase == BATTLELOOP) {
        BATTLELOOP.update();
    } else if(gamePhase == ESCAPELOOP) {
        escapeMenu();
        ++escapeCounter;
    }
    
    if(gamePhase !== ESCAPELOOP) {
        escapeCounter = 0;
    }
    
    // 
    
    // 
    
    for(let i = gameTimeouts.length - 1; i >= 0; --i) {
        let gameTimeout = gameTimeouts[i];
        
        if(gameTimeouts[i].timeout > 0) {
            --gameTimeouts[i].timeout;
        } else {
            gameTimeouts[i].function();
            gameTimeouts.splice(i, 1);
        }
    }
    
    for(let i = 0; i < gameControllers.length; ++i) {
        gameControllers[i]();
    }
    
    // 
    
    eventsRecordersUpdate();
    
    // 
    
    for(let i = 0; i < GLOBALDRAWABLES.length; ++i) {
        let drawable = GLOBALDRAWABLES[i];
        
        drawable.update();
        drawable.draw(CANVAS.getContext("2d"));
    }
    
    if(COVERDRAWABLE != null) {
        COVERDRAWABLE.update().draw(CANVAS.getContext("2d"));
    }
}

GAMELOOP.controllers.add(gameUpdate);

var gameInterval;
var gamePhase = WORLDLOOP;
var gamePace = WORLD_PACE;

function switchPhase(phase) {
    gamePhase = phase;
}

function switchLoop(loopF, pace = gamePace) {
    gameLoop = loopF;
    gamePace = pace;
    clearInterval(gameInterval);
    gameInterval = setInterval(loopF, pace);
}

function repaceLoop(pace) {
    switchLoop(gameLoop, pace);
}

function loadCheck() {
    if(loadCounter == 0) {
        for(var i = 0; i < IMGS.length; ++i) {
            if(!IMGS[i].complete || IMGS[i].naturalWidth === 0) {
                return false;
            }
        }
        
        loadMap(getCurrentSave().lastMap);
        transitionIn(), transitionOut();
        
        switchLoop(main, WORLD_PACE);
        
        return true;
    }
    
    return false;
}

function engageBattle(battlers = NOENTITY) {
    transitionIn();
    addBattlers(battlers);
    switchPhase(BATTLELOOP);
    addEntity(new EC["skyDecoration"]([0, 0], [640, 360]));
    transitionOut();
}

switchLoop(loadCheck, WORLD_PACE);

function gamePause() {
    clearInterval(gameInterval);
} function gameResume() {
    switchLoop(gameLoop, gamePace);
}

function gameResumeFor(duration = 1) {
    gameResume();
    setGameTimeout(gamePause, duration);
}

const DEBUG = {
    clear: function clear() {
        for(let i = 0; i < this.array.length; ++i) {
            removeDrawable(this.array[i]);
        }
        
        this.array.length = 0;
    },
    log: function log(data) {
        const rectangleDrawable = (new TextRectangleDrawable([0, this.array.length * 16], [640, 16])).setContent(data);
        rectangleDrawable.setCameraMode("reproportion");
        
        this.array.push(rectangleDrawable);
        addDrawable(rectangleDrawable);
    },
    array: []
};

function main() {
    GAMELOOP.update();
}
