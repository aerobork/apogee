"use strict"

exports = {}

exports.finIntersect = function finIntersect(x, points, coord) {
    let topEdge = [];
    let bottomEdge = [];

    for (let idx = 0; idx < points.length - 1; idx ++) {
        if (x < points[idx][coord] && x >= points[idx + 1][coord]) {
            bottomEdge = [points[idx], points[idx + 1]];
        }
        if (x >= points[idx][coord] && x < points[idx + 1][coord]){
            topEdge = [points[idx], points[idx + 1]];
        }
    }

    return [topEdge, bottomEdge];
}

exports.intersect = function intersect(x, points) {
    let m = (points[0][1] - points[1][1]) / (points[0][0] - points[1][0]);
    let b = points[0][1] - m * points[0][0];

    return m * x + b;
}

exports.equalTo = function equalTo(a, b, threshold = 0.0001) {
    return (Math.abs(a - b) < threshold); 
}

//rk4 that mf
exports.rk4 = function rk4(h, x, y, func) {
    let K1 = h * func(x, y);
    let K2 = h * func(x + h / 2, y + K1 / 2);
    let K3 = h * func(x + h / 2, y + K2 / 2);
    let K4 = h * func(x + h, y + K3);

    let ynext = y + K1 / 6 + K2 / 3 + K3 / 3 + K4 / 6;

    return ynext;
}

module.exports = exports;
