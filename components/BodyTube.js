"use strict"
const AxialOuterComponent = require("./AxialOuterComponent.js");

class BodyTube extends AxialOuterComponent {

    constructor(state) {
        `
            state: radius, innerRadius, length, density, angle, aref, dref, v0, p, M
            
            this.state.motorMount = false;
        `
        super(state);
    }

    _calcPoints() {
        this.points = [[this.state.radius, 0], [this.state.radius, this.state.length]];
        return this.points;
    }

    _calcMass() {
        this.mass = (this.state.radius**2 - (this.state.innerRadius)**2) * Math.PI * this.state.length * this.state.density;
    }

    _calcCG() {
        this.cg = this.state.length / 2;

        return this.cg;
    } 

    _calcCD() {
        this.cd = 0;
        return this.cd;
    }
}

module.exports = BodyTube;

if (require.main === module) {
    let bt = new BodyTube( {
        radius: 2.5,
        innerRadius: 2.3,
        length: 20, 
        density: 0.68,
        angle: 0,
        aref: 10,
        dref: 10,
        v0: 0,
        p: 0, 
        M: 0
    })
    bt.setState({});
    console.log(bt.mass);
    console.log(bt.cg);
    console.log(bt.cp);
}
