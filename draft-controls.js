
var controls = [
    {"id" : "example", "keys" : [], "presskeys" : [], "mouse" : []},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {}
];

var actionevents = [
    {"id" : "left", "keys" : [37, 65, 81], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.route = getKDirection().add(player.getPositionM());
        player.addAction(new MoveFocus());
        player.addAction(new Movement());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(Movement);
    }},
    {"id" : "up", "keys" : [38, 87, 90], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.route = getKDirection().add(player.getPositionM());
        player.addAction(new MoveFocus());
        player.addAction(new Movement());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(Movement);
    }},
    {"id" : "right", "keys" : [39, 68], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.route = getKDirection().add(player.getPositionM());
        player.addAction(new MoveFocus());
        player.addAction(new Movement());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(Movement);
    }},
    {"id" : "down", "keys" : [40, 83], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.route = getKDirection().add(player.getPositionM());
        player.addAction(new MoveFocus());
        player.addAction(new Movement());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(Movement);
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
    {"id" : "zyxeiFlurry", "keys" : [70], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new ZyxeiFlurry());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(ZyxeiFlurry);
    }},
    {"id" : "projectileShot", "keys" : [80], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new ProjectileShot());
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
    {"id" : "multi-aimShots", "keys" : [77], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new MultiaimShots());
    }, "oneventup" : function oneventup(player) {
        player.removeActionsWithConstructor(MultiaimShots);
    }},
    {"id" : "zoneEngage", "keys" : [69], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new ZoneEngage());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "teleportation", "keys" : [84], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new Teleportation(20, 20));
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "overheadSlash", "keys" : [79], "presskeys" : [], "mouse" : [1], "oneventdown" : function oneventdown(player) {
        player.addAction(new OverheadSlash());
    }, "oneventup" : function oneventup(player) {
        
    }},
    
    {"id" : "cutterBoomerang", "keys" : [], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new CutterBoomerang());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "cutterDash", "keys" : [], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new CutterDash());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "finalCutter", "keys" : [], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new FinalCutter());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "cleft", "keys" : [72], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new FreeKeyFocus());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "cup", "keys" : [85], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new FreeKeyFocus());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "cright", "keys" : [75], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new FreeKeyFocus());
    }, "oneventup" : function oneventup(player) {
        
    }},
    {"id" : "cdown", "keys" : [74], "presskeys" : [], "mouse" : [], "oneventdown" : function oneventdown(player) {
        player.addAction(new FreeKeyFocus());
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
    
    {"id" : "test", "keys" : [], "presskeys" : [], "mouse" : [1], "oneventdown" : function oneventdown(player) {
        // player.addAction(new RocketPunch());
        // player.addAction(new BulletShot());
    }, "oneventup" : function oneventup(player) {
        
    }}
];

function findActionevent(id) {
    return actionevents.find(function(actionevent) {
        return actionevent.id == id;
    });
}

/**/
var K_LEFT = findActionevent("left").keys;
var K_UP = findActionevent("up").keys;
var K_RIGHT = findActionevent("right").keys;
var K_DOWN = findActionevent("down").keys;

var K_CLEFT = findActionevent("cleft").keys;
var K_CUP = findActionevent("cup").keys;
var K_CDOWN = findActionevent("cdown").keys;
var K_CRIGHT = findActionevent("cright").keys;
/**
var K_DIRECTION = LEFT.concat(UP).concat(RIGHT).concat(DOWN);
var K_JUMP = [32];
var K_FOCUS = [223];
var K_PRESSFOCUS = [191];

var K_CDIRECTION = CLEFT.concat(CUP).concat(CDOWN).concat(CRIGHT);

var K_FLURRY = [70];
/**/

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
    const position = Vector.subtraction(mouse.position, [CANVAS.offsetLeft, CANVAS.offsetTop]).multiply([CANVAS.width / CANVAS.clientWidth, CANVAS.height / CANVAS.clientHeight]);
    
    if(arguments.length == 1) {
        return position[dimension] / [wprop, hprop][dimension] + CAMERA.getOffset()[dimension];
    }
    
    return position.divide([wprop, hprop]).add(CAMERA.getOffset());
}
