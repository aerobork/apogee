"use strict"

const utils = require('../utils.js');

class FinSet {
    constructor(shapeType, numFins, finRotation, finCant, rootChord, tipChord, height, 
                sweepLength, sweepAngle, crossSection, position, points, density, thickness, angle, aref, dref, v0, p) {
        
        this.state = {
            shapeType: shapeType,
            numFins: numFins,
            finRotation: finRotation,
            finCant: finCant,
            rootChord: rootChord, 
            tipChord: tipChord, 
            height: height,
            sweepLength: sweepLength, 
            sweepAngle: sweepAngle, 
            crossSection: crossSection, 
            position: position,
            density: density,
            thickness: thickness,
            angle: angle,
            aref: aref,
            dref: dref,
            v0: v0,
            p: 0,
            overrideMass : false,
            overrideCG : false,
        }

        this.freeFormPoints = points; 

        this._setState();
    }

    _calcPoints() {
        let points = [];

        switch(this.state.shapeType) {
            case "trapezoid":
                points = [[0,0], [this.state.height, this.state.sweepLength], [this.state.height, this.state.sweepLength + this.state.tipChord], 
                          [0, this.state.rootChord]];
                break;
            case "elliptical":
                let a = this.state.height;
                let b = this.state.rootChord / 2;
                for (let y = 0; y < this.state.length; y += 0.1) {
                    x = ((1 - (y - b)**2 / b**2) / a**2)**0.5; 
                    points.push([x,y]);
                }
                break;
            case "free-form": 
                points = this.freeFormPoints;
                break;
        }

        this.points = points;
        return this.points;
    }

    _setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key];
        }

        this._calcPoints();

    }

    setMass(mass) {
        this.mass = mass;
        this.overrideMass = true;
    }

    _calcMass() {

    }

    setCG(cg) {
        this.CG = cg;
        this.overrideCG = true;
    }

    _calcCG() {

    }

    _calcCP() { 
        let x = 0;
        let area = 0;

        // loop
        while (true){
            let edges = utils.finIntersect(x, this.points, 0);

            if (edges[0].length == 0 || edges[1].length == 0) {
                break;
            }

            let b1 = edges[0][0][1] - edges[1][1][1]; 
            let tx = edges[0][1][0];
            let bx = edges[1][0][0];
            
            let divX = Math.min([tx, bx]);
            let h = divX - x;

            let b2 = utils.intersect(divX, edges[0]) - utils.intersect(divX, edges[1]);

            // b1, b2, h
            // int(Xle * C dy);
            //Xle = y + m * x
            //C = length + (m1 + m2) * x


            /*integral 0->s(
                y * l + 
                (m1 + m2) * y * x +
                m1 * x * l +
                (m1 + m2) * m1 * x^2, dx
            )*/


            x = divX;

            if (utils.equalTo(b2, 0)){
                break;
            }
        }
    }
    }

    _calcArea() {
        let x = 0;
        let area = 0;

        // loop
        while (true){
            let edges = utils.finIntersect(x, this.points, 0);

            if (edges[0].length == 0 || edges[1].length == 0) {
                break;
            }

            let b1 = edges[0][0][1] - edges[1][1][1]; 
            let tx = edges[0][1][0];
            let bx = edges[1][0][0];
            
            let divX = Math.min([tx, bx]);
            let h = divX - x;

            let b2 = utils.intersect(divX, edges[0]) - utils.intersect(divX, edges[1]);

            area += (b1 + b2) * h * 0.5;
            x = divX;

            if (utils.equalTo(b2, 0)){
                break;
            }
        }
    }

}