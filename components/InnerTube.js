"use strict"
const Coupler = require("./Coupler.js");

class InnerTube extends Coupler {
    constructor(state) {
        `
            radius, innerRadius, length, density, position
            motorMount
        `
        super(state);
    }

    makeMotorMount(overhang, ignitionType, ignitionTime) {
        this.state.motorMount = true;
        this.state.overhang = overhang;
        this.state.ignitionType = ignitionType;
        this.state.ignitionTime = ignitionTime;
    }

}