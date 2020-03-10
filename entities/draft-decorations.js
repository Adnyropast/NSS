
class Decoration extends Entity {
    constructor(position, size) {
        super(position, size);
        this.collidable = false;
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

EC["treeBackground"] = class TreeBackground extends Entity {
    constructor() {
        super(...arguments);
        
        this.drawable.setStyle(makeRepeatedTileFrom(IMG_TREEBACKGROUND, this.getWidth(), this.getHeight(), TILEWIDTH/2, 4.5/2*TILEWIDTH));
        this.drawable.setZIndex(+16);
    }
};

EC["tree2"] = class Tree2 extends Decoration {
    constructor() {
        super(...arguments);
        this.setStyle(IMG_TREE2);
    }
};

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
