# ImpactPixiSpine

Spine support for ImpactPixi

ImpactPixi: https://github.com/ekelokorpi/impact-pixi

## Demo

http://kelokorpi.com/impactpixi/spine/

## Install

Copy `spine.js` to your `lib/plugins/` folder and require `plugins.spine` on your game main module.

## Example

	SpineBoy = ig.Spine.extend({
		pos: {x: 300, y: 600},
		anim: new ig.Asset("media/spineboy.anim"),
		animSheet: new ig.Asset("media/spineboy.json")
	});