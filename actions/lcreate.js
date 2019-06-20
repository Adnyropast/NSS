
class LCreation extends Action {
    constructor() {
        super();
        this.abilityId = "lcreate";
        
        this.rectangle = null;
    }
    
    use() {
        var cursorPosition = this.user.getCursor().getPositionM();
        
        if(this.phase == 0) {
            this.rectangle = this.user.getCursor().target = (new Entity(cursorPosition[0], cursorPosition[1], 0, 0)).setZIndex(-1000).setStyle("#00FFFF7F");
            
            if(typeof this.user.rectangles == "undefined") {
                this.user.rectangles = [];
            }
            
            this.user.rectangles.push(this.rectangle);
            addEntity(this.rectangle);
        } else {
            this.rectangle.setSize(Vector.subtraction(cursorPosition, (this.rectangle.getPosition1())));
        }
        
        return this;
    }
}

class LResize extends Action {
    constructor() {
        super();
        this.abilityId = "lcreate";
        
        this.vertical = 0;
        this.horizontal = 0;
        this.initialPosition = null;
        this.rectangle = null;
    }
    
    use() {
        if(this.phase == 0) {
            this.initialPosition = this.user.getCursor().getPositionM();
        }
        
        return this;
    }
}

class LMove extends Action {
    constructor() {
        super();
        this.abilityId = "lcreate";
        
        this.rectangle = null;
    }
}

class LDelete extends Action {
    constructor() {
        super();
        this.abilityId = "lcreate";
        
        this.rectangle = null;
    }
}

class RoundFocus extends Action {
    constructor(grid = 8) {
        super();
        this.id = "roundFocus";
        this.order = -0.5
        
        this.grid = grid;
    }
    
    use() {
        var cursorPosition = this.user.getCursor().getPosition();
        
        for(var dim = 0; dim < cursorPosition.length; ++dim) {
            this.user.cursor.setPosition(dim, Math.round(cursorPosition[dim] / this.grid) * this.grid);
        }
        
        return this.end();
    }
}
