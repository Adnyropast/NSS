
/**
 * Controllers are functions that make entities act according to "something".
 * For instance, the main player is controlled by the keyboard, whereas the enemies are controlled by an AI.
 * Controllers could theoretically be swapped for each entity.
 * If there is eventually multiple players, they would each require one separate controller.
 */

const noController = function noController(entity) {};

function playerController(entity) {
    if(entity instanceof Entity) {
        if(keyList.value(107)) {
            <!-- ++entity.cursorDistance; -->
        } if(keyList.value(109)) {
            <!-- --entity.cursorDistance; -->
        }
        /**/
        for(var i = 0; i < actionevents.length; ++i) {
            if(keyList.value(actionevents[i].keys)) {
                actionevents[i].oneventdown(entity);
            } if(keyList.value(actionevents[i].presskeys) == 1) {
                actionevents[i].oneventdown(entity);
            } if(mouse.value(actionevents[i].mouse)) {
                actionevents[i].oneventdown(entity);
            }
        }
        /**/
        for(var i = 0; i < actionevents.length; ++i) {
            if(keyList.justReleased(actionevents[i].keys)) {
                actionevents[i].oneventup(entity);
            }
        }
        
        if(mouse.moveValue == 1) {
            entity.addAction(new MouseFocus());
            
            for(let i = 0; i < controls.mousemove.length; ++i) {
                controls.mousemove[i](entity);
            }
        }
        
        if(mouse.value(1) == 1) {
            entity.addAction(new MouseFocus());
        }
        
        if(blurEvrec.blurred()) {
            for(let i = 0; i < actionevents.length; ++i) {
                actionevents[i].oneventup(entity);
            }
        }
        
        /**/
        
        for(let which in controls.click) {
            if(mouse.value(which) == 1) {
                for(let i = 0; i < controls.click[which].length; ++i) {
                    controls.click[which][i](entity);
                }
            } else if(controls.mouseup[which] && (mouse.justReleased(which) || blurEvrec.blurred())) {
                for(let i = 0; i < controls.mouseup[which].length; ++i) {
                    controls.mouseup[which][i](entity);
                }
            }
        }
        
        for(let keyCode in controls.keys) {
            if(keyList.value(keyCode) == 1) {
                for(let i = 0; i < controls.keys[keyCode].length; ++i) {
                    controls.keys[keyCode][i](entity);
                }
            } else if(controls.keyup[keyCode] && (keyList.justReleased(keyCode) || blurEvrec.blurred())) {
                for(let i = 0; i < controls.keyup[keyCode].length; ++i) {
                    controls.keyup[keyCode][i](entity);
                }
            }
        }
    }
}

function enemyController(entity) {
    var targets = [];
    
    for(var i = 0; i < entity.cursor.collidedWith.length; ++i) {
        if(entity.opponents.includes(entity.cursor.collidedWith[i])) {
            targets.push(entity.cursor.collidedWith[i]);
        }
    }
    
    var positionM = entity.getPositionM();
    
    entity.cursor.target = null;
    var max = entity.cursorDistance;
    
    for(var i = 0; i < targets.length; ++i) {
        var distance = Vector.distance(targets[i].getPositionM(), positionM);
        
        if(distance < max) {
            max = distance;
            entity.cursor.target = targets[i];
        }
    }
    
    if(entity.hasState("grounded") && worldCounter % 16 == 0) entity.removeActionsWithConstructor(Jump);
    
    if(entity.cursor.target != null) {
        entity.addAction(new PositionCursorTarget());
        
        entity.route = entity.cursor.getPositionM();
        entity.addAction(new Movement());
        entity.addAction(new EntityCharge([{"type" : "enemy", "value" : 8}]));
        
        if(entity.cursor.target.getY2() < entity.getY()) {
            let jump = new Jump();
            // jump.initialForce = 1;
            
            entity.addAction(jump);
        }
    } else {
        entity.cursor.setPositionM(entity.getPositionM());
        entity.route = null;
        entity.removeActionsWithConstructor(Movement);
    }
}
