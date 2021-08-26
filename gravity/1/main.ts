let _system: System;

// gfx
let _gfxDots = [];
let _gfxZoom = 10;
let _gfxPadX = 15;
let _gfxPadY = 15;

function createDomObject(name)
{
	let tmp;
	
	tmp = document.createElement("span");
	tmp.innerHTML = "&#8226;"
	tmp.className = "dot dot-" + name;
	document.body.appendChild(tmp);
	return tmp;
}

function gfxInit()
{
	let a;
	
	for (a of _system.bodies)
	{
		_gfxDots.push(createDomObject(a.name));
	}
}

function gfxUpdate()
{
	let a, i;
	
	i = 0;
	
	for (a of _system.bodies)
	{
		_gfxDots[i].style.left = ((a.position.x + _gfxPadX) * _gfxZoom);
		_gfxDots[i].style.top = ((a.position.y + _gfxPadY) * _gfxZoom);
		i++;
	}
}
// /gfx


function step()
{
	_system.step();
	gfxUpdate();
	
	window.requestAnimationFrame(step);
}

function init()
{
	_system = new System();
	// kilograms, meters, meters/second
/*
	_system.addBody(new Body("Sun", new Vec2D(0, 0), new Vec2D(0, 0), 1.989e30));
	_system.addBody(new Body("Earth", new Vec2D(1.496e11, 0), new Vec2D(0, 460), 5.972e24));
*/
	
	_system.addBody(new Body("blue",   new Vec2D(  0, 0), new Vec2D( 0.0,  0.0), 1e10));
	_system.addBody(new Body("red",    new Vec2D(-10, 0), new Vec2D( 0.0, -1.0), 1e7));
	_system.addBody(new Body("green",  new Vec2D(  5, 0), new Vec2D( 0.0,  1.0), 1e7));
	_system.addBody(new Body("yellow", new Vec2D(  6, 0), new Vec2D(-0.7, -0.5), 1e6));
	
	gfxInit();
	
	step();
}

window.addEventListener("load", init);
