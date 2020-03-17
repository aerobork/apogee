"use strict"

class Component {
    
    constructor() {}

    setMass(mass) {
        this.mass = mass;
    }

    getMass() {
        return this.mass;
    }

    _calcNormal() {}

    _calcDrag() {}

    _calcLift() {}

    _calcCP() {}

    _calcCG() {}

}

module.exports = Component;