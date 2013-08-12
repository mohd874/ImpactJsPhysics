ig.module(
        'game.entities.car'
)
.requires(
        'impact.entity',
        'game.entities.wheel',
        'plugins.box2d.entity'
)
.defines(function(){

EntityCar = ig.Box2DEntity.extend({
    size: {x: 16, y:8},
    
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
    
    animSheet: new ig.AnimationSheet( 'media/car_body.png', 16, 8 ),        
    
    flip: false,
    
    speed: Math.PI * 4,
    
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        
        // Add the animations
        this.addAnim( 'idle', 1, [0] );

        if(!ig.global.wm) {
                this.body.SetFixedRotation(true);
        }
    },
    
    createBody: function() {
        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.position = new Box2D.Common.Math.b2Vec2(
                (this.pos.x + this.size.x / 2) * Box2D.SCALE,
                (this.pos.y + this.size.y / 2) * Box2D.SCALE
        ); 
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        this.body = ig.world.CreateBody(bodyDef);

        var fixture = new Box2D.Dynamics.b2FixtureDef;
        fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
        fixture.shape.SetAsBox(
                this.size.x / 2 * Box2D.SCALE,
                this.size.y / 2 * Box2D.SCALE
        );
        
        fixture.density = 1.0;
        // fixture.friction = 0.5;
        // fixture.restitution = 0.3;

        this.body.CreateFixture(fixture);
        
        this.wheel_1 = ig.game.spawnEntity(EntityWheel, this.pos.x - 4, this.pos.y + 4)
        this.wheel_2 = ig.game.spawnEntity(EntityWheel, this.pos.x + 12, this.pos.y + 4)
        
        this.joint_1 = this.makeJoint(this.body, this.wheel_1.body)
        this.joint_2 = this.makeJoint(this.body, this.wheel_2.body)
    },
    update: function() {
        // move left or right
        if( ig.input.state('left') ) {
            console.log('From car.js: Left pressed')
            if(!this.isMotorOn()){
                this.switchMotorOn()	
            }
            this.switchMotorDirection(false)
            this.flip = true;
        }
        else if( ig.input.state('right') ) {
            console.log('From car.js: Right pressed')
            if(!this.isMotorOn()){
                this.switchMotorOn()	
            }
            this.switchMotorDirection(true)
            this.flip = false;
        }else if(this.isMotorOn()){
            this.switchMotorOff()	
        }
         
        this.currentAnim.flip.x = this.flip;
        
        // move!
        this.parent();
            
        var p = this.body.GetPosition();
        this.pos = {
            x: (p.x / Box2D.SCALE - this.size.x / 2),
            y: (p.y / Box2D.SCALE - this.size.y / 2 )
        };
        this.angle = this.body.GetAngle().round(2);
        
        if( this.currentAnim ) {
            this.currentAnim.update();
            this.currentAnim.angle = this.angle;
        }
    },
    makeJoint: function(box1, box2) {
		var rjd = new Box2D.Dynamics.Joints.b2RevoluteJointDef();

		rjd.Initialize(box1, box2, box2.GetWorldCenter());
		rjd.motorSpeed = this.speed; // how fast?
		rjd.maxMotorTorque = 8000.0; // how powerful?
		rjd.enableMotor = true; // is it on?

		return ig.world.CreateJoint(rjd);
	},
	switchMotorOn: function(){
		this.joint_1.EnableMotor(true)
		this.joint_2.EnableMotor(true)
	},
    switchMotorOff: function(){
		this.joint_1.EnableMotor(false)
		this.joint_2.EnableMotor(false)
	},
	isMotorOn: function(){
		return this.joint_1.IsMotorEnabled() && this.joint_2.IsMotorEnabled()	
	},
	switchMotorDirection: function(right){
		if(right){
			this.joint_1.SetMotorSpeed(this.speed)
			this.joint_2.SetMotorSpeed(this.speed)
		}else{
			this.joint_1.SetMotorSpeed(-this.speed)
			this.joint_2.SetMotorSpeed(-this.speed)	
		}
	}
});

});