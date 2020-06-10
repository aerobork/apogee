"use strict"

const Component = require('./Component.js');

class Motor extends Component {
    constructor(state) {
        
        `
            manufacturer, designation, type, length, diameter, mass, impulse, profile, position, name
        `

        super(state);
    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }

        this._calcPoints();
        this._calcCG();
    }

    _calcCG() {
        this.cg = this.state.length / 2;
        return this.cg;
    }

    _calcPoints() {
        this.points = [[this.state.diameter / 2, 0], [this.state.diameter / 2, this.state.length]];
        return this.points;
    }

    _calcMass() {
        this.mass = this.state.mass;
        return this.mass;
    }

    interpolateProfile(t) {
        for (let i = 0; i < this.state.profile.length - 1; i++) {
            if (this.state.profile[i][0] <= t && this.state.profile[i + 1][0] > t) {
                let slope = (this.state.profile[i][1] - this.state.profile[i + 1][1]) / (this.state.profile[i][0] - this.state.profile[i + 1][0]);
                return this.state.profile[i][1] + slope * (t - this.state.profile[i][0]);
            }
        }
    }
    
}

module.exports = Motor;