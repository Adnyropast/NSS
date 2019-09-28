
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
        // this.setOffense("default", 1);
        this.addInteraction(new TypeDamager([{"type" : "default", "value" : 1}]));
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
    }
}

EC["waterArea"] = WaterArea;

class Target extends Entity {
    constructor(position, size) {
        super(position, size);
        // this.setEffectFactor("default", 1);
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
        
        this.addActset("transitionSize");
        this.setSizeTransition(new ColorTransition(this.size, this.size));
    }
    
    setSizeTransition(sizeTransition) {
        this.removeActionsWithId("transitionSize");
        this.addAction(new TransitionSize(sizeTransition));
        
        return this;
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
        
        this.drawable.multiplySize(rectangle_averagesize(this)/16);
        
        this.setStyle(new ColorTransition([0, 255, 255, 127], [0, 255, 255, 0], 60));
        this.setStyle(new ColorTransition([0, 255, 255, 1], [127, 255, 255, 0.5], 32));
        this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(1/1.03125);
        
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
}

const smokeColorTransition = new ColorTransition([255, 255, 255, 255 / 255], [223, 223, 223, 191 / 255], 32);

class SmokeParticle extends Particle {
    constructor(position, size = [8, 8]) {
        super(position, size);
        
        this.setDrawable(PolygonDrawable.from(makeRandomPolygon(24, 12, 16)).setLifespan(32).setPositionM(this.getPositionM()).multiplySize(8/16));
        this.drawable.initImaginarySize(rectangle_averagesize(this));
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        this.setLifespan(32);
        // this.setColorTransition([255, 255, 255, 191], [223, 223, 223, 31], 60);
        this.setStyle(ColorTransition.from(smokeColorTransition));
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(0.03125));
        // this.addInteraction(new BrakeRecipient(1.5));
        
        this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        this.setSelfBrake(1.03125);
    }
    
    updateDrawable() {
        // this.drawable.multiplySize(1/1.0625);
        this.drawable.setImaginarySize(rectangle_averagesize(this));
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
        this.setStyle(new ColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 32));
        this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(-Math.pow(2, -10)));
    }
}

class FireParticle extends Particle {
    constructor(position, size) {
        super(...arguments);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        this.setLifespan(32);
        // this.setColorTransition([255, 0, 0, 127], [0, 0, 0, 127], 60);
        this.setStyle(new ColorTransition([255, 255, 0, 127], [255, 0, 0, 127], 32));
        this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
        
        this.addInteraction(new ReplaceRecipient());
        this.addInteraction(new DragRecipient(-Math.pow(2, -3)));
        
        this.setDrawable(makeFireParticle().setPositionM(this.getPositionM()));
        this.setSelfBrake(1.0625);
    }
    
    updateDrawable() {
        this.drawable.multiplySize(1/1.015625);
        this.drawable.setPositionM(this.getPositionM());
        
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
        // this.setOffense(FX_PIERCING, 1);
        
        this.setLifespan(16);
        
        this.addInteraction(new TypeDamager([{"type" : FX_PIERCING, "value" : 1}]));
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
};

EC["lookupDoor"] = class LookupDoor extends EC["autoDoor"] {
    setMapwarp(mapname, warpPositionM) {
        this.addInteraction(new LookupMapWarper(mapname, warpPositionM));
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
        
        this.addInteraction(new TypeDamager({"type" : "void", "value" : Infinity}));
        this.setStyle(makeStyledCanvas(makeCTile("#3F3F3F3F", "#0000007F", "FFFFFF3F"), this.getWidth(), this.getHeight()));
    }
}

EC["pitArea"] = PitArea;

EC["mazeGenerator"] = class MazeGenerator extends Entity {
    constructor(position, size) {
        super(position, size);
        this.mazeSize;
        this.cellSize;
        this.wallSize;
        this.mode;
    }
    
    static fromData(data) {
        let mazeSize = data.mazeSize;
        let cellSize = data.cellSize;
        let wallSize = data.wallSize;
        let mode = data.mode;
        
        let mazeGenerator = super.fromData(data);
        
        mazeGenerator.mazeSize = mazeSize;
        mazeGenerator.cellSize = cellSize;
        mazeGenerator.wallSize = wallSize;
        mazeGenerator.mode = mode;
        
        return mazeGenerator;
    }
    
    update() {
        loadMaze(this.mazeSize, this.cellSize, this.wallSize, this.mode);
        
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
        loadMap(this.mapname);
        setGameTimeout(function() {
            maptransitioning = false;
        }, 1);
        
        return super.onremove();
    }
}

EC["skyDecoration"] = class SkyDecoration extends Entity {
    constructor(position, size) {
        super(position, size);
        
        this.setZIndex(+Math.pow(2, 20));
        // this.setStyle(makeGradientCanvas(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1]), 1, this.getHeight() / CTILE_WIDTH));
        // this.getDrawable().setCameraMode("advanced");
        
        /*  *
        
        let c = makeRepeatedTileFrom(IMG_SKYTILE, this.getWidth(), this.getHeight());
        
        c.getContext("2d").drawImage(makeGradientCanvas(new ColorTransition([0, 0, 255, 0.75], [0, 255, 255, 0.75]), 1, this.getHeight()), 0, 0, c.width, c.height);
        
        this.setStyle(c);
        
        /*/
        
        let m = 4;
        
        this.setPosition([0, 0]);
        this.setSize([CANVAS.width, CANVAS.height]);
        
        this.drawable.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_SKYTILE, CANVAS.width/40*m), this.getWidth()*m, this.getHeight()*m));
        
        // this.drawable.style.getContext("2d").drawImage(makeGradientCanvas(new ColorTransition([0, 0, 255, 0.75], [0, 255, 255, 0.75]), 1, this.getHeight()), 0, 0, this.drawable.style.width, this.drawable.style.height);
        
        let canvas = this.drawable.style;
        let ctx = canvas.getContext("2d");
        
        let grd = ctx.createLinearGradient(canvas.width, 0, canvas.width, canvas.height);
        
        grd.addColorStop(0, "rgba(0, 0, 255, 0.75)");
        grd.addColorStop(1, "rgba(0, 255, 255, 0.75)");
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.drawable.setCameraMode("none");
        
        /*  */
    }
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
    constructor(position = [0, 0], size = [CANVAS.width, CANVAS.height]) {
        super(position, size);
        
        this.setZIndex(-16);
        this.getDrawable().setCameraMode("none");
        
        /*  *
        
        this.setStyle(makeGradientCanvas(new ColorTransition([255, 255, 255, 0.375], [255, 255, 0, 0]), this.getHeight() / CTILE_WIDTH, this.getWidth() / CTILE_WIDTH));
        this.setStyle(makeGradientCanvas(new ColorTransition([255, 255, 255, 0.5], [255, 255, 127, 0]), this.getHeight() / CTILE_WIDTH, this.getWidth() / CTILE_WIDTH));
        
        /*/
        
        let canvas = document.createElement("canvas");
        canvas.width = 16, canvas.height = 16;
        
        let ctx = canvas.getContext("2d");
        
        let grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        grd.addColorStop(0, "rgba(255, 255, 255, 0.375)");
        grd.addColorStop(1, "rgba(255, 255, 127, 0)");
        
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.drawable.setStyle(canvas);
        
        /**/
    }
};

EC["treeTrunk"] = class TreeTrunk extends EC["ground"] {
    constructor() {
        super(...arguments);
        
        this.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_TREETRUNK, this.getWidth(), this.getWidth(), "repeat"), this.getWidth(), this.getHeight()));
    }
};

EC["treeBackground"] = class TreeBackground extends Entity {
    constructor() {
        super(...arguments);
        
        this.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_TREEBACKGROUND, CTILE_WIDTH/2, 4.5/2 * CTILE_WIDTH, "repeat"), this.getWidth(), this.getHeight()));
        this.setZIndex(+16);
    }
};

EC["treePlatform"] = class TreePlatform extends EC["softPlatform"] {
    constructor(position, size = [64, 2]) {
        super(position, size);
        
        this.setStyle(makeStyledCanvas(CANVAS.makePattern(IMG_TREETRUNK, this.getWidth(), this.getWidth(), "repeat"), this.getWidth(), this.getHeight()));
    }
};

class DiamondParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setDrawable(PolygonDrawable.from(diamondparticle).setStyle(new ColorTransition(CV_WHITE, [255, 255, 0, 1], 12)));
        this.drawable.rotate(Math.PI/2).setPositionM(this.getPositionM());
        this.setLifespan(12);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(1/1.125);
        
        return this;
    }
}

class OvalParticle extends Entity {
    constructor() {
        super(...arguments);
        
        this.setDrawable(PolygonDrawable.from(roundparticle).setStyle(new ColorTransition([0, 0, 255, 1], [0, 0, 63, 1], 12)));
        this.drawable.setPositionM(this.getPositionM());
        this.setLifespan(12);
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(1/1.125);
        
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

const smokeColorTransition2 = new ColorTransition([255, 255, 255, 255 / 255], [223, 223, 223, 0 / 255], 28, function(t) {return Math.pow(t, 5)});

class SpikeSmokeParticle extends Particle {
    constructor(position, size) {
        super(...arguments);
        
        this.setLifespan(28);
        this.setSizeTransition(new ColorTransition(Vector.multiplication(size, 1/2), Vector.multiplication(size, 1.25), 28));
        this.setSelfBrake(1.03125);
        
        let spikesCount = irandom(3, 5);
        let angleDiff = Math.PI/4;
        
        // this.resetSpikeDrawable(spikesCount, new ColorTransition([-angleDiff], [+angleDiff]), irandom(8, 10), irandom(16, 18), 6);
        this.resetSpikeDrawable(spikesCount, new ColorTransition([-angleDiff], [+angleDiff]), function() {return irandom(8, 10);}, function() {return irandom(12, 18);}, 6);
    }
    
    updateDrawable() {
        this.drawable.setImaginarySize(rectangle_averagesize(this));
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.setImaginaryAngle(this.speed.getAngle());
        
        return this;
    }
    
    resetSpikeDrawable() {
        this.drawable = new SpikeDrawable(...arguments);
        
        this.drawable.setStyle(ColorTransition.from(smokeColorTransition2));
        
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.initImaginarySize(rectangle_averagesize(this));
        
        return this;
    }
}
