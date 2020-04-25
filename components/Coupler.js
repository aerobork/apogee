"use strict"
const InnerComponent = require("./InnerComponent.js");

class Coupler extends InnerComponent {
    constructor(state) {
        `
            radius, innerRadius, length, density, position
        `
        super(state);
    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }

        this._calcPoints();
        this._calcMass();
        this._calcCG();
    }

    _calcPoints() {
        this.points = [[this.state.radius, 0], [this.state.radius, this.state.length]];
        return this.points;
    }

    _calcMass() {
        this.mass = (this.state.radius**2 - this.state.innerRadius**2) * Math.PI * this.state.length * this.state.density;
        return this.mass;
    }

    _calcCG() {
        this.cg = this.state.length / 2;
        return this.cg;
    }
}

module.exports = Coupler;