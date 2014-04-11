/**
 * Created by Administrator on 14-4-3.
 */
define(function(require, exports, module){
	var jQuery = require('jquery');
	(function ($) {
		$.extend($.fn, {
			Anchor: function(options){
				var config = {anchorTo: "#anchor-main", navDom: "#navMenu"};
				$(this).on('click', function(){
					var $this = $(this);
					$.seaBase.run(config, options, function(config){
						$this.closest('li').addClass('active').siblings('li').removeClass('active');
						$(config.anchorTo).load(config.target, function(){
							if(config.loadCSS) {
								require.async(config.loadCSS, function(){
									$(config.anchorTo).seaLoad();
								});
							}else{
								$(config.anchorTo).seaLoad();
							}
							if(config.success) config.success();
						});
					});
					return false;
				});
			},
			Collapse: function(options){
				var $this = $(this), config = {addActive:true, active: 'li', parent: document, speed: 'slow', easing: 'swing', css: 'sea.css'};
				$.seaBase.run(config, options, function(config){
					console.log(config);
					var activeID = $('.sea-collapse-in', $(config.parent)).attr('id');
					var current=(config.active == 'this')?$('[href=#'+activeID+']'):$('[href=#'+activeID+']').closest(config.active);
					if(config.addActive) current.addClass('active').find('a').addClass('active');
					$this.on('click', function(){
						var hasActive = (config.active == 'this')?$(this):$(this).closest(config.active);
						if(!hasActive.hasClass('active')){
							if($(config.target).is(':hidden')){
								$('.sea-collapse', $(config.parent)).hide(config.speed, config.easing);
								$(config.target).show(config.speed, config.easing);
							}else{
								$(config.target).hide(config.speed, config.easing);
							}
							if(config.addActive) hasActive.addClass('active').find('a').addClass('active');
							hasActive.siblings().removeClass('active').find('a').removeClass('active');
						}
						return false;
					});
				});
			},
			Shake: function(options){
				var $this = $(this), config = {direction: 'top', offset: '5px', speed: 800, easing: 'swing'};
				function animUp() {
					$this.animate({
						top: "-"+config.offset
					}, config.speed, config.easing, animDown);
				};
				function animDown() {
					$this.animate({
						top: config.offset
					}, config.speed, config.easing, animUp);
				};
				function animLeft() {
					$this.animate({
						left: "-"+config.offset
					}, config.speed, config.easing, animRight());
				};
				function animRight() {
					$this.animate({
						left: config.offset
					}, config.speed, config.easing, animLeft);
				};
				$.seaBase.run(config, options, function(config){
					if(config.direction == 'top') animUp();
					else animLeft();
				});
			},
			Turns: function(options){
				var $this = $(this), config = {direction: 'top', offset: '60px', speed: 300, easing: 'swing'};
				$.seaBase.run(config, options, function(config){
					$this.mouseover(function () {
						switch(config.direction){
							case 'left':
								$this.stop().animate({ left: '-'+config.offset}, config.speed, config.easing);
								break;
							case 'right':
								$this.stop().animate({ right: '-'+config.offset}, config.speed, config.easing);
								break;
							case 'down':
								$this.stop().animate({ down: '-'+config.offset}, config.speed, config.easing);
								break;
							default:
								$this.stop().animate({ top: '-'+config.offset}, config.speed, config.easing);
								break;
						}
					});
					$this.mouseout(function () {
						switch(config.direction){
							case 'left':
								$this.stop().animate({ left: 0}, config.speed, config.easing);
								break;
							case 'right':
								$this.stop().animate({ right: 0}, config.speed, config.easing);
								break;
							case 'down':
								$this.stop().animate({ down: 0}, config.speed, config.easing);
								break;
							default:
								$this.stop().animate({ top: 0}, config.speed, config.easing);
								break;
						}
					});
				});
			},
			Confirm: function(options){
				var config = {message: '退出系统登录状态', method: 'get', async: true};
				$(this).on('click', function(){
					$.seaBase.run(config, options, function(config){
						require.async('messenger', function(){
							if(confirm('真的'+config.message+'吗？')){
								var mess = $.globalMessenger().post({
									message: '请等待正在'+config.message+'...',
									type: 'info'
								});
								$.ajax({
									url: config.target,
									type: config.method,
									data: config.value,
									async: config.async,
									error: function(XMLHttpRequest, textStatus, errorThrown){
										if(typeof config.error == 'function') config.error(XMLHttpRequest, textStatus, errorThrown);
									},
									success: function(data, textStatus, jqXHR){
										if(typeof config.callback == 'function') config.callback(data, mess, textStatus, jqXHR);
									}
								});
							}
						});
					});
				})
			},
			seaTextition: function(options){
				var $this = $(this), config = {autoplay: true};
				require.async('textition', function(){
					$.seaBase.run(config, options, function(config){
						$this.textition(config);
					});
				});
			}
		});
	}(jQuery));
	return jQuery;
});