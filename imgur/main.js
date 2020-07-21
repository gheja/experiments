"use strict";

let _canvas;
let _ctx;

function init()
{
	_canvas = document.getElementById("canvas1");
	_ctx = _canvas.getContext("2d");
}

window.addEventListener("load", init);
