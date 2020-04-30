"use strict"

const ComponentSeries = require("./components/ComponentSeries.js");
const InnerComponent = require("./components/InnerComponent.js");
const FinSet = require("./components/FinSet.js");

class Rocket extends ComponentSeries{
    constructor(componentList)
    {
        super([componentList]);

        this.componentList.map((component, idx) => {
            if (idx != this.points.length - 1) {
                
            }
        })
        
    }



    add(componentList) {

    }

    remove(componentList) {

    }

    add(component, location) {
        if (location) {
            for (let idx = 0; idx < this.componentList.length; idx++) {
                if (this.componentList[idx].name === location) {
                    
                    break;
                }
            }
        }
        this.subcomponents.push(subcomponent);
    }

    remove(componentName) {
        let removeidx = -1;
        for (let idx = 0; idx < this.subcomponents.length; idx++) {
            if (this.subcomponents[idx].name === componentName) {
                removeidx = idx;
                break;
            }
        }
        
        this.subcomponents.map((subcomponent, idx) => {
            if (idx != this.points.length - 1) {
                
            }
        })
        this.subcomponents.remove()
    }

    _calcFinenessRatio() {
        let maxDiameter = 0;
        let totalLength = 0;
        this.componentList.map((component, idx) => {
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
        this.componentList.map((component, idx) => {
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