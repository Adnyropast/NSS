
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
    
    if(this.cursor.target != null) {
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
    this.regenerate();
}

function routeOrbit() {
    this.setSelfBrake(Infinity);
    
    const positionM = this.getPositionM();
    const vector = Vector.subtraction(this.route, positionM);
    const currentAngle = vector.getAngle();
    const angleValue = this.rotateValue || +Math.PI/32;
    const nextAngle = currentAngle + angleValue;
    const nextPosition = Vector.subtraction(this.route, Vector.fromAngle(nextAngle).normalize(vector.getNorm()));
    
    this.speed.add(Vector.subtraction(nextPosition, positionM));
}

function routeTravel() {
    const vector = Vector.subtraction(this.route, this.getPositionM());
    
    if(this.routeTravelSpeedFactor) {
        this.speed.add(vector.multiply(this.routeTravelSpeedFactor));
    } else {
        this.speed.add(vector.multiply(+0.0625));
    }
}

function sizeTransitionController() {
    this.setSizeM(this.sizeTransition.getNext());
    
    if(this.sizeTransition.isDone()) {
        delete this.sizeTransition;
        this.controllers.remove(sizeTransitionController);
    }
}
