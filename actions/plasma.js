
const AS_PLASMA = set_gather("plasmaLightning");

class PlasmaEffect extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.addInteraction(new TypeDamager({type:FX_ELECTRIC, value:1}));
        this.setDrawable(PolygonDrawable.from(makeBurstPolygon2(new ColorTransition([2], [4], 16, Math.random), new ColorTransition([0], [20], 16, Math.random), 6)));
        this.drawable.rotate(Math.random());
        let avgsz = rectangle_averagesize(this);
        
        this.drawable.multiplySize(avgsz/16);
        this.drawable.initImaginarySize(avgsz);
        this.setStyle(new ColorTransition([255, 255, 0, 1], [63, 255, 63, 0], 12));
        this.setLifespan(12);
        
        let sizeTransition = new ColorTransition(this.size, Vector.multiplication(this.size, 8), this.lifespan);
        this.controllers.add(function() {
            this.setSizeM(sizeTransition.getNext());
        });
    }
    
    updateDrawable() {
        this.drawable.setImaginarySize(rectangle_averagesize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}

class PlasmaLightning extends BusyAction {
    constructor() {
        super();
        this.setId("plasmaLightning");
        
        this.maxRange = 128;
        this.setUseCost(12);
    }
    
    use() {
        if(this.phase == 0) {
            if(this.user.getEnergy() <= this.getUseCost()) {
                return this.end();
            } else {
                this.setRemovable(false);
                this.user.hurt(this.getUseCost());
            }
        }
        
        if(this.phase % 1 == 0 && this.phase < 16) {
            let cursorDirection = this.user.getCursorDirection();
            
            if(cursorDirection.getNorm() > this.maxRange) {
                cursorDirection.normalize(this.maxRange);
            }
            
            let cursorPositionM = Vector.addition(this.user.getPositionM(), cursorDirection);
            
            addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
            // addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
            // addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
            
            let hitbox = PlasmaEffect.fromMiddle(cursorPositionM, [2, 2]);
            hitbox.shareBlacklist(this.user.getBlacklist());
            
            addEntity(hitbox);
            
            this.user.setFace(cursorDirection[0]);
        }
        
        if(this.phase == 32) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
}

AC["plasmaLightning"] = PlasmaLightning;
