
const AS_SWORD = set_gather("overheadSlash", "multiswordAttack1", "multiswordAttack2", "multiswordAttackFinish", "upwardArcSlash", "downwardArcSlash", "autoSword");

class SwordAbility extends BusyAction {
    constructor() {
        super();
    }
}

class SlashEffect extends Hitbox {
    constructor(position, size) {
        super(position, size);
        this.setTypeOffense(FX_SHARP, 1);
        
        var grd = CANVAS.getContext("2d").createLinearGradient(0, 0, 0, this.getHeight());
        grd.addColorStop(0, "#00FFFF00");
        grd.addColorStop(1, "#00FFFFBF");
        
        this.setStyle(grd);
        this.setStyle(INVISIBLE);
        
        this.addInteraction(new TypeDamager());
    }
}

const CT_DEFAULTBLADE = [
    (new ColorTransition([0, 255, 255, 1], [0, 0, 255, 0.25], 7, bezierLinear)), 
    (new ColorTransition([255, 255, 255, irandom(75, 100)/100], [255, 255, 0, 0], 11, bezierLinear))
];

const CT_SHADOWBLADE = [
    (new ColorTransition([0, 0, 127, 1], [0, 0, 255, 0], 7, bezierLinear)), 
    (new ColorTransition([191, 191, 255, irandom(75, 100)/100], [31, 0, 255, 0], 11, bezierLinear))
];

const CT_REDBLADE = [
    (new ColorTransition([255, 63, 63, 1], [255, 0, 0, 0], 7, bezierLinear)),
    (new ColorTransition([255, 95, 95, irandom(75, 100)/100], [255, 0, 0, 0], 11, bezierLinear))
];

const CT_CYANBLADE = [
    (new MultiColorTransition([[127, 255, 255, 1], [0, 255, 255, 1], [0, 223, 255, 0.875], [0, 191, 255, 0.75], [0, 63, 255, 0.5], [0, 0, 255, 0]], 7, bezierLinear)),
    (new MultiColorTransition([[255, 255, 255, 1], [127, 255, 255, 1], [0, 255, 255, 0.75], [0, 127, 255, 0.5], [0, 0, 255, 0]], 11, bezierLinear))
];

let bladeCT = CT_DEFAULTBLADE;

function makeRandomBladeCT() {
    let rct = makeRandomSaturatedColor();
    let rct_edge = colorVector_brighten(rct, irandom(-127, +127));
    
    if(!Math.floor(Math.random() * 2)) {
        rct_edge = colorVector_brighten(makeRandomSaturatedColor(), irandom(-127, +127));
    }
    
    bladeCT = [
        new ColorTransition(rct, colorVector_alterAlpha(rct, -1), 7),
        new ColorTransition(rct_edge, colorVector_alterAlpha(rct_edge, -1), 11)
    ];
    
    return bladeCT;
}

class SwordSlashAction extends SlashAction {
    constructor() {
        super();
        
        this.startlag = 0;
        this.endlag = 0;
        
        this.swordDrawable = MultiPolygonDrawable.from(makeSwordMultiPolygon());
        
        this.swordDrawable.setLifespan(32);
        
        let drawables = this.swordDrawable;
        
        drawables[0].setStyle("#00FFFF");
        drawables[1].setStyle("#00EFEF");
        drawables[2].setStyle("#003F7F");
        drawables[3].setStyle("#005F9F");
        
        drawables[0].setStyle("#FFFFFF");
        drawables[1].setStyle("#EFEFEF");
        drawables[2].setStyle("#7F7F7F");
        drawables[3].setStyle("#F7F7F7");
        
        this.swordDrawable.multiplySize(1/1.5);
        this.swordDrawable.initImaginarySize(rectangle_averageSize(this.hitbox));
        
        this.swordDrawable.zIndex = -10;
        
        // let otherTrail = new TrailDrawable();
        // otherTrail.edgeWidth = 2;
        // this.trailDrawable.otherTrails.add(otherTrail);
        
        for(let i = 0; i < 4; ++i) {
            let otherTrail = new TrailDrawable();
            otherTrail.edgeWidth = 4-i*4; irandom(-8, +2);
            this.trailDrawable.otherTrails.add(otherTrail);
        }
        
        this.bladeCT = CT_DEFAULTBLADE;
        
        /**
        
        this.bladeCT = makeRandomBladeCT();
        
        let cv = this.bladeCT[0].vector1;
        
        drawables[0].setStyle(rgba.apply(rgba, colorVector_brighten(cv, 64)));
        drawables[1].setStyle(rgba.apply(rgba, colorVector_brighten(cv, -16)));
        drawables[2].setStyle(rgba.apply(rgba, colorVector_brighten(cv, -128)));
        drawables[3].setStyle(rgba.apply(rgba, colorVector_brighten(cv, -8)));
        
        /**/
    }
    
    updateTrailDrawableStyle(detProgress) {
        // this.trailDrawable.trailStyle = new ColorTransition([127*detProgress, 255, 255, 1], [0, 255*detProgress, 255, 0], 8);
        
        this.trailDrawable.trailStyle = this.bladeCT[0].setStep(1-detProgress);
        
        for(let i = 0; i < this.trailDrawable.otherTrails.length; ++i) {
            this.trailDrawable.otherTrails[i].trailStyle = this.bladeCT[1].setStep(1-detProgress);
        }
        
        return this;
    }
    /**/
    onadd() {
        addDrawable(this.swordDrawable);
        
        return super.onadd();
    }
    
    onend() {
        removeDrawable(this.swordDrawable);
        
        return super.onend();
    }
    
    use() {
        super.use();
        
        this.swordDrawable.setPositionM(this.hitbox.getPositionM());
        
        let progression = (Math.min(this.phase, this.startlag + this.slashDuration) - this.startlag) / (this.slashDuration);
        
        let angle = this.bladeAngleTransition.at(progression)[0];
        
        this.swordDrawable.setImaginaryAngle(angle);
        this.swordDrawable.setImaginarySize(rectangle_averageSize(this.hitbox));
        
        return this;
    }
    /**/
}

class OverheadSlash extends SwordSlashAction {
    constructor() {
        super();
        this.setId("overheadSlash");
        
        this.effect = null;
        this.face = null;
        this.center = null;
        
        this.setUseCost(3);
        this.setUseCost(1.5);
        this.det = 3;
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        face[1] = Math.sign(face[1]);
        
        if(face[0] == 0) {
            face[0] = this.user.faceSave;
        }
        
        this.baseAngleTransition = new ColorTransition([-Math.PI/2 - 2 * 2*face[0] * 0.1875], [-Math.PI/2 + 8 * 2*face[0] * 0.1875]);
        
        this.baseDistanceTransition = new ColorTransition([0], [2], 1, makeBackForthCurve(2));
        
        // this.bladeAngleTransition = this.baseAngleTransition;
        // this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI*3/4], [-Math.PI/2 + face[0] * 3/4 * Math.PI]);
        this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI*3/4], [-Math.PI/2 + face[0] * 5/4 * Math.PI]);
        
        this.bladeWidthTransition = new ColorTransition([20], [20]);
        
        this.edgeWidthTransition = new VectorTransition([2], [2]);
        
        this.hitbox.launchDirection = face.times(1);
        
        return this;
    }
    
    preventsAddition(action) {
        if(this.phase > 7 && AS_SWORD.includes(action.getId())) {
            this.nextAction = new MultiswordAttack1();
        }
        
        return super.preventsAddition(action);
    }
    
    onend() {
        this.preventsAddition = function() {return false};
        
        if(this.nextAction instanceof Action) {
            this.user.addAction(this.nextAction);
        }
        
        return super.onend();
    }
}

class UpwardArcSlash extends SwordSlashAction {
    constructor() {
        super();
        this.setId("upwardArcSlash");
        
        this.slashDuration = 9;
        // this.startlag = 6;
        
        this.hitbox.launchDirection = [0, -4];
        
        this.setUseCost(3);
        this.setUseCost(2);
    }
    
    transitionsSetup() {
        let hface = this.user.faceSave;
        
        this.baseAngleTransition = new ColorTransition([-Math.PI/2 - Math.PI/2], [-Math.PI/2 + Math.PI/2]);
        this.baseDistanceTransition = new ColorTransition([4], [4]);
        this.bladeAngleTransition = new ColorTransition([Math.PI/2 + Math.PI/4], [Math.PI/2 + 2*Math.PI - 3*Math.PI/4]);
        this.bladeWidthTransition = new ColorTransition([20], [20]);
        
        return this;
    }
}

function makeHalfOvalTiming(rad1 = 1, rad2 = 1) {
    return function timing(t) {
        let angle = t * Math.PI;
        
        let cos = rad1 * Math.cos(angle);
        let sin = rad2 * Math.sin(angle);
        
        let res = (new Vector(cos, sin)).getAngle() / Math.PI;
        
        return res;
    };
}

function makeFullOvalTiming(rad1 = 1, rad2 = 1) {
    return function timing(t) {
        let angle = t * 2*Math.PI;
        
        let cos = rad1 * Math.cos(angle);
        let sin = rad2 * Math.sin(angle);
        
        let res = (new Vector(cos, sin)).getAngle() / (2*Math.PI);
        
        return res;
    };
}

class MultiswordAttack1 extends SwordSlashAction {
    constructor() {
        super();
        this.setId("multiswordAttack1");
        
        this.slashDuration = 6;
        this.det = 6;
        this.endlag = 1;
        
        this.nextAction = MultiswordAttackFinish;
        this.followup = MultiswordAttack2;
        
        this.setUseCost(3);
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        
        if(Math.abs(face[0]) > Math.abs(face[1])) {
            face[0] = Math.sign(face[0]);
            face[1] = Math.sign(face[1]);
            
            const bladeRad1 = 20;
            const bladeRad2 = 8;
            
            this.baseAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI/4], [-Math.PI/2 + face[0] * Math.PI], 1, makeHalfOvalTiming(bladeRad1, bladeRad2));
            this.baseDistanceTransition = new ColorTransition([0], [4], 1, forthBackTiming);
            
            this.bladeAngleTransition = new ColorTransition([-Math.PI/2 - face[0] * Math.PI/2], [-Math.PI/2 + face[0] * 2.5/4*Math.PI], 1, makeHalfOvalTiming(bladeRad1, bladeRad2));
            this.bladeWidthTransition = new ColorTransition([0], [1], 1, function(t) {
                let angle = t * Math.PI;
                
                let cos = bladeRad1 * Math.cos(angle);
                let sin = bladeRad2 * Math.sin(angle);
                
                return (new Vector(cos, sin)).getNorm();
            });
            
            this.hitbox.launchDirection = [face[0] * 0.5, 0];
        } else {
            this.end();
            return false;
        }
        
        return this;
    }
    
    preventsAddition(action) {
        if(this.phase > 0 && AS_SWORD.includes(action.getId()) && typeof this.followup == "function") {
            this.nextAction = new this.followup();
        }
        
        return super.preventsAddition(action);
    }
    
    onend() {
        this.preventsAddition = function() {return false};
        
        if(this.nextAction instanceof Action) {
            this.user.addAction(this.nextAction);
        } else if(typeof this.nextAction == "function") {
            this.user.addAction(new this.nextAction());
        }
        
        return super.onend();
    }
}

class MultiswordAttack2 extends MultiswordAttack1 {
    constructor() {
        super();
        this.setId("multiswordAttack2");
        
        this.followup = MultiswordAttack1;
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        
        if(Math.abs(face[0]) > Math.abs(face[1])) {
            face[0] = Math.sign(face[0]);
            
            this.baseAngleTransition = new ColorTransition([-Math.PI/2], [-Math.PI/2 + face[0] * (Math.PI + Math.PI/4)]);
            this.baseDistanceTransition = new ColorTransition([6], [0], 1, makeBackForthCurve(2));
            
            this.bladeAngleTransition = this.baseAngleTransition;
            this.bladeWidthTransition = new ColorTransition([20], [16], 1, powt(2));
            
            this.hitbox.launchDirection = [face[0] * 0.5, 0];
        } else {
            this.end();
            return false;
        }
        
        return this;
    }
}

class MultiswordAttackFinish extends MultiswordAttack2 {
    constructor() {
        super();
        this.setId("multiswordAttackFinish");
        
        this.slashDuration = 8;
        this.endlag = 12;
        
        this.nextAction = null;
        this.followup = null;
        this.setUseCost(0);
    }
    
    transitionsSetup() {
        let face = this.user.getCursorDirection();
        face[0] = Math.sign(face[0]);
        face[1] = Math.sign(face[1]);
        
        if(face[0] != 0) {
            this.baseAngleTransition = new ColorTransition([Math.PI/2], [Math.PI/2 - face[0] * Math.PI]);
            this.baseDistanceTransition = new ColorTransition([4], [4]);
            
            this.bladeAngleTransition = new ColorTransition([Math.PI/2 + face[0] * Math.PI/4], [Math.PI/2 - face[0] * 5/4*Math.PI]);
            this.bladeWidthTransition = new ColorTransition([20], [20]);
            
            this.hitbox.launchDirection = face.times(8);
        } else {
            this.end();
            return false;
        }
        
        return this;
    }
}

class DownwardArcSlash extends SwordSlashAction {
    constructor() {
        super();
        this.setId("downwardArcSlash");
        
        this.hitbox.launchDirection = [0, +4];
        
        this.setUseCost(3);
        this.setUseCost(2);
    }
    
    transitionsSetup() {
        let hface = this.user.faceSave;
        
        this.baseAngleTransition = new ColorTransition([Math.PI/2 + Math.PI/4], [Math.PI/2 - 3/4 * Math.PI]);
        this.baseDistanceTransition = new ColorTransition([4], [4]);
        this.bladeAngleTransition = new ColorTransition([Math.PI/2 + Math.PI/4], [Math.PI/2 - 3/4*Math.PI]);
        this.bladeWidthTransition = new ColorTransition([20], [20]);
        
        return this;
    }
}

class AutoSword extends SwordAbility {
    constructor() {
        super();
        this.setId("autoSword");
    }
    
    use() {
        if(this.phase == 0) {
            if(this.user.collidesWithPoint(this.user.cursor.getPositionM())) {
                
            } else {
                let cursorDirection = this.user.getCursorDirection();
                
                if(Math.abs(cursorDirection[0]) >= Math.abs(cursorDirection[1])) {
                    this.user.addAction(new OverheadSlash());
                } else if(cursorDirection[1] < 0) {
                    this.user.addAction(new UpwardArcSlash());
                } else if(cursorDirection[1] > 0) {
                    this.user.addAction(new DownwardArcSlash());
                } else {
                    this.end();
                }
            }
        }
        
        return this;
    }
    
    allowsReplacement(action) {
        return AS_SWORD.includes(action.getId()) && !this.sharesId(action);
    }
}

AC["autoSword"] = AutoSword;
