"use strict"
const Component = require("./Component.js");

class InnerComponent extends Component{

    constructor(points, density, position) {
        super();

        this.state = {
            points: points,
            density: density,
            position: position,
            overrideMass: false,
            overrideCG: false 
        }
    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }

        this._calcPoints();
    }

    _calcPoints() {
        this.points = this.state.points;
        return this.points;
    }

    setMass(mass) {
        this.mass = mass;
        
        this.setState({
            overrideMass: true
        })
        
    }

    setCG(cg) {
        this.cg = cg;

        this.setState({
            overrideCG: true
        })
    }


}

module.exports = InnerComponent;