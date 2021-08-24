let _system: System;

function step()
{
	_system.step();
	
	console.log(_system.bodies[0].position, _system.bodies[1].position);
}

function init()
{
	_system = new System();
	// kilograms, meters, meters/second
/*
	_system.zoom = 1.8e11;
	_system.addBody(new Body("Sun", new Vec2D(0, 0), new Vec2D(0, 0), 1.989e30));
	_system.addBody(new Body("Earth", new Vec2D(1.496e11, 0), new Vec2D(0, 460), 5.972e24));
*/
	
	_system.zoom = 30;
	_system.addBody(new Body("red",  new Vec2D(-10, 0), new Vec2D(0, 0), 1e10));
	_system.addBody(new Body("blue", new Vec2D(  5, 0), new Vec2D(0, 0), 1e10));
	
	// step();
	window.setInterval(step, 100);
}

window.addEventListener("load", init);
