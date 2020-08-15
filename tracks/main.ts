"use strict";

let _gfx;
let _tracks;

function render()
{
    _gfx.render();
    window.requestAnimationFrame(render);
}

function init()
{
    _gfx = new Gfx(document.getElementById("c1") as HTMLCanvasElement);
    _tracks = new Network();
    render();
}

window.addEventListener("load", init);