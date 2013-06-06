// resize, orientation and device detection
// v1.0.4
ig.module(
	'plugins.mobile'
)
.requires(
	'impact.system',
	'impact.input'
)
.defines(function() {

ig.ua.wp = /Windows Phone/i.test(navigator.userAgent);
ig.ua.wp7 = (ig.ua.wp && /Windows Phone OS 7/i.test(navigator.userAgent));
ig.ua.wp8 = (ig.ua.wp && /Windows Phone 8/i.test(navigator.userAgent));
ig.ua.android2 = /android 2/i.test(navigator.userAgent);
ig.ua.iPhone5 =	(ig.ua.iPhone && ig.ua.pixelRatio == 2 && ig.ua.screen.height == 1096);
ig.ua.iPadRetina = (ig.ua.iPad && ig.ua.pixelRatio == 2);
ig.ua.iOS5 = (ig.ua.iOS && /OS 5/i.test(navigator.userAgent));
ig.ua.iOS6 = (ig.ua.iOS && /OS 6/i.test(navigator.userAgent));
ig.ua.opera = /Opera/i.test(navigator.userAgent);
if(ig.ua.wp) ig.ua.mobile = true;

ig.System.inject({
	hidden: false,

	init: function(canvasId, fps, width, height, scale) {
		this.parent(canvasId, fps, width, height, scale);

		this.ratio = this.width / this.height;

		if(ig.ua.mobile) document.addEventListener("touchstart", function(e) { e.preventDefault(); }, false);
		if(ig.System.forceLandscape && ig.ua.mobile || ig.System.forcePortrait && ig.ua.mobile) {
			var div = document.createElement("div");
			div.innerHTML = ig.System.rotateImg ? "" : ig.System.rotateMsg;
			div.id = "rotateMsg";
			div.style.position = "absolute";
			div.style.height = "12px";
			div.style.textAlign = "center";
			div.style.left = 0;
			div.style.right = 0;
			div.style.top = 0;
			div.style.bottom = 0;
			div.style.margin = "auto";
			div.style.display = "none";
			ig.System.rotateDiv = div;
			document.body.appendChild(ig.System.rotateDiv);

			if(ig.System.rotateImg) {
				var img = new Image();
				img.onload = function(e) {
					div.appendChild(e.target);
					div.style.height = e.target.height+"px";
				}
				img.src = ig.System.rotateImg;
				img.style.position = "relative";
			}
		}

		if(ig.ua.android) {
			window.onresize = this.onresizeAndroid.bind(this);
			this.onresizeAndroid();
		}
		else if(ig.ua.iPhone) {
			window.onresize = this.onresizeiPhone.bind(this);
			this.onresizeiPhone();
		}
		else if(ig.ua.wp) {
			window.onresize = this.onresizeWP.bind(this);
			this.onresizeWP();
		}
		else {
			window.onresize = this.onresize.bind(this);
			this.onresize();
		}

		if(ig.ua.mobile) return;

		if(ig.System.minWidth) this.canvas.style.minWidth = (ig.System.minWidth == "auto" ? width/2 : ig.System.minWidth) + "px";
		if(ig.System.minHeight) this.canvas.style.minHeight = (ig.System.minHeight == "auto" ? height/2 : ig.System.minHeight) + "px";
		if(ig.System.maxWidth) this.canvas.style.maxWidth = (ig.System.maxWidth == "auto" ? width : ig.System.maxWidth) + "px";
		if(ig.System.maxHeight) this.canvas.style.maxHeight = (ig.System.maxHeight == "auto" ? height : ig.System.maxWidth) + "px";
	},

	resize: function(width, height, scale) {
		this.parent(width, height, scale);

		if(ig.ua.android) {
			this.canvas.style.margin = "auto";
			this.canvas.style.position = "absolute";
			this.canvas.style.left = "0";
			this.canvas.style.right = "0";
			this.canvas.style.top = "0";
			this.canvas.style.bottom = "0";
		}

		if(ig.ua.iPhone) {
			this.canvas.style.margin = "auto";
			this.canvas.style.width = "auto";
			window.onorientationchange = function() {
				setTimeout(function() {
					window.scroll(0,1);
				}, 0);
			};
		}
	},

	checkOrientation: function() {
		if(ig.ua.android) {
			if(!ig.ua.portrait) ig.ua.portrait = {};
			if(!ig.ua.landscape) ig.ua.landscape = {};
			ig.ua.portrait.matches = window.innerWidth < window.innerHeight ? true : false;
			ig.ua.landscape.matches = window.innerWidth > window.innerHeight ? true : false;
		}
		if(ig.System.forceLandscape && ig.ua.portrait.matches) ig.System.hidden = true;
		if(ig.System.forceLandscape && !ig.ua.portrait.matches) ig.System.hidden = false;
		if(ig.System.forcePortrait && ig.ua.landscape.matches) ig.System.hidden = true;
		if(ig.System.forcePortrait && !ig.ua.landscape.matches) ig.System.hidden = false;

		ig.System.rotateDiv.style.display = ig.System.hidden ? "block" : "none";
		this.canvas.style.display = ig.System.hidden ? "none" : "block";
		
		if(typeof(ig.onOrientationChange) == "function") ig.onOrientationChange();
	},

	onresize: function() {
		if(ig.ua.mobile) this.checkOrientation();

		ig.ua.viewport.width = window.innerWidth;
		ig.ua.viewport.height = window.innerHeight;

		if(ig.ua.viewport.width < this.width || ig.ua.viewport.height < this.height) {
			if(ig.ua.viewport.width / this.width < ig.ua.viewport.height / this.height) {
				this.canvas.style.width = "100%";
				this.canvas.style.height = "auto";
			}
			else {
				this.canvas.style.width = "auto";
				this.canvas.style.height = "100%";
			}
		}

		if(typeof(ig.onResize) == "function") ig.onResize();
	},

	onresizeWP: function() {
		this.checkOrientation();

		this.canvas.style.height = window.innerHeight + "px";
		this.canvas.style.margin = "auto";
		this.canvas.style.width = window.innerHeight * this.ratio + "px";

		if(typeof(ig.onResize) == "function") ig.onResize();
	},

	onresizeiPhone: function() {
		this.checkOrientation();

		if(window.innerHeight == 260 || window.innerHeight == 301 || window.innerHeight == 320) {
			// fullscreen mode (landscape)
			if(this.canvas.width/this.canvas.height > window.innerWidth/window.innerHeight) {
				this.canvas.style.width = window.innerWidth + "px";
				this.canvas.style.height = "auto";
			} else {
				this.canvas.style.height = window.innerHeight + "px";
				this.canvas.style.width = "auto";
			}
		}
		else {
			this.canvas.style.width = "auto";
			this.canvas.style.height = (screen.width - 52) + "px";
		}
		
		window.scroll(0,1);

		if(typeof(ig.onResize) == "function") ig.onResize();
	},

	onresizeAndroid: function() {
		this.checkOrientation();

		if(ig.ua.android2) this.canvas.style.width = window.innerHeight * this.ratio + "px";
		else this.canvas.style.width = "auto";

		this.canvas.style.height = window.innerHeight + "px";
		this.canvas.style.margin = "auto";

		if(typeof(ig.onResize) == "function") ig.onResize();
	}

});

ig.System.minWidth = "auto";
ig.System.minHeight = "auto";
ig.System.maxWidth = "auto";
ig.System.maxHeight = "auto";
ig.System.forceLandscape = true;
ig.System.forcePortrait = false;
ig.System.rotateMsg = "Please rotate your device";
ig.System.rotateImg = null;

ig.ua.portrait = window.matchMedia ? window.matchMedia("(orientation: portrait)") : {};
ig.ua.landscape = window.matchMedia ? window.matchMedia("(orientation: landscape)") : {};

});