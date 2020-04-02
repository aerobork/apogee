"use strict"

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

        this.freeFormPoints = points; // how are we dealing with this 

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
                    x = ((1 - (y - b)**2 / b**2) / a**2)**0.5; // check this equation again
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

    }

    
}