
class LCreation extends Action {
    constructor() {
        super();
        this.id = "lcreate";
        
        this.rectangle = null;
    }
    
    use() {
        var cursorPosition = this.user.getCursor().getPositionM();
        
        if(this.phase == 0) {
            this.rectangle = (new Entity(cursorPosition[0], cursorPosition[1], 0, 0)).setZIndex(-1000).setStyle("#FFFFFF7F");
            this.user.rectangles.push(this.rectangle);
            addEntity(this.rectangle);
        } else {
            this.rectangle.setSize(Vector.subtraction(cursorPosition, (this.rectangle.getPosition1())));
        }
        
        if(!mouse.value(1)) {
            this.end();
        }
        
        return this;
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
        var cursorPosition = this.user.getCursor().getPositionM();
        
        for(var dim = 0; dim < cursorPosition.length; ++dim) {
            this.user.cursor.setPositionM(dim, Math.round(cursorPosition[dim] / this.grid) * this.grid);
        }
        
        return this.end();
    }
}

class LCreator extends PlayableCharacter {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.setRegeneration(0.0625);
        
        this.rectangles = [];
    }
}
