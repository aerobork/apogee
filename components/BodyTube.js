"use strict"
const AxialComponent = require("./axialComponent.js");

class BodyTube extends AxialComponent {

    constructor(radius, innerRadius, length, density, angle, aref, dref, v0, p) {

        super([[radius, 0], [radius, length]], density, angle, aref, dref, v0, p);
        this.innerRadius = innerRadius;
    }

    setState() {
        super.setState();
    }


    _calcMass() {
        this.mass = (this.startRadius**2 - (this.innerRadius)**2) * Math.pi * this.length * this.density;
    }

}