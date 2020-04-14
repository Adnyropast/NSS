
class DrawableImp extends Imp {
    static getGrants() {
        return {
            zIndex: 0,
            camera: null,
            cameraMode: "none",
            style: INVISIBLE,
            strokeStyle: undefined,
            globalAlpha: 1,
            shadowBlur: 0,
            shadowColor: undefined,
            
            getZIndex: function getZIndex() {
                return this.zIndex;
            },
            
            setZIndex: function setZIndex(zIndex) {
                this.zIndex = zIndex;
                
                return this;
            },
            
            getCamera: function getCamera() {
                return this.camera;
            },
            
            setCamera: function setCamera(camera) {
                this.camera = camera;
                
                return this;
            },
            
            getCameraMode: function getCameraMode() {
                return this.cameraMode;
            },
            
            setCameraMode: function setCameraMode(cameraMode) {
                return this.cameraMode = cameraMode;
            },
            
            getStyle: function getStyle() {
                return trueStyleOf(this.style);
            },
            
            setStyle: function setStyle(style) {
                this.style = style;
                
                return this;
            },
            
            getStrokeStyle: function getStrokeStyle() {
                return trueStyleOf(this.strokeStyle);
                return this.strokeStyle;
            },
            
            setStrokeStyle: function setStrokeStyle(strokStyle) {
                this.strokeStyle = strokStyle;
                
                return this;
            },
            
            getShadowBlur: function getShadowBlur() {
                return this.shadowBlur;
            },
            
            setShadowBlur: function setShadowBlur(shadowBlur) {
                return this.shadowBlur;
            },
            
            getShadowColor: function getShadowColor() {
                if(this.shadowColor !== undefined) {
                    return this.shadowColor;
                }
                
                return this.getStyle();
            },
            
            setShadowColor: function setShadowColor(shadowColor) {
                this.shadowColor = shadowColor;
                
                return this;
            },
            
            draw: function draw(context) {
                return this;
            },
            
            onlifespanend: function onlifespanend() {
                removeDrawable(this);
                
                return this;
            },
            
            update: function update() {
                this.updateControllers();
                this.updateLifeCounter();
                
                styleNext(this.style);
                styleNext(this.strokeStyle);
                
                return this;
            }
        };
    }
    
    static grant(object) {
        super.grant(object);
        ObservableImp.grant(object);
        LifespanImp.grant(object);
        ControllableImp.grant(object);
        
        return object;
    }
}
