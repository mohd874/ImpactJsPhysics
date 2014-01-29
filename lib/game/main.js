ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.player',
	'game.entities.crate',
	'game.entities.car',
	'game.entities.ghostStatic',
	'game.entities.ghost',
	'game.levels.test',
	
	'impact.debug.debug',

	'plugins.impsock',
	'plugins.box2d.game'
)
.defines(function(){

MyGame = ig.Box2DGame.extend({
	
	gravity: 100, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	clearColor: '#1b2026',
	
	//startingPosX: ((Math.random() * 200).toInt() + 16),
    //startingPosY: ((Math.random() * 50).toInt() + 16),
    
	startingPosX: 32,
    startingPosY: 32,
    
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'shoot' );
		
		if( ig.ua.mobile ) {
			ig.input.bindTouch( '#buttonLeft', 'left' );
			ig.input.bindTouch( '#buttonRight', 'right' );
			ig.input.bindTouch( '#buttonShoot', 'shoot' );
			ig.input.bindTouch( '#buttonJump', 'jump' );
		}
		
		// setup impsock
		this.impsock = new ig.Impsock(this);
		
		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( LevelTest );
	},
	
	loadLevel: function( data ) {
		this.parent( data );
		for( var i = 0; i < this.backgroundMaps.length; i++ ) {
			this.backgroundMaps[i].preRender = true;
		}
	},
	
	update: function() {
		// Update all entities and BackgroundMaps
		this.parent();
		
		
		if (this.impsock.socket.connected) {
		    this.joinGame();
        } else {
            // wait until connected
		}

		if( this.player ) {
			this.screen.x = this.player.pos.x - ig.system.width/2;
			this.screen.y = this.player.pos.y - ig.system.height/2;
		}
	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();
		
		if( !ig.ua.mobile ) {
			this.font.draw( 'Arrow Keys, X, C', 2, 2 );
		}
		if(this.player){
			this.font.draw( 'Player: '+this.player.name, 2, 10 );
			this.font.draw( 'x: '+Math.round(this.player.pos.x, 2)+' y: '+Math.round(this.player.pos.y, 2), 2, 18 );
		}
		
		var ghosts = this.getEntitiesByType('EntityGhostStatic');
		for(var i =0; i < ghosts.length; i++ ){
			var g = ghosts[i];
			this.font.draw( 'Ghost: '+g.name, 2, 26 );
			this.font.draw( 'x: '+Math.round(g.pos.x, 2)+' y: '+Math.round(g.pos.y, 2), 2, 34 );
		}
	},
	
	joinGame: function() {
      if (this.getEntitiesByType(EntityCar).length == 0) {
        // spawn our player entity
        this.player = this.spawnEntity(EntityCar, this.startingPosX, this.startingPosY, {name: this.impsock.sessionID});

        // when first loading the client, there's only one EntityPlayer
        //this.player = this.getEntitiesByType(EntityCar)[0];
        
        // announce our arrival to other clients
        this.impsock.broadcast(this.player);
      }
    },
    disconnectHandler: function(message) {
      var orphan = ig.game.getEntityByName(message.remove);
      if (orphan) {
        orphan.kill();
      }
    },
    broadcastHandler: function(message) {
    	// console.log('message.entity: '+(message.entity))
      if (message.entity) {
        this.spawnOtherPlayer(message.entity);
        this.updateOtherPlayer(message.entity);
      }
    },
    spawnOtherPlayer: function(playerDetails) {
      //console.log('spawnOtherPlayer -> playerDetails.sessionID: '+playerDetails.sessionID)
      if (playerDetails.sessionID == undefined) {return;}
      if (this.player && playerDetails.sessionID == this.player.name) {return;}
      
	  var otherPlayer = this.getEntityByName(playerDetails.sessionID);
      //console.log(otherPlayer)
      if (!otherPlayer) {
		console.log('Cannot find player: '+playerDetails.sessionID);
		console.log('Creating new Ghost for '+playerDetails.sessionID)
      	otherPlayer = this.spawnEntity(
            //EntityGhost,
            EntityGhostStatic,
            playerDetails.pos.x,
            playerDetails.pos.y, 
            playerDetails
        );
        this.impsock.broadcast(this.player);
      }
    },
    updateOtherPlayer: function(playerDetails) {
      if (playerDetails.sessionID == undefined) {return;}
      if (this.player && playerDetails.sessionID == this.player.name) {return;}
      
      var otherPlayer = this.getEntityByName(playerDetails.sessionID);
      if (otherPlayer) {
        otherPlayer.move(playerDetails);
      }
    },
    joinHandler: function(message) {
      // create a new entity for the player that just joined
      this.spawnOtherPlayer(message.spawn);
    }
});


if( ig.ua.iPad ) {
	ig.Sound.enabled = false;
	ig.main('#canvas', MyGame, 60, 240, 160, 2);
}
else if( ig.ua.mobile ) {	
	ig.Sound.enabled = false;
	ig.main('#canvas', MyGame, 60, 160, 160, 2);
}
else {
	ig.main('#canvas', MyGame, 60, 320, 240, 2);
}

});
