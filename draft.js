
var effectiveGrowth = true;

const ALMOST_ZERO = Math.pow(2, -10);

function isAlmostZero(x) {
    return Math.abs(x) < ALMOST_ZERO;
}

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
            console.log(maze_toString(maze));
            
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
                    console.log("end");
                    
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
        
        
        /**
        else if(cell.visited == 2) {
            
        } else {
            break;
        }
        /**/
    }
    
    console.log("IIII " + i + " IIII");
    
    
    
    return maze;
}

function rsAddEntity(rectangle) {
    return "addEntity((new " + rectangle.constructor.name + "(" + rectangle.getX() + ", " + rectangle.getY() + ", " + rectangle.getWidth() + ", " + rectangle.getHeight() + ")))";
}

function rsJSON(rectangle) {
    return "{}";
}

function getMap(rectangles, rsFunction = rsAddEntity) {
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

function camelToSentence(string) {
    return string.replace(/^./, function(c) {
        return c.toUpperCase();
    }).replace(/.[A-Z]/g, function(str) {
        return str[0] + " " + str[1];
    });
}

function gather() {
    let res = [];
    
    if(arguments.length > 1) {
        let arrays = [];
        
        for(var i = 0; i < arguments.length; ++i) {
            // res.push.apply(res, gather(arguments[i]));
            arrays[i] = gather(arguments[i]);
            
            for(var j = 0; j < arrays[i].length; ++j) {
                if(res.indexOf(arrays[i][j]) == -1) {
                    res.push(arrays[i][j]);
                }
            }
        }
    } else if(arguments.length == 1 && Array.isArray(arguments[0])) {
        let arrays = [];
        
        for(var i = 0; i < arguments[0].length; ++i) {
            // res.push.apply(res, gather(arguments[0][i]));
            arrays[i] = gather(arguments[0][i]);
            
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

const bezierLinear = cubicBezier(0, 0, 1, 1);
const bezierEase = cubicBezier(.25,.1,.25,1);
const bezierEaseIn = cubicBezier(.42,0,1,1);
const bezierEaseOut = cubicBezier(0,0,.58,1);
const bezierEaseInOut = cubicBezier(.42,0,.58,1);
