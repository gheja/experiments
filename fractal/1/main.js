"use strict";

let _canvas, _ctx;
let _canvas2, _ctx2;
let _canvas3, _ctx3;
let _width = 400;
let _height = 400;
let _t;
let _gui;
let _settings = { "drawBoxes": false, "alpha": 0.9 };

let _operations = [ "normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity" ];
let operation;

let _windows = [];

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
	
	_canvas3 = document.getElementById("c_overlay");
	_canvas3.width = _width;
	_canvas3.height = _height;
	_ctx3 = _canvas3.getContext("2d");
	
	_gui = new dat.GUI();
	_gui.add(_settings, "drawBoxes");
	_gui.add(_settings, "alpha", 0.0, 1.0);
	
	_t = 0;
	
	_windows.push([ 0.5, 0.5, 0.5, 0.05 ]);
	_windows.push([ 0.9, 0.9, 0.6, 0.1 ]);
	_windows.push([ 0.2, 0.2, 0.4, -0.25 ]);
	
	pickOperation();
	window.setInterval(pickOperation, 500);
	draw();
}

function drawWindow(x, y, scale, rotation, debug)
{
	_ctx2.setTransform(scale, 0, 0, scale, _width/2 - (1-x)*_width*scale, _height/2 - (1-y)*_height*scale);
//	_ctx2.translate(-_width/2, -_height/2);
	_ctx2.translate(_width/2, _height/2);
	_ctx2.rotate(rotation * (Math.PI * 2));
	_ctx2.translate(-_width/2, -_height/2);
	
	if (!debug)
	{
		_ctx2.drawImage(_canvas, 0, 0);
	}
	else
	{
		_ctx2.strokeStyle = "#fff9";
		_ctx2.lineWidth = 3;
		_ctx2.beginPath();
		_ctx2.rect(0, 0, _width, _height);
		_ctx2.stroke();
	}
}

function draw()
{
	let a;
	
	_t += 0.02;
	
	_ctx2.clearRect(0, 0, _width, _height);
	_ctx2.globalAlpha = _settings.alpha;
	_ctx2.globalCompositeOperation = operation;
	
	for (a of _windows)
	{
		drawWindow(...a, false);
	}
	
	_ctx2.setTransform(1, 0, 0, 1, 0, 0);
	
	_ctx.clearRect(0, 0, _width, _height);
	_ctx.drawImage(_canvas2, 0, 0);
	_ctx.fillStyle = "#c93c";
	_ctx.globalCompositeOperation = operation;
	_ctx.fillRect(100 + Math.sin(_t) * 100, 100 + Math.sin(_t*1.4) * 100, 200, 200); 
	
	// overlay
	_ctx3.clearRect(0, 0, _width, _height);
	
	if (_settings.drawBoxes)
	{
		_ctx2.clearRect(0, 0, _width, _height);
		_ctx2.globalAlpha = 1;
		_ctx2.globalCompositeOperation = "normal";
		
		for (a of _windows)
		{
			drawWindow(...a, true);
		}
		
		_ctx2.setTransform(1, 0, 0, 1, 0, 0);
		
		_ctx3.drawImage(_canvas2, 0, 0);
	}
	
	window.requestAnimationFrame(draw);
}

window.addEventListener("load", init);
