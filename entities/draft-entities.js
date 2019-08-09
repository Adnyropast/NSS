
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
        
        this.setStyle(makeStyledCanvas(makeCTile("black", "gray", "#3F3F3F"), this.getWidth(), this.getHeight()));
        
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
        this.setStyle("#007FFF3F");
        
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
        this.setDrawable(PolygonDrawable.from(flameparticle).multiplySize(1/4));
        this.drawable.setPositionM(this.getPositionM());
        this.setStyle(new ColorTransition([0, 255, 255, 127], [0, 255, 255, 0], 60));
        this.setStyle(new ColorTransition([0, 255, 255, 1], [127, 255, 255, 0.5], 32));
        this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
    }
    
    updateDrawable() {
        this.drawable.setPositionM(this.getPositionM());
        this.drawable.multiplySize(1/1.03125);
        
        return this;
    }
}

class SmokeParticle extends Particle {
    constructor(position, size = [8, 8]) {
        super(position, size);
        
        this.collidable = true;
        // this.forceFactor = 0.5;
        // this.setSelfBrake(1.0625);
        this.setLifespan(32);
        // this.setColorTransition([255, 255, 255, 191], [223, 223, 223, 31], 60);
        this.setStyle(new ColorTransition([255, 255, 255, 255 / 255], [223, 223, 223, 191 / 255], 32));
        // this.setStyle(AnimatedImages.from(PTRNS_SMOKE));
        
        // this.addInteraction(new ReplaceRecipient());
        // this.addInteraction(new DragRecipient(1));
        // this.addInteraction(new BrakeRecipient(1.5));
        
        this.setSizeTransition(new ColorTransition(size, [0, 0], 32));
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
        this.addInteraction(new DragRecipient(-Math.pow(2, -10)));
    }
}

class Projectile extends Entity {
    constructor(position, size) {
        super(position, size);
        this.setStyle("#FF0000");
        // this.setBrakeExponent(0);
        // this.setForceFactor(0);
        // this.setRegeneration(-1);
        // this.setOffense(FX_PIERCING, 1);
        
        this.setLifespan(16);
        
        this.addInteraction(new TypeDamager([{"type" : FX_PIERCING, "value" : 1}]));
        this.addInteraction(new ReplaceRecipient());
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
        this.setLifespan(8);
        this.mapname = mapname;
    }
    
    onadd() {
        transitionIn(this.energy);
        
        return super.onadd();
    }
    
    onremove() {
        transitionOut(8);
        loadMap(this.mapname);
        maptransitioning = false;
        
        return super.onremove();
    }
}

EC["skyDecoration"] = class SkyDecoration extends Entity {
    constructor() {
        super(...arguments);
        
        this.setZIndex(+16);
        this.setStyle(makeGradientCanvas(new ColorTransition([0, 0, 255, 1], [0, 255, 255, 1]), 1, this.getWidth() / CTILE_WIDTH));
        // this.getDrawable().setCameraMode("advanced");
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
    constructor() {
        super(...arguments);
        
        this.setZIndex(-16);
        this.setStyle(makeGradientCanvas(new ColorTransition([255, 255, 255, 0.375], [255, 255, 0, 0]), this.getHeight() / CTILE_WIDTH, this.getWidth() / CTILE_WIDTH));
        this.getDrawable().setCameraMode("none");
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
