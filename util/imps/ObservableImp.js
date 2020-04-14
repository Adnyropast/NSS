
class ObservableImp extends Imp {
    static getGrants() {
        return {
            eventListeners: {},
            
            triggerEvent: function triggerEvent(eventName, event) {
                if(typeof this["on" + eventName] === "function") {
                    this["on" + eventName](event);
                }
                
                for(let i in this.eventListeners[eventName]) {
                    this.eventListeners[eventName][i].bind(this)(event);
                }
                
                return this;
            },
            
            addEventListener: function addEventListener(eventName, listener) {
                if(!this.eventListeners.hasOwnProperty(eventName)) {
                    this.eventListeners[eventName] = new SetArray();
                }
                
                this.eventListeners[eventName].add(listener);
                
                return this;
            },
            
            setEventListener: function setEventListener(eventName, listenerName, listener) {
                if(!this.eventListeners.hasOwnProperty(eventName)) {
                    this.eventListeners[eventName] = new SetArray();
                }
                
                this.eventListeners[eventName][listenerName] = listener;
                
                return this;
            },
            
            removeEventListener(eventName, listener) {
                const eventListeners = this.eventListeners[eventName];
                
                let matchFn = returnFalse;
                
                if(typeof listener === "function") {
                    matchFn = function matchListener(eventListener, listenerName) {
                        return eventListener === listener;
                    };
                }
                
                else if(typeof listener === "string") {
                    matchFn = function matchString(eventListener, listenerName) {
                        return listenerName === listener;
                    };
                }
                
                else if(listener instanceof RegExp) {
                    matchFn = function matchRegExp(eventListener, listenerName) {
                        return !!listenerName.match(listener);
                    };
                }
                
                for(let listenerName in eventListeners) {
                    if(matchFn(eventListener[listenerName], listenerName)) {
                        delete eventListener[listenerName];
                    }
                }
                
                return this;
            }
        };
    }
}
