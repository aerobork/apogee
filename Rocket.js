"use strict"

const FinSet = require("./components/FinSet.js");
const OuterComponent = require('./components/OuterComponent.js');
const ComponentSeries = require("./components/ComponentSeries.js");
const InnerComponent = require("./components/InnerComponent.js");
const BodyTube = require("./components/BodyTube.js");
const InnerTube = require('./components/InnerTube.js');

class Rocket extends ComponentSeries{
    constructor(state)
    {
        super(state);
        
        for (let i = 0; i < this.state.subcomponents.length; i++){
            if (this.state.subcomponents[i] instanceof FinSet) {
                this.state.finset = this.state.subcomponents[i];
                break;
            }
        }
    }

    add(subcomponents) {
        `
        subcomponents -> [[location, component], ...]
        `

        console.log(subcomponents);
        subcomponents.map((info, idx) => {
            let location = info[0] + '.';
            let component = info[1];
            let parentComponent = this;

            while (location.indexOf('.') >= 0){
                let splitLocation = location.indexOf(".");        // . delimit
                let name = location.slice(0, splitLocation);
                console.log(name + " " + splitLocation + " " + location);

                parentComponent = parentComponent.search(name);

                location = location.slice(splitLocation + 1); 
            }
            
            parentComponent.state.subcomponents.push(component);
            
        })
    }

    search(name) {
        if (name === ""){
            return this; 
        }

        for (let i = 0; i < this.state.subcomponents.length; i++){
            if (this.state.subcomponents[i].state.name === name) {
                return this.state.subcomponents[i];
            }   
        }

        throw "bruh this component doesn't exist u dong";
    }

    remove(subcomponents) {

    }

    remove(componentName) {
        let removeidx = -1;
        for (let idx = 0; idx < this.state.subcomponents.length; idx++) {
            if (this.state.subcomponents[idx].name === componentName) {
                removeidx = idx;
                break;
            }
        }
        
        this.state.subcomponents.map((subcomponent, idx) => {
            if (idx != this.points.length - 1) {
                
            }
        })
        this.state.subcomponents.remove()
    }

    _calcFinenessRatio() {
        let maxDiameter = 0;
        let totalLength = 0;
        this.state.subcomponents.map((component, idx) => {
            if (!component instanceof InnerComponent && !component instanceof FinSet) {
                component.points.map((point, idx) => {
                    if (idx != component.points.length - 1) {
                        if (component.points[idx][0] > maxDiameter) {
                            maxDiameter = component.points[idx][0];
                        }
                        totalLength += component.length;
                    }
                })
            }
        })
        this.length = totalLength;
        this.finenessRatio = totalLength / maxDiameter;
        return this.finenessRatio;
    }

    _calcDrag() {
        let R = this.state.v0 * this.length / (1.48 * 10**-5);
        let Cfc = (1.50 * Math.log(R) - 5.6)**-2 * (1-0.1 * this.state.M**2);
        let skinFrictionDrag = Cfc * ((1 + 1 / 2 / this.finenessRatio) * this.surfaceArea + 
                               (1 + 2 * this.fins.thickness / this.fins.maclength) * this.fins.surfaceArea) / this.state.aref;
        
        let cd = 0;
        this.state.subcomponents.map((component, idx) => {
            cd += component.cd;
        })


    }


}

/*
    skin friction drag = C_fc * ((1 + 1 / 2 / f_B) * A_body + (1 + 2 * t / c) * A_fins) / A_ref
    body pressure drag
        nose cone pressure drag = 0.8 * sin(phi)**2, phi is angle between vertical and nosecone
        shoulder (transition) pressure drag: same as nose cone
        boattail pressure drag: eq 3.88, pg 49
    fin pressure drag: dependent on rectangular, rounded leading/trailing edges, airfoil 
        Aref = full frontal area
        rounded leading edge presure drag: eq 3.89, pg 49
        rectangular: eq 3.90, pg 50


*/

let bt = new BodyTube({
    radius: 5,
    innerRadius: 4.5, 
    length: 10,
    density: 0.68,
    subcomponents: [],
    name: "bron"
});

let rocket = new Rocket({
    subcomponents: [] 
})

let innertube = new InnerTube({
    radius: 4.5,
    innerRadius: 4,
    position: 0,
    motorMount: false,
    name: "bronticulosis"
})

rocket.add([["", bt]]);
console.log(rocket.state);
rocket.add([["bron", innertube]])

console.log(rocket.state);
console.log(rocket.state.subcomponents[0].state)