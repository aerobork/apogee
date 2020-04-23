"use strict"
const Coupler = require("./Coupler.js");

class Bulkhead extends Coupler {
    constructor(radius, length, density, position) {
        super(radius, 0, length, density, position);
    }
}