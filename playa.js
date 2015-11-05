/*!
 * Playa
 * Native html 5 video and Youtube api equalizer
 *
 * https://github.com/emilsall/jQueryPlaya
 */

;(function ($, window, document, undefined) {
	var plugName = "playa",
		defaults = {
			// source
			youtube: null,
			path: null,

			// settings
			autoplay: false,
			loop: false,
			controls: true,

			// callbacks
			onLoad: function () {},
			onPlay: function () {},
			onPause: function () {},
			onEnd: function () {}
		};

	// Constructor
	var Plug = function (element, options) {
		this.element = element;
		this.$ = $(element);
		this.options = $.extend({}, defaults, options);

		this._defaults = defaults;
		this._name = plugName;

		// states
		this.youtubeLoaded = false;
		this.paused = true;

		this.init();
	};


	// Private methods
	var createPlayer = function () {
		var player = this;
		var $html;

		if (this.isNative) {
			// create native video element
			$html = $('<video />').attr({
				src: this.options.path,
				width: '100%',
				autoplay: this.options.autoplay,
				loop: this.options.loop,
				controls: this.options.controls
			});

			// setup event listeners
			$html.on('loadeddata', function (e) {
				loaded.apply(player);
			}).on('playing', function (e) {
				played.apply(player);
			}).on('pause', function (e) {
				paused.apply(player);
			}).on('ended', function (e) {
				ended.apply(player);
			});

			// store in instance
			this.player = $html.prependTo(this.$)[0];

		} else {
			// create youtube player
			$html = $('<div />').prependTo(this.$);

			// and store in instance
			this.player = new YT.Player($html[0], {
				height: '390',
				width: '640',
				videoId: this.options.youtube,
				playerVars: {
					'autoplay': this.options.autoplay ? 1 : 0,
					'controls': this.options.controls ? 1 : 0,
					'modestbranding': 1,
					'rel': 0,
					'showinfo': 0
				},
				events: {
					'onReady': function () {
						loaded.apply(player);
					},
					'onStateChange': function (e) {
						if (e.data === 1) {
							played.apply(player);
						} else if (e.data === 2) {
							paused.apply(player);
						} else if (e.data === 0) {
							ended.apply(player);
						}
					}
				}
			});
		}
	};

	// trigger custom events and callbacks
	var loaded = function () {
		this.$.trigger('playaLoaded');
		this.options.onLoad.apply(this);
	};

	var played = function () {
		this.$.trigger('playaPlayed');
		this.options.onPlay.apply(this);
	};

	var paused = function () {
		this.$.trigger('playaPaused');
		this.options.onPause.apply(this);
	};

	var ended = function () {
		this.$.trigger('playaEnded');
		this.options.onEnd.apply(this);

		// youtube fake loop
		if (!this.isNative && this.options.loop) this.player.playVideo();
	};

	// load youtube api and run callback
	var loadYoutube = function (player, callback) {
		window.onYouTubeIframeAPIReady = function () {
			callback.apply(player);
		};

		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	};

	// Public methods
	Plug.prototype = {
		init: function () {
			var player = this;

			// store some info
			this.html = this.$.html();
			this.isNative = !!this.options.path;

			// create player
			if (this.isNative || typeof window.YT != 'undefined') {
				createPlayer.apply(this);
			} else {
				loadYoutube(this, function () {
					createPlayer.apply(this);
				});
			}

			// listen for events
			this.$.on('click.playa', '[data-playa-event]', function (e) {
				var event = $(this).data('playa-event');
				player[event]();
			});
		},

		play: function () {
			if (this.isNative) {
				this.player.play();
			} else {
				this.player.playVideo();
			}
		},

		pause: function () {
			if (this.isNative) {
				this.player.pause();
			} else {
				this.player.pauseVideo();
			}
		},

		destroy: function () {
			this.$.html(this.html);
			this.$.off('.playa');
			this.$.data('plug_' + plugName, undefined);
		}
	};


	// jQuery plugin factory
	$.fn[plugName] = function (options) {
		var plug = this.data('plug_' + plugName);

		// destroy previous instance
		if (plug instanceof Plug && options) {
			plug.destroy();
		}

		// create intance
		if (options) {
			plug = new Plug(this[0], options);
			this.data('plug_' + plugName, plug);
		}

		return plug;
	};

	// Auto init elements with data attribute
	$('[data-' + plugName + ']').each(function () {
		$(this)[plugName]($(this).data(plugName));
	});

})(jQuery, window, document);

