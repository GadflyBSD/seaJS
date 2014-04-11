/*!
 * jQuery hoverGrid Plugin
 * https://github.com/carlwoodhouse/jquery.hoverGrid
 *
 * Copyright 2012, Carl Woodhouse, Mark Searle
 */
define( function(require, exports, module) {
	var jQuery = require('jquery');
	(function($){
		$.fn.hoverGrid = function(options){
			var dom = this, config ={
				'itemClass': '.item',
				'width': '180px',
				'height': '180px',
				'margin': '0 15px 0 0',
				'padding': '15px',
				'bgColor': '#222',
				'color': '#fff',
				'radius': '8px',
				'fadeInOut': 600
			};
			$.seaBase.run(config, options, function(settings){
				var hoverGridItem = {
						'width': settings.width,
						'height': settings.height,
						'margin': settings.margin,
						'float': 'left',
						'-webkit-border-radius': settings.radius,
						'-moz-border-radius': settings.radius,
						'border-radius': settings.radius,
						'overflow': 'hidden',
						'position': 'relative',
						'cursor': 'pointer'
					},
					hoverGridImg = {
						'-webkit-border-radius': settings.radius,
						'-moz-border-radius': settings.radius,
						'border-radius': settings.radius,
						'border': 0,
						'position': 'absolute',
						'margin': 0,
						'padding': 0
					},
					hoverGridCaption = {
						'width': settings.width,
						'height': settings.height,
						'padding': settings.padding,
						'background-color': settings.bgColor,
						'position': 'absolute',
						'left':0,
						'color': settings.color,
						'display': 'none',
						'line-height': '1.1',
						'-webkit-border-radius': settings.radius,
						'-moz-border-radius': settings.radius,
						'border-radius': settings.radius
					};
				$(dom).addClass('hover-grid');
				$(settings.itemClass, $(dom)).css(hoverGridItem);
				$('img', $(dom)).css(hoverGridImg);
				$('div.caption', $(dom)).css(hoverGridCaption).hide();
				return dom.each(function(){
					var hoverGrid = $(this);
					$(hoverGrid).find(settings.itemClass).hover(function () {
							$(this).find('div.caption').stop(false, true).fadeIn(settings.fadeInOut);
						},
						function () {
							$(this).find('div.caption').stop(false, true).fadeOut(settings.fadeInOut);
						});
				});
			});
		};
	})(jQuery);
	return jQuery;
});