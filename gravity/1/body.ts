class Body
{
	name: string;
	position: Vec2D;
	velocity: Vec2D;
	mass: number;
	
	tempVelocity: Vec2D;
	
	constructor(name: string, position:Vec2D, velocity: Vec2D, mass: number)
	{
		this.position = new Vec2D();
		this.velocity = new Vec2D();
		this.tempVelocity = new Vec2D();
		
		this.name = name;
		this.position.copyFrom(position);
		this.velocity.copyFrom(velocity);
		this.mass = mass;
	}
	
	stepStart()
	{
		// this.tempVelocity.zero();
		this.tempVelocity.copyFrom(this.velocity);
	}
	
	stepEnd(stepSize: number)
	{
		this.velocity.copyFrom(this.tempVelocity);
		this.position.x += this.velocity.x * stepSize;
		this.position.y += this.velocity.y * stepSize;
	}
}
