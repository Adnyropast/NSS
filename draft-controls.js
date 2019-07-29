
/**/
const K_ESC = [27];
const K_CONFIRM = [13];

var K_LEFT = [37, 65, 81];
var K_UP = [38, 87, 90];
var K_RIGHT = [39, 68];
var K_DOWN = [40, 83];

var K_CLEFT = [72];
var K_CUP = [85];
var K_CDOWN = [74];
var K_CRIGHT = [75];
/**/
var K_DIRECTION = K_LEFT.concat(K_UP).concat(K_RIGHT).concat(K_DOWN);
var K_JUMP = [32];
var K_FOCUS = [223];
var K_PRESSFOCUS = [191];

var K_CDIRECTION = K_CLEFT.concat(K_CUP).concat(K_CDOWN).concat(K_CRIGHT);

var K_FLURRY = [70];
/**/

function actionAdder(action) {
    return function(entity) {
        entity.addAction(action);
    };
}

function actionNewAdder(actionClass) {
    return function(entity) {
        entity.addAction(new actionClass());
    }
}

function actionConstructorRemover(actionClass) {
    return function(entity) {
        entity.removeActionsWithConstructor(actionClass);
    };
}

function addClickAction(which, actionClass) {
    if(Array.isArray(which)) {
        for(let i = 0; i < which.length; ++i) {
            addClickAction(which[i], actionClass);
        }
    } else {
        controls.click[which].push(actionNewAdder(actionClass));
        controls.mouseup[which].push(actionConstructorRemover(actionClass));
    }
}

function removeClickAction() {
    
}

function addKeyAction(keyCode, actionClass) {
    if(Array.isArray(keyCode)) {
        for(let i = 0; i < keyCode.length; ++i) {
            addKeyAction(keyCode[i], actionClass);
        }
    } else {
        if(!controls.keys.hasOwnProperty(keyCode)) {
            controls.keys[keyCode] = [];
        } if(!controls.keyup.hasOwnProperty(keyCode)) {
            controls.keyup[keyCode] = [];
        }
        
        controls.keys[keyCode].push(actionNewAdder(actionClass));
        controls.keyup[keyCode].push(actionConstructorRemover(actionClass));
    }
}

var controls = {
    click : {
        1 : [
            function(entity) {
                // console.log("left click");
            }
        ],
        2 : [function(entity) {
            // console.log("middle click");
        }],
        3 : [function(entity) {
            // console.log("right click");
        }]
    },
    mouseup : {
        1 : [function(entity) {
            
        }],
        2 : [function(entity) {
            
        }],
        3 : [function(entity) {
            
        }]
    },
    keys : {
        226 : [
            function(entity) {
                
            }
        ]
    },
    keyup : {
        
    },
    mousemove : [function(entity) {
        // console.log("mouse move");
    }]
};

addClickAction(1, LCreate);
addClickAction(2, LSelect);
addKeyAction(46, LDelete);
addClickAction(3, LResize);
addKeyAction(49, LSelect);

var actionevents = [
    {"id" : "left", "keys" : K_LEFT, "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new MovementLeft());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(MovementLeft);
    }},
    {"id" : "up", "keys" : K_UP, "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new MovementUp());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(MovementUp);
    }},
    {"id" : "right", "keys" : K_RIGHT, "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new MovementRight());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(MovementRight);
    }},
    {"id" : "down", "keys" : K_DOWN, "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new MovementDown());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(MovementDown);
    }},
    {"id" : "jump", "keys" : [32], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new Jump());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(Jump);
    }},
    {"id" : "holdFocus", "keys" : [223], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new HoldFocus());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(HoldFocus);
    }},
    {"id" : "pressFocus", "keys" : [], "presskeys" : [191], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new PressFocus());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "goldFlurry", "keys" : [70], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new GoldFlurry());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(GoldFlurry);
    }},
    {"id" : "bloodShot", "keys" : [80], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new BloodShot());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "still", "keys" : [16], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new Still());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(Still);
    }},
    {"id" : "blowoutShots", "keys" : [66], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new BlowoutShots());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(BlowoutShots);
    }},
    {"id" : "zoneEngage", "keys" : [69], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new ZoneEngage());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "teleportation", "keys" : [84], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new Teleportation());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "overheadSlash", "keys" : [], "presskeys" : [79], "mouse" : [1], "oneventdown" : function oneventdown(player) {
        player.addAction(new OverheadSlash());
    }, "oneventup" : function oneventup(player) {
        
    }},
    
    {"id" : "cutterBoomerang", "keys" : [73], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new CutterBoomerang());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "cutterDash", "keys" : [85], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new CutterDash());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "finalCutter", "keys" : [], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new FinalCutter());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "roundFocus", "keys" : [], "presskeys" : [], "mouse" : [2], "oneventdown" : function oneventdown(player) {
        player.addAction(new RoundFocus(8));
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "followMe", "keys" : [], "presskeys" : [67], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new FollowMe());
    }, "oneventup" : function oneventup(player) {
        
    }},
    
    {"id" : "test", "keys" : [80, 82], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new RocketPunch());
        // player.addAction(new BulletShot());
    }, "oneventup" : function oneventup(player) {
        
    }}
];

function findActionevent(id) {
    return actionevents.find(function(actionevent) {
        return actionevent.id == id;
    });
}

function updateActionevents(data) {
    for(var j = 0; j < data.length; ++j) {
        for(var i = 0; i < actionevents.length; ++i) {
            var actionevent = actionevents[i];
            
            if(actionevent.id == data[j].id) {
                if(Array.isArray(data.keys)) {
                    actionevent.keys.splice(0, actionevent.keys.length);
                    actionevent.keys.push.apply(actionevent, data[j].keys);
                } if(Array.isArray(data.presskeys)) {
                    actionevent.presskeys.splice(0, actionevent.presskeys.length);
                    actionevent.presskeys.push.apply(actionevent, data[j].presskeys);
                } if(Array.isArray(data.mouse)) {
                    actionevent.mouse.splice(0, actionevent.mouse.length);
                    actionevent.mouse.push.apply(actionevent, data[j].mouse);
                }
            }
        }
        
        if(data[j].id == "left") {
            K_LEFT.splice(0, K_LEFT.length);
            K_LEFT.push(K_LEFT, data[j].keys);
        } else if(data[j].id == "up") {
            K_UP.splice(0, K_UP.length);
            K_UP.push(K_UP, data[j].keys);
        } else if(data[j].id == "right") {
            K_RIGHT.splice(0, K_RIGHT.length);
            K_RIGHT.push(K_RIGHT, data[j].keys);
        } else if(data[j].id == "down") {
            K_DOWN.splice(0, K_DOWN.length);
            K_DOWN.push(K_DOWN, data[j].keys);
        }
    }
}

function getKDirection(kleft = K_LEFT, kup = K_UP, kright = K_RIGHT, kdown = K_DOWN) {
    var direction = Vector.filled(2, 0);
    
    if(keyList.value(kleft)) {
        direction.add(0, -1);
    } if(keyList.value(kup)) {
        direction.add(1, -1);
    } if(keyList.value(kright)) {
        direction.add(0, +1);
    } if(keyList.value(kdown)) {
        direction.add(1, +1);
    }
    
    return direction.normalize();
}

function getMousePosition(dimension) {
    const positionOnCanvas = Vector.subtraction(mouse.position, [CANVAS.offsetLeft, CANVAS.offsetTop]).multiply([CANVAS.width / CANVAS.clientWidth, CANVAS.height / CANVAS.clientHeight]);
    
    if(arguments.length == 1) {
        let offset = CAMERA != null ? CAMERA.getOffset()[dimension] : 0;
        
        return positionOnCanvas[dimension] / CAMERA.getSizeProp(dimension) + offset;
    }
    
    let offset = CAMERA != null ? CAMERA.getOffset() : 0;
    
    return positionOnCanvas.divide(CAMERA.getSizeProp()).add(offset);
}
