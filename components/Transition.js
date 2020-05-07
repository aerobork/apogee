"use strict"
const AxialOuterComponent = require("./AxialOuterComponent.js");

class Transition extends AxialOuterComponent {

    constructor(state) {
        `
            startRadius, endRadius, length, density, thickness, angle, aref, dref, v0, p, M
            this.state.points = null;
            this.state.startRadius = startRadius;
            this.state.endRadius = endRadius;
            this.state.length = length;
            this.state.thickness = thickness;
            this.state.filled = false;
        `
        super(state);
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
        let h = this.state.length;
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
        let h = this.state.length;
        let comInner = h * (R**2 + 2 * R * r + 3 * r**2) / (4 * (R**2 + R * r + r**2));
        let massInner = (R**2 + R * r + r**2) * 1/3 * h * Math.PI * this.state.density;
        
        this.cg = this.state.filled ? comOuter : (this._calcVolume() * this.state.density * comOuter - massInner * comInner) / (this._calcVolume() * this.state.density - massInner);

        return this.cg;
    }   

    _calcCD() {
        
        let jointAngle = Math.atan2(this.points[this.points.length - 1][0] - this.points[this.points.length - 2][0], this.points[this.points.length - 1][1] - this.points[this.points.length - 2][1]);
        let bodyDrag = 0.8 * Math.sin(jointAngle) ** 2;

        this.cd = bodyDrag;
        return this.cd;

    }

    toggleFilled() {
        super.setState({filled: !this.state.filled});
    }
}

let bt = new Transition(2.5, 2.3, 7.5, 0.68, 1.2, 0, 10, 10, 0, 0);
bt.setState({});
console.log(bt.mass);
console.log(bt.cg);

