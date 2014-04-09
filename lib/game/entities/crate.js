ig.module(
	'game.entities.crate'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCrate = ig.Entity.extend({
	size: {x: 8, y: 8},
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,
	
	animSheet: new ig.AnimationSheet( 'media/crate.png', 8, 8 ),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );
		this.gravityFactor = 0;
	},
    update: function(){
        var mx = ig.input.mouse.x;
        var my = ig.input.mouse.y;

        this.pos = {x: mx, y: my};
    },
    check: function(other){
        //
    }
});


});
