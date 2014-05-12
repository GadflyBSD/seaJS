/**
 * Created by Administrator on 14-4-3.
 */
define(function(require, exports, module){
	var jQuery = require('jquery');
	(function ($) {
		$.extend($.fn, {
			seaStellar: function(options){
				var $this = $(this), config = {horizontalOffset: 40, verticalOffset: 150};
				$.seaBase.run(config, options, function(config){
					require.async('stellar', function(){
						$this.css('background-image', 'url('+config.target+')');
						$this.stellar(config);
					});
				});
			},
			seaCarouFredSel: function(options){
				var $this = $(this), config = {prev: '#prev', next: '#next', pagination: '#pager', scroll: 1000, height: '200px'};
				$.seaBase.run(config, options, function(config){
					require.async('carouFredSel', function(){
						$this.carouFredSel(config);
					});
				});
			},
			seaElastislide: function(options){
				var $this = $(this), config = {style:'horizontalOverall',minItems:4,easing:'ease-in-out',start:0,speed:800};
				$.seaBase.run(config, options, function(config){
					require.async('elastislide', function(){
						$this.autoSlide(config);
					});
				});
			}
		});
	}(jQuery));
	return jQuery;
});