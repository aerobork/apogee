"use strict"
const AxialComponent = require("./axialComponent.js");

class Transition extends AxialComponent {

    constructor(startRadius, endRadius, length, density, thickness, angle, aref, dref, v0, p) {

        super([[startRadius, 0],[endRadius, length]], density, angle, aref, dref, v0, p);
        this.state.points = null;
        this.state.startRadius = startRadius;
        this.state.endRadius = endRadius;
        this.state.length = length;
        this.state.thickness = thickness;
        this.state.filled = false;
    }

    _calcPoints() {
        this.points = [[this.state.startRadius, 0], [this.state.endRadius, this.state.length]];
        return this.points; 
    }

    _calcMass() {
        let theta = Math.atan2(this.state.length, this.state.endRadius - this.state.startRadius);
        let x = this.state.thickness / Math.sin(theta);
        let R = this.state.endRadius - x;
        let r = this.state.startRadius - x;
        let h = this.state.length - 2 * this.state.thickness;
        let massInner = (R**2 + R * r + r**2) * 1/3 * h * Math.PI * this.state.density;
        this.mass = this.state.filled? this._calcVolume() * this.state.density : this._calcVolume() * this.state.density - massInner;

        return this.mass;
    }

    _calcCG() {
        
        let comOuter = super._calcCG();

        let theta = Math.atan2(this.state.length, this.state.endRadius - this.state.startRadius);

        let x = this.state.thickness * Math.sin(theta);
        let r = this.state.endRadius - x;
        let R = this.state.startRadius - x;
        let h = this.state.length - 2 * this.state.thickness;
        let comInner = h * (R**2 + 2 * R * r + 3 * r**2) / (4 * (R**2 + R * r + r**2));
        let massInner = (R**2 + R * r + r**2) * 1/3 * h * Math.PI * this.state.density;
        
        this.cg = this.state.filled ? comOuter : (this._calcVolume() * this.state.density * comOuter - massInner * comInner) / (this._calcVolume() * this.state.density - massInner);

        return this.cg;
    }   

    toggleFilled() {
        super.setState({filled: !this.state.filled});
    }
}

let bt = new Transition(2.5, 2.3, 7.5, 0.68, 1.2, 0, 10, 10, 0, 0);
bt.setState({});
console.log(bt.mass);
console.log(bt.cg);

