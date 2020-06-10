
const OuterComponent = require("./OuterComponent.js");

class AxialOuterComponent extends OuterComponent {
    constructor(state) {
        `
            points -> [[float, float], ...]: a list of points centered around the x = 0 line describing the profile of the axially symmetric component
            density -> float: density of the material in g/cm^3
            this.state = {
                points: points,
                density: density,
                angle: angle,
                aref: aref,
                dref: dref,
                v0: v0,
                p: 0,
                M: M,
                overrideMass: false,
                overrideCG: false,
                subcomponents: []
            }
        `
        super(state);
        
        this.state = state;

        this.setState();
    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }

        this._calcPoints();

        this.startRadius = this.points[0][0];
        this.endRadius = this.points[this.points.length - 1][0];
        this.length = this.points[this.points.length - 1][1] - this.points[0][1];

        this._calcVolume();
        
        if (!this.state.overrideMass){
            this._calcMass();
        }

        this._calcPlanformArea();

        if (!this.state.overrideCG){
            this._calcCG();
        }

        this._calcCP();
        this._calcCL();

        this._calcNormal();
        this._calcLift();

    }

    search(name) {
        for (let i = 0; i < this.state.subcomponents.length; i++){
            if (this.state.subcomponents[i].name === name) {
                return this.state.subcomponents[i];
            }   
        }

        throw "No subcomponent has the given name.";
    }

    _calcPoints() {}

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

    getRadius(y) {

        for (let i = 0; i < this.points.length; i++){
            if (point[i][1] > y){
                let prev = this.points[i- 1];
                let height = point[1] - prev[1];

                let radius = prev[0] + (point[0] - prev[0]) * (x - prev[1]) / height;
                return radius;
            }
        }
       
        return 0;
    }

    _calcVolume() {
        // volume of truncated cone: (r^2 + Rr + R^2) * 1/3 h * pi
        this.volume = 0
        this.points.map((point, idx) => {
            if (idx != this.points.length - 1) {
                let current = this.points[idx];
                let next = this.points[idx + 1];


                this.volume += (current[0] * current[0] + current[0] * next[0] + next[0] * next[0]) * 1/3 * (next[1] - current[1]) * Math.PI;  
            }
        })

        return this.volume;
    }

    _calcPlanformArea() {
        this.planformArea = 0
        this.points.map((point, idx) => {
            if (idx != this.points.length - 1) {
                let current = this.points[idx];
                let next = this.points[idx + 1];

                this.planformArea += 0.5 * (2 * current[0] + 2 * next[0]) * (next[1] - current[1]);
            }
        })
        return this.planformArea;
    }

    _calcNormal() {
        this.Cn = 2 * Math.sin(this.state.angle) / (this.state.aref) * ((this.endRadius ** 2 - this.startRadius ** 2) * Math.PI);
        return this.Cn;
    }

    _calcLift() {
        //coefficient of lift = k * (A_plan) / A_ref sin^2(angle) 
        this.clift = 1.1 * this.planformArea / this.state.aref * Math.sin(this.state.angle)**2
        return this.clift;
    }

    _calcCL() {
        let sum = 0;
        
        this.points.map((point, idx) => {
            if (idx != this.points.length - 1) {
                let current = this.points[idx];
                let next = this.points[idx + 1];

                let R = current[0];
                let r = next[0];
                let h = next[1] - current[1];

                let centroid = h - h / 3 * (4 * r + 2 * R) / (2 * r + 2 * R);
                let area = 0.5 * (2 * r + 2 * R) * h

                sum += centroid * area;
            }
        })

        this.cl = sum / this.planformArea;
        return this.cl;
    }

    _calcCP() {
        //this.Cm = 2 * Math.sin(this.angle) / (this.aref * this.dref) * (this.length * this.endRadius ** 2 * Math.PI - this.volume);
        //this.cp = this.Cm / this.Cn * 

        let endArea = this.endRadius ** 2 * Math.PI;
        this.cp = (this.length * endArea - this.volume) / (endArea - this.startRadius ** 2 * Math.PI);

        return this.cp;
    }

    _calcMass() {
        this.mass = this.state.overrideMass ? this.mass : this.volume * this.state.density;

        return this.volume * this.state.density;
    }

    _calcCG() {
        let sum = 0;
        let massSum = 0;

        this.points.map((point, idx) => {
            if (idx != this.points.length - 1) {
                let current = this.points[idx];
                let next = this.points[idx + 1];

                let R = current[0];
                let r = next[0];
                let h = next[1] - current[1];

                let com = h * (R**2 + 2 * R * r + 3 * r**2) / (4 * (R**2 + R * r + r**2));
                let mass = (R**2 + R * r + r**2) * 1/3 * h * Math.PI * this.state.density;

                sum += com * mass;
                massSum += mass;
            }
        })

        this.cg = sum / massSum;

        return this.cg;
    }
    
    _calcSurfaceArea() {
        let area = 0;

        this.points.map((point, idx) => {
            if (idx != this.points.length - 1) {
                let current = this.points[idx];
                let next = this.points[idx + 1];

                let R = current[0];
                let r = next[0];
                let h = next[1] - current[1];

                area += Math.PI * (r + R) * ((R-r)**2 + h**2)**0.5
            }
        })

        this.surfaceArea = area;
        return this.surfaceArea;
    }
}

module.exports = AxialOuterComponent;




