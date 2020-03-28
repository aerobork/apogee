"use strict"
const AxialComponent = require("./axialComponent.js");

class BodyTube extends AxialComponent {

    constructor(radius, innerRadius, length, density, angle, aref, dref, v0, p) {

        super([[radius, 0], [radius, length]], density, angle, aref, dref, v0, p);
        this.state.points = null;
        this.state.radius = radius;
        this.state.innerRadius = innerRadius;
        this.state.length = length;
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

let bt = new BodyTube(2.5, 2.3, 20, 0.68, 0, 10, 10, 0, 0);
bt.setState({});
console.log(bt.mass);
console.log(bt.cg);
console.log(bt.cp);
