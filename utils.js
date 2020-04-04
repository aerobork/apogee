"use strict"

exports = {}

exports.finIntersect = function finIntersect(x, points, coord) {
    let topEdge = [];
    let bottomEdge = [];

    this.points.map((point, idx) => {
        if (x <= points[idx][coord] && x > points[idx + 1][coord]) {
            bottomEdge = [points[idx], points[idx + 1]];
        }
        if (x >= points[idx][coord] && x < points[idx + 1][coord]){
            topEdge = [points[idx], points[idx + 1]];
        }
    })

    return [topEdge, bottomEdge];
}

exports.intersect = function intersect(x, points) {
    let m = (points[0][1] - points[1][1]) / (points[0][0] - points[1][0]);
    let b = points[0][1] - m * points[0][0];

    return m * x + b;
}

modules.exports = exports;
