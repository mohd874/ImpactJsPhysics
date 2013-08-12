ig.module(
        'game.entities.wheel'
)
.requires(
        'impact.entity',
        'plugins.box2d.entity'
)
.defines(function(){
EntityWheel = ig.Box2DEntity.extend({
        size: {x: 8, y: 8},
        
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B, 
        collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
                
        animSheet: new ig.AnimationSheet( 'media/wheel.png', 8, 8 ),    
        
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            
            this.addAnim( 'idle', 1, [0] );
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
            fixture.shape = new Box2D.Collision.Shapes.b2CircleShape();
            var radius = (this.size.x/2) * Box2D.SCALE
            fixture.shape.SetRadius(radius);
            
            fixture.density = 1.0;
            fixture.friction = 0.5;
            fixture.restitution = 0.3;

            this.body.CreateFixture(fixture);
        },
        update: function() {
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
            
            this.parent()
	}
});

});
