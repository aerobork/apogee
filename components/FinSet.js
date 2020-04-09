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
                for (let y = 0; y < this.state.rootChord; y += 0.2) {
                    let x = ((1 - (y - b)**2 / b**2) / a**2)**0.5;

                    points.push([x,-1 * y]);
                }
                points.push([0, -1 * this.state.rootChord]);
                console.log(points);
                break;
            case "freeform": 
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
        this._calcArea();
        this._calcCP();

    }

    setMass(mass) {
        this.mass = mass;
        this.overrideMass = true;
    }

    _calcMass() {
        this.mass = this.area * this.state.density;
        return this.mass;
    }

    setCG(cg) {
        this.CG = cg;
        this.overrideCG = true;
    }

    _calcCG() { // TODO: check this entire thing 
        let x = 0;
        let mass = 0;
        let com = 0;

        // loop
        while (true){
            let edges = utils.finIntersect(x, this.points, 0);
            if (edges[0].length == 0 || edges[1].length == 0) {
                break;
            }

            let b1 = edges[0][0][1] - edges[1][1][1]; 
            let tx = edges[0][1][0];
            let bx = edges[1][0][0];

            
            let divX = Math.min(tx, bx);
            let h = divX - x;

            let b2 = utils.intersect(divX, edges[0]) - utils.intersect(divX, edges[1]);
            
            com += (h * (bx**2 + 2 * bx * tx + 3 * tx**2) / (4 * (bx**2 + bx * tx + tx**2)));
            mass += (b1 + b2) * h * 0.5 * this.state.density;

            x = divX;

            if (utils.equalTo(b2, 0)){
                break;
            }
        }

        this.cg = com / mass;
        return this.cg;
    }

    _calcCP() { 
        let x = 0;
        let xmac = 0;
        let maclength = 0;

        // loop
        while (true){
            let edges = utils.finIntersect(x, this.points, 0);

            if (edges[0].length == 0 || edges[1].length == 0) {
                break;
            }

            let b1 = utils.intersect(x, edges[0]) - utils.intersect(x, edges[1]); 
            let tx = edges[0][1][0];
            let bx = edges[1][0][0];
            
            let divX = Math.min(tx, bx);
            let h = divX - x;

            let b2 = utils.intersect(divX, edges[0]) - utils.intersect(divX, edges[1]);
            
            console.log(edges);
            console.log("b1: " + b1);
            console.log("b2: " + b2);

            let y = utils.intersect(x, edges[0]);
            let m1 = (edges[0][0][1] - edges[0][1][1]) / (edges[0][0][0] - edges[0][1][0]);
            let m2 = (edges[1][1][1] - edges[1][0][1]) / (edges[1][1][0] - edges[1][0][0]);
            let l = b1;
            console.log("m1: " + m1);
            console.log("m2: " + m2);

            let xmacB = (m1 - m2) * y / 2 * h**2 + m1 * l * h**2 / 2 + (m1 - m2) * m1 * h**3 / 3 + y * l * h;
            //let xmacA = (m1 - m2) * y / 2 * x**2 + m1 * l * x**2 / 2 + (m1 - m2) * m1 * x**3 / 3 + y * l * x;
            xmac += xmacB;
            console.log("xmac: " + xmac);

            let maclengthB = l**2 * h + l * (m1 - m2) * h**2 + (m1 - m2)**2 * h**3 / 3;
            //let maclengthA = l**2 * x + l * (m1 - m2) * x**2 + (m1 - m2)**2 * x**3 / 3;
            maclength += maclengthB;
            console.log("mac length: " + maclength);

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
        xmac /= this.area;
        maclength /= this.area;

        console.log("xmac: " + xmac);
        console.log("mac length: " + maclength);
        this.cp = xmac - maclength / 4;
        return this.cp;
    
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

            
            let divX = Math.min(tx, bx);
            let h = divX - x;

            let b2 = utils.intersect(divX, edges[0]) - utils.intersect(divX, edges[1]);

            area += (b1 + b2) * h * 0.5;
            x = divX;

            if (utils.equalTo(b2, 0)){
                break;
            }
        }

        this.area = area;
        return this.area;
    }

}

//let fin = new FinSet("freeform", 3, 0, 0, 5, 5, 5, 5, 5, 5, 5, [[0, 0], [5, -2.5], [5, -7.5], [0, -5]], 0.68, .3, 0, 0, 0, 0, 0);
//let fin = new FinSet("freeform", 3, 0, 0, 5, 5, 5, 5, 5, 5, 5, [[0, 0], [5, -2.5], [7.5, -5], [5, -7.5], [0, -5]], 0.68, .3, 0, 0, 0, 0, 0);
//let fin = new FinSet("freeform", 3, 0, 0, 5, 5, 5, 5, 5, 5, 5, [[0, 0], [2.5, -2.5], [0,-5]], 0.68, .3, 0, 0, 0, 0, 0);
let fin = new FinSet("elliptical", 3, 0, 0, 5, 5, 5, 5, 0, 0, 0, [], 0.68, 0.3, 0, 0, 0, 0, 0);

//fin._setState({});
console.log("points: " + fin.points);
console.log("area: " + fin.area);
console.log("cp: " + fin.cp);