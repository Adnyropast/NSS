
const AS_FOCUS = set_gather("HoldFocus", "PressFocus", "MouseFocus", "MoveFocus", "FreeKeyFocus", "PositionCursorTarget", "TargetFocus");

class FocusAction extends Action {
    constructor() {
        super();
    }
}

class HoldFocus extends FocusAction {
    constructor() {
        super();
        this.order = -1;
    }
    
    use() {
        // console.log("holdfocus #" + this.phase);
        
        if(this.phase == 0) {
            this.user.cursor.setNextTarget();
        }
        
        this.user.cursor.centerTarget();
        
        if(this.user.cursor.target == null) {
            this.end();
        }
        
        return this;
    }
    
    onend() {
        this.user.cursor.target = null;
        // console.log("holdfocus ended");
    }
}

class PressFocus extends FocusAction {
    constructor() {
        super();
        this.order = -1;
    }
    
    use() {
        if(this.phase == 0) {
            this.user.cursor.setNextTarget();
        }
        
        this.user.cursor.centerTarget();
        
        return this;
    }
    
    preventsAddition(action) {
        if(action instanceof PressFocus) {
            this.user.cursor.setPositionM(this.user.getPositionM());
            this.end();
        }
        
        return AS_FOCUS.includes(action.getClassName()) || super.preventsAddition(action);
    }
}

class MouseFocus extends FocusAction {
    constructor() {
        super();
        this.order = -1;
        this.allowMoveFocus = false;
    }
    
    use() {
        if(mouse.moveValue < 15 || mouse.value(1)) {
            // this.user.cursor.setPositionM(getMousePosition());
            this.user.cursor.destination = getMousePosition();
            this.allowMoveFocus = false;
        } else {
            // console.log(this.user.actions);
            this.allowMoveFocus = true;
            this.user.cursor.destination = null;
            
            this.end();
        }
        
        return this;
    }
    
    preventsAddition(action) {
        return action instanceof MoveFocus || super.preventsAddition(action);
    }
}

class KeySteer extends Action {
    constructor() {
        super();
    }
    
    use() {
        var direction = getKDirection();
        
        if(!direction.isZero()) {
            this.user.direction.set(direction);
        }
        
        return this;
    }
}

class MoveFocus extends FocusAction {
    constructor() {
        super();
        this.order = -1;
        
        this.keySteer = new KeySteer();
    }
    
    use() {
        /**
        
        if(this.phase == 0) {
            this.user.cursor.setPositionM(Vector.addition(this.user.getPositionM(), this.user.speed));
        }
        
        // this.user.cursor.setPositionM(this.user.route.minus(this.user.getPositionM()).multiply(this.user.cursorDistance).add(this.user.getPositionM()));
        this.user.cursor.setPositionM(this.user.route.minus(this.user.getPositionM()).normalize(this.user.cursorDistance).add(this.user.getPositionM()));
        // this.user.cursor.route = getKDirection().add(this.user.getPositionM());
        // this.user.cursor.speed = this.user.speed;
        
        // if(this.phase > 0 && this.user.speed.isZero()) {
            // this.end();
        // }
        
        /**
        
        if(this.phase == 0) {
            this.user.addAction(this.keySteer);
        }
        
        this.user.cursor.setPositionM(this.user.direction.times(1048576).add(this.user.getPositionM()));
        
        /**/
        
        if(this.user.route != null) {
            // this.user.cursor.setPositionM(this.user.route);
            const positionM = this.user.getPositionM();
            let vector = Vector.subtraction(this.user.route, positionM);
            this.user.cursor.destination = Vector.addition(positionM, vector.normalize(80));
        }
        
        return this.end();
    }
    
    allowsReplacement(action) {
        return AS_FOCUS.includes(action.getClassName()) && !(action instanceof MoveFocus);
    }
    
    onend() {
        this.user.removeAction(this.keySteer);
        
        return super.onend();
    }
}

class FreeKeyFocus extends FocusAction {
    constructor() {
        super();
        this.order = -1;
    }
    
    use() {
        this.user.cursor.drag(getKDirection(K_CLEFT, K_CUP, K_CRIGHT, K_CDOWN));
        this.end();
        
        return this;
    }
}

class PositionCursorTarget extends FocusAction {
    constructor() {
        super();
    }
    
    use() {
        this.user.cursor.centerTarget();
        
        return this.end();
    }
}

class FocusClosest extends FocusAction {
    use() {
        if(this.user.cursor == null) return this.end("no cursor");
        if(this.user.cursor.targets.length == 0) return this.end("no targets");
        
        this.user.cursor.target = this.user.cursor.targets[0];
        var max = Vector.distance(this.user.cursor.target.getPositionM(), this.user.getPositionM());
        
        for(var i = 1; i < this.user.cursor.targets.length; ++i) {
            var distance = Vector.distance(this.user.cursor.targets[i].getPositionM(), this.user.getPositionM());
            
            if(distance < max) {
                max = distance;
                this.user.cursor.target = this.user.cursor.targets[i];
            }
        }
        
        this.user.cursor.centerTarget();
        
        return this;
    }
}

class TargetFocus extends FocusAction {
    constructor() {
        super();
    }
    
    use() {
        const cursor = this.user.getCursor();
        
        let user = this.user;
        let userPositionM = this.user.getPositionM();
        
        if(this.phase === 0) {
            let previousTarget = this.user.cursor.target;
            
            let targeted = cursor.targeted;
            let targets = cursor.collidedWith.filter(function(entity) {
                return entity.findInterrecipientWithId("damage") && !targeted.includes(entity);
            });
            
            if(targets.length === 0) {
                cursor.targeted.clear();
                let targeted = cursor.targeted;
                targets = cursor.collidedWith.filter(function(entity) {
                    return entity.findInterrecipientWithId("damage") && !targeted.includes(entity);
                });
            }
            
            array_bubbleSort(targets, function(a, b) {
                let distA = Vector.distance(a.getPositionM(), userPositionM);
                let distB = Vector.distance(b.getPositionM(), userPositionM);
                
                if(distA > distB) {return +1;}
                if(distA < distB) {return -1;}
                return 0;
            });
            
            let target = targets[0];
            
            if(target != undefined) {
                cursor.target = target;
                cursor.targeted.add(target);
                CAMERA.targets.add(target);
            }
        }
        
        if(Vector.distance(cursor.getPositionM(), userPositionM) > this.user.cursorDistance) {
            // this.end();
        }
        
        return this;
    }
    
    onend() {
        CAMERA.targets.remove(this.user.cursor.target);
        this.user.cursor.target = null;
        
        return this;
    }
    
    preventsAddition(action) {
        return AS_FOCUS.includes(action.getClassName()) || super.preventsAddition(...arguments);
    }
}
