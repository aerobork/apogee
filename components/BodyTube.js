"use strict"
const AxialOuterComponent = require("./AxialOuterComponent.js");

class BodyTube extends AxialOuterComponent {

    constructor(state) {
        `
            state: radius, innerRadius, length, density, angle, aref, dref, v0, p, M
            
            this.state.motorMount = false;
        `
        super(state);
    }

    _calcPoints() {
        this.points = [[this.state.radius, 0], [this.state.radius, this.state.length]];
        return this.points;
    }

    _calcMass() {
        this.mass = (this.state.radius**2 - (this.state.innerRadius)**2) * Math.PI * this.state.length * this.state.density;
    }

    _calcCG() {
        this.cg = this.state.length / 2;

        return this.cg;
    } 
    
}

module.exports = BodyTube;

let bt = new BodyTube(2.5, 2.3, 20, 0.68, 0, 10, 10, 0, 0);
bt.setState({});
console.log(bt.mass);
console.log(bt.cg);
console.log(bt.cp);
