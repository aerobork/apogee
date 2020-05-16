"use strict"
const Component = require("./Component.js");

class InnerComponent extends Component{

    constructor(state) {
        super();

        this.state = state;

        this.setState();
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
