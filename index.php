<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta id="viewport" name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
	<title>Spine</title>
	<style type="text/css">
		html,body {
			margin: 0;
		}
		canvas {
			display: block;
		}
	</style>

	<script type="text/javascript" src="lib/impact/impact.js"></script>
	<script type="text/javascript" src="lib/game/main.js"></script>
</head>
<body>
	<canvas id="canvas"></canvas>
	<?php if($_SERVER['HTTP_HOST'] == "localhost"): ?><script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script><?php endif ?>
</body>
</html>