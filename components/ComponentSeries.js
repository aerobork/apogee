"use strict"
const Component = require("./Component.js");
const OuterComponent = require('./OuterComponent.js');

class ComponentSeries extends Component {

    constructor(state) {
        `
            this.state = {
                angle: angle,
                aref: aref,
                dref: dref,
                v0: v0,
                p: 0,
                overrideMass : false,
                overrideCG : false,
                subcomponents: []
            }
        `

        super(state);
        this.setState();
    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 

            this.state.subcomponents.map((component, idx) => {
                component.setState(newState);
            }) 
        }

        this._calcMass();
        this._calcCG();
        this._calcCP();
    }

    setMass(mass) {
        this.mass = mass;
        this.overrideMass = true;
    }

    /*
    _calcMass() {
        let massSum = 0;

        this.state.subcomponents.map((component, idx) => {
            massSum += component.mass;
        })

        this.mass = massSum;
        return this.mass;
    }*/

    setCG(cg) {
        this.CG = cg;
        this.overrideCG = true;
    }

    /*_calcCG() {
        let comSum = 0;

        this.state.subcomponents.map((component, idx) => {
            comSum += component.mass * component.cg;
        })

        this.cg = comSum / this._calcMass();
        return this.cg;
    }

    _calcCP() {
        let cpSum = 0;
        let cnSum = 0;
        let length = 0;

        this.state.subcomponents.map((component, idx) => {
            if (component instanceof OuterComponent){
                cpSum += component.Cn * (component.cp + length);
                cnSum += component.Cn;

                length += component.length;
            }
        })

        this.cp = cpSum / cnSum;
        return this.cp;
    }

    _calcSurfaceArea() {
        let area = 0;
        
        this.state.subcomponents.map((component, idx) => {
            if (component instanceof OuterComponent) {
                area += component.surfaceArea;
            }
        })

        this.surfaceArea = area;
        return this.surfaceArea;
    }*/

}

module.exports = ComponentSeries;
