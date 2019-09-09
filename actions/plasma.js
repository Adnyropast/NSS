
const AS_PLASMA = set_gather("plasmaLightning");

class PlasmaEffect extends Hitbox {
    constructor() {
        super(...arguments);
        
        this.addInteraction(new TypeDamager({type:FX_ELECTRIC, value:16}));
        this.setStyle(new ColorTransition([255, 255, 0, 1], [255, 255, 0, 0.5], 12));
        this.setLifespan(12);
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
            if(this.user.getEnergy() > this.getUseCost()) {
                let cursorDirection = this.user.getCursorDirection();
                
                if(cursorDirection.getNorm() > this.maxRange) {
                    cursorDirection.normalize(this.maxRange);
                }
                
                let cursorPositionM = Vector.addition(this.user.getPositionM(), cursorDirection);
                
                addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
                addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
                addDrawable(new LightningDrawable(this.user.getPositionM(), cursorPositionM));
                
                let hitbox = PlasmaEffect.fromMiddle(cursorPositionM, [2, 2]);
                hitbox.shareBlacklist(this.user.getBlacklist());
                
                addEntity(hitbox);
                
                this.setRemovable(false);
                this.user.hurt(this.getUseCost());
                
                this.user.setFace(cursorDirection[0]);
            } else {
                return this.end();
            }
        }
        // addDrawable(new LightningDrawable(this.user.getPositionM(), this.user.getCursor().getPositionM()));
        if(this.phase == 32) {
            this.setRemovable(true);
            this.end();
        }
        
        return this;
    }
}
