"use strict";

class NetworkNode
{
    x: number;
    y: number;
    z: number;
    neighbours: NetworkNode[];

    constructor(x: number, y: number, z: number, neighbours: NetworkNode[])
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.neighbours = neighbours;
    }
}

class Network
{
    public nodes: NetworkNode[];

    constructor()
    {
        this.nodes = [];
    }

    addNode(x, y, z, parent)
    {
        this.nodes.push(new NetworkNode(x, y, z, parent));
        return this.nodes[this.nodes.length - 1];
    }
}