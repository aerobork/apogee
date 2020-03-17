
const Component = require("./Component.js");

class AxialComponent extends Component {
    constructor (points, density, angle, aref, dref, v0, p) {
        `
            points -> [[float, float], ...]: a list of points centered around the x = 0 line describing the profile of the axially symmetric component
            density -> float: density of the material in g/cm^3
        `
        super();

        this.state = {
            points: points,
            density: density,
            angle: angle,
            aref: aref,
            dref: dref,
            v0: v0,
            p: 0
            
        }

        let startRadius = this.state.points[0][0];
        let endRadius = this.state.points[this.state.points.length - 1][0];
        let length = this.state.points[this.state.points.length - 1][1] - this.state.points[0][1];

    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }

        this._calcVolume();
        this._calcNormal();
        this._calcCP();
        this._calcMass();
    }

    getRadius(x) {

        for (let i = 0; i < this.state.points.length; i++){
            if (point[i][1] > x){
                let prev = this.state.points[i- 1];
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
        this.state.points.map((point, idx) => {
            if (idx != this.state.points.length - 1) {
                let current = this.state.points[idx];
                let next = this.state.points[idx + 1];


                this.volume += (current[0] * current[0] + current[0] * next[0] + next[0] * next[0]) * 1/3 * (next[1] - current[1]) * Math.PI;  
            }
        })

        return this.volume;
    }

    _calcNormal() {
        this.Cn = 2 * Math.sin(this.state.angle) / (this.state.aref) * ((this.endRadius ** 2 - this.startRadius ** 2) * Math.PI);
        return this.Cn;
    }

    getDrag() {
        //
    }

    getLift() {

    }

    _calcCP() {
        //this.Cm = 2 * Math.sin(this.angle) / (this.aref * this.dref) * (this.length * this.endRadius ** 2 * Math.PI - this.volume);
        //this.cp = this.Cm / this.Cn * 

        let endArea = this.endRadius ** 2 * Math.PI;
        this.cp = (this.length * endArea - this.volume) / (endArea - this.startRadius ** 2 * Math.PI);

        return this.cp;
    }

    _calcMass() {
        this.mass = this.volume * this.state.density;

        return this.mass;
    }

    _calcCG() {
        let sum = 0;

        this.state.points.map((point, idx) => {
            if (idx != this.state.points.length - 1) {
                let current = this.state.points[idx];
                let next = this.state.points[idx + 1];

                let R = current[0];
                let r = next[0];
                let h = next[1] - current[1];

                let com = h * (R * R + 2 * R * r + 3 * r * r) / (4 * (R * R + R * r + r * r));
                let mass = (R * R + R * r + r * r) * 1/3 * h * Math.PI * this.state.density;

                sum += com * mass;
            }
        })

        this.cg = sum / this.mass;

        return this.cg;
    }   
}

let ac = new AxialComponent([[1.5, 0], [2.5, 7.5]], 0.68);
console.log(ac._calcVolume());
console.log(ac._calcCP())
console.log(ac._calcMass())
console.log(ac._calcCG())