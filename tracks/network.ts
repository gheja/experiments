"use strict";

class NetworkNode extends Point3d
{
    neighbours: NetworkNode[];
    selected: boolean;

    constructor(x: number, y: number, z: number, neighbours: NetworkNode[])
    {
        super(x, y, z);
        this.neighbours = neighbours;
        this.selected = false;
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

    pickNearestNode(p: Point3d)
    {
        let a: NetworkNode;

        for (a of this.nodes)
        {
            if (dist3d(a, p) < 10)
            {
                return a;
            }
        }

        return null;
    }

    selectNearestNode(p: Point3d)
    {
        let a: NetworkNode;
        let b: NetworkNode;

        b = this.pickNearestNode(p);

        for (a of this.nodes)
        {
            a.selected = a == b;
        }
    }
}