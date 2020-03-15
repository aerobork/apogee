"use strict"
import {Component} from './Component.js'

class BodyTube extends AxialComponent {

    constructor(radius, innerRadius, length, density) {
        super([[radius, 0], [radius, length]], density);
        this.radius = radius;
        this.innerRadius = innerRadius;
        this.length = length;
    }

    setState() {

    }

    _calcNormal(angle, aref, dref, v0, p) {
        super(angle, aref, dref, v0, p);
    }

    _calcDrag() {}

    _calcLift() {}

    _calcCP() {}

    _calcCG() {}

    calcMass() {
        this.mass = (this.outerRadius**2 - (this.innerRadius)**2) * math.pi * this.length * this.density;
    }

}