"use strict"
const AxialComponent = require("./axialComponent.js");

class BodyTube extends AxialComponent {

    constructor(radius, innerRadius, length, density, angle, aref, dref, v0, p) {

        super(radius, radius, length, density, angle, aref, dref, v0, p);
        this.state.innerRadius = innerRadius;
    }

    _calcMass() {
        this.mass = (this.state.startRadius**2 - (this.state.innerRadius)**2) * Math.PI * this.state.length * this.state.density;
    }

    _calcCG() {
        this.cg = this.state.length / 2;

        return this.cg;
    }   
}

let bt = new BodyTube(2.5, 2.3, 20, 0.68, 0, 10, 10, 0, 0);
bt.setState({});
console.log(bt.mass);
console.log(bt.cg);
console.log(bt.cp);
