"use strict"

const Rocket = require("./Rocket.js");
const Quaternion = require("quaternion");

class Simulation {

    constructor(rocket, state) {
        `
            all simulation poarameter :))))),
            aref, dref, p, mach
        `
        this.state = state;
        this.rocket = rocket;

        this.reset();
    }

    reset() {
        // velocity is axial velocity

        this.simulation = {
            orientation: new Quaternion(1, 0, 0, 0),                // rad + no dimension + imag + real + fake + maybe + banned + [REDACTED] + alien
            altitude: 0,                                            // m
            velocity: 0,                                            // m/s
            acceleration: 0,                                        // m/s^2
            position: [0, 0, 0],                                    // m
            time: 0,                                                // s
            v0: 0,
            M: 0,
            angle: 0,
        }
    }

    initialize() {
        // TODO: calculate rocket mass
    }

    step(dt) {
        // TODO: runge-kutta 4 that mf
        let t = this.simulation.time;
        let thrustForce = this.rocket.motors[0].interpolateProfile(t); // currently only uses the first motor
   
        let norm = 0.5 * this.state.p * this.simulation.velocity ** 2 * this.state.aref;

        let dragForce = this.rocket.cd * norm;
        let axialDragForce = dragForce * Math.cos(this.state.angle); 

        let normalForce = this.rocket.cn * norm;

        let gravityForce = 9.81 * this.rocket.mass;
        let axialGravityForce = gravityForce * Math.cos(this.state.angle);
        let normalGravityForce = gravityForce * Math.sin(this.state.angle);

        let force = axialDragForce + thrustForce + axialGravityForce;

        console.log(`${axialDragForce}, ${thrustForce}, ${axialGravityForce}`)

        // none of this is right
        this.simulation.acceleration = force / this.rocket.mass;
        this.simulation.velocity += this.simulation.acceleration * dt;
        this.simulation.altitude += this.simulation.velocity * dt;

        this.simulation.time += dt;

        this.simulation.M = this.simulation.velocity / this.state.mach;
        this.simulation.v0 = this.simulation.velocity;

        this.rocket.state.subcomponents.map((component) => {
            component.setState({
                v0: this.simulation.v0,
                M: this.simulation.M,
                p: this.state.p,
                aref: this.state.aref,
                dref: this.state.dref,
                angle: this.simulation.angle,
            })
        })
    }

    setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }
    }
}

module.exports = Simulation;