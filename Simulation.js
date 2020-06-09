"use strict"

const Rocket = require("./Rocket.js");
const Quaternion = require("quaternion");

class Simulation {

    constructor(rocket, state) {
        `
            all simulation poarameter :))))),
            aref, dref, p
        `
        this.state = state;
        this.rocket = rocket;

        this.reset();
    }

    reset() {
        this.simulation = {
            orientation: new Quaternion(1, 0, 0, 0),                // rad + no dimension + imag + real + fake + maybe + banned + [REDACTED] + alien
            altitude: 0,                                            // m
            velocity: 0,                                            // m/s
            acceleration: 0,                                        // m/s^2
            time: 0                                                 // s
        }
    }

    initialize() {
        // TODO: calculate rocket mass
    }

    step(dt) {
        // TODO: runge-kutta 4 that mf
        let t = this.simulation.time;
        let thrustForce = this.rocket.motor.interpolateProfile(t);
   
        let norm = 0.5 * this.state.p * this.simulation.velocity ** 2 * this.state.aref;

        let dragForce = this.rocket.cd * norm;
        let axialDragForce = dragForce * Math.cos(this.state.angle); 

        let normalForce = this.rocket.cn * norm;

        let gravityForce = 9.81 * this.rocket.mass;
        let axialGravityForce = gravityForce * Math.cos(this.state.angle);
        let normalGravityForce = gravityForce * Math.sin(this.state.angle);

        let force = axialDragForce + thrustForce + axialGravityForce;

        this.simulation.acceleration = force / this.rocket.mass;
        this.simulation.velocity += this.simulation.acceleration * dt;
        this.simulation.altitude += this.simulation.velocity * dt;

        this.simulation.time += dt;
    }

    _setState(newState) {
        for (let key in newState) {
            this.state[key] = newState[key]; 
        }
    }

    

}