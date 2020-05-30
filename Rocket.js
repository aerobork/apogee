"use strict"

const FinSet = require("./components/FinSet.js");
const OuterComponent = require('./components/OuterComponent.js');
const ComponentSeries = require("./components/ComponentSeries.js");
const InnerComponent = require("./components/InnerComponent.js");
const BodyTube = require("./components/BodyTube.js");
const InnerTube = require('./components/InnerTube.js');

console.log(FinSet);

class Rocket extends ComponentSeries{
    constructor(state)
    {
        super(state);
        // we only have one finset bitch
        // contact the developers if you want more
        // >:(

        // TODO: Finish this whole mf project
        // TODO: Implement DFS/BFS for searching for FinSet
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

    remove(names) {
        
        names.map(name => {
            let location = name + '.';
            let parentComponent = this;

            while (name.indexOf('.') >= 0){
                let splitLocation = name.indexOf(".");        // . delimit
                let name = name.slice(0, splitLocation);
                console.log(name + " " + splitLocation + " " + name);

                parentComponent = parentComponent.search(name);

                name = name.slice(splitLocation + 1); 
            }
            
            for (let i = 0; i < parentComponent.state.subcomponents.length; i++){
                if (parentComponent.state.subcomponents[i].state.name === name) {
                    parentComponent.state.subcomponents.splice(i,1);
                    break;
                }   
            }
        })
    }

    setMass(mass) {
        this.mass = mass;
        this.overrideMass = true;
    }

    setCG(cg) {
        this.CG = cg;
        this.overrideCG = true;
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

    _calcMass() {
        let mass = 0;
        let componentQueue = [];

        for (let i = 0; i < this.state.subcomponents.length; i++){
            componentQueue.push(this.state.subcomponents[i]);
        }

        while (componentQueue.length > 0){
            // pop a component and add its mass 
            let pop = componentQueue[0];
            componentQueue = componentQueue.slice(1);
            mass += pop.mass;

            // add all of pop's children to the queue
            for (let i = 0; i < pop.state.subcomponents.length; i++){
                componentQueue.push(pop.state.subcomponents[i]);
            }
        }

        this.mass = mass;
        return this.mass;
    }

    _calcCG () {
        let mass = 0;
        let cg = 0;
        let componentQueue = [];

        let tipPosition = 0;

        for (let i = 0; i < this.state.subcomponents.length; i++){
            componentQueue.push([this.state.subcomponents[i], tipPosition]);
            tipPosition += this.state.subcomponents[i].length;
        }

        while (componentQueue.length > 0){
            // pop a component and add its mass 
            let pop = componentQueue[componentQueue.length - 1];
            let component = pop[0];
            let position = pop[1];

            componentQueue = componentQueue.slice(0, -1);
            
            cg += (position + component.cg) * component.mass;
            mass += component.mass;
            
            console.log(component.state.name);
            console.log("cg " + component.cg);
            console.log("bruh" + position + " " + component.mass);
            console.log("--------------\n")

            // add all of pop's children to the queue
            for (let i = 0; i < component.state.subcomponents.length; i++){
                componentQueue.push([component.state.subcomponents[i], component.state.subcomponents[i].state.position + position]);
            }
        }
        
        this.cg = cg / mass;
        return this.cg; 
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
        let R = this.state.v0 * this.length / (1.48 * 10**-5); // Reynolds number
        let Cfc = (1.50 * Math.log(R) - 5.6)**-2 * (1-0.1 * this.state.M**2); // compressibility-corrected skin friction coefficient
        let skinFrictionDrag = Cfc * ((1 + 1 / 2 / this.finenessRatio) * this.surfaceArea + 
                               (1 + 2 * this.finset.thickness / this.finset.maclength) * this.finset.surfaceArea) / this.state.aref;
        
        let cd = skinFrictionDrag;

        this.state.subcomponents.map((component, idx) => {
            cd += component.cd;
        })

        this.cd = cd;
        return this.cd;

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
    length: 9, 
    density: 0.68,
    position: 0,
    motorMount: false,
    name: "bronticulosis"
})


let finset = new FinSet({
         shapeType: "elliptical",
        numFins: 3,
        rootChord: 10, 
        tipChord: 5,
        height: 5, 
        sweepLength: 5,
        density: 0.68,
        thickness: 0.3,
        position: 5
        , name: "finass"
})
rocket.add([["", bt]]);
rocket.add([["bron", innertube]])
rocket.add([['bron', finset]])


//rocket.remove(["bron"]);

console.log(rocket._calcMass())
console.log(rocket._calcCG())