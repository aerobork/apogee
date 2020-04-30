"use strict"
const InnerComponent = require("./InnerComponent.js");

class Streamer extends InnerComponent {
    constructor(state) {
        `
            length, width, density, cd, packedLength, packedDiameter, positionthis.state.length = length;
            this.state.width = width;
            this.state.cd = cd;
            this.state.packedDiameter = packedDiameter;
            this.state.packedLength = packedLength;

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
        this.mass = this.state.length * this.state.width * this.state.density;
        return this.mass;
    }

    _calcCG() {
        this.cg = this.state.packedLength / 2;
        return this.cg;
    }
}