// TODO: something about finset????????????????????????????????????? boof

let apogee = require('./Imports.js');

let nosecone = new apogee.Nosecone({
    radius: 2.5,
    length: 15, 
    shapeType: "ogive",
    shapeParameter: 1.0,
    density: 0.68,
    thickness: 0.2,
    filled: false
})

let E6 = [[0.0, 0.0], [0.047, 10.866], [0.127, 11.693], [0.19, 11.9], [0.316, 11.622], [0.522, 10.593], [0.743, 9.287], [0.996, 7.842], [1.249, 6.19], [1.47, 5.296], [1.787, 4.747], [2.372, 4.471], [3.02, 4.403], [3.747, 4.264], [4.49, 4.403], [5.375, 4.333], [6.087, 4.264], [6.719, 4.264], [6.877, 4.196], [6.957, 3.783], [7.004, 2.614], [7.036, 1.513], [7.083, 0.55], [7.12, 0.0]];
let motor = new apogee.Motor({
    manufacturer: "Aerotech",
    designation: "E6", 
    type: "reloadable", 
    length: 7.0,
    diameter: 2.4,
    mass: 21.5,
    impulse: 37.5,
    profile: E6,
    position: 0,
    name: "motor"
})

let innertube = new apogee.InnerTube({
    radius: 1.0,
    innerRadius: 0.9,
    length: 7, 
    density: 0.68,
    position: 0,
    motorMount: true,
    name: "motorMount",
    subcomponents: [motor]
})

let bt = new apogee.BodyTube({
    radius: 2.5,
    innerRadius: 2.3, 
    length: 25,
    density: 0.68,
    subcomponents: [innertube],
    name: "bodyTube"
});

let finset = new apogee.FinSet({
    shapeType: "trapezoidal",
    numFins: 3,
    rootChord: 5, 
    tipChord: 5,
    height: 3, 
    sweepLength: 0,
    density: 0.68,
    thickness: 0.3,
    position: 0,
    name: "trapFins"
})

let rocket = new apogee.Rocket({
    subcomponents: [nosecone, bt, finset] 
})

let sim1 = new apogee.Simulation(rocket, {
    aref: 2.5**2 * Math.PI,
    dref: 40,
    p: 0.001225,    // g / cm^3, 1.225
    mach: 343
})

sim1.reset();

for (let i = 0; i < 1000; i++){
    sim1.step(0.02);
    if (i % 10 == 0) {
        console.log(`${sim1.simulation.altitude} ${sim1.simulation.velocity} ${sim1.simulation.acceleration}`)
    }
}

