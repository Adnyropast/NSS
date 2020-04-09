
let LGRID = 8;

function roundTo(value, grid = LGRID) {
    return Math.round(value / grid) * grid;
}

const CREATED_RECTANGLES = new SetArray();
let SELECTED_RECTANGLE = null;

function setSelectedRectangle(rectangle) {
    if(rectangle instanceof Entity) {
        if(SELECTED_RECTANGLE instanceof Entity) {
            SELECTED_RECTANGLE.setStyle(LCREATED_DEFSTYLE.copy());
        }
        
        SELECTED_RECTANGLE = rectangle;
        rectangle.setStyle(LCREATED_SELSTYLE.copy());
    }
}

const LCREATED_DEFSTYLE = (new ColorTransition([0, 255, 255, 1], [0, 255, 255, 0.5], 128)).setLoop(true);
const LCREATED_SELSTYLE = (new ColorTransition([255, 255, 0, 1], [255, 255, 0, 0.5], 128)).setLoop(true);

class LCreated extends Entity {
    constructor() {
        super(...arguments);
        
        this.setZIndex(-1000).setStyle(LCREATED_DEFSTYLE.copy());
        this.drawable.setStrokeStyle((new ColorTransition([0, 192, 255, 0.5], [0, 63, 255, 0.5], 128)).setLoop(true));
    }
}

class LCreate extends Action {
    constructor() {
        super();
        
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
    }
    
    use() {
        removeEntity(SELECTED_RECTANGLE);
        CREATED_RECTANGLES.remove(SELECTED_RECTANGLE);
        SELECTED_RECTANGLE = null;
        
        return this.end();
    }
}

class RoundFocus extends Action {
    constructor() {
        super();
        this.order = -0.5;
    }
    
    use() {
        var cursorPosition = this.user.getCursor().getPosition();
        
        for(var dim = 0; dim < cursorPosition.length; ++dim) {
            this.user.cursor.setPosition(dim, roundTo(cursorPosition[dim]));
        }
        
        return this.end();
    }
}

class LSelect extends Action {
    constructor() {
        super();
    }
    
    use() {
        let potentials = new SetArray();
        let cursor = this.user.getCursor();
        
        /**
        
        for(let i = 0; i < cursor.collidedWith.length; ++i) {
            if(cursor.collidedWith[i] instanceof LCreated) {
                potentials.add(cursor.collidedWith[i]);
            }
        }
        
        /**/
        
        let cursorPositionM = cursor.getPositionM();
        
        for(let i = 0; i < CREATED_RECTANGLES.length; ++i) {
            let rectangle = CREATED_RECTANGLES[i];
            
            if(rectangle.collidesWithPoint(cursorPositionM)) {
                potentials.add(rectangle);
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
    return '{"className": "' + rectangle.constructor.name + '", "position": [' + rectangle.position.join(", ") + '], "size": [' + rectangle.size.join(", ") + ']}';
}

function getCreatedMap(rectangles = CREATED_RECTANGLES, rsFunction = rsJSON) {
    var prefix = "", suffix = ",", separator = "\n";
    
    var string = "";
    
    for(var i = 0; i < rectangles.length; ++i) {
        string += prefix + rsFunction(rectangles[i]) + suffix;
        
        if(i < rectangles.length - 1) {
            string += separator;
        }
    }
    
    return string;
}

class LPlace extends Action {
    constructor() {
        super();
        
        this.entity = new Entity([NaN, NaN], [16, 16]);
    }
    
    use() {
        let cursorPosition = this.user.getCursor().getPositionM();
        
        for(let dim = 0; dim < cursorPosition.length; ++dim) {
            cursorPosition[dim] = roundTo(cursorPosition[dim]);
        }
        
        let entity = LCreated.from(this.entity);
        entity.setPositionM(cursorPosition);
        
        setSelectedRectangle(entity);
        CREATED_RECTANGLES.add(SELECTED_RECTANGLE);
        addEntity(SELECTED_RECTANGLE);
        
        return this.end();
    }
}

let placeClass = Ground;
let lgrid = LGRID;
let lgridX = 16;
let lgridY = 16;

class AutoLCreate extends Action {
    constructor() {
        super();
        
        this.area = new LCreated([NaN, NaN], [0, 0]);
    }
    
    use() {
        let cursorPosition = this.user.cursor.getPositionM();
        
        if(this.phase == 0) {
            this.area.setPosition(cursorPosition);
            
            addEntity(this.area);
        } else {
            this.area.setSize(Vector.subtraction(cursorPosition, this.area.position));
        }
        
        return this;
    }
    
    onend() {
        // 
        
        let minX = roundTo(this.area.getX1(), lgrid);
        let minY = roundTo(this.area.getY1(), lgrid);
        let maxX = roundTo(this.area.getX2(), lgrid);
        let maxY = roundTo(this.area.getY2(), lgrid);
        
        if(maxX < minX) {
            const x = minX;
            minX = maxX;
            maxX = x;
        }
        
        if(maxY < minY) {
            const x = minY;
            minY = maxY;
            maxY = x;
        }
        
        // 
        
        if((new placeClass()).canMergeWith()) {
            const rectangle = new placeClass([minX, minY], [maxX - minX, maxY - minY]);
            CREATED_RECTANGLES.add(rectangle);
            addEntity(rectangle);
        } else {
            for(let x = minX; x < maxX; x += lgrid) {
                for(let y = minY; y < maxY; y += lgrid) {
                    const rectangle = new placeClass([x, y], [lgrid, lgrid]);
                    
                    CREATED_RECTANGLES.add(rectangle);
                    addEntity(rectangle);
                }
            }
        }
        
        if(maxX - minX < lgridX && maxY - minY < lgrid) {
            const x = roundTo(this.area.getXM() - lgrid/2, lgrid);
            const y = roundTo(this.area.getYM() - lgrid/2, lgrid);
            
            const rectangle = new placeClass([x, y], [lgrid, lgrid]);
            
            CREATED_RECTANGLES.add(rectangle);
            addEntity(rectangle);
        }
        
        removeEntity(this.area);
        
        return this;
    }
}

class AutoLDelete extends Action {
    constructor() {
        super();
    }
    
    use() {
        if(this.phase == 0) {
            this.user.addAction(new LSelect());
        } else if(this.phase == 1) {
            this.user.addAction(new LDelete());
            this.end();
        }
        
        return this;
    }
}

class LSave extends Action {
    constructor() {
        super();
    }
    
    use() {
        if(this.phase === 0) {
            let a = document.createElement("a");
            a.href = "data:text/json," + getCreatedMap();
            a.download = "map";
            a.click();
        }
        
        return this;
    }
}
