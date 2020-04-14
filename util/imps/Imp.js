
class Imp {
    constructor() {
        throw TypeError(this.constructor.name + " is not a constructor");
    }
    
    static getGrants() {
        return {};
    }
    
    static grant(object) {
        const grants = this.getGrants();
        
        for(let propName in grants) {
            if(typeof object[propName] === "undefined") {
                const value = grants[propName];
                
                if(typeof value === "function") {
                    Object.defineProperty(object.__proto__, propName, {
                        enumerable: false,
                        value: value,
                        writable: true,
                    });
                } else {
                    Object.defineProperty(object, propName, {
                        enumerable: false,
                        value: value,
                        writable: true,
                    });
                }
            }
        }
        
        Object.defineProperty(object, "grantedBy" + this.name, {
            enumerable: false,
            value: true,
            writable: true
        });
        
        return object;
    }
}

class LifespanImp extends Imp {
    static getGrants() {
        return {
            lifeCounter: 0,
            lifespan: -1,
            
            getLifeCounter: function getLifeCounter() {
                return this.lifeCounter;
            },
            
            getLifespan: function getLifespan() {
                return this.lifespan;
            },
            
            setLifespan: function setLifespan(lifespan) {
                this.lifeCounter = 0;
                this.lifespan = lifespan;
                
                return this;
            },
            
            updateLifeCounter: function updateLifeCounter() {
                if(this.lifeCounter >= this.lifespan) {
                    if(this.grantedByObservableImp) {
                        this.triggerEvent("lifespanend");
                    }
                } else {
                    ++this.lifeCounter;
                }
                
                return this;
            }
        };
    }
}
