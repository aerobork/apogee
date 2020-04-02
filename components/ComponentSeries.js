"use strict"
const Component = require("./Component.js");

class ComponentSeries extends Component {

    constructor(componentList) {
        this.componentList = componentList;
        
        this.state = {
            angle: angle,
            aref: aref,
            dref: dref,
            v0: v0,
            p: 0,
            overrideMass : false,
            overrideCG : false,
        }
    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 

            this.componentList.map((component, idx) => {
                component.setState(newState);
            }) 
        }

        this._calcMass();
        this._calcCG();
    }

    setMass(mass) {
        this.mass = mass;
        this.overrideMass = true;
    }

    _calcMass() {
        let massSum = 0;

        this.componentList.map((component, idx) => {
            massSum += component.mass;
        })

        this.mass = massSum;
        return this.mass;
    }

    setCG(cg) {
        this.CG = cg;
        this.overrideCG = true;
    }

    _calcCG() {
        let comSum = 0;

        this.componentList.map((component, idx) => {
            comSum += component.mass * component.cg;
        })

        this.cg = comSum / this._calcMass();
        return this.cg;
    }

    _calcCP() {
        let cpSum = 0;
        let cnSum = 0;
        this.componentList.map((component, idx) => {
            cpSum += component.Cn * component.cp;
            cnSum += component.Cn;
        })

        this.cp = cpSum / cnSum;
        return this.cp;
    }

}