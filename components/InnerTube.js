"use strict"
const Coupler = require("./Coupler.js");

class InnerTube extends Coupler {
    constructor(radius, innerRadius, length, density, position) {
        super(radius, innerRadius, length, density, position);
        this.state.motorMount = false;
    }

    makeMotorMount(overhang, ignitionType, ignitionTime) {
        this.state.motorMount = true;
        this.state.overhang = overhang;
        this.state.ignitionType = ignitionType;
        this.state.ignitionTime = ignitionTime;
    }

}