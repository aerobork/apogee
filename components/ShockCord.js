"use strict"
const InnerComponent = require("./InnerComponent.js");

class ShockCord extends InnerComponent {
    constructor(state){
        `
            length, density, position, packedLength, packedDiameter
            this.state.length = length;
            this.state.packedLength = packedLength;
            this.state.packedDiameter = packedDiameter;
        `
        super(state);    
    }

    setState() {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }

        this._calcMass();
        this._calcCG();
    }

    _calcMass() {
        this.mass = this.state.length * this.state.density;
        return this.mass;
    }

    _calcCG() {
        this.cg = this.state.packedLength / 2;
        return this.cg;
    }
}