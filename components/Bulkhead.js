"use strict"
const Coupler = require("./Coupler.js");

class Bulkhead extends Coupler {
    constructor(state) {
        `
            radius, length, density, position
        `
        super(state);
    }
}