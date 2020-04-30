"use strict"
const InnerComponent = require("./InnerComponent.js");

class Parachute extends InnerComponent {
    constructor(state) {
        `
            diameter, cd, canopyDensity, shroudLines, lineLength, shroudLineDensity, position, packedLength, packedDiameter
            this.state.diameter = diameter;
            this.state.cd = cd;
            this.state.canopyDensity = canopyDensity;
            this.state.shroudLines = shroudLines;
            this.state.lineLength = lineLength;
            this.state.shroudLineDensity = shroudLineDensity;
            this.state.position = position;
            this.state.packedLength = packedLength;
            this.state.packedDiameter = packedDiameter;
        `
        super(state);
    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }

        this._calcMass();
        this._calcCG();
    }

    _calcMass() {
        this.mass = (this.state.diameter / 2)**2 * Math.PI * this.state.canopyDensity + this.shroudLines * this.lineLength * this.shroudLineDensity;
        return this.mass;
    }

    _calcCG() {
        this.cg = this.packedLength / 2;
        return this.cg;
    }
}
