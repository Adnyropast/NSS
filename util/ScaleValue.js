
class ScaleValue {
    constructor(real, effective = real, effectiveLock = false) {
        this.real = real;
        this.effective = effective;
        this.effectiveLock = effectiveLock;
    }
    
    static fromData(data) {
        const scaleValue = new this(data.real, data.effective);
        
        if(data.effectiveLock) {
            scaleValue.setEffectiveLock(data.effectiveLock);
        }
        
        return scaleValue;
    }
    
    getReal() {
        return this.real;
    }
    
    setReal(real) {
        this.real = real;
        
        return this;
    }
    
    getEffective() {
        return this.effective;
    }
    
    setEffective(effective) {
        this.effective = effective;
        
        return this;
    }
    
    init(value) {
        this.real = value;
        this.effective = value;
        
        return this;
    }
    
    effectiveLocked() {
        return this.effectiveLock;
    }
    
    setEffectiveLock(effectiveLock) {
        this.effectiveLock = effectiveLock;
        
        return this;
    }
    
    valueOf() {
        return this.effective;
    }
    
    toJSON() {
        return {
           className: "ScaleValue",
           real: this.getReal(),
           effective: this.getEffective(),
           effectiveLock: this.effectiveLocked()
        };
    }
}
