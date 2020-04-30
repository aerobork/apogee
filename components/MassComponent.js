"use strict"
const InnerComponent = require("./InnerComponent.js");

class MassComponent extends InnerComponent {
    constructor(state){
        `
            mass, position, length, diameter
        `
        super(state);
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