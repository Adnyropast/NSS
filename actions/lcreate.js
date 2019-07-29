
const CREATED_RECTANGLES = new SetArray();
let SELECTED_RECTANGLE = null;

function setSelectedRectangle(rectangle) {
    if(SELECTED_RECTANGLE instanceof Entity) {
        SELECTED_RECTANGLE.setStyle(LCREATED_DEFSTYLE.copy());
    }
    
    SELECTED_RECTANGLE = rectangle;
    rectangle.setStyle(LCREATED_SELSTYLE.copy());
}

const LCREATED_DEFSTYLE = (new ColorTransition([0, 255, 255, 1], [0, 255, 255, 0.5], 128)).setLoop(true);
const LCREATED_SELSTYLE = (new ColorTransition([255, 255, 0, 1], [255, 255, 0, 0.5], 128)).setLoop(true);

class LCreated extends Entity {
    constructor() {
        super(...arguments);
        
        this.setZIndex(-1000).setStyle(LCREATED_DEFSTYLE.copy());
    }
}

class LCreate extends Action {
    constructor() {
        super();
        this.setId("lcreate");
        
        this.roundFocus = new RoundFocus();
    }
    
    use() {
        this.roundFocus.setUser(this.user);
        this.roundFocus.use();
        
        var cursorPosition = this.user.getCursor().getPositionM();
        
        if(this.phase == 0) {
            setSelectedRectangle(new LCreated([cursorPosition[0], cursorPosition[1]], [0, 0]));
            
            CREATED_RECTANGLES.add(SELECTED_RECTANGLE);
            addEntity(SELECTED_RECTANGLE);
        } else {
            SELECTED_RECTANGLE.setSize(Vector.subtraction(cursorPosition, (SELECTED_RECTANGLE.getPosition1())));
        }
        
        return this;
    }
    
    onend() {
        if(Vector.from(SELECTED_RECTANGLE.size).isZero()) {
            this.user.addAction(new LDelete());
        }
        
        return this;
    }
}

class LResize extends Action {
    constructor() {
        super();
        
        this.side = 0;
        
        this.roundFocus = new RoundFocus();
    }
    
    use() {
        this.roundFocus.setUser(this.user);
        this.roundFocus.use();
        
        let cursor = this.user.getCursor();
        
        if(SELECTED_RECTANGLE == null) {return this.end();}
        
        if(this.phase == 0) {
            this.side = SELECTED_RECTANGLE.locate(cursor);
        } else {
            if(this.side == 1) {
                let width = Math.abs(cursor.getXM() - SELECTED_RECTANGLE.getX2());
                
                SELECTED_RECTANGLE.setWidth(width);
                SELECTED_RECTANGLE.setX(cursor.getXM());
            } else if(this.side == 2) {
                let width = Math.abs(cursor.getXM() - SELECTED_RECTANGLE.getX());
                
                SELECTED_RECTANGLE.setWidth(width);
                SELECTED_RECTANGLE.setX2(cursor.getXM());
            } else if(this.side == 4) {
                let height = Math.abs(cursor.getYM() - SELECTED_RECTANGLE.getY2());
                
                SELECTED_RECTANGLE.setHeight(height);
                SELECTED_RECTANGLE.setY(cursor.getYM());
            } else if(this.side == 8) {
                let height = Math.abs(cursor.getYM() - SELECTED_RECTANGLE.getY());
                
                SELECTED_RECTANGLE.setHeight(height);
                SELECTED_RECTANGLE.setY2(cursor.getYM());
            }
        }
        
        return this;
    }
}

class LMove extends Action {
    constructor() {
        super();
        
        this.rectangle = null;
    }
}

class LDelete extends Action {
    constructor() {
        super();
        this.setId("ldelete");
    }
    
    use() {
        removeEntity(SELECTED_RECTANGLE);
        CREATED_RECTANGLES.remove(SELECTED_RECTANGLE);
        SELECTED_RECTANGLE = null;
        
        return this.end();
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

class LSelect extends Action {
    constructor() {
        super();
        this.setId("lselect");
    }
    
    use() {
        let potentials = new SetArray();
        let cursor = this.user.getCursor();
        
        for(let i = 0; i < cursor.collidedWith.length; ++i) {
            if(cursor.collidedWith[i] instanceof LCreated) {
                potentials.add(cursor.collidedWith[i]);
            }
        }
        
        
        
        potentials.sort(function(a, b) {
            let distA = Vector.distance(a.getPositionM(), cursor.getPositionM());
            let distB = Vector.distance(b.getPositionM(), cursor.getPositionM());
            
            return distA - distB;
        });
        
        setSelectedRectangle(potentials[0]);
        
        return this.end();
    }
}

function rsAddEntity(rectangle) {
    return "addEntity((new " + rectangle.constructor.name + "([" + rectangle.getX() + ", " + rectangle.getY() + "], [" + rectangle.getWidth() + ", " + rectangle.getHeight() + "])))";
}

function rsJSON(rectangle) {
    return "{}";
}

function getMap(rectangles = CREATED_RECTANGLES, rsFunction = rsAddEntity) {
    var prefix = "", suffix = ";", separator = "\n";
    
    var string = "";
    
    for(var i = 0; i < rectangles.length; ++i) {
        string += prefix + rsFunction(rectangles[i]) + suffix;
        
        if(i < rectangles.length - 1) {
            string += separator;
        }
    }
    
    return string;
}
