
var effectiveGrowth = true;

const ALMOST_ZERO = Math.pow(2, -10);

function isAlmostZero(x) {
    return Math.abs(x) < ALMOST_ZERO;
}

const BIG = 1048576;// Math.pow(2, 20);

const DIAG = Math.sqrt(2) / 2;

var WORLD_PACE = 16;

const BASEWIDTH = 640;
const BASEHEIGHT = 360;
const BASESIZE = [BASEWIDTH, BASEHEIGHT];

var prop = 16;

var effectsCount = 0;
const FX_SHARP = effectsCount++;
const FX_BLUNT = effectsCount++;
const FX_PIERCING = effectsCount++;
const FX_FIRE = effectsCount++;
const FX_WATER = effectsCount++;
const FX_ICE = effectsCount++;
const FX_WIND = effectsCount++;
const FX_EARTH = effectsCount++;
const FX_ELECTRIC = effectsCount++;
const FX_METAL = effectsCount++;
const FX_LIGHT = effectsCount++;
const FX_DARK = effectsCount++;
const FX_POISON = effectsCount++;
const FX_GOLD_ = effectsCount++;

// 

function getDD(bits) {
    var directions = [];
    var dimension = 0;
    var sign = -1;
    
    while(bits > 0) {
        if(bits & 1) {
            directions.push({"dimension" : dimension, "sign" : sign});
        }
        
        sign *= -1;
        
        if(sign == -1) {
            ++dimension;
        }
        
        bits >>= 1;
    }
    
    return directions;
}

function array_random(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function directionToWord(direction) {
    var word = "";
    
    if(direction.dimension == 0) {
        if(direction.sign == -1) {
            word = "left";
        } else {
            word = "right";
        }
    } else {
        if(direction.sign == -1) {
            word = "up";
        } else {
            word = "down";
        }
    }
    
    return word;
}

function directionsToWords(directions) {
    var words = [];
    
    for(var i = 0; i < directions.length; ++i) {
        words.push(directionToWord(directions[i]));
    }
    
    return words;
}

function maze_toString1(maze) {
    var str = "";
    
    for(var y = 0; y < maze.length; ++y) {
        for(var x = 0; x < maze[y].length; ++x) {
            str += maze[y][x].walls.toString(16);
        }
        
        str += "\n";
    }
    
    return str;
}

function maze_toString(maze) {
    var height = maze.length, width = maze[0].length;
    
    var block = '■', space = 'O';
    
    var str = "";
    
    for(var y = 0; y < height; ++y) {
        for(var x = 0; x < width; ++x) {
            str += block;
            if(maze[y][x].walls & 4) {str += block;}
            else {str += space;}
            str += block;
        }
        
        str += "\n";
        
        for(var x = 0; x < width; ++x) {
            if(maze[y][x].walls & 1) {str += block;}
            else {str += space;}
            str += space;
            if(maze[y][x].walls & 2) {str += block;}
            else {str += space;}
        }
        
        str += "\n";
        
        for(var x = 0; x < width; ++x) {
            str += block;
            if(maze[y][x].walls & 8) {str += block;}
            else {str += space;}
            str += block;
        }
        
        str += "\n";
    }
    
    return str;
}

function makeMaze(width, height) {
    var maze = [];
    
    for(var y = 0; y < height; ++y) {
        maze[y] = [];
        for(var x = 0; x < width; ++x) {
            maze[y][x] = {"borders" : 0, "walls" : 15, "doors" : 0, "visited" : 0};
        }
    }
    
    for(var x = 0; x < width; ++x) {
        maze[0][x].borders += 4;
        maze[height - 1][x].borders += 8;
    } for(var y = 0; y < height; ++y) {
        maze[y][0].borders += 1;
        maze[y][width - 1].borders += 2;
    }
    
    var x = 0, y = 0;
    var path = [];
    
    for(var i = 0; i < width * height * 2; ++i) {
        var cell = maze[y][x];
        ++cell.visited;
        
        // console.log("(" + x + ", " + y + "), walls :", cell.walls, "visited :", cell.visited);
        
        if(cell.visited == 1) {
            // console.log(maze_toString(maze));
            
            var directions = getDD(15 - cell.borders);
            var s = Array.from(directions);
            
            for(var k = directions.length - 1; k >= 0; --k) {
                var d = directions[k];
                
                var otherX = x + (d.dimension == 0 ? d.sign : 0);
                var otherY = y + (d.dimension == 1 ? d.sign : 0);
                
                var otherCell = maze[otherY][otherX];
                
                if(otherCell.visited > 0) {
                    directions.splice(k, 1);
                }
            }
            
            if(directions.length == 0) {
                cell.visited = 2;
                
                if(path.length == 0) {
                    // console.log("end");
                    
                    break; break; break;
                }
                
                var direction = path.pop();
                
                var opener = (1 << 2 * direction.dimension) << (direction.sign == -1);
                cell.walls -= opener;
                
                if(direction.dimension == 0) {
                    x -= direction.sign; 
                } else {
                    y -= direction.sign;
                }
                
                --maze[y][x].visited;
            } else {
                var direction = array_random(directions);
                
                var choices = "";
                
                for(var k = 0; k < directions.length; ++k) {
                    if(directions[k] == direction) {
                        choices += "%c";
                    }
                    
                    choices += directionToWord(directions[k])
                    
                    if(directions[k] == direction) {
                        choices += "%c";
                    }
                    
                    if(k < directions.length - 1) {
                        choices += ", ";
                    }
                }
                
                // console.log("Original directions : " + directionsToWords(s).join(", "));
                // console.log("Possible directions : " + choices, "color : #FF0000;", "color : #000000;");
                
                if(direction.dimension == 0) {
                    x += direction.sign;
                } else {
                    y += direction.sign;
                }
                
                cell.walls -= 1 << (2 * (direction.dimension == 1) + (direction.sign == 1));
                // console.log("Walls now :", cell.walls);
                path.push(direction);
            }
        }
    }
    
    return maze;
}

function camelToSentence(string) {
    return string.replace(/^./, function(c) {
        return c.toUpperCase();
    }).replace(/.[A-Z]/g, function(str) {
        return str[0] + " " + str[1];
    });
}

function set_gather() {
    let res = [];
    
    if(arguments.length > 1) {
        let arrays = [];
        
        for(var i = 0; i < arguments.length; ++i) {
            // res.push.apply(res, set_gather(arguments[i]));
            arrays[i] = set_gather(arguments[i]);
            
            for(var j = 0; j < arrays[i].length; ++j) {
                if(res.indexOf(arrays[i][j]) == -1) {
                    res.push(arrays[i][j]);
                }
            }
        }
    } else if(arguments.length == 1 && Array.isArray(arguments[0])) {
        let arrays = [];
        
        for(var i = 0; i < arguments[0].length; ++i) {
            // res.push.apply(res, set_gather(arguments[0][i]));
            arrays[i] = set_gather(arguments[0][i]);
            
            for(var j = 0; j < arrays[i].length; ++j) {
                if(res.indexOf(arrays[i][j]) == -1) {
                    res.push(arrays[i][j]);
                }
            }
        }
    } else if(arguments.length == 1 && !Array.isArray(arguments[0])) {
        res.push(arguments[0]);
    }
    
    return res;
}

/* https://en.wikipedia.org/wiki/B%C3%A9zier_curve */

function cubicBezier(p0, p1, p2, p3) {
    return function b(t) {
        if(0 <= t && t <= 1) {
            return Math.pow(1 - t, 3) * p0   +   3 * Math.pow(1 - t, 2) * t * p1   +   3 * (1 - t) * t*t * p2   +   t*t*t * p3;
        }
        
        return NaN;
    };
}

const bezierLinear = function bezierLinear(t) {return t;}; cubicBezier(0, 0, 1, 1);
const bezierEase = cubicBezier(.25,.1,.25,1);
const bezierEaseIn = function bezierEaseIn(t) {return t*t*t;}; cubicBezier(.42,0,1,1);
const bezierEaseOut = cubicBezier(0,0,.58,1);
const bezierEaseInOut = cubicBezier(.42,0,.58,1);

const backForthTiming = function backForthTiming(t) {
    return (0.5-Math.abs(t-0.5))/0.5;
};
const forthBackTiming = function forthBackTiming(t) {
    return Math.abs(t-0.5)/0.5;
};

function makeCellsD(size) {
    var cells = [];
    
    if(size.length == 1) {
        for(var x = 0; x < size[0]; ++x) {
            cells.push({"position" : [x]});
        }
    } else if(size.length > 1) {
        var subcells = makeCellsD(size.slice(0, size.length - 1));
        
        for(var i = 0; i < subcells.length; ++i) {
            for(var x = 0; x < size[size.length - 1]; ++x) {
                cells.push({"position" : subcells[i].position.concat(x)});
            }
        }
    }
    
    return cells;
}

function makeMazeD(size) {
    let maze = makeCellsD(size);
    
    let totalD = Math.pow(2, 2 * size.length) - 1;
    
    for(let i = 0; i < maze.length; ++i) {
        maze[i].borders = 0;
        
        for(let dim = 0; dim < size.length; ++dim) {
            if(maze[i].position[dim] == 0) {
                maze[i].borders += 1 << (2 * dim);
            } else if(maze[i].position[dim] == size[dim] - 1) {
                maze[i].borders += 1 << (2 * dim) + 1;
            }
        }
        
        maze[i].walls = totalD;
        maze[i].doors = totalD ^ maze[i].walls;
        maze[i].visited = 0;
    }
    
    let position = Array(size.length).fill(0);
    
    let path = [];
    
    let smthg = 2;
    
    for(let dim = 0; dim < size.length; ++dim) {smthg *= size[dim]}
    
    for(let i = 0; i < smthg; ++i) {
        let cell = maze.find(function(cell) {
            for(let dim = 0; dim < cell.position.length; ++dim) {
                if(cell.position[dim] != position[dim]) {
                    return false;
                }
            }
            
            return true;
        });
        
        console.log(position, cell);
        
        ++cell.visited;
        
        if(cell.visited == 1) {
            let directions = getDD(totalD - cell.borders);
            
            for(let j = directions.length - 1; j >= 0; --j) {
                let direction = directions[j];
                
                let otherPosition = Array.from(position);
                
                otherPosition[direction.dimension] += direction.sign;
                
                let otherCell = maze.find(function(cell) {
                    for(let dim = 0; dim < cell.position.length; ++dim) {
                        if(cell.position[dim] != otherPosition[dim]) {
                            return false;
                        }
                    }
                    
                    return true;
                });
                
                if(otherCell.visited > 0) {
                    directions.splice(j, 1);
                }
            }
            
            if(directions.length == 0) {
                cell.visited = 2;
                
                if(path.length == 0) {
                    break; break; break;
                }
                
                let direction = path.pop();
                
                let opener = 1 << 2 * direction.dimension + (direction.sign == -1);
                cell.walls -= opener;
                
                position[direction.dimension] -= direction.sign;
                
                --maze.find(function(cell) {
                    for(let dim = 0; dim < cell.position.length; ++dim) {
                        if(cell.position[dim] != position[dim]) {
                            return false;
                        }
                    }
                    
                    return true;
                }).visited;
            } else {
                let direction = array_random(directions);
                
                cell.walls -= 1 << 2 * direction.dimension + (direction.sign == +1);
                
                position[direction.dimension] += direction.sign;
                
                path.push(direction);
            }
        }
    }
    
    return maze;
}

function makeGradientMatrix(width, height) {
    let matrix = [];
    
    let n = width + height - 1;
    
    /**
    
    for(let i = 0; i < n; ++i) {
        for(let x = i, y = 0; x >= 0 && y < height; --x, ++y) {
            if(typeof matrix[y] == "undefined") {matrix[y] = []}
            
            matrix[y][x] = i / (n - 1);
        }
    }
    
    /**/
    
    for(let y = 0; y < height; ++y) {
        matrix[y] = [];
        
        for(let x = 0; x < width; ++x) {
            matrix[y][x] = (x + y) / (n - 1);
        }
    }
    
    return matrix;
}

function tlog(x) {console.log(x); return x;}

class SetArray extends Array {
    add(element) {
        if(this.indexOf(element) == -1) {
            this.push(element);
        }
        
        return this;
    }
    
    remove(element) {
        var index = this.indexOf(element);
        
        if(index != -1) {
            this.splice(index, 1);
        }
        
        return this;
    }
    
    clear() {
        this.splice(0, this.length);
        
        return this;
    }
}

class PointsPath extends Array {
    constructor() {
        super();
    }
    
    addStep(step, point) {
        this.push({step : step, point : point});
        
        this.sort(function(a, b) {
            return a.step - b.step;
        });
        
        return this;
    }
    
    at(step) {
        let bef = this[0];
        let aft = this[0];
        
        for(let i = 0; i < this.length; ++i) {
            aft = this[i];
            
            if(step <= aft.step) {
                let progression;
                
                if(bef.step == aft.step) {
                    progression = 0;
                } else {
                    progression = (step - bef.step) / (aft.step - bef.step);
                }
                
                let point = [];
                let dimensions = Math.min(bef.point.length, aft.point.length);
                
                for(let dim = 0; dim < dimensions; ++dim) {
                    point[dim] = bef.point[dim] + progression * (aft.point[dim] - bef.point[dim]);
                }
                
                return point;
            }
            
            bef = this[i];
        }
            
        return null;
    }
    
    getPoints() {
        let points = [];
        
        for(let i = 0; i < this.length; ++i) {
            points.push(this[i].point);
        }
        
        return points;
    }
}

function object_clone(object) {
    let clone = new object.constructor();
    
    Object.assign(clone, object);
    
    return clone;
}

class VisibleList {
    constructor(visibleCount = 3) {
        this.items = [];
        this.visibleCount = visibleCount;
        this.index = 0;
        this.type = ["auto", "centered"][0];
        this.auto_start = 0;
    }
    
    getVisible() {
        if(this.type === "auto") {
            let lastIndex = Math.min(this.auto_start + this.visibleCount, this.items.length);
            
            return this.items.slice(this.auto_start, lastIndex);
        } else if(this.type === "centered") {
            let start = Math.max(0, this.index - Math.floor(this.visibleCount/2));
            let end = Math.min(this.items.length, this.index + Math.floor(this.visibleCount/2) + 1);
            
            return this.items.slice(start, end);
        }
        
        return [];
    }
    
    setType(type) {this.type = type; return this;}
    
    addItem(item) {this.items.push(item); return this;}
    
    setIndex(index) {
        if(index < 0) {
            index = 0;
        } else if(index >= this.items.length) {
            index = this.items.length - 1;
        }
        
        if(index >= 0 && index < this.items.length) {
            if(this.type === "auto") {
                if(this.auto_start + this.visibleCount <= index) {
                    this.auto_start = index - this.visibleCount + 1;
                } else if(this.auto_start > index) {
                    this.auto_start = index;
                }
            }
            
            this.index = index;
        }
        
        return this;
    }
    
    incIndex() {return this.setIndex(this.index+1);}
    decIndex() {return this.setIndex(this.index-1);}
    
    getItem() {return this.items[this.index];}
    
    empty() {this.items.splice(0, Infinity); return this;}
}

function rectangle_averageSize() {
    let sum = 0;
    let count = 0;
    
    for(let i = 0; i < arguments.length; ++i) {
        let rectangle = arguments[i];
        
        for(let dim = 0; dim < rectangle.getDimension(); ++dim) {
            sum += arguments[i].getSize(dim);
            
            ++count;
        }
    }
    
    return sum / count;
}

function irandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function powt(pow) {
    return function timing(t) {
        return Math.pow(t, pow);
    };
}

const FRIGHT = +1, FLEFT = -1;

function sfsTiming(pow) {
    return function timing(t) {
        return (Math.pow((t - 0.5) / 0.5, pow) + 1) / 2;
    }
}

function random(min, max) {
    return min + Math.random() * (max - min);
}
