let program: WebGLProgram;
let ticks = 0;

let _gfx: WebglGfx;
let _editor: Editor;

function tick()
{
    ticks++;

    _gfx.objects[1].rz += 0.01;

    _gfx.render();
}

function init()
{
    _gfx = new WebglGfx("canvas");
    _editor = new Editor(_gfx, "editor", 1, 1);

    window.setInterval(tick, 1000/60);
}

window.addEventListener("load", init);
