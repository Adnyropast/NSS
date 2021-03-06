
const AS_PLASMA = set_gather("PlasmaLightning");

class PlasmaEffect extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.setDrawable(PolygonDrawable.from(makeBurstPolygon2(new ColorTransition([2], [4], 16, Math.random), new ColorTransition([0], [20], 16, Math.random), 6)));
        this.drawable.rotate(Math.random());
        let avgsz = rectangle_averageSize(this);
        
        this.drawable.multiplySize(avgsz/16);
        this.drawable.initImaginarySize(avgsz);
        this.setStyle(new ColorTransition([255, 255, 0, 1], [63, 255, 63, 0], 12));
        this.setLifespan(12);
        
        let sizeTransition = new ColorTransition(this.size, Vector.multiplication(this.size, 8), this.lifespan);
        this.controllers.add(function() {
            this.setSizeM(sizeTransition.getNext());
        });
        
        this.setTypeOffense(FX_ELECTRIC, 1);
        
        this.setEventListener("hit", "shake", function shake(event) {
            entityShake(event.recipient, 32);
        });
    }
    
    updateDrawable() {
        this.drawable.setImaginarySize(rectangle_averageSize(this));
        this.drawable.setPositionM(this.getPositionM());
        
        return this;
    }
}

class PlasmaLightning extends BusyAction {
    constructor() {
        super();
        
        this.maxRange = 128;
        this.setUseCost(12);
    }
    
    use() {
        if(this.phase == 0) {
            if(this.user.spendEnergy(this.getUseCost())) {
                this.setRemovable(false);
            } else {
                return this.end();
            }
        }
        
        let cursorDirection = this.user.getCursorDirection();
        
        if(cursorDirection.getNorm() > this.maxRange) {
            cursorDirection.normalize(this.maxRange);
        }
        
        let cursorPositionM = Vector.addition(this.user.getPositionM(), cursorDirection);
        
        if(this.phase % 1 == 0 && this.phase < 16) {
            
            addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
            // addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
            // addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
            
            this.user.setFace(cursorDirection[0]);
        }
        
        if(this.phase % 4 == 0 && this.phase < 16) {
            let hitbox = PlasmaEffect.fromMiddle(cursorPositionM, [2, 2]);
            hitbox.shareBlacklist(this.user.getBlacklist());
            
            addEntity(hitbox);
        }
        
        if(this.phase == 32) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
}
