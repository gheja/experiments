"use strict";

let _canvas, _ctx;
let _canvas2, _ctx2;
let _width = 400;
let _height = 400;
let _t;

let _operations = [ "normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity" ];
let operation;

function pickOperation()
{
	let operation = _operations[Math.floor(Math.random() * _operations.length)];
	console.log(operation);
}

function init()
{
	_canvas = document.getElementById("c");
	_canvas.width = _width;
	_canvas.height = _height;
	_ctx = _canvas.getContext("2d");
	
	_canvas2 = document.createElement("canvas");
	_canvas2.width = _width;
	_canvas2.height = _height;
	_ctx2 = _canvas2.getContext("2d");
	
	_t = 0;
	
	
 pickOperation();
 window.setInterval(pickOperation, 500);
 draw();
}

function drawWindow(x, y, scale, rotation)
{
	_ctx2.setTransform(scale, 0, 0, scale, _width/2 - (1-x)*_width*scale, _height/2 - (1-y)*_height*scale);
//	_ctx2.translate(-_width/2, -_height/2);
	_ctx2.translate(_width/2, _height/2);
	_ctx2.rotate(rotation * (Math.PI * 2));
	_ctx2.translate(-_width/2, -_height/2);
	_ctx2.drawImage(_canvas, 0, 0);
	
	_ctx2.strokeStyle = "#f00";
	_ctx2.lineWidth = 2;
	_ctx2.beginPath(); 
	_ctx2.rect(0, 0, _width, _height);
	_ctx2.stroke(); 
}

function draw()
{
	_t += 0.02;
	
	_ctx2.clearRect(0, 0, _width, _height);
	_ctx2.globalAlpha = 0.95;
	_ctx2.globalCompositeOperation = operation;
	drawWindow(0.5, 0.5, 0.5, 0.05);
	drawWindow(0.9, 0.9, 0.6, 0.1);
	drawWindow(0.2, 0.2, 0.4, -0.25);
	_ctx2.setTransform(1, 0, 0, 1, 0, 0);

	_ctx.clearRect(0, 0, _width, _height);
	_ctx.drawImage(_canvas2, 0, 0);
	_ctx.fillStyle = "#c93c";
	_ctx.globalCompositeOperation = operation;
	_ctx.fillRect(100 + Math.sin(_t) * 100, 100 + Math.sin(_t*1.4) * 100, 200, 200); 
	window.requestAnimationFrame(draw);
}

window.addEventListener("load", init);
