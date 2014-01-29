ig.module(
        'game.entities.ghostStatic'
)
.requires(
        'impact.entity'
)
.defines(function(){

EntityGhostStatic = ig.Entity.extend({
    size: {x: 16, y:8},
    
    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
    density: 0,
    animSheet: new ig.AnimationSheet( 'media/ghost_body.png', 16, 8 ),        
    
    flip: false,
    
    motorState: {},
	
	syncTimer: new ig.Timer(),
	syncInterval: 0.5,
	oldPos: {x: 0, y:0},
	newPos: {x: 0, y:0},
	oldAngle: 0,
	newAngle: 0,
	
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        
        // Add the animations
        this.addAnim( 'idle', 1, [0] );
        if(settings.sessionID){
            this.name = settings.sessionID
        }
		this.gravityFactor = 0;
    },
    update: function() {
        this.parent();
		var np = this.newPos;
		var op = this.oldPos;
		var na = this.newAngle;
		var oa = this.oldAngle;
		
		var delta = this.syncTimer.delta();
		if(delta > this.syncInterval) {delta = this.syncInterval}
		
		this.angle = oa + ((na - oa) * delta);
		this.currentAnim.angle = this.angle;
        
		this.pos.x = op.x + ((np.x - op.x) * delta);
		this.pos.y = op.y + ((np.y - op.y) * delta);
    },
    draw: function(){
        this.parent();
    },
    move: function(playerDetails){
        var pd = playerDetails;
		this.oldPos.x = this.newPos.x;
		this.oldPos.y = this.newPos.y;
		this.newPos.x = pd.pos.x;
        this.newPos.y = pd.pos.y;
		this.oldAngle = this.newAngle;
		this.newAngle = pd.angle;
        this.syncTimer.reset();
    }
});

});
