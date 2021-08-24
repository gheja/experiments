const gravConst = 6.67430e-11;

function dist2d(a, b)
{
	return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

class System
{
	bodies: Array<Body>;
	zoom: number;
	centerOfMass: Vec2D;
	
	constructor()
	{
		this.bodies = [];
		this.zoom = 0;
		this.centerOfMass = new Vec2D();
	}
	
	addBody(body)
	{
		this.bodies.push(body);
	}
	
	// should be inlined
	updateCenterOfMass()
	{
		let a: Body;
		let totalMass: number;
		
		this.centerOfMass.zero();
		totalMass = 0;
		
		for (a of this.bodies)
		{
			this.centerOfMass.x += a.position.x * a.mass;
			this.centerOfMass.y += a.position.y * a.mass;
			totalMass += a.mass;
		}
		
		this.centerOfMass.x /= totalMass;
		this.centerOfMass.y /= totalMass;
	}
	
	step()
	{
		let a: Body;
		let b: Body;
		let d: Vec2D;
		let r2: number;
		let f: number;
		let acceleration: number;
		let stepSize: number;
		
		stepSize = 1;
		
		this.updateCenterOfMass();
		d = new Vec2D();
		
		for (a of this.bodies)
		{
			a.stepStart();
		}
		
		for (a of this.bodies)
		{
			for (b of this.bodies)
			{
				if (a == b)
				{
					continue;
				}
				
				d.x = b.position.x - a.position.x;
				d.y = b.position.y - a.position.y;
				
				r2 = dist2d(a.position, b.position) ** 2;
				
				f = gravConst * ((a.mass * b.mass) / r2); // kg * m / s^2
				
				acceleration = f / a.mass; // m / s^2
				
				a.tempVelocity.x += acceleration * d.x * stepSize;
				a.tempVelocity.y += acceleration * d.y * stepSize;
			}
		}
		
		for (a of this.bodies)
		{
			a.stepEnd();
			
			// console.log(a.position);
		}
		
		// console.log(this.centerOfMass);
	}
}
