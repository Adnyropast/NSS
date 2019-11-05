
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
        this.addInteraction(new ContactVanishActor(1));
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
        
        this.setStyle(makeRepeatedTileFrom(IMG_DEFBLOCK, this.getWidth(), this.getHeight()));
        
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
        this.setTypeOffense("default", 1);
        this.addInteraction(new TypeDamager());
    }
}

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
        
        this.drawable.setZIndex(-Math.random() * 4 + 3);
        
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/1.125), size, [0, 0]], 32));
        this.drawable.initImaginarySize(rectangle_averageSize(this));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        // this.drawable.multiplySize(1/1.03125);
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        
        return this;
    }
}

const smokeColorTransition = new ColorTransition([255, 255, 255, 255 / 255], [223, 223, 223, 191 / 255], 32, powt(2));

class SmokeParticle extends Particle {
    constructor(position, size = [8, 8]) {
        super(position, size);
        
        let avgsz = rectangle_averageSize(this);
        
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(avgsz*2, 12, 16)).setLifespan(32).setPositionM(this.getPositionM()).multiplySize(8/16));
        this.drawable.initImaginarySize(avgsz);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        this.setLifespan(32);
        // this.setColorTransition([255, 255, 255, 191], [223, 223, 223, 31], 60);
        this.setStyle(ColorTransition.from(smokeColorTransition));
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(0.03125));
        // this.addInteraction(new BrakeRecipient(1.5));
        
        // this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, 1/2), size, Vector.multiplication(size, 1/2), [0, 0]], 32));
        this.setSelfBrake(1.03125);
        
        this.drawable.setZIndex(random(-1, +1));
    }
    
    updateDrawable() {
        // this.drawable.multiplySize(1/1.0625);
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        
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
        this.setLifespan(64);
        // this.setColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 60);
        // this.setStyle(new ColorTransition([255, 255, 0, 127], [255, 0, 0, 127], this.lifespan));
        this.setSizeTransition(new MultiColorTransition([Vector.multiplication(size, random(1/4, 1/2)), Vector.from(size), Vector.multiplication(size, random(1/4, 1/2)), [0, 0]], this.lifespan, powt(1/1.25)));
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(-Math.pow(2, -2)));
        
        this.setSelfBrake(1.125);
        
        for(let i = 0; i < 2; ++i) {
            let drawable = makeFireParticle();
            drawable.multiplySize(random(1/2, 1));
            drawable.setStyle(new ColorTransition([255, 255, 127, 1], [255, 0, 0, 0.375], this.lifespan, function(t) {return Math.pow(t, 1)}));
            drawable.setLifespan(-1);
            drawable.initImaginarySize(rectangle_averageSize(this));
            drawable.setZIndex(random(-1, 0.25));
            
            this.drawables.push(drawable);
        }
    }
    
    updateDrawable() {
        for(let i = 0; i < this.drawables.length; ++i) {
            let drawable = this.drawables[i];
            // this.drawable.multiplySize(1/1.015625);
            drawable.setPositionM(this.getPositionM());
            drawable.setImaginarySize(rectangle_averageSize(this));
        }
        
        return this;
    }
}

class Projectile extends Hitbox {
    constructor(position, size) {
        super(position, size);
        this.setStyle("#FF0000");
        // this.setBrakeExponent(0);
        // this.setForceFactor(0);
        // this.setRegeneration(-1);
        this.setTypeOffense(FX_PIERCING, 1);
        
        this.setLifespan(16);
        
        this.addInteraction(new TypeDamager());
        // this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new ContactVanishRecipient(1));
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
            
            // loadFromData(maze);
            
            let cba = maze.entities.find(function(entity) {
                return entity.classId === "cameraBoundaryAround";
            });
            
            cba.position = [+16, +16];
            
            for(let i = 0; i < maze.entities.length; ++i) {
                addEntity(makeEntityFromData(maze.entities[i]));
            }
            
            PLAYER.initPositionM(getCurrentSave().playerPositionM);
            
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
        
        // this.setStyle(makeGradientCanvas(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1]), 1, this.getHeight() / CTILE_WIDTH));
        // this.getDrawable().setCameraMode("advanced");
        
        /*  *
        
        let c = makeRepeatedTileFrom(IMG_SKYTILE, this.getWidth(), this.getHeight());
        
        c.getContext("2d").drawImage(makeGradientCanvas(new ColorTransition([0, 0, 255, 0.75], [0, 255, 255, 0.75]), 1, this.getHeight()), 0, 0, c.width, c.height);
        
        this.setStyle(c);
        
        /**
        
        let m = 4;
        
        this.drawable.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_SKYTILE, CANVAS.width/40*m), this.getWidth()*m, this.getHeight()*m));
        
        // this.drawable.style.getContext("2d").drawImage(makeGradientCanvas(new ColorTransition([0, 0, 255, 0.75], [0, 255, 255, 0.75]), 1, this.getHeight()), 0, 0, this.drawable.style.width, this.drawable.style.height);
        
        let canvas = this.drawable.style;
        let ctx = canvas.getContext("2d");
        
        let grd = ctx.createLinearGradient(canvas.width, 0, canvas.width, canvas.height);
        
        grd.addColorStop(0, "rgba(0, 0, 255, 0.875)");
        grd.addColorStop(1, "rgba(0, 255, 255, 0.875)");
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        /*  *
        
        this.clouds = new SetArray();
        
        for(let i = 0; i < 16; ++i) {
            let cloud = Cloud.fromMiddle([Math.random() * this.getWidth() - 64, Math.random() * this.getHeight() - 64], [128, 64]);
            
            this.clouds.add(cloud);
        }
        
        /**/
        
        this.drawable.setStyle(IMGBG["sky2"]);
        
        /**/
    }
    
    /**
    
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
        this.addInteraction(new ContactVanishActor(1));
    }
};

EC["sidewaysSetter"] = class SidewaysSetter extends Entity {
    constructor() {
        super(...arguments);
        
        this.gravityField = new EC["gravityField"](...arguments);
        this.airArea = new EC["airArea"](...arguments);
    }
    
    onadd() {
        addEntity(this.gravityField);
        addEntity(this.airArea);
        
        return this;
    }
    
    update() {
        removeEntity(this);
        
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
        
        this.drawable.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_TREETRUNK, this.getWidth(), this.getWidth(), "repeat"), this.getWidth(), this.getHeight()));
    }
};

EC["treeBackground"] = class TreeBackground extends Entity {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_TREEBACKGROUND, CTILE_WIDTH/2, 4.5/2 * CTILE_WIDTH, "repeat"), this.getWidth(), this.getHeight()));
        this.drawable.setZIndex(+16);
    }
};

EC["treePlatform"] = class TreePlatform extends EC["softPlatform"] {
    constructor(position, size = [64, 2]) {
        super(position, size);
        
        this.drawable.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_TREETRUNK, this.getWidth(), this.getWidth(), "repeat"), this.getWidth(), this.getHeight()));
    }
};

class DiamondParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setLifespan(24);
        this.setDrawable(PolygonDrawable.from(diamondparticle).setStyle(new ColorTransition(CV_WHITE, [255, 255, 0, 1], this.lifespan, powt(1/2))));
        this.drawable.rotate(Math.PI/2).setPositionM(this.getPositionM());
        this.drawable.multiplySize(rectangle_averageSize(this))
        this.setSelfBrake(1.0625);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(1/1.125);
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

class MazeWall extends EC["ground"] {
    constructor() {
        super(...arguments);
        
        var wallPattern = makeCTile("#7F7F8F", "#3F3F7F", "#8F8F9F");
        
        wallPattern = CANVAS.makePattern(makeGradientCTilesCanvas(4, 4, new ColorTransition([0, 0, 0, 1], [255, 255, 255, 1]), new ColorTransition([0, 0, 0, 1], [0, 0, 0, 1])), 64, 64, "repeat");
        wallPattern = CANVAS.makePattern(makeGradientCanvas(new ColorTransition(CV_WHITE, [127, 127, 127, 1]), 2, 2), CTILE_WIDTH*4, CTILE_WIDTH*4, "repeat");

        // wallPattern = makeGradientCTiles(4, 4, new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1]), new ColorTransition([rv(), rv(), rv(), 1], [rv(), rv(), rv(), 1]));
        
        this.setStyle(makeStyledCanvas(wallPattern, this.getWidth()*4, this.getHeight()*4));
        this.setStyle(makeRepeatedTileFrom(makeGradientCanvas(new ColorTransition(CV_WHITE, [127, 127, 127, 1]), 2, 2), this.getWidth(), this.getHeight()));
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
        // this.resetEnergy(20);
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

class CloudDrawable extends PolygonDrawable {
    constructor() {
        super(makeRandomPolygon(32, 14, 16));
        
        this.stretchM([irandom(0, 48), 0]);
        this.multiplySize(irandom(2, 4));
        
        let light = 255; irandom(239, 255);
        let alpha = 1; irandom(191, 255) / 255;
        
        this.setStyle(rgba(light, light, light, alpha));
        
        this.setCameraMode("none");
    }
}

class Cloud extends Entity {
    constructor() {
        super(...arguments);
        
        for(let i = 0; i < 1; ++i) {
            let particle = new CloudDrawable();
            
            particle.multiplySize(3);
            particle.setStyle(rgba(255, 255, 255, irandom(0, 31) / 255));
            particle.setZIndex(Math.pow(2, 19.9));
            
            particle.setPositionM(Vector.addition(this.getPositionM(), [irandom(-64, +64), irandom(-48, +48)]));
            
            this.drawables.add(particle);
        }
        
        for(let i = 0; i < 1; ++i) {
            let particle = new CloudDrawable();
            
            particle.setZIndex(Math.pow(2, 19));
            
            particle.setPositionM(Vector.addition(this.getPositionM(), [irandom(-64, +64), irandom(-48, +48)]));
            
            this.drawables.add(particle);
        }
        
        for(let i = 0; i < 1; ++i) {
            let particle = new CloudDrawable();
            
            particle.setStyle(rgba(239, 239, 239, 0.875));
            particle.setZIndex(Math.pow(2, 18));
            
            particle.setPositionM(Vector.addition(this.getPositionM(), [irandom(-64, +64), irandom(-48, +48)]));
            
            this.drawables.add(particle);
        }
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
        
        let m = 4;
        
        this.drawable.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_SKYTILE, CANVAS.width/40*m), this.getWidth()*m, this.getHeight()*m));
        
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
