
/**
 * Controllers are functions that make entities act according to "something".
 * For instance, the main player is controlled by the keyboard, whereas the enemies are controlled by an AI.
 * Controllers could theoretically be swapped for each entity.
 * If there is eventually multiple players, they would each require one separate controller.
 */

const noController = function noController(entity) {};

function playerController() {
    if(keyList.value(107)) {
        <!-- ++this.cursorDistance; -->
    } if(keyList.value(109)) {
        <!-- --this.cursorDistance; -->
    }
    /**/
    for(var i = 0; i < actionevents.length; ++i) {
        if(keyList.value(actionevents[i].keys)) {
            actionevents[i].oneventdown(this);
        } if(keyList.value(actionevents[i].presskeys) == 1) {
            actionevents[i].oneventdown(this);
        } if(mouse.value(actionevents[i].mouse)) {
            actionevents[i].oneventdown(this);
        }
    }
    /**/
    for(var i = 0; i < actionevents.length; ++i) {
        if(keyList.justReleased(actionevents[i].keys)) {
            actionevents[i].oneventup(this);
        }
    }
    
    if(mouse.moveValue == 1) {
        this.addAction(new MouseFocus());
        
        for(let i = 0; i < controls.mousemove.length; ++i) {
            controls.mousemove[i](this);
        }
    }
    
    if(mouse.value(1) == 1) {
        this.addAction(new MouseFocus());
    }
    
    if(blurEvrec.blurred()) {
        for(let i = 0; i < actionevents.length; ++i) {
            actionevents[i].oneventup(this);
        }
    }
    
    /**/
    
    for(let which in controls.click) {
        if(mouse.value(which) == 1) {
            for(let i = 0; i < controls.click[which].length; ++i) {
                controls.click[which][i](this);
            }
        } else if(controls.mouseup[which] && (mouse.justReleased(which) || blurEvrec.blurred())) {
            for(let i = 0; i < controls.mouseup[which].length; ++i) {
                controls.mouseup[which][i](this);
            }
        }
    }
    
    for(let keyCode in controls.keys) {
        if(keyList.value(keyCode) == 1) {
            for(let i = 0; i < controls.keys[keyCode].length; ++i) {
                controls.keys[keyCode][i](this);
            }
        } else if(controls.keyup[keyCode] && (keyList.justReleased(keyCode) || blurEvrec.blurred())) {
            for(let i = 0; i < controls.keyup[keyCode].length; ++i) {
                controls.keyup[keyCode][i](this);
            }
        }
    }
}

function enemyController() {
    var targets = [];
    
    for(var i = 0; i < this.cursor.collidedWith.length; ++i) {
        if(this.opponents.includes(this.cursor.collidedWith[i])) {
            targets.push(this.cursor.collidedWith[i]);
        }
    }
    
    var positionM = this.getPositionM();
    
    this.cursor.target = null;
    var max = this.cursorDistance;
    
    for(var i = 0; i < targets.length; ++i) {
        var distance = Vector.distance(targets[i].getPositionM(), positionM);
        
        if(distance < max) {
            max = distance;
            this.cursor.target = targets[i];
        }
    }
    
    if(this.hasState("grounded") && worldCounter % 16 == 0) this.removeActionsWithConstructor(Jump);
    
    if(this.cursor.target != null) {
        this.addAction(new PositionCursorTarget());
        
        this.route = this.cursor.getPositionM();
        this.addAction(new Movement());
        this.addAction(new EnemyCharge());
        
        if(this.cursor.target.getY2() < this.getY()) {
            let jump = new Jump();
            // jump.initialForce = 1;
            
            this.addAction(jump);
        }
    } else {
        this.cursor.setPositionM(this.getPositionM());
        this.route = null;
        this.removeActionsWithConstructor(Movement);
    }
}

function healController() {
    this.heal(this.stats["regeneration"]);
}
