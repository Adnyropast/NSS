
/**
 * Controllers are functions that make entities act according to "something".
 * For instance, the main player is controlled by the keyboard, whereas the enemies are controlled by an AI.
 * Controllers could theoretically be swapped for each entity.
 * If there is eventually multiple players, they would each require one separate controller.
 */

const noController = function noController(entity) {};

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
