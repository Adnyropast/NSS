
class HoldFocus extends Action {
    constructor() {
        super();
        this.id = "cursorControl";
        this.order = -1;
    }
    
    use() {
        this.user.cursor.centerTarget();
        
        if(!keyList.value(K_FOCUS)) {
            this.end();
        }
        
        return this;
    }
}

class PressFocus extends Action {
    constructor() {
        super();
        this.id = "cursorControl";
        this.order = -1;
    }
    
    use() {
        if(this.phase > 0 && keyList.value(K_PRESSFOCUS) == 1) {
            this.user.cursor.setPositionM(this.user.getPositionM());
            this.end();
        } else {
            this.user.cursor.centerTarget();
        }
        
        return this;
    }
}

class MouseFocus extends Action {
    constructor() {
        super();
        this.id = "cursorControl";
        this.order = -1;
    }
    
    use() {
        if(mouse.moveValue == 1) {
            this.user.cursor.setPositionM(Vector.from(getMousePosition()));
        }
        
        this.end();
        
        return this;
    }
}

class MoveFocus extends Action {
    constructor() {
        super();
        this.id = "cursorControl";
        this.order = -1;
    }
    
    use() {
        this.user.cursor.setPositionM(getKDirection().add(this.user.getPositionM()));
        this.end();
        
        return this;
    }
    
    allowsReplacement(action) {
        return action.id == "cursorControl";
    }
}

class FreeKeyFocus extends Action {
    constructor() {
        super();
        this.id = "cursorControl";
        this.order = -1;
    }
    
    use() {
        this.user.cursor.drag(getKDirection(CLEFT, CUP, CRIGHT, CDOWN));
        this.end();
        
        return this;
    }
}
