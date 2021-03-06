
class GameLoop {
    constructor() {
        this.drawables = new SetArray();
        this.entities = new SetArray();
        this.collidables = new SetArray();
        this.camera = null;
        
        this.counter = 0;
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
    
    removeDrawables(drawables) {
        for(let i = 0; i < drawables.length; ++i) {
            this.removeDrawable(drawables[i]);
        }
        
        return this;
    }
    
    getCollidables() {return this.collidables;}
    
    addEntity(entity) {
        entity.setGameLoop(this);
        entity.triggerEvent("add");
        
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
            entity.triggerEvent("remove");
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
        
        drawables = SetArray.from(drawables);
        
        for(let i in drawables) {
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
    
    sortEntities() {
        array_bubbleSort(this.entities, function(a, b) {
            if(a.order > b.order) {return +1;}
            if(a.order < b.order) {return -1;}
            return 0;
        });
        
        return this;
    }
    
    sortDrawables() {
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
            
            if(a instanceof Rectangle && b instanceof Rectangle) {
                if(a.getY2() > b.getY2()) {return +1;}
                if(a.getY2() < b.getY2()) {return -1;}
            }
            
            return 0;
        });
        
        return this;
    }
    
    onresume() {
        return this;
    }
}

class WorldLoop extends GameLoop {
    constructor() {
        super();
        
        this.loadZone = new Entity([NaN, NaN, NaN], [896, 504, 896]);
        this.loadedEntities = this.entities;
        this.loadedDrawables = this.drawables;
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
    
    getLoadedEntities() {
        const loadZone = this.loadZone;
        
        return this.loadedEntities = this.entities.filter(function(entity) {
            if(entity.alwaysLoad) return true;
            
            return loadZone.collides(entity) && !entity.isFrozen();
        });
    }
    
    sortCollidables() {
        /**
        
        this.collidables.sort(function(a, b) {
            if(a.collide_priority < b.collide_priority) {return -1;}
            if(a.collide_priority > b.collide_priority) {return +1;}
            return 0;
        });
        
        /**/
        
        return this;
    }
    
    getCollidables() {
        /**
        
        let collidables = this.collidables.filter(function(collidable) {
            return loadZone.collides(collidable) && !collidable.isFrozen();
        });
        
        /**/
        
        return this.loadedEntities.filter(function(entity) {
            return entity.isCollidable();
        });
    }
    
    getLoadedDrawables() {
        const loadZone = this.loadZone;
        
        return this.loadedDrawables = this.drawables.filter(function(drawable) {
            if(drawable.cameraMode === "none" || drawable.cameraMode === "reproportion") {return true;}
            
            if(typeof drawable.getPositionM === "undefined") {return true;}
            
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
    }
    
    draw() {
        return super.draw(this.loadedDrawables);
    }
    
    onresume() {
        return this;
    }
}

let battleMode = "everyone";

class BattleLoop extends GameLoop {
    constructor() {
        super();
        
        this.camera = (BasicCamera.fromMiddle([0, 0, 0], [256, 144, 0]));
        this.battlers = new SetArray();
        this.movesQueue = new SetArray();
    }
    
    getTurnBattlers() {
        if(battleMode === "everyone") {
            return this.battlers;
        } else if(battleMode === "single") {
            return new SetArray(this.battlers[actorIndex]);
        }
        
        return EMPTYSET;
    }
    
    sortMoves() {
        this.movesQueue.sort(function(a, b) {
            if(a.getPriority() > b.getPriority()) {return -1;}
            if(a.getPriority() < b.getPriority()) {return +1;}
            return 0;
        });
        
        const priorityTies = this.getPriorityTies();
        
        for(let index = 0; index < priorityTies.length; ++index) {
            const priority = priorityTies[index].priority;
            const moves = priorityTies[index].moves;
            
            const oldIndexes = [];
            
            for(let i = 0; i < moves.length; ++i) {
                oldIndexes.push(this.movesQueue.indexOf(moves[i]));
            }
            
            array_shuffle(moves);
            
            for(let i = 0; i < moves.length; ++i) {
                const oldIndex = oldIndexes[i];
                
                this.movesQueue[oldIndex] = moves[i];
            }
        }
        
        return this;
    }
    
    peekMove() {
        return this.movesQueue[0];
    }
    
    addMove(move) {
        this.movesQueue.add(move);
        this.sortMoves();
        
        return this;
    }
    
    removeMove(move) {
        this.movesQueue.remove(move);
        
        return this;
    }
    
    addBattler(battler) {
        if(battler instanceof Entity && battler.isBattler()) {
            battler = battler.getBattler();
            
            this.addBattler(battler);
        }
        
        else if(battler instanceof Battler) {
            battler.onadd();
            
            this.battlers.add(battler);
        }
        
        return this;
    }
    
    removeBattler(battler) {
        battler.onremove();
        this.battlers.remove(battler);
        
        return this;
    }
    
    sortBattlers() {
        this.battlers.sort(function(a, b) {
            if(a.getPriority() > b.getPriority()) return -1;
            if(a.getPriority() < b.getPriority()) return +1;
            return 0;
        });
        
        return this;
    }
    
    getPriorityTies() {
        const priorityTies = [];
        
        for(let i = 0; i < this.movesQueue.length; ++i) {
            const move = this.movesQueue[i];
            
            const priority = move.getPriority();
            
            let priorityGroup = priorityTies.find(function(priorityGroup, index, priorityTies) {
                return priorityGroup.priority === priority;
            });
            
            if(priorityGroup === undefined) {
                priorityGroup = {priority: priority, moves: []};
                priorityTies.push(priorityGroup);
            }
            
            priorityGroup.moves.push(move);
        }
        
        Object.defineProperty(priorityTies, "executeOrder", {value: function(callbackfn) {
            for(let i = 0; i < this.length; ++i) {
                const moves = this[i].moves;
                const priority = this[i].priority;
                
                callbackfn(moves, i, this, priority);
            }
        }});
        
        return priorityTies;
    }
    
    onresume() {
        return this;
    }
}

class EscapeLoop extends GameLoop {
    constructor() {
        super();
        
        this.itemIndex = 0;
        this.itemY = 0;
        
        this.menuDrawables = null;
        this.menuIndex = 0;
        
        this.pathsItemIndexes = {};
    }
    
    cancelMenu() {
        if(this.menuOpen()) {
            for(let i in this.menuDrawables) {
                this.removeDrawable(this.menuDrawables[i]);
            }
            
            this.menuDrawables = null;
            this.menuIndex = 0;
        }
        
        return this;
    }
    
    menuOpen() {
        return this.menuDrawables !== null;
    }
    
    getItemIndex() {
        const inventoryPath = chapter_getCurrentInventoryPath();
        
        if(this.pathsItemIndexes[inventoryPath] === undefined) {
            this.pathsItemIndexes[inventoryPath] = 0;
        }
        
        return this.pathsItemIndexes[inventoryPath];
    }
    
    setItemIndex(itemIndex) {
        const inventoryPath = chapter_getCurrentInventoryPath();
        
        this.pathsItemIndexes[inventoryPath] = itemIndex;
        
        return this;
    }
    
    onresume() {
        return this;
    }
}

const GAMELOOP = new GameLoop();
const WORLDLOOP = new WorldLoop();
const BATTLELOOP = new BattleLoop();
const ESCAPELOOP = new EscapeLoop();
const TRANSITIONLOOP = new GameLoop();

const EMPTYSET = new SetArray();
const ENTITIES = WORLDLOOP.entities;
// const COLLIDABLES = new SetArray();
const DRAWABLES = WORLDLOOP.drawables;
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
        saveMapState();
        setGameTimeout(function() {
            transitionIn();
        }, 48);
        setGameTimeout(function() {
            loadMap(chapter_getLastMap());
            transitionOut();
        }, 64);
    });
    
    entity.addInteraction(new ItemPicker());
    
    entity.addEventListener("hurt", function() {
        const cover = new Entity([0, 0], [640, 360]);
        cover.setLifespan(16);
        cover.drawable.setZIndex(-Math.pow(2, 20));
        cover.drawable.setCameraMode("reproportion");
        cover.drawable.baseWidth = 640;
        cover.drawable.baseHeight = 360;
        cover.drawable.setStyle(new ColorTransition([255, 0, 0, 1], [255, 0, 0, 0], cover.lifespan, powt(1/2)));
        
        addEntity(cover);
        
        const linework = new ConcentratedLineworkFrameDrawable();
        linework.setLifespan(32);
        linework.setStyle(new ColorTransition([255, 0, 0, 1], [255, 0, 0, 0], linework.lifespan, powt(4)));
        
        const newCenter = gamePoint_positionOnCanvas(this.getPositionM());
        newCenter.multiply(640/CANVAS.width);
        
        linework.setPositionM(newCenter);
        
        addDrawable(linework);
    });
    
    addEntity(entity);
}

function setCamera(camera) {
    WORLDLOOP.setCamera(camera);
}

// 

function worldUpdate() {
    const loadZone = this.loadZone;
    loadZone.setPositionM(this.camera.getPositionM());
    loadZone.updateReset();
    
    this.sortEntities();
    const entities = this.getLoadedEntities();
    
    this.sortCollidables();
    const collidables = this.getCollidables();
    
    this.sortDrawables();
    const drawables = this.getLoadedDrawables();
    
    // Entities updates
    
    entities.forEach(function(entity) {
        entity.update();
    });
    
    this.entities.forEach(function(entity) {
        if(!entity.isFrozen()) {
            entity.updateReset();
        }
        
        entity.thaw();
    });
    
    // Collisions
    
    for(let i = 0; i < collidables.length; ++i) {
        const collidable1 = collidables[i];
        
        /**/
        
        for(let j = i + 1; j < collidables.length; ++j) {
            const collidable2 = collidables[j];
            
            if(collidable1.collides(collidable2)) {
                collidable1.triggerEvent("collision", collidable2);
                collidable2.triggerEvent("collision", collidable1);
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
    
    // Drawing
    
    this.draw();
}

WORLDLOOP.controllers.add(worldUpdate);
WORLDLOOP.controllers.add(function() {
    if(keyList.value(K_ESC) == 1 || gamepadRec.value(BUTTON_START) === 1) {
        backupPhase = gamePhase;
        switchPhase(ESCAPELOOP);
    }
});

// --------------- //
//// BATTLE LOOP ////
// --------------- //

const BATTLERS = BATTLELOOP.battlers;
const MOVESQUEUE = BATTLELOOP.movesQueue;

var battleturn = 0;
var actorIndex = -1;

function addBattler(battler) {
    BATTLELOOP.addBattler(battler);
}

function addBattlers(battlers) {
    for(let i = 0; i < battlers.length; ++i) {
        addBattler(battlers[i]);
    }
}

function removeBattler(battler) {
    BATTLELOOP.removeBattler(battler);
}

function addMove(move) {
    BATTLELOOP.addMove(move);
}

function removeMove(move) {
    BATTLELOOP.removeMove(move);
}

let electedPlayableBattler = null;

const BATTLEDRAWABLES = BATTLELOOP.drawables;

const BATTLECAMERA = BATTLELOOP.getCamera();

let battlePhase = "act";

const BATTLEMINY2 = 16, BATTLEMAXY2 = 24;

function battleUpdate() {
    
    // End the battle when there's no fighter left.
    
    if(this.battlers.length === 0) {
        this.movesQueue.clear();
        this.drawables.clear();
        this.entities.clear();
        
        actorIndex = -1;
        
        transitionIn(16);
        switchPhase(TRANSITIONLOOP);
        
        setGameTimeout(function() {
            switchPhase(WORLDLOOP);
            battlePhase = "act";
            transitionOut(16);
        }, 16);
        
        return;
    }
    
    // "Pick your move(s)" phase.
    
    if(battlePhase === "strategy") {
        const turnBattlers = this.getTurnBattlers();
        
        let allReady = true;
        
        for(let i = 0; i < turnBattlers.length; ++i) {
            const battler = turnBattlers[i];
            
            if(!battler.isReady()) {
                if(electedPlayableBattler === null && battler.isPlayable()) {
                    battler.onturnstart();
                    electedPlayableBattler = battler;
                }
                
                battler.strategyUpdate();
                
                allReady = false;
            }
        }
        
        if(electedPlayableBattler !== null && electedPlayableBattler.isReady()) {
            electedPlayableBattler = null;
        }
        
        if(allReady) {
            battlePhase = "act";
        }
    }
    
    // Executing the moves.
    
    else if(battlePhase === "act") {
        
        // Highest priority move in the list.
        
        if(this.movesQueue.length > 0) {
            const move = this.peekMove();
            
            move.use();
            ++move.phase;
            
            if(move.hasEnded()) {
                this.sortMoves();
            }
        }
        
        // No move left to execute, going back to the strategy phase.
        
        else {
            ++actorIndex;
            actorIndex %= this.battlers.length;
            
            for(let i = 0; i < this.battlers.length; ++i) {
                this.battlers[i].setReady(false);
            }
            
            this.sortBattlers();
            
            const turnBattlers = this.getTurnBattlers();
            
            for(let i = 0; i < turnBattlers.length; ++i) {
                const battler = turnBattlers[i];
                
                // battler.onturnstart();
            }
            
            battlePhase = "strategy";
        }
    }
    
    // Remove battlers without an opponent.
    
    var allBattlers = SetArray.from(this.battlers);
    
    for(let i = 0; i < allBattlers.length; ++i) {
        const battler = allBattlers[i];
        const opponents = battler.getOpponents();
        
        if(opponents.length === 0) {
            removeBattler(battler);
        }
    }
    
    // 
    
    var allBattlers = SetArray.from(this.battlers);
    
    for(let i = 0; i < allBattlers.length; ++i) {
        allBattlers[i].update();
    }
    
    var allEntities = SetArray.from(this.entities);
    
    for(let i = 0; i < allEntities.length; ++i) {
        const entity = allEntities[i];
        entity.update();
    }
    
    for(let i = 0; i < allEntities.length; ++i) {
        const entity = allEntities[i];
        entity.updateReset();
    }
    
    //// Draw battle things. ////
    
    array_bubbleSort(this.drawables, function(a, b) {
        if(a.getZIndex() > b.getZIndex()) {return -1;}
        if(a.getZIndex() < b.getZIndex()) {return +1;}
        return 0;
    });
    
    const context = CANVAS.getContext("2d");
    
    this.draw();
    
    /* Showing the moves queue */
    
    const priorityTies = this.getPriorityTies();
    const offsetTop = (battleMode === "single") ? 32 + 8 : 0;
    
    for(let index = 0, x = 0; index < priorityTies.length; ++index) {
        const priority = priorityTies[index].priority;
        const moves = priorityTies[index].moves;
        
        for(let i = 0; i < moves.length; ++i) {
            const move = moves[i];
            
            const drawable = new RectangleDrawable([x*32 + 4, 4 + offsetTop], [32, 32]);
            drawable.setStyle(move.user.drawable.getStyle());
            drawable.setCameraMode("reproportion");
            
            drawable.draw(context);
            
            ++x;
        }
        
        x += 0.5;
    }
    
    /**/
    
    if(battleMode === "single") {
        for(let i = 0; i < this.battlers.length; ++i) {
            const battler = this.battlers[i];
            
            const drawable = new RectangleDrawable([i * 32 + 4, 4], [32, 32]);
            drawable.setCameraMode("reproportion");
            drawable.setStyle(battler.drawable.getStyle());
            
            drawable.draw(context);
        }
    }
}

BATTLELOOP.controllers.add(battleUpdate);

function engageBattle(battlers = EMPTYSET) {
    transitionIn(16);
    switchPhase(TRANSITIONLOOP);
    setGameTimeout(function() {
        switchPhase(BATTLELOOP);
        
        addBattlers(battlers);
        BATTLELOOP.sortBattlers();
        
        addEntity(BATTLELOOP.camera);
        addEntity(new SkyDecoration([0, 0], [640, 360]));
        const ground0 = new Entity([-640, BATTLEMAXY2], [1280, 360]);
        ground0.getDrawable()
        .setZIndex(+0.5)
        .setStyle("#7F5F00");
        addEntity(ground0);
        const ground1 = new Entity([-640, BATTLEMINY2 - 4], [1280, 360]);
        ground1.getDrawable()
        .setZIndex(+1)
        .setStyle("#3F3F00");
        addEntity(ground1);
        
        for(let i = 0; i < battlers.length; ++i) {
            const battler = battlers[i].getBattler();
            
            if(battler.isPlayable()) {
                battler.makeCenter();
                break;
            }
        }
        
        transitionOut(16);
    }, 16);
}

// -------------- //
//// ESCAPELOOP ////
// -------------- //

const ESCDRAWABLES = ESCAPELOOP.drawables;

function escapeMenu() {
    const inventory = chapter_getCurrentInventory();
    
    const marginLR = 8, marginTB = 5;
    const spaceBetween = 4;
    const gridWidth = (640 - 2*marginLR);
    const gridHeight = (360 - 2*marginTB);
    
    const cellWidth = (gridWidth - spaceBetween * (inventory.displayWidth-1)) / inventory.displayWidth;
    const cellHeight = cellWidth;
    
    const hProp = CANVAS.width / 640;
    const vProp = CANVAS.height / 360;
    
    const displayWidth = inventory.displayWidth;
    const displayHeight = Math.floor(gridHeight / cellHeight);
    
    let gamepadDirection = gamepad_getDirection(getGamepad(0));
    
    // Moving the cursor
    
    if(poh(keyList.value(K_LEFT)) || (gamepadDirection[0] < 0 && poh(gamepadRec.directionHoldValue))) {
        if(this.getItemIndex() > 0) {
            this.setItemIndex(this.getItemIndex() - 1);
        }
        
        this.cancelMenu();
    } if(poh(keyList.value(K_RIGHT)) || (gamepadDirection[0] > 0 && poh(gamepadRec.directionHoldValue))) {
        if(this.getItemIndex() < inventory.items.length - 1) {
            this.setItemIndex(this.getItemIndex() + 1);
        }
        
        this.cancelMenu();
    }
    
    if((poh(keyList.value(K_UP)) || (gamepadDirection[1] < 0 && poh(gamepadRec.directionHoldValue))) && !this.menuOpen()) {
        if(this.getItemIndex() >= displayWidth) {
            this.setItemIndex(this.getItemIndex() - displayWidth);
        }
        
        this.cancelMenu();
    } if((poh(keyList.value(K_DOWN)) || (gamepadDirection[1] > 0 && poh(gamepadRec.directionHoldValue))) && !this.menuOpen()) {
        if(this.getItemIndex() < inventory.items.length - displayWidth) {
            this.setItemIndex(this.getItemIndex() + displayWidth);
        }
        
        this.cancelMenu();
    }
    
    if((poh(keyList.value(K_UP)) || (gamepadDirection[1] < 0 && poh(gamepadRec.directionHoldValue))) && this.menuOpen()) {
        this.menuDrawables[this.menuIndex].setStyle("white");
        
        if(this.menuIndex > 0) {--this.menuIndex;}
        
        this.menuDrawables[this.menuIndex].setStyle("yellow");
    } if((poh(keyList.value(K_DOWN)) || (gamepadDirection[1] > 0 && poh(gamepadRec.directionHoldValue))) && this.menuOpen()) {
        this.menuDrawables[this.menuIndex].setStyle("white");
        
        if(this.menuIndex < this.menuDrawables.length - 1) {++this.menuIndex;}
        
        this.menuDrawables[this.menuIndex].setStyle("yellow");
    }
    
    let item = inventory.items[this.getItemIndex()];
    
    // Use item (first command)
    
    if((keyList.value(K_CONFIRM) === 1 || gamepadRec.value(BUTTON_A) === 1) && !this.menuOpen()) {
        if(item !== undefined) {
            item.useCommand();
        }
        
        this.cancelMenu();
    }
    
    else if((keyList.value(K_CONFIRM) === 1 || gamepadRec.value(BUTTON_A) === 1) && this.menuOpen()) {
        if(item !== undefined) {
            let i = 0;
            
            for(let name in item.commands) {
                if(i === this.menuIndex) {
                    item.useCommand(name);
                    break;
                }
                
                ++i;
            }
            
            this.cancelMenu();
        }
    }
    
    // Open commands list for selected item
    
    else if(keyList.value(KEY_SPACE) === 1 && !this.menuOpen()) {
        if(item !== undefined) {
            this.menuDrawables = new SetArray();
            
            let commands = item.commands;
            
            let commandsNames = [];
            
            for(let name in commands) {
                commandsNames.push(name);
            }
            
            let fontFamily = "Segoe UI";
            let textColor = "black";
            let strokeColor = "blue";
            
            let width = makeTextCanvas(longestText(commandsNames, fontFamily), 16, fontFamily, textColor, strokeColor).width;
            let height = 16;
            
            let x = this.getItemIndex() % displayWidth;
            let y = Math.floor(this.getItemIndex() / displayWidth) - this.itemY;
            
            x *= cellWidth + spaceBetween;
            y *= cellHeight + spaceBetween;
            
            x += marginLR + cellWidth / 2;
            y += marginTB + cellHeight / 2;
            
            x = Math.min(x, 640 - width);
            y = Math.min(y, 360 - commandsNames.length * height);
            
            let i = 0;
            
            for(let name in commands) {
                let menu = new TextRectangleDrawable([x, y + i * height], [width, height]);
                menu.setContent(name);
                
                menu.setCameraMode("reproportion");
                menu.baseWidth = 640;
                menu.baseHeight = 360;
                
                if(i === 0) {
                    menu.setStyle("yellow");
                }
                
                this.addDrawable(menu);
                this.menuDrawables.add(menu);
                
                ++i;
            }
        }
    }
    
    else if(keyList.value(KEY_SPACE) === 1 && this.menuOpen()) {
        this.cancelMenu();
    }
    
    // If the selected item was the last and got removed, the new last item is selected.
    
    if(this.getItemIndex() >= inventory.items.length) {
        this.setItemIndex(inventory.items.length - 1);
        
        if(inventory.items.length <= (this.itemY + displayHeight) * 16 - 16) {
            --this.itemY;
            
            if(this.itemY < 0) {
                this.itemY = 0;
            }
        }
    }
    
    if(this.getItemIndex() / displayWidth < this.itemY) {
        this.itemY = Math.max(0, Math.floor(this.getItemIndex() / displayWidth));
    } else if(this.getItemIndex() / displayWidth >= this.itemY + displayHeight) {
        this.itemY = Math.floor(this.getItemIndex() / displayWidth) - displayHeight + 1;
    }
    
    // Go back to parent inventory
    
    if(poh(keyList.value(222)) || poh(gamepadRec.value(BUTTON_L)) || poh(gamepadRec.value(BUTTON_B))) {
        if(!this.menuOpen()) {
            chapter_cdParentInventory();
            
            this.cancelMenu();
        } else {
            this.cancelMenu();
        }
    }
    
    // Save inventory file
    
    if(keyList.value(KEY_NUMPAD1) === 1) {
        let b64 = window.btoa(unescape(encodeURIComponent(JSON.stringify(INVENTORY))));
        
        let a = document.createElement("a");
        a.href = "data:text/json;base64," + b64;
        a.download = "inventory.json";
        
        a.click();
    }
    
    // Load inventory file
    
    if(keyList.value(KEY_NUMPAD2) === 1) {
        let input = document.createElement("input");
        input.type = "file";
        
        input.onchange = function onchange() {
            if(this.files.length > 0) {
                let reader = new FileReader();
                
                reader.onload = function onload() {
                    let b64 = this.result.match(/base64,([\d\D]*)/)[1];
                    
                    try {
                        let data = JSON.parse(decodeURIComponent(escape(atob(b64))));
                        
                        INVENTORY = Inventory.fromData(data);
                    } catch(error) {
                        
                    }
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        };
        
        input.click();
    }
    
    // Save inventory file locally
    
    if(keyList.value(KEY_NUMPAD9) === 1) {
        getCurrentChapter().playerPositionM = PLAYERS[0].entity.getPositionM();
        updateCurrentCharacter();
        saveMapState();
        saveGameState();
        updateSaveState({chapterPath : getInventoryItemPath(getCurrentChapter())});
        
        if(saveGameState.success) {
            if(saveGameState.outputtedType === "file") {
                alert("Saved as \"" + saveGameState.resFileName + "\".");
            } else if(saveGameState.outputtedType === "local storage") {
                alert("Saved in local web storage.");
            }
        } else {
            alert("Could not save the inventory state.");
        }
    }
    
    // Exit escape menu
    
    if(keyList.value(K_ESC) == 1 || gamepadRec.value(BUTTON_START) === 1) {
        switchPhase(backupPhase);
    }
    
    //// Drawing ////
    
    let context = CANVAS.getContext("2d");
    
    context.fillStyle = "#00003F";
    context.fillRect(0, 0, CANVAS.width, CANVAS.height);
    
    for(let i = 0; i < inventory.items.length; ++i) {
        let width = cellWidth, height = cellHeight;
        
        let x = i % displayWidth;
        x *= width + spaceBetween;
        x += marginLR;
        let y = Math.floor(i / displayWidth) - this.itemY;
        y *= height + spaceBetween;
        y += 0 + marginTB;
        
        x *= hProp;
        y *= vProp;
        
        width *= hProp;
        height *= vProp;
        
        if(i === this.getItemIndex()) {context.fillStyle = "yellow";}
        else {context.fillStyle = "cyan";}
        context.fillRect(x, y, width, height);
        
        let img = inventory.items[i].getImage();
        
        if(typeof img != "undefined") {
            context.drawImage(img, x, y, width, height);
        }
    }
    
    this.draw();
}

ESCAPELOOP.controllers.add(escapeMenu);

let transitionCoverDrawableClass = TransitionCoverDrawable;
transitionCoverDrawableClass = ScreenWipeCoverDrawable;
// transitionCoverDrawableClass = BookTransitionCoverDrawable;
// transitionCoverDrawableClass = CartoonClosureCoverDrawable;

function transitionIn(duration = 16, focusPosition = undefined, direction = undefined) {
    const coverDrawable = new transitionCoverDrawableClass([0, 0], [CANVAS.width, CANVAS.height]);
    if(focusPosition) {coverDrawable.setFocusPosition(focusPosition);}
    if(direction) {coverDrawable.setDirection(direction);}
    coverDrawable.initTransitionIn(duration);
    
    GAMELOOP.drawables
    .filter(function(d) {return d instanceof TransitionCoverDrawable;})
    .forEach(function(d) {GAMELOOP.removeDrawable(d);});
    GAMELOOP.addDrawable(coverDrawable);
    
    return coverDrawable;
}

function transitionOut(duration = 16, focusPosition = undefined, direction = undefined) {
    const coverDrawable = GAMELOOP.drawables.find(function(d) {return d instanceof TransitionCoverDrawable;});
    
    if(coverDrawable !== undefined) {
        if(focusPosition) {coverDrawable.setFocusPosition(focusPosition);}
        if(direction) {coverDrawable.setDirection(direction);}
        coverDrawable.initTransitionOut(duration);
    }
    
    return coverDrawable;
}

function transitionInOut(durationIn = 16, durationOut = 16) {
    transitionIn(durationIn);
    setGameTimeout(transitionOut.bind(transitionOut, durationOut), durationIn);
}

const gameTimeouts = new SetArray();

function setGameTimeout(f, timeout) {
    gameTimeouts.push({function: f, timeout: timeout});
}

GAMELOOP.controllers.add(gameEventController);

function gameUpdate() {
    gamePhase.update();
    
    // Executing timeout functions.
    
    const gameTimeoutsCopy = SetArray.from(gameTimeouts);
    
    for(let i = 0; i < gameTimeoutsCopy.length; ++i) {
        const gameTimeout = gameTimeoutsCopy[i];
        
        if(gameTimeout.timeout > 0) {
            --gameTimeout.timeout;
        } else {
            gameTimeout.function();
            gameTimeouts.remove(gameTimeout);
        }
    }
    
    // 
    
    eventsRecordersUpdate();
    
    //// Drawing ////
    
    this.draw();
}

GAMELOOP.controllers.add(gameUpdate);

var gameInterval;
var gamePhase = WORLDLOOP;
var gamePace = WORLD_PACE;

function switchPhase(phase) {
    gamePhase = phase;
    gamePhase.onresume();
}

let gameLoop;

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
        
        loadMap(chapter_getLastMap());
        transitionIn(), transitionOut();
        
        switchLoop(main, WORLD_PACE);
        
        return true;
    }
    
    return false;
}

function gamePause() {
    clearInterval(gameInterval);
} function gameResume() {
    switchLoop(gameLoop, gamePace);
}

function gameResumeFor(duration = 1) {
    gameResume();
    setGameTimeout(gamePause, duration);
}

addEventListener("blur", gamePause);
addEventListener("focus", gameResume);

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

function gamePoint_positionOnCanvas(position) {
    const positionOnCanvas = Vector.from(position);
    
    if(CAMERA instanceof BasicCamera) {
        positionOnCanvas.subtract(CAMERA.getOffset());
        positionOnCanvas.multiply(CAMERA.getSizeProp());
    }
    
    else if(CAMERA instanceof AdvancedCamera) {
        positionOnCanvas.subtract(CAMERA.getPositionM());
        const sProp = CAMERA.getRange()/Math.abs(CAMERA.getZM());
        positionOnCanvas.multiply(sProp);
        positionOnCanvas.add([CANVAS.width/2, CANVAS.height/2]);
    }
    
    return positionOnCanvas;
}

function canvasPoint_positionInGame(position) {
    const positionInGame = Vector.from(position);
    
    if(CAMERA instanceof BasicCamera) {
        positionInGame.divide(CAMERA.getSizeProp());
        positionInGame.add(CAMERA.getOffset());
    }
    
    else if(CAMERA instanceof AdvancedCamera) {
        positionInGame.subtract([CANVAS.width/2, CANVAS.height/2]);
        const sProp = CAMERA.getRange()/Math.abs(CAMERA.getZM());
        positionInGame.divide(sProp);
        positionInGame.add(CAMERA.getPositionM());
    }
    
    return positionInGame;
}
