
const BRK_OBST = 1.25;
const BRK_AIR = 1.03125;
const BRK_WATER = 1.25;
var THRUSTFACTOR_OBSTACLE = 1;
var THRUSTFACTOR_AIR = 0.1875;
var THRUSTFACTOR_WATER = 1.125;

class ActorCollidable extends Entity {
    constructor(position, size) {
        super(position, size);
        this.collidable = true;
        // this.setEffectFactor("default", 0);
        
        this.collide_priority = +1;
    }
}

class Area extends ActorCollidable {
    constructor(position, size) {
        super(position, size);
    }
}

class Obstacle extends ActorCollidable {
    constructor(position, size) {
        super(position, size);
        // this.replaceId = -1;
        // this.otherBrake = BRK_OBST;
        // this.otherThrust = THRUST_OBSTACLE;
        
        this.addInteraction(new ReplaceActor());
        this.addInteraction(new BrakeActor(BRK_OBST));
        this.addInteraction(new ThrustRecipient(THRUSTFACTOR_OBSTACLE));
        this.addInteraction(new ContactVanishActor(CVF_OBSTACLE));
    }
    
    onadd() {
        OBSTACLES.add(this);
        this.whitelist = NONOBSTACLES;
        
        return super.onadd();
    }
}

EC["obstacle"] = Obstacle;

class Braker extends ActorCollidable {
    constructor(position, size, otherBrake = 1) {
        super(position, size);
        // this.otherBrake = otherBrake;
        this.setStyle(INVISIBLE);
        
        this.addInteraction(new BrakeActor(otherBrake));
    }
}

EC["braker"] = Braker;

class ForceField extends ActorCollidable {
    constructor(position, size, force = [0, 0]) {
        super(position, size);
        this.setStyle(INVISIBLE);
        // this.setForce(force);
        
        this.addInteraction(new DragActor(force));
    }
}

EC["forceField"] = ForceField;

class GravityField extends EC["forceField"] {
    constructor(position, size, force = [0, +0.25]) {
        super(position, size, force);
        
        this.addInteraction(new GravityActor(force));
        
        this.collide_priority = +2;
    }
}

EC["gravityField"] = GravityField;

class Ground extends EC["obstacle"] {
    constructor(position, size) {
        super(position, size);
        // this.ground = true;
        
        this.addInteraction(new GroundActor());
        
        makeRepeatedTileFrom.multiplier = 8;
        this.setStyle(makeRepeatedTileFrom(IMG_DEFBLOCK, this.getWidth(), this.getHeight()));
        makeRepeatedTileFrom.multiplier = 2;
        
        this.addInteraction(new WallActor());
    }
}

EC["ground"] = Ground;

class MovingObstacle extends Ground {
    constructor(position, size) {
        super(position, size);
    }
}

EC["movingObstacle"] = MovingObstacle;

class Bouncer extends Ground {
    constructor(position, size) {
        super(position, size);
        // this.bounce = 1;
        
        this.addInteraction(new ReplaceActor(-1, 1));
    }
}

EC["bouncer"] = Bouncer;

class Director extends Area {
    constructor(position, size, route = [0, 0]) {
        super(position, size);
        
        this.addInteraction(new DirectActor());
    }
}

EC["director"] = Director;

class Hazard extends Ground {
    constructor(position, size) {
        super(position, size);
        this.setTypeOffense("default", Infinity);
        this.addInteraction((new TypeDamager()).setRehit(16));
        this.setStats({"stun-timeout": 16});
        this.addEventListener("hit", function(event) {
            const recipient = event.recipient;
            const direction = Vector.subtraction(recipient.getPositionM(), this.getPositionM());
            
            recipient.drag(direction.normalize(8));
            
            stunOnhit(...arguments);
        });
        
        this.drawable.setStyle("red");
    }
}

EC["hazard"] = Hazard;

class GroundArea extends Area {
    constructor(position, size) {
        super(position, size);
        // this.otherThrust = THRUST_OBSTACLE;
        // this.setOtherBrake(BRK_OBST);
        // this.ground = true;
        
        this.addInteraction(new ThrustRecipient(THRUSTFACTOR_OBSTACLE));
        this.addInteraction(new BrakeActor(BRK_OBST));
        this.addInteraction(new GroundAreaActor());
    }
}

EC["groundArea"] = GroundArea;

class AirArea extends Area {
    constructor(position, size) {
        super(position, size);
        // this.setOtherThrust(THRUST_AIR);
        // this.setOtherBrake(BRK_AIR);
        this.setStyle(makeGradientCTilesCanvas(1, this.getHeight() * 2 / 16, new ColorTransition([255, 255, 255, 0.5], [239, 239, 239, 0]), new ColorTransition([239, 239, 239, 0.5], [223, 223, 223, 0])));
        this.setStyle(INVISIBLE);
        this.collide_priority = -1;
        
        this.addInteraction(new BrakeActor(BRK_AIR));
        this.addInteraction(new ThrustRecipient(THRUSTFACTOR_AIR));
    }
}

EC["airArea"] = AirArea;

class WaterArea extends Area {
    constructor(position, size) {
        super(position, size);
        // this.setOtherBrake(BRK_WATER);
        // this.otherThrust = THRUST_WATER;
        this.setStyle("#007FFF7F");
        
        this.addInteraction(new BrakeActor(BRK_WATER));
        this.addInteraction(new ThrustRecipient(THRUSTFACTOR_WATER));
        this.addInteraction(new WaterActor());
        
        this.drawable.setZIndex(-10);
    }
}

EC["waterArea"] = WaterArea;

class Target extends Entity {
    constructor(position, size) {
        super(position, size);
        this.addInteraction(new TypeDamageable());
    }
}

class Router extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setStyle("FF7FFF3F");
        
        this.table = [];
    }
    
    oncollision(other) {
        
        
        return this;
    }
}

class Projectile extends Hitbox {
    constructor(position, size) {
        super(position, size);
        this.setStyle("#FF0000");
        // this.setTypeOffense(FX_PIERCING, 1);
        
        this.setLifespan(16);
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new ContactVanishRecipient(CVF_OBSTACLE));
    }
}

EC["autoDoor"] = class AutoDoor extends Entity {
    constructor(position, size, mapname = "hub", warpPositionM = [0, 0]) {
        super(position, size);
        
        this.setMapwarp(mapname, warpPositionM);
        
        this.setStyle("#000000BF");
        this.setZIndex(+10);
    }
    
    setMapwarp(mapname, warpPositionM) {
        this.mapname = mapname;
        this.warpPositionM = warpPositionM;
        this.addInteraction(new MapWarper(mapname, warpPositionM));
        
        return this;
    }
    
    static fromData(data) {
        let clone = {};
        Object.assign(clone, data);
        
        let mapname = clone.mapname;
        delete clone.mapname;
        let warpPositionM = clone.warpPositionM;
        delete clone.warpPositionM;
        
        let door = super.fromData(clone);
        
        door.setMapwarp(mapname, warpPositionM);
        
        return door;
    }
    
    getData() {
        let data = super.getData();
        
        data.mapname = this.mapname;
        data.warpPositionM = this.warpPositionM;
        
        return data;
    }
};

EC["lookupDoor"] = class LookupDoor extends EC["autoDoor"] {
    setMapwarp(mapname, warpPositionM) {
        this.mapname = mapname;
        this.warpPositionM = warpPositionM;
        this.addInteraction(new LookupMapWarper(mapname, warpPositionM));
        
        return this;
    }
};

class Collectible extends Entity {
    constructor(position, size) {
        super(position, size);
        
        this.item = null;
    }
}

EC["ladder"] = class Ladder extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setStyle(makeCTile(INVISIBLE, "#7F3F00"));
        
        this.setZIndex(+1);
        
        this.addInteraction(new LadderActor());
        // this.addInteraction(new BrakeActor(1.25));
        // this.addInteraction(new ThrustRecipient(0.5));
        // this.collide_priority = -1;
    }
};

EC["softPlatform"] = class SoftPlatform extends ActorCollidable {
    constructor(position, size) {
        super(position, size);
        
        this.setStyle("#3F3F3F");
        
        this.addInteraction(new SoftReplaceActor());
        this.addInteraction(new GroundActor());
        this.addInteraction(new SoftThrustRecipient());
    }
};

class PitArea extends Area {
    constructor(position, size) {
        super(position, size);
        
        this.addInteraction(new TypeDamager());
        this.setStyle(makeStyledCanvas(makeCTile("#3F3F3F3F", "#0000007F", "FFFFFF3F"), this.getWidth(), this.getHeight()));
        
        this.setTypeOffense("void", Infinity);
    }
}

EC["pitArea"] = PitArea;

EC["mazeGenerator"] = class MazeGenerator extends Entity {
    constructor(position, size) {
        super(position, size);
        this.mazeSize;
        this.cellSize = undefined; [64, 16*3];
        this.wallSize = undefined; [8, 8];
        this.mode;
    }
    
    static fromData(data) {
        let mazeSize = data.mazeSize;
        let cellSize = data.cellSize;
        let wallSize = data.wallSize;
        let mode = data.mode;
        
        let mazeGenerator = super.fromData(data);
        
        mazeGenerator.mazeSize = mazeSize || mazeGenerator.mazeSize;
        mazeGenerator.cellSize = cellSize || mazeGenerator.cellSize;
        mazeGenerator.wallSize = wallSize || mazeGenerator.wallSize;
        mazeGenerator.mode = mode;
        
        return mazeGenerator;
    }
    
    update() {
        if(this.mode === "test") {
            let maze = buildMazeLevel([10, 4], [2*16, 3*16], [8, 8], array_random(["topdown", "sideways", "sideways-water"]));
            
            const entities = maze.variable_entities;
            
            // loadFromData(maze);
            
            let cba = entities.find(function(entity) {
                return entity.classId === "cameraBoundaryAround";
            });
            
            cba.position = [+16, +16];
            
            for(let i = 0; i < entities.length; ++i) {
                addEntity(makeEntityFromData(entities[i]));
            }
            
            PLAYERS[0].entity.initPositionM(getCurrentSave().playerPositionM);
            
            removeEntity(this);
        } else {
            loadMaze(this.mazeSize, this.cellSize, this.wallSize, this.mode);
        }
        
        return this;
    }
};

class TransitionCover extends Entity {
    constructor(mapname) {
        super([0, 0], [CANVAS.width, CANVAS.height]);
        
        // this.setStyle(new ColorTransition([0, 0, 0, 0], [0, 0, 0, 1], 16));
        // this.drawable.setCameraMode("none").setZIndex(-Infinity);
        this.setLifespan(16);
        this.mapname = mapname;
    }
    
    onadd() {
        transitionIn(this.lifespan);
        
        return super.onadd();
    }
    
    onremove() {
        transitionOut(16);
        saveMapState();
        loadMap(this.mapname);
        setGameTimeout(function() {
            maptransitioning = false;
        }, 1);
        
        return super.onremove();
    }
}

EC["invisibleWall"] = class InvisibleWall extends ActorCollidable {
    constructor() {
        super(...arguments);
        
        this.addInteraction(new ReplaceActor());
        this.addInteraction(new ContactVanishActor(CVF_OBSTACLE));
    }
};

EC["sidewaysSetter"] = class SidewaysSetter extends Entity {
    constructor() {
        super(...arguments);
        this.collidable = false;
        
        this.gravityField = new EC["gravityField"](...arguments);
        this.airArea = new EC["airArea"](...arguments);
    }
    
    onadd() {
        addEntity(this.gravityField);
        addEntity(this.airArea);
        
        return this;
    }
    
    update() {
        // removeEntity(this);
        
        return this;
    }
}

EC["treeTrunk"] = class TreeTrunk extends EC["ground"] {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_TREETRUNK, this.getWidth(), this.getHeight()));
    }
};

EC["treePlatform"] = class TreePlatform extends EC["softPlatform"] {
    constructor(position, size = [64, 2]) {
        super(position, size);
        
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_TREETRUNK, this.getWidth(), this.getHeight()));
    }
};

const mazeWallCanvas = makeGradientCanvas(new ColorTransition(CV_WHITE, [127, 127, 127, 1]), 2, 2);

class MazeWall extends EC["ground"] {
    constructor() {
        super(...arguments);
        
        this.setStyle(makeRepeatedTileFrom(mazeWallCanvas, this.getWidth(), this.getHeight()));
    }
}

EC["mazeWall"] = MazeWall;

EC["invisibleWallAround"] = class InvisibleWallAround extends EntityAround {
    constructor() {
        super(...arguments);
        this.entityClass = EC["invisibleWall"];
    }
};

EC["breakableWood"] = class BreakableWood extends EC["treeTrunk"] {
    constructor() {
        super(...arguments);
        
        this.addInteraction(new TypeDamageable());
        
        this.setStats({
            "energy": {
                "real": 20,
                "effective": 1,
                "effectiveLock": false
            }
        });
        
        this.resetEnergy();
        
        this.removeInteractorWithId("contactVanish");
    }
    
    ondefeat() {
        let positionM = this.getPositionM();
        let avgsz = rectangle_averageSize(this);
        let count = 8;
        
        for(let i = 0; i < count; ++i) {
            let angle = i/(count-1) * 2*Math.PI;
            
            let particle = RectangleDrawable.fromMiddle(positionM, this.size);
            particle.setStyle(IMG_TREETRUNK);
            particle.setLifespan(16);
            
            let sizeTransition = new VectorTransition(this.size, [0, 0], particle.lifespan);
            let positionTransition = new VectorTransition(positionM, Vector.fromAngle(angle).normalize(avgsz).add(positionM), particle.lifespan, function(t) {return Math.pow(t, 1/4)});
            
            particle.controllers.add(function() {
                this.setSize(sizeTransition.getNext());
                this.setPositionM(positionTransition.getNext());
            });
            
            addDrawable(particle);
        }
        
        return super.ondefeat();
    }
};

EC["mazeGroundArea"] = class MazeGroundArea extends GroundArea {
    constructor() {
        super(...arguments);
        
        
        this.drawable.setZIndex(16)//.setStyle(makeStyledCanvas(mazeStyle, groundArea.getWidth(), groundArea.getHeight()));
        
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_GRASSTILE, this.getWidth(), this.getHeight()));
    }
};

class TrailerEntity extends Entity {
    constructor() {
        super(...arguments);
        
        this.trailDrawable = new TrailDrawable();
        this.drawables.add(this.trailDrawable);
        
        this.bladeAngle = 0;
        this.basePosition = [NaN, NaN];
        
        this.controllers.add(function() {
            this.updateTrailProperties();
            this.updateBasePosition();
            this.updateBladeAngle();
        });
    }
    
    updateTrailProperties() {return this;}
    updateBasePosition() {return this;}
    updateBladeAngle() {return this;}
    
    getBasePosition() {
        return this.basePosition;
    }
    
    getBladeAngle() {
        return this.bladeAngle;
    }
    
    updateDrawable() {
        return super.updateDrawable();
    }
}

class TextBubble extends Entity {
    constructor() {
        super(...arguments);
        
        // this.setDrawable(TextRectangleDrawable.shared(this));
        // this.drawable.textEnhance = 16;
        // this.drawable.setContent("");
        
        this.fontSize = 10;
        this.fontFamily = "Segoe UI";
        this.textColor = "black";
        this.strokeColor = undefined;
        this.lineHeight = 8;
        this.lineCount = 5;
        
        this.setDrawable(new RectangleDrawable());
        this.drawable.setZIndex(-10);
        this.drawable.setStyle("#FFFFFFBF");
    }
    
    getBubbleHeight() {
        return this.lineHeight * this.lineCount;
    }
    
    setContent(content) {
        for(let i = 0; i < this.drawables.length; ++i) {
            removeDrawable(this.drawables[i]);
        }
        
        this.drawables.length = 0;
        
        let lines = [];
        
        let index = 0;
        
        for(let i = 0; i < content.length; ++i) {
            let ss = content.substring(index, i);
            let tc = makeTextCanvas(ss, undefined, this.fontFamily, this.textColor, this.strokeColor);
            
            // console.log(index, i, ss);
            
            // console.log(tc.width/75 * this.lineHeight, this.getWidth());
            
            if((tc.width/75*this.lineHeight) > this.getWidth()) {
                --i;
                lines.push(content.substring(index, i));
                index = i;
            }
        }
        
        lines.push(content.substr(index));
        
        // console.log(lines);
        
        tfparams["positioning"] = 0.5;
        
        let y = 0;
        
        for(let i = Math.max(0, lines.length - this.lineCount); i < lines.length; ++i) {
            let ss = lines[i];
            let textEnhance = 16;
            let tf = makeTextFit(ss, this.getWidth() * textEnhance, this.lineHeight * textEnhance, this.fontFamily, this.textColor, this.strokeColor);
            
            let drawable = new RectangleDrawable([this.getX(), this.getY() + y * this.lineHeight], [this.getWidth(), this.lineHeight]);
            
            drawable.setStyle(tf);
            drawable.setZIndex(-11);
            
            addDrawable(drawable);
            this.drawables.push(drawable);
            
            ++y;
        }
        
        tfparams["positioning"] = 0;
        
        return this;
    }
    
    updateDrawable() {
        this.drawable.setSize([this.getWidth(), this.getBubbleHeight()]);
        this.drawable.setPosition1(this.getPosition1());
        
        for(let i = 0; i < this.drawables.length; ++i) {
            let drawable = this.drawables[i];
            
            drawable.setPosition1([this.getX(), this.getY() + i * this.lineHeight]);
        }
        
        return this;
    }
}
