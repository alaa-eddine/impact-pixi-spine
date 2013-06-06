ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'plugins.pixi',
	'plugins.mobile',
	'plugins.tween',
	'plugins.stats',
	'plugins.spine'
)
.defines(function(){

ig.Spine = ig.Class.extend({
	anim: null,
	skeleton: null,
	skeletonData: null,
	state: null,
	stateData: null,
	sprites: [],
	container: null,

	init: function() {
		var anim = PIXI.AnimCache[this.anim.path];

		var json = new spine.SkeletonJson();
		this.skeletonData = json.readSkeletonData(JSON.parse(anim));
		spine.Bone.yDown = true;

		this.skeleton = new spine.Skeleton(this.skeletonData);
		this.skeleton.getRootBone().x = this.pos.x;
		this.skeleton.getRootBone().y = this.pos.y;
		this.skeleton.updateWorldTransform();

		this.stateData = new spine.AnimationStateData(this.skeletonData);	
		this.state = new spine.AnimationState(this.stateData);

		this.stateData.setMixByName("walk", "jump", 0.2);
		this.stateData.setMixByName("jump", "walk", 0.4);
		this.state.setAnimationByName("walk", true);

		this.container = new PIXI.DisplayObjectContainer();

		for (var i = 0; i < this.skeleton.drawOrder.length; i++) {
			var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(this.skeleton.drawOrder[i].data.attachmentName));
			sprite.anchor.x = sprite.anchor.y = 0.5;
			this.container.addChild(sprite);
			this.sprites.push(sprite);
		};

		ig.system.stage.addChild(this.container);
	},

	update: function() {
		this.state.update(ig.system.tick);
		this.state.apply(this.skeleton);
		this.skeleton.updateWorldTransform();

		for (var i = 0; i < this.skeleton.drawOrder.length; i++) {
			var slot = this.skeleton.drawOrder[i];

			var x = slot.bone.worldX + slot.attachment.x * slot.bone.m00 + slot.attachment.y * slot.bone.m01 + slot.attachment.width * 0.5;
			var y = slot.bone.worldY + slot.attachment.x * slot.bone.m10 + slot.attachment.y * slot.bone.m11 + slot.attachment.height * 0.5;

			x += -((slot.attachment.width * (slot.bone.worldScaleX + slot.attachment.scaleX - 1))>>1);
			y += -((slot.attachment.height * (slot.bone.worldScaleY + slot.attachment.scaleY - 1))>>1);

			this.sprites[i].position.x = x;
			this.sprites[i].position.y = y;
			this.sprites[i].rotation = (-(slot.bone.worldRotation + slot.attachment.rotation)) * (Math.PI/180);
		}
	}
});

SpineBoy = ig.Spine.extend({
	pos: {x: 300, y: 600},
	anim: new ig.Asset("media/spineboy.anim"),
	animSheet: new ig.Asset("media/spineboy.json")
});

Background = ig.Class.extend({
	image: new ig.Asset("media/clouds.jpg"),

	init: function() {
		this.sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("media/clouds.jpg"), ig.system.width, ig.system.height);
		this.sprite.tileScale.x = this.sprite.tileScale.y = 0.5;
		ig.system.stage.addChild(this.sprite);
	},

	update: function() {
		this.sprite.tilePosition.x += 2;
	}
});

MyGame = ig.Game.extend({
	clearColor: "#ffffff",
	interactive: true,

	click: function() {
	},

	init: function() {
		this.parent();

		this.bg = new Background();
		this.spine = new SpineBoy();
	},

	update: function() {
		this.bg.update();
		this.spine.update();

		this.parent();
	}
});

// ig.System.debug = true;

ig.main('#canvas', MyGame, 60, 1024, 672);

});