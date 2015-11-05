# jQueryPlaya
Native html5 video element and Youtube api equalizer

Just basic methods for play and pause and some callbacks and events for load, play, pause and end.

Handy when you have mixed youtube and native players on one site, or maybe you want to have a native player as fallback for [certain regions](https://en.wikipedia.org/wiki/Censorship_of_YouTube) that block youtube.

###[Basic demo @ jsbin.com](http://jsbin.com/bazape/edit?html,js,output)

---

## Init player from javascript:

```js
$('.target').playa({
	// source
	path: null,		// file path/url for native player
	youtube: null,	// youtube ID for youtube player
					// (if you provide both, youtube will be ignored)

	// settings
	autoplay: false,
	loop: false,
	controls: true,

	// callbacks
	onLoad: function () {},
	onPlay: function () {},
	onPause: function () {},
	onEnd: function () {}
});
```

## Auto-init player from markup:
```html
<div data-playa='{"youtube": "wer234WE", "autoplay": "true"}'></div>
```

## Access an initiated player instance:

```js
// returned instance
var player = $('.target').playa({
	//...
});

player.play();


// data object
var player = $('.target').data('plug_playa');

player.play();


// run plugin without options
var player = $('.target').playa();

player.play();

```

---

### Requirements:
jQuery, duh.

### Roadmap:
* Add a demo page
* Add more methods, like volume and skipping
* Handle aspect ratio and resizing

See ya!





