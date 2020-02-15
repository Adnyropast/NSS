
let eventControllers = new SetArray();

function addClickAction(which, actionClass, player) {
    if(Array.isArray(which)) {
        for(let i = 0; i < which.length; ++i) {
            addClickAction(which[i], actionClass, player);
        }
    } else {
        if(!controls.click.hasOwnProperty(which)) {
            controls.click[which] = [];
        } if(!controls.mouseup.hasOwnProperty(which)) {
            controls.mouseup[which] = [];
        }
        
        let action = null;
        
        controls.click[which].push(function() {
            let entity = player.entity;
            
            action = new actionClass();
            
            entity.addAction(action);
        });
        
        controls.mouseup[which].push(function() {
            let entity = player.entity;
            
            entity.removeAction(action);
        });
    }
}

function removeClickAction() {
    
}

function addKeyAction(keyCode, actionClass, player) {
    if(Array.isArray(keyCode)) {
        for(let i = 0; i < keyCode.length; ++i) {
            addKeyAction(keyCode[i], actionClass, player);
        }
    } else {
        if(!controls.keys.hasOwnProperty(keyCode)) {
            controls.keys[keyCode] = [];
        } if(!controls.keyup.hasOwnProperty(keyCode)) {
            controls.keyup[keyCode] = [];
        }
        
        let action = null;
        
        controls.keys[keyCode].push(function() {
            let entity = player.entity;
            
            action = new actionClass();
            
            entity.addAction(action);
        });
        
        controls.keyup[keyCode].push(function() {
            let entity = player.entity;
            
            entity.removeAction(action);
        });
    }
}

function addKeyActionRepeat(keyCode, actionClass, player) {
    if(Array.isArray(keyCode)) {
        for(let i = 0; i < keyCode.length; ++i) {
            addKeyActionRepeat(keyCode[i], actionClass, player);
        }
    } else {
        if(!controls.keys.hasOwnProperty(keyCode)) {
            controls.keys[keyCode] = [];
        } if(!controls.keyup.hasOwnProperty(keyCode)) {
            controls.keyup[keyCode] = [];
        }
        
        let action = null;
        let f = function() {
            let entity = player.entity;
            
            let newAction = new actionClass();
            
            if(entity != null) if(entity.addAction(newAction)) {
                action = newAction;
            }
        };
        
        controls.keys[keyCode].push(function() {
            let entity = player.entity;
            
            f;
            
            eventControllers.add(f);
        });
        
        controls.keyup[keyCode].push(function() {
            let entity = player.entity;
            
            eventControllers.remove(f);
            
            if(entity != null) entity.removeAction(action);
        });
    }
}

function addClickActionRepeat(which, actionClass, player) {
    if(Array.isArray(which)) {
        for(let i = 0; i < which.length; ++i) {
            addClickActionRepeat(which[i], actionClass, player);
        }
    } else {
        if(!controls.click.hasOwnProperty(which)) {
            controls.click[which] = [];
        } if(!controls.mouseup.hasOwnProperty(which)) {
            controls.mouseup[which] = [];
        }
        
        let action;
        let f = function() {
            let entity = player.entity;
            
            let newAction = new actionClass();
            
            if(entity != null) if(entity.addAction(newAction)) {
                action = newAction;
            }
        };
        
        controls.click[which].push(function() {
            let entity = player.entity;
            
            f;
            
            eventControllers.add(f);
        });
        controls.mouseup[which].push(function() {
            let entity = player.entity;
            
            eventControllers.remove(f);
            
            if(entity != null) entity.removeAction(action);
        });
    }
}

function addKeyActionToggle(keyCode, actionClass, player) {
    if(Array.isArray(keyCode)) {
        for(let i = 0; i < keyCode.length; ++i) {
            addKeyActionToggle(keyCode[i], actionClass, player);
        }
    } else {
        if(!controls.keys.hasOwnProperty(keyCode)) {
            controls.keys[keyCode] = [];
        } if(!controls.keyup.hasOwnProperty(keyCode)) {
            controls.keyup[keyCode] = [];
        }
        
        let action;
        let f = function() {
            let entity = player.entity;
            
            let newAction = new actionClass();
        
            if(entity != null) if(entity.addAction(newAction)) {
                action = newAction;
            }
        };
        
        controls.keys[keyCode].push(function() {
            let entity = player.entity;
            
            if(eventControllers.includes(f)) {
                eventControllers.remove(f);
                
                if(entity != null) {
                    entity.removeAction(action);
                }
            } else {
                f;
                
                eventControllers.add(f);
            }
        });
    }
}

function addClickActionToggle(which, actionClass, player) {
    if(Array.isArray(which)) {
        for(let i = 0; i < which.length; ++i) {
            addClickActionToggle(which[i], actionClass, player);
        }
    } else {
        if(!controls.click.hasOwnProperty(which)) {
            controls.click[which] = [];
        } if(!controls.mouseup.hasOwnProperty(which)) {
            controls.mouseup[which] = [];
        }
        
        let action;
        let f = function() {
            let entity = player.entity;
            
            newAction = new actionClass();
            
            if(entity != null) if(entity.addAction(newAction)) {
                action = newAction;
            }
        };
        
        controls.click[which].push(function() {
            let entity = player.entity;
            
            if(eventControllers.includes(f)) {
                eventControllers.remove(f);
                
                if(entity != null) {
                    entity.removeAction(action);
                }
            } else {
                f;
                
                eventControllers.add(f);
            }
        });
    }
}

function addButtonAction(button, actionClass, player) {
    if(Array.isArray(button)) {
        for(let i = 0; i < button.length; ++i) {
            addButtonAction(button[i], actionClass, player);
        }
    } else {
        if(!controls.buttons.hasOwnProperty(button)) {
            controls.buttons[button] = [];
        } if(!controls.buttonup.hasOwnProperty(button)) {
            controls.buttonup[button] = [];
        }
        
        let action = null;
        
        controls.buttons[button].push(function() {
            let entity = player.entity;
            
            action = new actionClass();
            
            entity.addAction(action);
        });
        
        controls.buttonup[button].push(function() {
            let entity = player.entity;
            
            entity.removeAction(action);
        });
    }
}

function addButtonActionRepeat(button, actionClass, player) {
    if(Array.isArray(button)) {
        for(let i = 0; i < button.length; ++i) {
            addButtonActionRepeat(button[i], actionClass, player);
        }
    } else {
        if(!controls.buttons.hasOwnProperty(button)) {
            controls.buttons[button] = [];
        } if(!controls.buttonup.hasOwnProperty(button)) {
            controls.buttonup[button] = [];
        }
        
        let action = null;
        let f = function() {
            let entity = player.entity;
            
            let newAction = new actionClass();
            
            if(entity != null) if(entity.addAction(newAction)) {
                action = newAction;
            }
        };
        
        controls.buttons[button].push(function() {
            let entity = player.entity;
            
            f;
            
            eventControllers.add(f);
        });
        
        controls.buttonup[button].push(function() {
            let entity = player.entity;
            
            eventControllers.remove(f);
            
            if(entity != null) entity.removeAction(action);
        });
    }
}

function addButtonActionToggle(button, actionClass, player) {
    if(Array.isArray(button)) {
        for(let i = 0; i < button.length; ++i) {
            addButtonActionToggle(button[i], actionClass, player);
        }
    } else {
        if(!controls.buttons.hasOwnProperty(button)) {
            controls.buttons[button] = [];
        } if(!controls.buttonup.hasOwnProperty(button)) {
            controls.buttonup[button] = [];
        }
        
        let action;
        let f = function() {
            let entity = player.entity;
            
            let newAction = new actionClass();
        
            if(entity != null) if(entity.addAction(newAction)) {
                action = newAction;
            }
        };
        
        controls.buttons[button].push(function() {
            let entity = player.entity;
            
            if(eventControllers.includes(f)) {
                eventControllers.remove(f);
                
                if(entity != null) {
                    entity.removeAction(action);
                }
            } else {
                f;
                
                eventControllers.add(f);
            }
        });
    }
}

var controls = {
    click : {},
    mouseup : {},
    keys : {},
    keyup : {},
    mousemove : [],
    buttons : {},
    buttonup : {}
};

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
    const positionRelative = Vector.subtraction(mouse.position, [CANVAS.offsetLeft, CANVAS.offsetTop]);
    const positionOnCanvas = Vector.multiplication(positionRelative, [CANVAS.width / CANVAS.clientWidth, CANVAS.height / CANVAS.clientHeight]);
    
    if(arguments.length == 1) {
        let offset = CAMERA != null ? CAMERA.getOffset()[dimension] : 0;
        
        return positionOnCanvas[dimension] / CAMERA.getSizeProp(dimension) + offset;
    }
    
    let offset = CAMERA != null ? CAMERA.getOffset() : [0, 0];
    
    return positionOnCanvas.divide(CAMERA.getSizeProp()).add(offset);
}

// 

AC["fc3"] = FinalCutter3;

let ctrljson = {
    "keyOnce" : [
        {"keyCode" : 46, "actionId" : "ldelete"},
        {"keyCode" : 49, "actionId" : "lselect"},
        {"keyCode" : 84, "actionId" : "test"},
        {"keyCode" : [74], "actionId" : "goldenJab"},
        {"keyCode" : [97], "actionId" : "lSave"}
    ],
    "keyRepeat" : [
        {"keyCode" : 86, "actionId" : "flamethrower"},
        {"keyCode" : 77, "actionId" : "plasmaLightning"},
        {"keyCode" : 79, "actionId" : "autoSword"},
        {"keyCode" : 79, "actionId" : "veinSweep"},
        {"keyCode" : 75, "actionId" : "cutterDash"},
        {"keyCode" : 85, "actionId" : "burningAttack"},
        {"keyCode" : K_LEFT, "actionId" : "movementLeft"},
        {"keyCode" : K_UP, "actionId" : "movementUp"},
        {"keyCode" : K_RIGHT, "actionId" : "movementRight"},
        {"keyCode" : K_DOWN, "actionId" : "movementDown"},
        {"keyCode" : [32], "actionId" : "autoJump"},
        {"keyCode" : [70], "actionId" : "goldFlurry"},
        {"keyCode" : [80], "actionId" : "bloodShot"},
        {"keyCode" : [16], "actionId" : "still"},
        {"keyCode" : [66], "actionId" : "blowoutShots"},
        {"keyCode" : [69], "actionId" : "zoneEngage"},
        {"keyCode" : [73], "actionId" : "autoCutter"},
        {"keyCode" : [80, 82], "actionId" : "rocketPunch"},
        {"keyCode" : [66], "actionId" : "brushSlash"},
        {"keyCode" : [84], "actionId" : "fc3"},
        {"keyCode" : [223], "actionId" : "targetFocus"},
        {"keyCode" : [76], "actionId" : "energyJump"},
        {"keyCode" : [78], "actionId" : "paintBomb"},
        {"keyCode" : [188], "actionId" : "paintSpray"},
    ],
    "keyToggle" : [
        // {"keyCode" : [67], "actionId" : "followMe"},
        // {"keyCode" : [82], "actionId" : "rocketPunch"},
        // {"keyCode" : [86], "actionId" : "flamethrower"},
        {"keyCode" : [191], "actionId" : "targetFocus"},
    ],
    "mouseOnce" : [
        // {"which" : 1, "actionId" : "lplace"},
        // {"which" : 1, "actionId" : "lcreate"},
        // {"which" : 2, "actionId" : "lselect"},
        // {"which" : 1, "actionId" : "rocketPunch"},
    ],
    "mouseRepeat" : [
        {"which" : 1, "actionId" : "autoLcreate"},
        // {"which" : 1, "actionId" : "autoSword"}
        // {"which" : 1, "actionId" : "plasmaLightning"}
        {"which" : 3, "actionId" : "autoLdelete"},
        // {"which" : 1, "actionId" : "rocketPunch"}
    ],
    "mouseToggle" : [
        // {"which" : 1, "actionId" : "rocketPunch"},
        // {"which" : 3, "actionId" : "flamethrower"},
    ],
    "buttonOnce" : [
        {"button" : 3, "actionId" : "goldenJab"},
    ],
    "buttonRepeat" : [
        {"button" : 5, "actionId" : "autoJump"},
        {"button" : 2, "actionId" : "autoSword"},
        {"button" : 0, "actionId" : "autoCutter"},
        {"button" : 1, "actionId" : "rocketPunch"},
    ],
    "buttonToggle" : [
        {"button" : -1, "actionId" : "flamethrower"},
    ]
};

function updateEventAction(json, player = PLAYERS[0]) {
    clearEventAction();
    
    for(let i = 0; i < json.keyOnce.length; ++i) {
        let assoc = json.keyOnce[i];
        
        addKeyAction(assoc.keyCode, getActionClass(assoc.actionId), player);
    }
    
    for(let i = 0; i < json.keyRepeat.length; ++i) {
        let assoc = json.keyRepeat[i];
        
        addKeyActionRepeat(assoc.keyCode, getActionClass(assoc.actionId), player);
    }
    
    for(let i = 0; i < json.keyToggle.length; ++i) {
        let assoc = json.keyToggle[i];
        
        addKeyActionToggle(assoc.keyCode, getActionClass(assoc.actionId), player);
    }
    
    for(let i = 0; i < json.mouseOnce.length; ++i) {
        let assoc = json.mouseOnce[i];
        
        addClickAction(assoc.which, getActionClass(assoc.actionId), player);
    }
    
    for(let i = 0; i < json.mouseRepeat.length; ++i) {
        let assoc = json.mouseRepeat[i];
        
        addClickActionRepeat(assoc.which, getActionClass(assoc.actionId), player);
    }
    
    for(let i = 0; i < json.mouseToggle.length; ++i) {
        let assoc = json.mouseToggle[i];
        
        addClickActionToggle(assoc.which, getActionClass(assoc.actionId), player);
    }
    
    for(let i = 0; i < json.buttonOnce.length; ++i) {
        let assoc = json.buttonOnce[i];
        
        addButtonAction(assoc.button, getActionClass(assoc.actionId), player);
    }
    
    for(let i = 0; i < json.buttonRepeat.length; ++i) {
        let assoc = json.buttonRepeat[i];
        
        addButtonActionRepeat(assoc.button, getActionClass(assoc.actionId), player);
    }
    
    for(let i = 0; i < json.buttonToggle.length; ++i) {
        let assoc = json.buttonToggle[i];
        
        addButtonActionToggle(assoc.button, getActionClass(assoc.actionId), player);
    }
    
    controls.mousemove.push(function() {
        player.entity.addAction(new MouseFocus());
    });
    controls.click[1].push(function() {
        player.entity.addAction(new MouseFocus())
    });
    controls.keys[49].push(function() {
        if(player.entity instanceof EC["adnyropast"]) {
            // console.log("lcreatemenu");
        }
    });
}

function clearEventAction() {
    eventControllers.clear();
    
    controls.click = {};
    controls.mouseup = {};
    controls.keys = {};
    controls.keyup = {};
    controls.mousemove = [];
    controls.buttons = {};
    controls.buttonup = {};
}

updateEventAction(ctrljson);

function gameEventController() {
    if(mouse.moveValue == 1) {
        let list = controls.mousemove;
        
        for(let i in list) {
            list[i]();
        }
    }
    
    for(let which in controls.click) {
        if(mouse.value(which) === 1) {
            let list = controls.click[which];
            
            for(let i in list) {
                list[i]();
            }
        } else if(controls.mouseup[which] && (mouse.justReleased(which) || blurEvrec.blurred())) {
            let list = controls.mouseup[which];
            
            for(let i in list) {
                list[i]();
            }
        }
    }
    
    for(let keyCode in controls.keys) {
        if(keyList.value(keyCode) === 1) {
            let list = controls.keys[keyCode];
            
            for(let i in list) {
                list[i]();
            }
        } else if(controls.keyup[keyCode] && (keyList.justReleased(keyCode) || blurEvrec.blurred())) {
            let list = controls.keyup[keyCode];
            
            for(let i in list) {
                list[i]();
            }
        }
    }
    
    for(let i = 0; i < eventControllers.length; ++i) {
        eventControllers[i]();
    }
    
    let gamepad = getGamepad(0);
    
    if(gamepad instanceof Gamepad) {
        let entity = PLAYERS[0].entity;
        
        if(true) {
            let vector = getDPADDirection();
            vector.add(getJoyStickDirection());
            
            if(vector.isZero()) {
                for(let i = 0; i < movementActions.length; ++i) {
                    entity.removeAction(movementActions[i]);
                }
                
                movementActions.length = 0;
            } else {
                entity.route = Vector.addition(entity.getPositionM(), vector.normalized(BIG));
                
                entity.addAction(new MoveFocus());
                
                let movementAction = (new Movement()).setUseCost(movementCost);
                movementActions.push(movementAction);
                entity.addAction(movementAction);
            }
        }
        
        for(let i = 0; i < gamepad.buttons.length; ++i) {
            if(gamepadRec.value(i) === 1) {
                let list = controls.buttons[i];
                
                for(let j in list) {
                    list[j]();
                }
            } else if(gamepadRec.justReleased(i)) {
                let list = controls.buttonup[i];
                
                for(let j in list) {
                    list[j]();
                }
            }
        }
    }
}

let movementActions = [];
