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

function gfxZoomToFit()
{
	let a, max1;
	
	max1 = 0.00001;
	
	for (a of _system.bodies)
	{
		max1 = Math.max(max1, Math.abs(a.position.x));
		max1 = Math.max(max1, Math.abs(a.position.y));
	}
	
	max1 = max1 * 1.5;
	
	_gfxPadX = max1;
	_gfxPadY = max1;
	_gfxZoom = 1 / max1 * 200;
}

function gfxInit()
{
	let a;
	
	for (a of _gfxDots)
	{
		a.parentNode.removeChild(a);
	}
	
	_gfxDots = [];
	
	for (a of _system.bodies)
	{
		_gfxDots.push(createDomObject(a.name));
	}
	
	gfxZoomToFit();
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

function initA()
{
	_system = new System();
	_system.stepSize = 0.05;
	
	_system.addBody(new Body("yellow", new Vec2D(  0, 0), new Vec2D( 0.0,  0.0), 1e12));
	_system.addBody(new Body("red",    new Vec2D(-10, 0), new Vec2D( 0.0, -2.25), 1e7));
	_system.addBody(new Body("green",  new Vec2D(  5, 0), new Vec2D( 0.0,  3), 1e7));
	_system.addBody(new Body("blue",   new Vec2D(  6, 0), new Vec2D(-0.1, -1.8), 1e6));
	
	gfxInit();
}

function initSunAndEarth()
{
	_system = new System();
	_system.stepSize = 50000;
	
	// position and speed of Earth relative to Sun at perihelion
	_system.addBody(new Body("yellow", new Vec2D(0, 0), new Vec2D(0, 0), 1.989e30));
	_system.addBody(new Body("blue",   new Vec2D(-147091144000, 0), new Vec2D(0, 30290), 5.972e24));
	
	gfxInit();
}

function initEarthAndMoon()
{
	_system = new System();
	_system.stepSize = 5000;
	
	// position and speed of Moon relative to Earth at perigee
	// note: the Earth has no initial speed here
	_system.addBody(new Body("blue",  new Vec2D(0, 0), new Vec2D(0, 0), 5.972e24));
	_system.addBody(new Body("green",  new Vec2D(-363300000, 0), new Vec2D(0, 1075), 7.34767309e22));
	
	gfxInit();
}

function initSunEarthAndMoon()
{
	_system = new System();
	_system.stepSize = 5000;
	
	// position and speed of Earth relative to Sun at perihelion
	// position and speed of Moon relative to Sun at perigee
	// note: this is not really visible with current viewing settings
	_system.addBody(new Body("yellow", new Vec2D(0, 0), new Vec2D(0, 0), 1.989e30));
	_system.addBody(new Body("blue",   new Vec2D(-147091144000, 0), new Vec2D(0, 30290), 5.972e24));
	_system.addBody(new Body("green",  new Vec2D(-363300000 -147091144000, 0), new Vec2D(0, 1075 + 30290), 7.34767309e22));
	
	gfxInit();
}

function initFigureEight()
{
	_system = new System();
	_system.stepSize = 0.03;
	
	// Figure eight orbit of the three body problem by Cris Moore,
	// described in his paper "Braids in classical dynamics"
	
	// The weights here are guessed as the gravitational constant is
	// different in the paper
	
	_system.addBody(new Body("red",   new Vec2D(-0.97000436, -0.24308753), new Vec2D( 0.93240737/2, -0.86473146/2), 1.88e10));
	_system.addBody(new Body("green", new Vec2D( 0.97000436,  0.24308753), new Vec2D( 0.93240737/2, -0.86473146/2), 1.88e10));
	_system.addBody(new Body("blue",  new Vec2D( 0,           0         ), new Vec2D(-0.93240737  ,  0.86473146  ), 1.88e10));
	
	gfxInit();
}

function init()
{
	initFigureEight();
	step();
}

window.addEventListener("load", init);
