ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.player',
	'game.entities.crate',
	'game.entities.car',
	'game.levels.test',
	
	'plugins.impsock',
	'plugins.box2d.game'
)
.defines(function(){

MyGame = ig.Box2DGame.extend({
	
	gravity: 100, // All entities are affected by this
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	clearColor: '#1b2026',
	
	startingPosX: ((Math.random() * 200).toInt() + 16),
    startingPosY: ((Math.random() * 50).toInt() + 16),
    
	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
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
          
		// screen follows the player
		//var player = this.getEntitiesByType( EntityCar )[0];
		if( this.player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();
		
		if( !ig.ua.mobile ) {
			this.font.draw( 'Arrow Keys, X, C', 2, 2 );
		}
	},
	
	joinGame: function() {
      if (this.getEntitiesByType(EntityCar).length == 0) {
        // spawn our player entity
        this.spawnEntity(EntityCar, this.startingPosX, this.startingPosY);

        // when first loading the client, there's only one EntityPlayer
        this.player = this.getEntitiesByType(EntityCar)[0];
        
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
      if (message.entity) {
        this.spawnOtherPlayer(message.entity);
        this.updateOtherPlayer(message.entity);
      }
    },
    spawnOtherPlayer: function(playerDetails) {
      if (playerDetails.sessionId == undefined) {return;}
      if (this.player && playerDetails.sessionId == this.player.name) {return;}
      
      var otherPlayer = this.getEntityByName(playerDetails.sessionId);
      
      if (!otherPlayer) {
        otherPlayer = this.spawnEntity(
            EntityGhost,
            playerDetails.pos.x,
            playerDetails.pos.y, 
            {
              name: playerDetails.sessionId
            }
        );
      }
    },
    updateOtherPlayer: function(playerDetails) {
      if (playerDetails.sessionId == undefined) {return;}
      if (this.player && playerDetails.sessionId == this.player.name) {return;}
      
      var otherPlayer = this.getEntityByName(playerDetails.sessionId);
      if (otherPlayer) {
        otherPlayer.move(playerDetails.movementState);
      }
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
