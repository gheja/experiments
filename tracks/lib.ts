"use strict";

function dist(a: number, b: number): number
{
    return Math.abs(a - b);
}

function dist3d(a: Point3d, b: Point3d): number
{
    return dist(a.x, b.x) + dist(a.y, b.y) + dist(a.z, b.z);
}