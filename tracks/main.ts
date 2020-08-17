"use strict";

let _gfx: Gfx;
let _tracks: Network;

function render()
{
    let a: NetworkNode, b: NetworkNode;

    _gfx.renderBegin();
    _gfx.setStroke(2, "#000");
    for (a of _tracks.nodes)
    {
        _gfx.drawBegin();
        _gfx.drawCircle(a.x, a.y, 10);
        _gfx.drawStroke();
    }
    for (a of _tracks.nodes)
    {
        for (b of a.neighbours)
        {
            if (!b)
            {
                continue;
            }
            _gfx.drawBegin();
            _gfx.drawLine(a.x, a.y, b.x, b.y);
            _gfx.drawStroke();
        }
    }
    _gfx.renderEnd();
    window.requestAnimationFrame(render);
}

function init()
{
    let a: NetworkNode, b: NetworkNode;

    _gfx = new Gfx(document.getElementById("c1") as HTMLCanvasElement);
    _tracks = new Network();
    a = _tracks.addNode(50, 0, 0, [ null ]);
    _tracks.addNode(50, 50, 0, [ a ]);
    b = _tracks.addNode(100, 50, 0, [ a ]);
    _tracks.addNode(100, 150, 0, [ b ]);
    render();
}

window.addEventListener("load", init);