
let eventControllers = new SetArray();

function addInputAction(inputType, key, actionClass, player, type) {
    if(Array.isArray(key)) {
        for(let i = 0; i < key.length; ++i) {
            addInputAction(inputType, key[i], actionClass, player, type);
        }
    }
    
    else {
        // Set the proper input type.
        
        let downListeners = [];
        let upListeners = [];
        
        if(inputType === "mouse") {
            downListeners = controls.click;
            upListeners = controls.mouseup;
        }
        
        else if(inputType === "keyboard") {
            downListeners = controls.keys;
            upListeners = controls.keyup;
        }
        
        else if(inputType === "gamepad") {
            downListeners = controls.buttons;
            upListeners = controls.buttonup;
        }
        
        // Create the arrays if they don't exist.
        
        if(!downListeners.hasOwnProperty(key)) {
            downListeners[key] = [];
        } if(!upListeners.hasOwnProperty(key)) {
            upListeners[key] = [];
        }
        
        // Add the input-action association.
        
        if(type === "once") {
            let action = null;
            
            downListeners[key].push(function() {
                const entity = player.entity;
                
                if(entity !== null) {
                    action = new actionClass();
                    
                    entity.addAction(action);
                }
            });
            
            upListeners[key].push(function() {
                const entity = player.entity;
                
                if(entity !== null) {
                    entity.removeAction(action);
                }
            });
        }
        
        else if(type === "repeat") {
            let action = null;
            
            function f() {
                const entity = player.entity;
                
                if(entity != null) {
                    const newAction = new actionClass();
                    
                    entity.addAction(newAction);
                    
                    if(ACTIONADDED) {
                        action = newAction;
                    }
                }
            }
            
            downListeners[key].push(function() {
                eventControllers.add(f);
            });
            
            upListeners[key].push(function() {
                const entity = player.entity;
                
                eventControllers.remove(f);
                
                if(entity !== null) {
                    entity.removeAction(action);
                }
            });
        }
        
        else if(type === "toggle") {
            let action = null;
            
            function f() {
                const entity = player.entity;
                
                if(entity !== null) {
                    const newAction = new actionClass();
                    
                    entity.addAction(newAction);
                    
                    if(ACTIONADDED) {
                        action = newAction;
                    }
                }
            }
            
            downListeners[key].push(function() {
                const entity = player.entity;
                
                if(eventControllers.includes(f)) {
                    eventControllers.remove(f);
                    
                    if(entity !== null) {
                        entity.removeAction(action);
                    }
                }
                
                else {
                    eventControllers.add(f);
                }
            });
        }
    }
}

function addClickAction(which, actionClass, player) {
    addInputAction("mouse", which, actionClass, player, "once");
}

function addKeyAction(keyCode, actionClass, player) {
    addInputAction("keyboard", keyCode, actionClass, player, "once");
}

function addKeyActionRepeat(keyCode, actionClass, player) {
    addInputAction("keyboard", keyCode, actionClass, player, "repeat");
}

function addClickActionRepeat(which, actionClass, player) {
    addInputAction("mouse", which, actionClass, player, "repeat");
}

function addKeyActionToggle(keyCode, actionClass, player) {
    addInputAction("keyboard", keyCode, actionClass, player, "toggle");
}

function addClickActionToggle(which, actionClass, player) {
    addInputAction("mouse", which, actionClass, player, "toggle");
}

function addButtonAction(button, actionClass, player) {
    addInputAction("gamepad", button, actionClass, player, "once");
}

function addButtonActionRepeat(button, actionClass, player) {
    addInputAction("gamepad", button, actionClass, player, "repeat");
}

function addButtonActionToggle(button, actionClass, player) {
    addInputAction("gamepad", button, actionClass, player, "toggle");
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

function getMousePosition() {
    const positionRelative = Vector.subtraction(mouse.position, [CANVAS.offsetLeft, CANVAS.offsetTop]);
    const positionOnCanvas = Vector.multiplication(positionRelative, [CANVAS.width / CANVAS.clientWidth, CANVAS.height / CANVAS.clientHeight]);
    
    return canvasPoint_positionInGame(positionOnCanvas);
}

// 

let ctrljson = {
    "keyOnce" : [
        {"keyCode" : 46, "actionClassName" : "LDelete"},
        {"keyCode" : 49, "actionClassName" : "LSelect"},
        {"keyCode" : 84, "actionClassName" : "Test"},
        {"keyCode" : [74], "actionClassName" : "GoldenJab"},
        {"keyCode" : [97], "actionClassName" : "LSave"}
    ],
    "keyRepeat" : [
        {"keyCode" : 86, "actionClassName" : "Flamethrower"},
        {"keyCode" : 77, "actionClassName" : "PlasmaLightning"},
        {"keyCode" : 79, "actionClassName" : "AutoSword"},
        {"keyCode" : 79, "actionClassName" : "VeinSweep"},
        {"keyCode" : 75, "actionClassName" : "CutterDash"},
        {"keyCode" : 85, "actionClassName" : "BurningAttack"},
        {"keyCode" : K_LEFT, "actionClassName" : "MovementLeft"},
        {"keyCode" : K_UP, "actionClassName" : "MovementUp"},
        {"keyCode" : K_RIGHT, "actionClassName" : "MovementRight"},
        {"keyCode" : K_DOWN, "actionClassName" : "MovementDown"},
        {"keyCode" : [32], "actionClassName" : "AutoJump"},
        {"keyCode" : [70], "actionClassName" : "GoldFlurry"},
        {"keyCode" : [80], "actionClassName" : "BloodShot"},
        {"keyCode" : [16], "actionClassName" : "Still"},
        {"keyCode" : [66], "actionClassName" : "BlowoutShots"},
        {"keyCode" : [69], "actionClassName" : "ZoneEngage"},
        {"keyCode" : [73], "actionClassName" : "AutoCutter"},
        {"keyCode" : [80, 82], "actionClassName" : "RocketPunch"},
        {"keyCode" : [66], "actionClassName" : "BrushSlash"},
        {"keyCode" : [84], "actionClassName" : "FinalCutter3"},
        {"keyCode" : [223], "actionClassName" : "TargetFocus"},
        {"keyCode" : [76], "actionClassName" : "EnergyJump"},
        {"keyCode" : [78], "actionClassName" : "PaintBomb"},
        {"keyCode" : [188], "actionClassName" : "PaintSpray"},
    ],
    "keyToggle" : [
        // {"keyCode" : [67], "actionClassName" : "FollowMe"},
        // {"keyCode" : [82], "actionClassName" : "RocketPunch"},
        // {"keyCode" : [86], "actionClassName" : "Flamethrower"},
        {"keyCode" : [191], "actionClassName" : "TargetFocus"},
    ],
    "mouseOnce" : [
        // {"which" : 1, "actionClassName" : "LPlace"},
        // {"which" : 1, "actionClassName" : "LCreate"},
        // {"which" : 2, "actionClassName" : "LSelect"},
        // {"which" : 1, "actionClassName" : "RocketPunch"},
    ],
    "mouseRepeat" : [
        {"which" : 1, "actionClassName" : "AutoLCreate"},
        // {"which" : 1, "actionClassName" : "AutoSword"}
        // {"which" : 1, "actionClassName" : "PlasmaLightning"}
        {"which" : 3, "actionClassName" : "AutoLDelete"},
        // {"which" : 1, "actionClassName" : "RocketPunch"}
    ],
    "mouseToggle" : [
        // {"which" : 1, "actionClassName" : "RocketPunch"},
        // {"which" : 3, "actionClassName" : "Flamethrower"},
    ],
    "buttonOnce" : [
        {"button" : 3, "actionClassName" : "ZoneEngage"},
    ],
    "buttonRepeat" : [
        {"button" : 5, "actionClassName" : "AutoJump"},
        {"button" : 2, "actionClassName" : "AutoSword"},
        {"button" : 0, "actionClassName" : "AutoCutter"},
        {"button" : 1, "actionClassName" : "RocketPunch"},
        {"button" : 6, "actionClassName" : "Still"},
    ],
    "buttonToggle" : [
        {"button" : -1, "actionClassName" : "Flamethrower"},
    ]
};

function updateEventAction(json, player = PLAYERS[0]) {
    clearEventAction();
    
    for(let i = 0; i < json.keyOnce.length; ++i) {
        let assoc = json.keyOnce[i];
        
        addKeyAction(assoc.keyCode, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("keyboard", assoc.keyCode, actionClass_forName(assoc.actionClassName), player, "once");
    }
    
    for(let i = 0; i < json.keyRepeat.length; ++i) {
        let assoc = json.keyRepeat[i];
        
        addKeyActionRepeat(assoc.keyCode, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("keyboard", assoc.keyCode, actionClass_forName(assoc.actionClassName), player, "repeat");
    }
    
    for(let i = 0; i < json.keyToggle.length; ++i) {
        let assoc = json.keyToggle[i];
        
        addKeyActionToggle(assoc.keyCode, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("keyboard", assoc.keyCode, actionClass_forName(assoc.actionClassName), player, "toggle");
    }
    
    for(let i = 0; i < json.mouseOnce.length; ++i) {
        let assoc = json.mouseOnce[i];
        
        addClickAction(assoc.which, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("mouse", assoc.which, actionClass_forName(assoc.actionClassName), player, "once");
    }
    
    for(let i = 0; i < json.mouseRepeat.length; ++i) {
        let assoc = json.mouseRepeat[i];
        
        addClickActionRepeat(assoc.which, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("mouse", assoc.which, actionClass_forName(assoc.actionClassName), player, "repeat");
    }
    
    for(let i = 0; i < json.mouseToggle.length; ++i) {
        let assoc = json.mouseToggle[i];
        
        addClickActionToggle(assoc.which, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("mouse", assoc.which, actionClass_forName(assoc.actionClassName), player, "toggle");
    }
    
    for(let i = 0; i < json.buttonOnce.length; ++i) {
        let assoc = json.buttonOnce[i];
        
        addButtonAction(assoc.button, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("gamepad", assoc.button, actionClass_forName(assoc.actionClassName), player, "once");
    }
    
    for(let i = 0; i < json.buttonRepeat.length; ++i) {
        let assoc = json.buttonRepeat[i];
        
        addButtonActionRepeat(assoc.button, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("gamepad", assoc.button, actionClass_forName(assoc.actionClassName), player, "repeat");
    }
    
    for(let i = 0; i < json.buttonToggle.length; ++i) {
        let assoc = json.buttonToggle[i];
        
        addButtonActionToggle(assoc.button, actionClass_forName(assoc.actionClassName), player);
        // addInputAction("gamepad", assoc.button, actionClass_forName(assoc.actionClassName), player, "toggle");
    }
    
    controls.mousemove.push(function() {
        player.entity.addAction(new MouseFocus());
    });
    controls.click[1].push(function() {
        player.entity.addAction(new MouseFocus())
    });
    controls.keys[49].push(function() {
        if(player.entity instanceof Adnyropast) {
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
    
    const gamepad = getGamepad(0);
    
    if(gamepad instanceof Gamepad) {
        const entity = PLAYERS[0].entity;
        
        const vector = gamepad_getDirection(gamepad);
        
        entity.removeActionsWithConstructor(Movement);
        
        if(!vector.isZero()) {
            entity.route = Vector.addition(entity.getPositionM(), vector.normalized(BIG));
            
            entity.addAction(new MoveFocus());
            entity.addAction((new Movement()).setUseCost(movementCost));
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
    
    for(let i = 0; i < eventControllers.length; ++i) {
        eventControllers[i]();
    }
}
