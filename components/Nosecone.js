"use strict"
const AxialOuterComponent = require("./AxialOuterComponent.js");

class Nosecone extends AxialOuterComponent {
    //TODO: Implement
    constructor(state) {
        `
            radius, length, shapeType, shapeParameter, density, thickness, angle, aref, dref, v0, p, M
            this.state.points = null;
            this.state.thickness = thickness;
            this.state.startRadius = 0;
            this.state.endRadius = radius;
            this.state.length = length;
            this.state.thickness = thickness;
            this.state.shapeType = shapeType;
            this.state.shapeParameter = shapeParameter;
            this.state.filled = false;
        `
        super(state);
    }

    _calcPoints() {
        console.log(this.state.shapeType);
        let points = [];

        for (let y = 0; y < this.state.length; y += 0.1) {
            switch(this.state.shapeType) {
                case "conical": 
                    points.push([y / this.state.length * this.state.endRadius, y]);
                    break;
                case "ogive":   
                    let rho = (this.state.length**2 + this.state.endRadius**2) * ((((2 - this.state.shapeParameter) * this.state.length)**2) 
                            + (this.state.shapeParameter * this.state.endRadius)**2) /
                            4 / (this.state.shapeParameter * this.state.endRadius) ** 2;
                    let x = (rho - (this.state.length / this.state.shapeParameter - y)** 2) ** 0.5 - (rho - (this.state.length / this.state.shapeParameter)**2) ** 0.5;
                    points.push([x, y]);
                    break;
                case "ellipsoid":
                    points.push([this.state.endRadius * (1 - (1 - y / this.state.length)**2) ** 0.5, y]);
                    break;
                case "power": 
                    points.push([this.state.endRadius * (y / this.state.length) ** this.state.shapeParameter, y]);
                    break;
                case "parabolic":
                    points.push([this.state.endRadius * y / this.state.length * (2 - this.state.shapeParameter * y / this.state.length) / (2 - this.state.shapeParameter), y]);
                    break;
                case "haack":
                    let theta = Math.acos(1 - 2 * y / this.state.length);
                    points.push([this.state.endRadius / Math.PI ** 0.5 * (theta - 0.5 * Math.sin(2 * theta) + this.state.shapeParameter * Math.sin(theta)**3) ** 0.5, y]);
                    break;
            }
        }

        this.points = points;

        return this.points;
    }

    _calcMass() {
        let totalMass = 0;

        this.points.map((point, idx) => {
            if (idx != this.points.length - 1) {
                let current = this.points[idx];
                let next = this.points[idx + 1];

                let l = next[1] - current[1];
                let R = next[0];
                let r = current[0];

                let theta = Math.atan2(l, R - r);
                let x = this.state.thickness / Math.sin(theta);
                let R_ = R - x;
                let r_ = r - x;

                let massInner = (R_**2 + R_ * r_ + r_**2) * 1/3 * l * Math.PI * this.state.density;
                let massOuter = (R**2 + R * r + r**2) * 1/3 * l * Math.PI * this.state.density;
                let mass = (this.state.filled || r_ < 0 || R_ < 0) ? massOuter : massOuter - massInner;

                totalMass += mass;
            }
        })

        this.mass = totalMass;
        return this.mass;
    }

    _calcCG() {
        let sumOuter = 0;
        let sumInner = 0;
        let massSumOuter = 0;
        let massSumInner = 0;

        this.points.map((point, idx) => {
            if (idx != this.points.length - 1) {
                let current = this.points[idx];
                let next = this.points[idx + 1];

                let R = current[0];
                let r = next[0];
                let h = next[1] - current[1];

                let comOuter = h * (R**2 + 2 * R * r + 3 * r**2) / (4 * (R**2 + R * r + r**2)) + current[1];
                let massOuter = (R**2 + R * r + r**2) * 1/3 * h * Math.PI * this.state.density;

                let theta = Math.atan2(h, R - r);
                let x = this.state.thickness / Math.sin(theta);
                let R_ = R - x;
                let r_ = r - x;

                let comInner = h * (R_**2 + 2 * R_ * r_ + 3 * r_**2) / (4 * (R_**2 + R_ * r_ + r_**2)) + current[1];
                let massInner = (R_**2 + R_ * r_ + r_**2) * 1/3 * h * Math.PI * this.state.density;
                
                sumOuter += comOuter * massOuter;
                sumInner += comInner * massInner;
                massSumOuter += massOuter;
                massSumInner += massInner;
            }
        })

        this.cg = this.state.filled ? sumOuter / massSumOuter : (sumOuter - sumInner) / (massSumOuter - massSumInner);

        return this.cg;
    }

    _calcCD() {
        
        let jointAngle = Math.atan2(this.points[this.points.length - 1][0] - this.points[this.points.length - 2][0], this.points[this.points.length - 1][1] - this.points[this.points.length - 2][1]);
        let bodyDrag = 0.8 * Math.sin(jointAngle) ** 2;

    }


    toggleFilled() {
        super.setState({filled: !this.state.filled});
    }

}

let nose = new Nosecone(2.5, 15, "haack", 0, 0.68, 0.2, 0, 0, 0, 0, 0);

console.log(nose.mass);
console.log(nose.cg);
console.log(nose.cp);

