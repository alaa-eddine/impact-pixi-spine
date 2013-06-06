ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'plugins.pixi',
	'plugins.spine'
)
.defines(function(){

SpineBoy = ig.Spine.extend({
	anim: new ig.Asset("media/spineboy.anim"),
	animSheet: new ig.Asset("media/spineboy.json"),

	init: function(x,y) {
		this.parent();

		this.pos.x = x;
		this.pos.y = y;
		this.stateData.setMixByName("walk", "jump", 0.2);
		this.stateData.setMixByName("jump", "walk", 0.4);
		this.state.setAnimationByName("walk", true);
	},

	update: function() {
		this.pos.x += 200 * ig.system.tick;
		if(this.pos.x > ig.system.width) this.pos.x = 0;
		this.parent();
	}
});

MyGame = ig.Game.extend({
	init: function() {
		this.parent();
		this.spineboy = new SpineBoy(0,600);
	},

	update: function() {
		this.spineboy.update();
		this.parent();
	}
});

ig.main('#canvas', MyGame, 60, 1024, 672);

});