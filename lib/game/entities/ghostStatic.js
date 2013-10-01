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
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        
        // Add the animations
        this.addAnim( 'idle', 1, [0] );
        if(settings.sessionID){
            this.name = settings.sessionID
        }
    },
    update: function() {
        // move!
        this.parent();
    },
    draw: function(){
        this.parent();
    },
    move: function(playerDetails){
        var p = playerDetails;
        this.angle = p.angle;
        this.pos = p.pos;
    }
});

});
