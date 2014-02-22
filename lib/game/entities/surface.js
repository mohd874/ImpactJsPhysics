ig.module( 
	'game.entities.surface' 
)
.requires(
	'plugins.box2d.entity'
)
.defines(function(){

	EntitySurface = ig.Box2DEntity.extend({
		size: {x: 24, y: 8},
		
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(255,0,255,0.5)',
		_wmScalable: true,
		
		// Collision is already handled by Box2D!
		collides: ig.Entity.COLLIDES.NEVER,
		
		animSheet: new ig.AnimationSheet( 'media/tileset2.png', 24, 8 ),
		
		init: function( x, y, settings ) {
			this.addAnim( 'idle', 1, [0] );
			this.parent( x, y, settings );
		},
		/* Override */
		createBody: function(){ 
			var bodyDef = new Box2D.Dynamics.b2BodyDef();
			bodyDef.position = new Box2D.Common.Math.b2Vec2(
				(this.pos.x + this.size.x / 2) * Box2D.SCALE,
				(this.pos.y + this.size.y / 2) * Box2D.SCALE
			); 
			bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
			bodyDef.angle = this.angle * Box2D.Common.b2Settings.b2_pi;
			this.body = ig.world.CreateBody(bodyDef);

			var fixture = new Box2D.Dynamics.b2FixtureDef;
			fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
			fixture.shape.SetAsBox(
				this.size.x / 2 * Box2D.SCALE,
				this.size.y / 2 * Box2D.SCALE
			);
			
			fixture.density = 1.0;
			fixture.friction = 0.5;
			// fixture.restitution = 0.3;

			this.body.CreateFixture(fixture);
		}, 
		draw: function(){
			this.parent();
			
			if(ig.game.debugCollisionRects){
				var rect = {
					x: this.pos.x,
					y: this.pos.y,
					width: this.size.x,
					height: this.size.y
				}
				ig.system.context.strokeStyle = '#00ff00';
				ig.system.context.strokeRect(
					ig.system.getDrawPos( rect.x - this.screen.x ),
					ig.system.getDrawPos( rect.y - this.screen.y ),
					ig.system.getDrawPos( rect.width ),
					ig.system.getDrawPos( rect.height )
				);
			}
		}
	});
	
})