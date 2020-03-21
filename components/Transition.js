"use strict"
const AxialComponent = require("./axialComponent.js");

class Transition extends AxialComponent {

    constructor(startRadius, endRadius, length, density, thickness, angle, aref, dref, v0, p) {

        super(startRadius, endRadius, length, density, angle, aref, dref, v0, p);
        // this.state.foreRadius = foreRadius;
        // this.state.aftRadius = aftRadius;
        // this.state.length = length;
        this.state.thickness = thickness;
    }

    setState(newState) {
        // this.state.aftRadius = newState.aftRadius ? newState.aftRadius : this.state.aftRadius;
        // this.state.foreRadius = newState.foreRadius ? newState.foreRadius : this.state.foreRadius;
        // this.state.length = newState.length ? newState.length : this.state.length;

        // this.state.points = [[this.state.aftRadius, 0], [this.state.foreRadius, this.state.length]];
        super.setState(newState);
    }

    _calcMass() {
        let theta = Math.atan2(this.state.length, this.state.endRadius - this.state.startRadius);
        let x = this.state.thickness * Math.sin(theta);
        let R = this.state.endRadius - x;
        let r = this.state.startRadius - x;
        let h = this.state.length - 2 * this.state.thickness;
        let massInner = (R**2 + R * r + r**2) * 1/3 * h * Math.PI * this.state.density;
        this.mass = this._calcVolume() * this.state.density - massInner;

        return this.mass;
    }

    _calcCG() {
        
        let comOuter = super._calcCG();

        let theta = Math.atan2(this.state.length, this.state.endRadius - this.state.startRadius);
        let x = this.state.thickness * Math.sin(theta);
        let R = this.state.endRadius - x;
        let r = this.state.startRadius - x;
        let h = this.state.length - 2 * this.state.thickness;
        let comInner = h * (R**2 + 2 * R * r + 3 * r**2) / (4 * (R**2 + R * r + r**2));
        let massInner = (R**2 + R * r + r**2) * 1/3 * h * Math.PI * this.state.density;
        
        this.cg = (this._calcVolume() * this.state.density * comOuter - massInner * comInner) / (this._calcMass());
        
        return this.cg;
    }   
}

let bt = new Transition(2.5, 2.3, 20, 0.68, 0.1, 0, 10, 10, 0, 0);
bt.setState({});
console.log(bt.mass);
console.log(bt.cg);
