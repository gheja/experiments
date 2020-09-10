let ticks = 0;

let _gfx: WebglGfx;
let _editor: Editor;

function tick()
{
    ticks++;

    _gfx.objects[1].rz += 0.01;

    _gfx.resize();
    _gfx.render();
    window.requestAnimationFrame(tick);
}

function startEditor()
{
    document.getElementById("start_editor").style.display = "none";
    document.getElementById("editor_box").style.display = "block";

    _editor = new Editor(_gfx, "editor", 1, 1);
}

function init()
{
    let a;

    _gfx = new WebglGfx("canvas");
    _gfx.createObject(SHAPE_PLANE_INDEX);
    _gfx.createObject(SHAPE_TRAIN1_INDEX);
    _gfx.createObject(SHAPE_CURSOR_INDEX);
    a = _gfx.createObject(SHAPE_CURSOR_BLUE_INDEX);
    a.x = 1;

    document.getElementById("start_editor").addEventListener("click", startEditor.bind(null));
    tick();
}

window.addEventListener("load", init);
