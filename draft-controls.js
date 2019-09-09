
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

function addKeyActionRepeat(keyCode, actionClass) {
    if(Array.isArray(keyCode)) {
        for(let i = 0; i < keyCode.length; ++i) {
            addKeyActionRepeat(keyCode[i], actionClass);
        }
    } else {
        if(!controls.keys.hasOwnProperty(keyCode)) {
            controls.keys[keyCode] = [];
        } if(!controls.keyup.hasOwnProperty(keyCode)) {
            controls.keyup[keyCode] = [];
        }
        
        let adder = function adder() {
            actionNewAdder(actionClass)(this);
        };
        
        controls.keys[keyCode].push(function(entity) {
            entity.controllers.add(adder);
        });
        controls.keyup[keyCode].push(function(entity) {
            entity.controllers.remove(adder);
            actionConstructorRemover(actionClass)(entity);
        });
    }
}

function addClickActionRepeat(which, actionClass) {
    if(Array.isArray(which)) {
        for(let i = 0; i < which.length; ++i) {
            addClickActionRepeat(which[i], actionClass);
        }
    } else {
        let adder = function adder() {
            actionNewAdder(actionClass)(this);
        };
        
        controls.click[which].push(function(entity) {
            entity.controllers.add(adder);
        });
        controls.mouseup[which].push(function(entity) {
            entity.controllers.remove(adder);
            actionConstructorRemover(actionClass)(entity);
        });
    }
}

function addKeyActionToggle(keyCode, actionClass) {
    if(Array.isArray(keyCode)) {
        for(let i = 0; i < keyCode.length; ++i) {
            addKeyActionToggle(keyCode[i], actionClass);
        }
    } else {
        if(!controls.keys.hasOwnProperty(keyCode)) {
            controls.keys[keyCode] = [];
        } if(!controls.keyup.hasOwnProperty(keyCode)) {
            controls.keyup[keyCode] = [];
        }
        
        let adder = function adder() {
            actionNewAdder(actionClass)(this);
        };
        
        controls.keys[keyCode].push(function(entity) {
            if(entity.controllers.includes(adder)) {
                entity.controllers.remove(adder);
                actionConstructorRemover(actionClass)(entity);
            } else {
                entity.controllers.add(adder);
            }
        });
        // controls.keyup[keyCode].push();
    }
}

function addClickActionToggle(which, actionClass) {
    if(Array.isArray(which)) {
        for(let i = 0; i < which.length; ++i) {
            addClickActionToggle(which[i], actionClass);
        }
    } else {
        let adder = function adder() {
            actionNewAdder(actionClass)(this);
        };
        
        controls.click[which].push(function(entity) {
            if(entity.controllers.includes(adder)) {
                entity.controllers.remove(adder);
                actionConstructorRemover(actionClass)(entity);
            } else {
                entity.controllers.add(adder);
            }
        });
        // controls.mouseup[which].push();
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

addClickAction(1, LPlace);
// addClickAction(1, LCreate);
addClickAction(2, LSelect);
addKeyAction(46, LDelete);
addClickAction(3, LResize);
addKeyAction(49, LSelect);
// addKeyAction(84, SlashAction);
addKeyActionRepeat(86, Flamethrower);
addKeyActionRepeat(77, PlasmaLightning);
addKeyActionRepeat(79, AutoSword);
addKeyActionRepeat(79, VeinSweep);
addClickActionRepeat(1, AutoSword);
// addKeyActionRepeat(85, CutterDash);
addKeyActionRepeat(85, BurningAttack);
addKeyActionRepeat(K_LEFT, MovementLeft);
addKeyActionRepeat(K_UP, MovementUp);
addKeyActionRepeat(K_RIGHT, MovementRight);
addKeyActionRepeat(K_DOWN, MovementDown);
addKeyActionRepeat([32], Jump);

var actionevents = [
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
        
    }},/**
    {"id" : "overheadSlash", "keys" : [79], "presskeys" : [79], "mouse" : [1], "oneventdown" : function oneventdown(player) {
        player.addAction(new OverheadSlash());
        player.addAction(new VeinSweep());
    }, "oneventup" : function oneventup(player) {
        
    }},
    /**/
    {"id" : "cutterBoomerang", "keys" : [73], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new AutoCutter());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "cutterDash", "keys" : [85], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        // player.addAction(new CutterDash());
        // player.addAction(new BurningAttack());
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

// 

let ctrljson = {
    "keyonce" : [
        {"keyCode" : 0, "actionId" : "jump"},
        {"keyCode" : 0, "actionId" : "jump"},
        {"keyCode" : 0, "actionId" : "jump"},
        {"keyCode" : 0, "actionId" : "jump"},
        {"keyCode" : 0, "actionId" : "jump"}
    ],
    "keyrepeat" : [
        {"keyCode" : 0, "actionId" : ""}
    ],
    "keytoggle" : [
        {"keyCode" : 0, "actionId" : ""}
    ],
    "mouseonce" : [
        {"which" : 0, "actionId" : ""}
    ],
    "mouserepeat" : [
        {"which" : 0, "actionId" : ""}
    ],
    "mousetoggle" : [
        {"which" : 0, "actionId" : ""}
    ]
};
