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
	pos: {x: 300, y: 600},
	anim: new ig.Asset("media/spineboy.anim"),
	animSheet: new ig.Asset("media/spineboy.json")
});

MyGame = ig.Game.extend({
	init: function() {
		this.parent();
		this.spineboy = new SpineBoy();
	},

	update: function() {
		this.spineboy.update();
		this.parent();
	}
});

ig.main('#canvas', MyGame, 60, 1024, 672);

});