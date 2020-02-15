
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

class Decoration extends Entity {
    constructor(position, size) {
        super(position, size);
        this.collidable = false;
        // this.setEffectFactor("default", 0);
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

const INVISIBLE_VECTOR = new Vector(0, 0, 0, 0);
const WHITE_VECTOR = new Vector(255, 255, 255, 255);

class Particle extends Decoration {
    constructor(position, size) {
        super(position, size);
        this.setZIndex(-1);
        this.setLifespan(1);
        
        this.setSizeTransition(new ColorTransition(this.size, this.size));
    }
}

class TpParticle extends Particle {
    constructor(position, size) {
        super(position, size);
    }
}

class GoldSmokeParticle extends Particle {
    constructor(position, size) {
        super(position, size);
        
        this.setSelfBrake(1.0625);
        this.setLifespan(32);
        // this.setColorTransition([0, 255, 255, 127], [0, 255, 255, 0], 60);
        // this.setDrawable(PolygonDrawable.from(flameparticle).multiplySize(1/4));
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(24, 12, 16)).setLifespan(32).setPositionM(this.getPositionM()).multiplySize(8/16));
        
        this.drawable.multiplySize(rectangle_averageSize(this)/16);
        
        if(!Math.floor(Math.random() * 2)) {
            this.drawable.setStyle(new ColorTransition([0, 255, 255, 127], [0, 255, 255, 0], 60));
        } else {
            this.drawable.setStyle(new ColorTransition([0, irandom(191, 255), 255, 1], [0, 63, 255, 0], 32, function(t) {return Math.pow(t, 4);}));
        }
        
        this.drawable.setZIndex(random(-1, 8));
        
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/1.125), Vector.from(size), [0, 0]], 32));
        this.drawable.initImaginarySize(rectangle_averageSize(this));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        // this.drawable.multiplySize(1/1.03125);
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        // this.drawable.shadowBlur = this.lifespan - this.lifeCounter;
        
        return this;
    }
}

const smokeColorTransition = new ColorTransition([255, 255, 255, 255 / 255], [223, 223, 223, 191 / 255], 32, powt(2));

class SmokeParticle extends Particle {
    constructor(position, size = [8, 8]) {
        super(position, size);
        
        this.setLifespan(48);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(0.03125));
        // this.addInteraction(new BrakeRecipient(1.5));
        
        // this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/2), size, Vector.multiplication(size, 1/2), [0, 0]], this.lifespan));
        this.setSelfBrake(1.03125);
        
        const avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(Math.min(Math.max(4, avgsz*2), 32), 12, 16)));
        this.drawable.setLifespan(this.lifespan);
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(avgsz/polygon_averageSize(this.drawable));
        this.drawable.initImaginarySize(avgsz);
        
        this.drawable.setZIndex(random(-1, +1));
        
        this.drawable.setStyle(ColorTransition.from(smokeColorTransition));
        this.drawable.setStrokeStyle("lightGray");
    }
    
    updateDrawable() {
        // this.drawable.multiplySize(1/1.0625);
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.rotate(Math.PI/128);
        
        return this;
    }
}

class FireSmokeParticle extends Particle {
    constructor(position, size) {
        super(position, size);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        this.setLifespan(32);
        // this.setColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 60);
        
        const CT_FIRESMOKE = new ColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 32);
        
        // this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/2), Vector.from(size), [0, 0]], 32));
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(-Math.pow(2, -10)));
        
        const avgsz = rectangle_averageSize(this);
        
        for(let i = 0; i < 3; ++i) {
            let drawable = new PolygonDrawable(makeRandomPolygon(16, 12, 16));
            drawable.setStyle(CT_FIRESMOKE.copy().setStep(random(0, 8)));
            drawable.multiplySize(random(1/2, 1));
            drawable.multiplySize(avgsz/polygon_averageSize(drawable));
            drawable.initImaginarySize(avgsz);
            drawable.setZIndex(random(-1, 1));
            
            this.drawables.push(drawable);
        }
        
        this.setSelfBrake(1.03125);
        this.addInteraction(new DragRecipient(-0.125));
    }
    
    updateDrawable() {
        const avgsz = rectangle_averageSize(this);
        const positionM = this.getPositionM();
        
        for(let i = 0; i < this.drawables.length; ++i) {
            let drawable = this.drawables[i];
            
            drawable.setImaginarySize(avgsz);
            drawable.setPositionM(positionM);
        }
        
        return super.updateDrawable();
    }
}

class FireParticle extends Particle {
    constructor(position, size) {
        super(...arguments);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        this.setLifespan(irandom(24, 64));
        // this.setColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 60);
        // this.setStyle(new ColorTransition([255, 255, 0, 127], [255, 0, 0, 127], this.lifespan));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, random(1/4, 1/2)), Vector.from(size), Vector.multiplication(size, random(1/4, 1/2)), [0, 0]], this.lifespan, powt(1/1.25)));
        
        this.addInteraction(new ReplaceRecipient());
        // this.addInteraction(new DragRecipient(-Math.pow(2, -2)));
        this.accelerators.add([0, -0.0625]);
        
        this.setSelfBrake(1.125);
        
        for(let i = 0; i < 3; ++i) {
            const drawable = makeFireParticle();
            drawable.setLifespan(-1);
            
            drawable.setZIndex(random(-1, 0.25));
            
            drawable.multiplySize(rectangle_averageSize(this) / polygon_averageSize(drawable));
            
            drawable.initImaginarySize(rectangle_averageSize(this));
            
            drawable.setStyle(new ColorTransition([255, 255, 127, 1], [255, 0, 0, 0.375], this.lifespan, powt(1/2)));
            
            this.drawables.push(drawable);
        }
    }
    
    updateDrawable() {
        const positionM = this.getPositionM();
        
        for(let i = 0; i < this.drawables.length; ++i) {
            const drawable = this.drawables[i];
            
            drawable.setPositionM(positionM);
            drawable.setImaginarySize(rectangle_averageSize(this));
        }
        
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

EC["skyDecoration"] = class SkyDecoration extends Entity {
    constructor(position = [0, 0], size = [640, 360]) {
        super(position, size);
        
        this.setZIndex(+Math.pow(2, 20));
        
        this.drawable.setCameraMode("reproportion");
        this.getDrawable().baseWidth = size[0];
        this.getDrawable().baseHeight = size[1];
        
        this.clouds = new SetArray();
        
        /* MAKE SKY BACKGROUND *
        
        makeRepeatedTileFrom.multiplier = 4;
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_SKYTILE, this.getWidth(), this.getHeight(), 2*TILEWIDTH));
        makeRepeatedTileFrom.multiplier = 2;
        
        let canvas = this.drawable.style;
        let ctx = canvas.getContext("2d");
        
        let grd = ctx.createLinearGradient(canvas.width, 0, canvas.width, canvas.height);
        
        grd.addColorStop(0, "rgba(0, 0, 255, 0.875)");
        grd.addColorStop(1, "rgba(0, 255, 255, 0.875)");
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        /* MAKE CLOUDS *
        
        for(let i = 0; i < 12; ++i) {
            let cloud = Cloud.fromMiddle([random(this.getX1(), this.getX2()), random(this.getY1(), this.getY2())], [128, 64]);
            
            cloud.drawable.baseWidth = this.getDrawable().baseWidth;
            cloud.drawable.baseHeight = this.getDrawable().baseHeight;
            
            this.clouds.add(cloud);
        }
        
        for(let i = 0; i < 0; ++i) {
            let cloud = BigCloud.fromMiddle([random(this.getX1(), this.getX2()), random(this.getY1(), this.getY2())], [128, 64]);
            
            cloud.drawable.baseWidth = this.getDrawable().baseWidth;
            cloud.drawable.baseHeight = this.getDrawable().baseHeight;
            
            this.clouds.add(cloud);
        }
        
        for(let i = 0; i < 0; ++i) {
            let cloud = DarkerCloud.fromMiddle([random(this.getX1(), this.getX2()), random(this.getY1(), this.getY2())], [128, 64]);
            
            cloud.drawable.baseWidth = this.getDrawable().baseWidth;
            cloud.drawable.baseHeight = this.getDrawable().baseHeight;
            
            this.clouds.add(cloud);
        }
        
        /* PRE-EXISTING BACKGROUND IMAGE */
        
        this.drawable.setStyle(IMGBG["skyblur5"]);
        
        /**/
    }
    
    /**/
    
    onadd() {
        super.onadd();
        
        this.clouds.forEach(addEntity);
        
        return this;
    }
    
    onremove() {
        super.onremove();
        
        this.clouds.forEach(removeEntity);
        
        return this;
    }
    
    /**/
};

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

EC["sunlightDecoration"] = class SunlightDecoration extends Entity {
    constructor(position = [0, 0], size = [640, 360]) {
        super(position, size);
        
        this.setZIndex(-16);
        this.getDrawable().setCameraMode("reproportion");
        this.getDrawable().baseWidth = size[0];
        this.getDrawable().baseHeight = size[1];
        
        /*  *
        
        this.setStyle(makeGradientCanvas(new ColorTransition([255, 255, 255, 0.375], [255, 255, 0, 0]), this.getHeight() / CTILE_WIDTH, this.getWidth() / CTILE_WIDTH));
        this.setStyle(makeGradientCanvas(new ColorTransition([255, 255, 255, 0.5], [255, 255, 127, 0]), this.getHeight() / CTILE_WIDTH, this.getWidth() / CTILE_WIDTH));
        
        /*/
        
        let canvas = document.createElement("canvas");
        canvas.width = 16, canvas.height = 16;
        
        let ctx = canvas.getContext("2d");
        
        let grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        grd.addColorStop(0, rgba(255, 255, 255, 0.5));
        grd.addColorStop(0.0625, rgba(255, 255, 255, 0.25));
        grd.addColorStop(0.125, rgba(255, 255, 255, 0.375));
        grd.addColorStop(1, rgba(255, 255, 127, 0));
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.drawable.setStyle(canvas);
        
        /**/
    }
};

EC["treeTrunk"] = class TreeTrunk extends EC["ground"] {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_TREETRUNK, this.getWidth(), this.getHeight()));
    }
};

EC["treeBackground"] = class TreeBackground extends Entity {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_TREEBACKGROUND, this.getWidth(), this.getHeight(), TILEWIDTH/2, 4.5/2*TILEWIDTH));
        this.drawable.setZIndex(+16);
    }
};

EC["treePlatform"] = class TreePlatform extends EC["softPlatform"] {
    constructor(position, size = [64, 2]) {
        super(position, size);
        
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_TREETRUNK, this.getWidth(), this.getHeight()));
    }
};

class DiamondParticle extends Entity {
    constructor() {
        super(...arguments);
        
        const avgsz = rectangle_averageSize(this);
        
        this.setLifespan(24);
        this.setDrawable(PolygonDrawable.from(makePathPolygon([[0, -avgsz/2], [0, 0], [0, +avgsz/2]], avgsz/16)));
        this.drawable.setStyle(new ColorTransition(CV_WHITE, CV_YELLOW, this.lifespan, powt(1/2)));
        this.drawable.rotate(Math.PI/2).setPositionM(this.getPositionM());
        
        this.setSelfBrake(1.0625);
        
        // this.drawable.setShadowBlur(8);
    }
    
    updateDrawable() {
        const avgsz = rectangle_averageSize(this);
        
        this.drawable.setPositionM(this.getPositionM());
        // this.drawable.multiplySize(1/1.125);
        this.drawable.shrinkBase([0, avgsz/(16*(this.lifespan+1))]);
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
}

class OvalParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setDrawable(PolygonDrawable.from(roundparticle));
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.initImaginarySize(rectangle_averageSize(this));
        this.setLifespan(12);
        
        this.controllers.add(function() {
            if(this.sizeTransition) {
                this.setSizeM(this.sizeTransition.getNext());
            }
        });
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
    
    setSizeTransition() {
        if(arguments[0] instanceof VectorTransition) {
            this.sizeTransition = arguments[0];
        } else {
            this.sizeTransition = new VectorTransition(...arguments);
        }
        
        return this;
    }
}

const mazeWallCanvas = makeGradientCanvas(new ColorTransition(CV_WHITE, [127, 127, 127, 1]), 2, 2);

class MazeWall extends EC["ground"] {
    constructor() {
        super(...arguments);
        
        this.setStyle(makeRepeatedTileFrom(mazeWallCanvas, this.getWidth(), this.getHeight()));
    }
}

EC["mazeWall"] = MazeWall;

const smokeColorTransition2 = new ColorTransition([255, 255, 255, 255 / 255], [223, 223, 223, 0 / 255], 16, function(t) {return Math.pow(t, 5)});

class SpikeSmokeParticle extends Particle {
    constructor(position, size) {
        super(...arguments);
        
        this.setLifespan(16);
        this.setSizeTransition(new ColorTransition(Vector.multiplication(size, 1/2), Vector.multiplication(size, 1.25), this.lifespan));
        this.setSelfBrake(1.03125);
        
        let spikesCount = irandom(4, 6);
        let angleDiff = Math.PI/4;
        
        // this.resetSpikeDrawable(spikesCount, new ColorTransition([-angleDiff], [+angleDiff]), irandom(8, 10), irandom(16, 18), 6);
        this.resetSpikeDrawable(spikesCount, new ColorTransition([-angleDiff], [+angleDiff]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
    }
    
    updateDrawable() {
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
    
    resetSpikeDrawable() {
        this.drawable = new SpikeDrawable(...arguments);
        
        this.drawable.setStyle(ColorTransition.from(smokeColorTransition2));
        
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.initImaginarySize(rectangle_averageSize(this));
        
        return this;
    }
}

EC["tree2"] = class Tree2 extends Decoration {
    constructor() {
        super(...arguments);
        this.setStyle(IMG_TREE2);
    }
};

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

class CloudDrawable extends MultiPolygonDrawable {
    constructor() {
        // super(makeRandomPolygon(32, 12, 16));
        super();
        this.setPolygons(makeCloudMultiPolygon(16, random(16, 64), random(8, 32)));
        
        // this.stretchM([irandom(16, 64), 0]);
        this.multiplySize(irandom(2, 4));
        
        let light = irandom(239, 255);
        let alpha = irandom(191, 255) / 255;
        
        this.setStyle(rgba(light, light, light, alpha));
        
        this.setCameraMode("reproportion");
        
        this.setShadowBlur(12);
    }
}

class Cloud extends Entity {
    constructor() {
        super(...arguments);
        
        this.setDrawable(new CloudDrawable());
        
        this.getDrawable().setZIndex(Math.pow(2, 20) - 2);
        
        this.alwaysLoad = true;
    }
    
    updateDrawable() {
        this.getDrawable().setPositionM(this.getPositionM());
        
        return this;
    }
}

class BigCloud extends Cloud {
    constructor() {
        super(...arguments);
        
        this.getDrawable().multiplySize(3);
        this.getDrawable().setStyle(rgba(255, 255, 255, irandom(15, 31) / 255));
        this.getDrawable().setZIndex(Math.pow(2, 20) - 1);
    }
}

class DarkerCloud extends Cloud {
    constructor() {
        super(...arguments);
        
        let drawable = this.getDrawable();
        
        drawable.multiplySize(1/2);
        drawable.setStyle(rgba(223, 223, 223, 0.75));
        drawable.setZIndex(Math.pow(2, 20) - 3);
    }
}

EC["moonlightDecoration"] = class MoonlightDecoration extends Entity {
    constructor(position = [0, 0], size = [640, 360]) {
        super(position, size);
        
        this.setZIndex(-1024);
        this.getDrawable().setCameraMode("reproportion");
        this.getDrawable().baseWidth = size[0];
        this.getDrawable().baseHeight = size[1];
        
        let canvas = document.createElement("canvas");
        canvas.width = 16, canvas.height = 16;
        
        let ctx = canvas.getContext("2d");
        
        let grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        grd.addColorStop(0, rgba(0, 0, 0, 0.5));
        grd.addColorStop(1, rgba(0, 0, 15, 0));
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.drawable.setStyle(canvas);
    }
};

EC["nightSkyDecoration"] = class NightSkyDecoration extends EC["skyDecoration"] {
    // constructor(position = [0, 0], size = [640, 360]) {
        // super(position, size);
    constructor() {
        super(...arguments);
        
        /**/
        
        makeRepeatedTileFrom.multiplier = 4;
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_SKYTILE, this.getWidth(), this.getHeight(), 2*TILEWIDTH));
        makeRepeatedTileFrom.multiplier = 2;
        
        // this.drawable.style.getContext("2d").drawImage(makeGradientCanvas(new ColorTransition([0, 0, 255, 0.75], [0, 255, 255, 0.75]), 1, this.getHeight()), 0, 0, this.drawable.style.width, this.drawable.style.height);
        
        let canvas = this.drawable.style;
        let ctx = canvas.getContext("2d");
        
        let grd = ctx.createLinearGradient(canvas.width, 0, canvas.width, canvas.height);
        
        grd.addColorStop(0, "rgba(0, 0, 0, 0.875)");
        grd.addColorStop(1, "rgba(0, 0, 63, 0.875)");
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        /**/
    }
};

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

class WaterDroplet extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(24);
        
        this.setSelfBrake(1.03125);
        
        this.addInteraction(new DragRecipient(0.03125));
        
        this.setSizeTransition(new VectorTransition(this.size, [0, 0], this.lifespan, powt(8)));
        
        let avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(roundparticle));
        
        this.drawable.multiplySize(avgsz/12/irandom(4, 16));
        this.drawable.stretchM([16, 0]);
        
        this.drawable.initImaginarySize(avgsz);
    }
    
    updateDrawable() {
        if(this.lifeCounter < 14) {this.drawable.shrinkBase([-1, 0]);}
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}
