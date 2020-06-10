"use strict"

const utils = require('../utils.js');
const OuterComponent = require('./OuterComponent.js')

 class FinSet extends OuterComponent{
    constructor(state) {
        `shapeType, numFins, finRotation, finCant, rootChord, tipChord, height, 
        sweepLength, sweepAngle, crossSection, position, freeFormPoints, density, thickness, angle, aref, dref, v0, p`

        super(state);

        this.state = state
        this.setState();
    }

    _calcPoints() {
        let points = [];

        switch(this.state.shapeType) {
            case "trapezoidal":
                points = [[0,0], [this.state.height, this.state.sweepLength], [this.state.height, this.state.sweepLength + this.state.tipChord], 
                          [0, this.state.rootChord]];
                break;
            case "elliptical":
                let a = this.state.height;
                let b = this.state.rootChord / 2;
                for (let y = 0; y < this.state.rootChord; y += 0.1) {
                    let x = ((1 - (y - b)**2 / b**2) * a**2)**0.5;

                   // let x = ((1 - (y - b) ** 2 / b ** 2) / a ** 2) ** 0.5

                    points.push([x,y]);
                }
                points.push([0, this.state.rootChord]);
                break;
            case "freeform": 
                points = this.state.freeFormPoints;
                break;
        }

        this.points = points;
        return this.points;
    }

    setState(newState) {
        for (let key in newState) {
           this.state[key] = newState[key];
        }

        this._calcPoints();
        // epic joke!
        this.length = this.points[0][1] - this.points[this.points.length - 1][1]; // candace told a real knee slapper while i wrote this line
        
        this._calcArea();
        this._calcCP();
        this._calcCG();
        this._calcMass();
        this._calcSurfaceArea();
        this._calcCD();

    }

    setMass(mass) {
        this.mass = mass;
        this.overrideMass = true;
    }

    _calcMass() {
        this.mass = this.area * this.state.thickness * this.state.numFins * this.state.density;
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

            // b1 is the length of side of the strip closest to the body tube
            // b2 is the length of the other side bruh
            // tx is the x coordinate of the point furthest from the body tube on the top edge of the strip
            // bx is the same thing but on the bottom edge of the strip
            // divX is where we form the top edge of the trapezoidal strip, and is formed by taking the minimum of tx and bx
            // h is the height of the trapezoidal strip
            // p1-4 are the points of the trapezoidal strip
            // 

            let tx = edges[0][1][0];
            let bx = edges[1][0][0];
            
            let divX = Math.min(tx, bx);
            let b1 = edges[1][1][1] - edges[0][0][1]; 
            let b2 = utils.intersect(divX, edges[1]) - utils.intersect(divX, edges[0]);
            let h = divX - x;


            let p1 = edges[0][0];
            let p2 = [divX, utils.intersect(divX, edges[0])];
            let p3 = [divX, utils.intersect(divX, edges[1])];
            let p4 = edges[1][1];
            let points = [p1, p2, p3, p4, p1]; 
            
         
            // b1 is always going to be the longer side
            if (b1 < b2){
                let t = b1;
                b1 = b2;
                b2 = t;
            }

            // candace did not like the name massOfThing
            // see: en.wikipedia.org/wiki/Centroid#Of_a_polygon
            let A = 0;
            for (let i = 0; i < points.length - 1; i++){
                A += 0.5 * (points[i][0] * points[i + 1][1] - points[i + 1][0] * points[i][1]);
            }

            let cy = 0;
            for (let i = 0; i < points.length - 1;i ++){
                cy += (points[i][1] + points[i + 1][1]) * (points[i][0] * points[i + 1][1] - points[i + 1][0] * points[i][1]); 
            }            
            cy *= 1/(6 * A);
            
            /* ok so basicalllllly
            // we split the trapezoid into two triangles and a rectangle and take the weighted average of their CGs.
            // dy is the length of the top edge;
            // theta 
            let dy = ((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2) ** 0.5;
            let theta = Math.asin(h / dy);
            let l = b2; 
            let x1 = h / Math.tan(theta);
            let x2 = b1 - x1 - l;
            let cg_ = 2/3 * x1 * x1 * h / 2 + (x1 + l/2) * h * l + (x1 + l + 1/3 * x2) * (x2 * h) / 2;
            cg_ /= (x1 * h / 2 + h * l + x2 * h / 2);*/
            
            //cg_ = 0.5 * ((b1 + b2) / 2 + dy * Math.cos(theta));

            //console.log(cy + " boof " + cg_);


            let massStrip = (b1 + b2) * h * 0.5 * this.state.thickness * this.state.density;
            //com += (h * (b1**2 + b1 * b2 + b2**2) / (3 * (b1 + b2))) * massStrip;
            com += cy * massStrip;
            mass += massStrip; 

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
            
            // console.log(edges);
            // console.log("b1: " + b1);
            // console.log("b2: " + b2);

            let y = utils.intersect(x, edges[0]);
            let m1 = (edges[0][0][1] - edges[0][1][1]) / (edges[0][0][0] - edges[0][1][0]);
            let m2 = (edges[1][1][1] - edges[1][0][1]) / (edges[1][1][0] - edges[1][0][0]);
            let l = b1;
            // console.log("m1: " + m1);
            // console.log("m2: " + m2);

            let xmacB = (m1 - m2) * y / 2 * h**2 + m1 * l * h**2 / 2 + (m1 - m2) * m1 * h**3 / 3 + y * l * h;
            //let xmacA = (m1 - m2) * y / 2 * x**2 + m1 * l * x**2 / 2 + (m1 - m2) * m1 * x**3 / 3 + y * l * x;
            xmac += xmacB;
            // console.log("xmac: " + xmac);

            let maclengthB = l**2 * h + l * (m1 - m2) * h**2 + (m1 - m2)**2 * h**3 / 3;
            //let maclengthA = l**2 * x + l * (m1 - m2) * x**2 + (m1 - m2)**2 * x**3 / 3;
            maclength += maclengthB;
            // console.log("mac length: " + maclength);

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

        this.cp = xmac - maclength / 4;
        this.maclength = maclength;
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
            let h = -Math.abs(divX - x);

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

    _calcCD() {
        //console.log("finset M: " + this.state.M);
        let finDragLE = 0;
        let finDragTE = 0;

        switch(this.state.crossSection) {
            case "rounded":
                finDragLE = (1 - this.state.M**2)**(-0.417) - 1;
                finDragTE = (0.12 + 0.13 * this.state.M**2) / 2;
                break;
            case "square":
                finDragLE = 0.85 * (1 + this.state.M**2 / 4 + this.state.M**4 / 40);
                finDragTE = 0.12 + 0.13 * this.state.M**2;
                break;
            case "airfoil":
                finDragLE = (1 - this.state.M**2)**(-0.417) - 1;
                break;
        }

        this.cd = finDragLE + finDragTE;
        return this.cd;
    }

    _calcSurfaceArea() {
        let area = 2 * this.area;

        this.points.map((point, idx) => {
            if (idx != this.points.length - 1) {
                let current = this.points[idx];
                let next = this.points[idx + 1];

                let edgeLength = ((current[0] - next[0])**2 + (current[1] - next[1])**2)**0.5;
                area += edgeLength * this.state.thickness;
            }
        })

        this.surfaceArea = area * this.state.numFins;
        return this.surfaceArea;
    }


}

module.exports = FinSet;

//let fin = new FinSet("freeform", 3, 0, 0, 5, 5, 5, 5, 5, 5, 5, [[0, 0], [5, -2.5], [5, -7.5], [0, -5]], 0.68, .3, 0, 0, 0, 0, 0);
//let fin = new FinSet("freeform", 3, 0, 0, 5, 5, 5, 5, 5, 5, 5, [[0, 0], [5, -2.5], [7.5, -5], [5, -7.5], [0, -5]], 0.68, .3, 0, 0, 0, 0, 0);
//let fin = new FinSet("freeform", 3, 0, 0, 5, 5, 5, 5, 5, 5, 5, [[0, 0], [2.5, -2.5], [0,-5]], 0.68, .3, 0, 0, 0, 0, 0);
//let fin = new FinSet("elliptical", 3, 0, 0, 10, 5, 5, 5, 0, 0, 0, [], 0.68, 0.3, 0, 0, 0, 0, 0);

if (require.main === module){

    `shapeType, numFins, finRotation, finCant, rootChord, tipChord, height, 
    sweepLength, sweepAngle, crossSection, position, freeFormPoints, density, thickness, angle, aref, dref, v0, p`

    let fin = new FinSet({
        shapeType: "elliptical",
        numFins: 3,
        rootChord: 10, 
        tipChord: 5,
        height: 5, 
        sweepLength: 5,
        density: 0.68,
        thickness: 0.3
    })


    //fin.setState({});
    console.log("points: " + fin.points);
    console.log("area: " + fin.area);
    console.log("cp: " + fin.cp);
}