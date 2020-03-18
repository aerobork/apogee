"use strict"
const AxialComponent = require("./axialComponent.js");

class BodyTube extends AxialComponent {

    constructor(radius, innerRadius, length, density, angle, aref, dref, v0, p) {

        super([[radius, 0], [radius, length]], density, angle, aref, dref, v0, p);
        this.innerRadius = innerRadius;
    }

    setState(newState) {
        super.setState(newState);
    }

    _calcMass() {
        this.mass = (this.startRadius**2 - (this.innerRadius)**2) * Math.PI * this.length * this.state.density;
    }

    _calcCG() {
        this.cg = this.length / 2;

        return this.cg;
    }   
}

let bt = new BodyTube(2.5, 2.3, 20, 0.68, 0, 10, 10, 0, 0);
