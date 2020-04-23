"use strict"
const InnerComponent = require("./InnerComponent.js");

class MassComponent extends InnerComponent {
    constructor(mass, position, length, diameter){
        super([[0,0]], 0, position);

        this.state.mass = mass;
        this.state.length = length;
        this.state.diameter = diameter;
    }

    setState() {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }

        this._calcCG();
    }

    _calcCG() {
        this.cg = this.length / 2;
        return this.cg;
    }

}