"use strict"

class Component {
    
    constructor(state) {
        this.state = state;
        
        if (!this.state.subcomponents){
            this.state.subcomponents = [];
        }
        
        this.setState();

    }

    setState() {

    } 

    setMass(mass) {
        this.mass = mass;
    }

    getMass() {
        return this.mass;
    }

    setName(name) {
        this.state.name = name;
    }

    _calcNormal() {}

    getNormal() {}

    _calcDrag() {}

    getDrag() {}

    _calcLift() {}

    getLift() {}

    _calcCP() {}

    getCP() {}

    setCP(CP) {
        this.CP = CP; 
    }

    _calcCG() {}

    getCG() {
        return this.CG;
    }

    setCG(CG) {
        this.CG = CG;
    }

}

module.exports = Component;
