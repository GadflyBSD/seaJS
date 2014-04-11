/**
 * Created by Administrator on 14-3-27.
 */
define( function(require, exports, module) {
	var jQuery = require('jquery');
	require('Layout/meerkat/meerkat.css');
	(function ($) {
		$.fn.extend({
			Meerkat: function(options) {
				var defaults = {
					background: 'none',
					opacity: .65,
					height: 'auto',
					width: '100%',
					position: 'bottom',
					close: '.close-meerkat',
					minimize: '.minimize-meerkat',
					dontShowAgain: '.shutdown-meerkat',
					dontShowAgainAuto: false,
					animationIn: 'none',
					animationOut: null,
					easingIn: 'swing',
					easingOut: 'swing',
					animationSpeed: 'normal',
					cookieExpires: 0,
					removeCookie: '.removeCookie',
					delay: 0,
					onMeerkatShow: function() {},
					timer: null
				};
				var settings = $.extend(defaults, options);
				$('#meerkat-wrap').replaceWith( $('#meerkat-container').contents().hide() );
				$(this).removeClass('pos-top pos-right pos-bottom pos-left').addClass('pos-'+settings.position);
				if(!$(this).find('div').is('.adsense')){
					var html = $(this).html();
					$(this).empty().append('<div class="adsense">'+html+'</div>');
				}
				if(!$(this).find('a').is('.button-meerkat')){
					if(settings.minimize) $(this).prepend('<a href="javascript:void(0);" class="button-meerkat minimize-meerkat"></a>');
					if(settings.dontShowAgain) $(this).prepend('<a href="javascript:void(0);" class="button-meerkat shutdown-meerkat"></a>');
					if(settings.close) $(this).prepend('<a href="javascript:void(0);" class="button-meerkat close-meerkat"></a>');
					if(settings.minimize){
						$(this).after('<a href="javascript:void(0);" id="minimizeWrap"></a>');
					}
				}
				$('.meerkat-magin').remove();
				if(settings.position == 'top' && !$('body>div').first().is('#meerkat-magin-top')){
					$('body').prepend('<div id="meerkat-magin-top" class="meerkat-magin"/>');
					$('#meerkat-magin-top').css('height', settings.height);
				}
				if(settings.position == 'bottom' && !$('body>div').last().is('#meerkat-magin-bottom')){
					$('body').append('<div id="meerkat-magin-bottom" class="meerkat-magin" />');
					$('#meerkat-magin-bottom').css('height', settings.height);
				}
				if(settings.minimize){
					$('#minimizeWrap').removeClass('minimize-top minimize-right minimize-bottom minimize-left').addClass('minimize-'+settings.position).hide();
				}
				if($.easing.def){
					settings.easingIn = settings.easingIn;
					settings.easingOut = settings.easingOut;
				}else {
					settings.easingIn = 'swing';
					settings.easingOut = 'swing';
				}
				if(settings.animationOut === null){
					settings.animationOut = settings.animationIn;
				}
				settings.delay = settings.delay * 1000;
				if(settings.timer != null){
					settings.timer = settings.timer * 1000;
				}
				function createCookie(name,value,days) {
					if (days) {
						var date = new Date();
						date.setTime(date.getTime()+(days*24*60*60*1000));
						var expires = "; expires="+date.toGMTString();
					}
					else {
						var expires = "";
					}
					document.cookie = name+"="+value+expires+"; path=/";
				}
				function readCookie(name) {
					var nameEQ = name + "=";
					var ca = document.cookie.split(';');
					for(var i=0;i < ca.length;i++) {
						var c = ca[i];
						while (c.charAt(0)===' ') c = c.substring(1,c.length);
						if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
					}
					return null;
				}
				function eraseCookie(name) {
					createCookie(name,"",-1);
				}
				$(settings.removeCookie).click(function(){ eraseCookie('meerkat')});
				return this.each(function() {
					var element = $(this);
					if(readCookie('meerkat') != "dontshow"){
						settings.onMeerkatShow.call(this);
						function animateMeerkat(showOrHide, fadeOrSlide){
							var meerkatWrap = $('#meerkat-wrap');
							if(fadeOrSlide === "slide"){
								if(settings.position === "left" || settings.position === "right"){
									var animationType = 'width';
								} else {
									var animationType = 'height';
								}
							} else {
								var animationType = "opacity";
							}
							var animationProperty = {};
							animationProperty[animationType] = showOrHide;
							if(showOrHide === "show"){
								if(fadeOrSlide !== "none"){
									if(settings.delay > 0){
										$(meerkatWrap).hide().delay(settings.delay).animate(animationProperty,settings.animationSpeed, settings.easingIn);
									} else {
										$(meerkatWrap).hide().animate(animationProperty,settings.animationSpeed, settings.easingIn);
									}
								} else if ((fadeOrSlide === "none")&&(settings.delay > 0)){
									$(meerkatWrap).hide().delay(settings.delay).show(0);
								} else {
									$(meerkatWrap).show();
								}
								$(element).show(0);
							}
							if(showOrHide === "hide"){
								if(fadeOrSlide !== "none"){
									if(settings.timer !== null){
										$(meerkatWrap).delay(settings.timer).animate(animationProperty,settings.animationSpeed, settings.easingOut,
											function(){
												$(this).destroyMeerkat();
												if(settings.dontShowAgainAuto === true) { createCookie('meerkat','dontshow', settings.cookieExpires); }
											});
									}
									$(settings.close).click(function(){
										$(meerkatWrap).stop().animate(animationProperty,settings.animationSpeed, settings.easingOut, function(){$(this).destroyMeerkat();});
										$('.meerkat-magin').remove();
										return false;
									});
									$(settings.minimize).click(function(){
										$(meerkatWrap).stop().animate(animationProperty,settings.animationSpeed, settings.easingOut, function(){$(this).destroyMeerkat();});
										$('#minimizeWrap').show(settings.animationSpeed, settings.easingOut);
										$('.meerkat-magin').remove();
										$('#minimizeWrap').on('click', function(){
											element.Meerkat(settings);
										});
										return false;
									});
									$(settings.dontShowAgain).click(function(){
										$(meerkatWrap).stop().animate(animationProperty,settings.animationSpeed, settings.easingOut, function(){$(this).destroyMeerkat();});
										createCookie('meerkat','dontshow', settings.cookieExpires);
										$('.meerkat-magin').remove();
										return false;
									});
								} else if((fadeOrSlide === "none")&&(settings.timer !== null)) {
									$(meerkatWrap).delay(settings.timer).hide(0).queue(function(){
										$(this).destroyMeerkat();
									});
								} else {
									$(settings.close).click(function(){
										$(meerkatWrap).hide().queue(function(){
											$(this).destroyMeerkat();
										});
										return false;
									});
									$(settings.dontShowAgain).click(function(){
										$(meerkatWrap).hide().queue(function(){
											$(this).destroyMeerkat();
										});
										createCookie('meerkat','dontshow', settings.cookieExpires);
										return false;
									});
								}
							}
						}
						$('html, body').css({'margin':'0', 'height':'100%'});
						$(element).wrap('<div id="meerkat-wrap"><div id="meerkat-container"></div></div>');
						$('#meerkat-wrap').css({'position':'fixed', 'z-index': '10000', 'width': settings.width, 'height': settings.height}).css(settings.position, "0");
						$('#meerkat-container').css({'background': settings.background, 'height': settings.height});
						if(settings.position === "left" || settings.position === "right"){
							$('#meerkat-wrap').css("top", 0);
						}else{
							$('#meerkat-wrap').css("left", 0);
						}

						if(settings.opacity != null){
							$("#meerkat-wrap").prepend('<div class="opacity-layer"></div>');
							$('#meerkat-container').css({'background': 'transparent', 'z-index' : '2', 'position': 'relative'});
							$(".opacity-layer").css({
								'position': 'absolute',
								'top' : '0',
								'height': '100%',
								'width': '100%',
								'background': settings.background,
								"opacity" : settings.opacity
							});

						}
						if($.browser.msie && $.browser.version <= 6){
							$('#meerkat-wrap').css({'position':'absolute', 'bottom':'-1px', 'z-index' : '0'});
							if($('#ie6-content-container').length == 0){
								$('body').children()
									.filter(function (index) {
										return $(this).attr('id') != 'meerkat-wrap';
									})
									.wrapAll('<div id="ie6-content-container"></div>');
								$('html, body').css({'height':'100%', 'width':'100%', 'overflow':'hidden'});
								$('#ie6-content-container').css({'overflow':'auto', 'width':'100%', 'height':'100%', 'position':'absolute'});
								var bgProperties = document.body.currentStyle.backgroundColor+ " ";
								bgProperties += document.body.currentStyle.backgroundImage+ " ";
								bgProperties += document.body.currentStyle.backgroundRepeat+ " ";
								bgProperties += document.body.currentStyle.backgroundAttachment+ " ";
								bgProperties += document.body.currentStyle.backgroundPositionX+ " ";
								bgProperties += document.body.currentStyle.backgroundPositionY;
								$("body").css({'background':'none'});
								$("#ie6-content-container").css({'background' : bgProperties});
							}
							var ie6ContentContainer = document.getElementById('ie6-content-container');
							if((ie6ContentContainer.clientHeight < ie6ContentContainer.scrollHeight) && (settings.position != 'left')) {
								$('#meerkat-wrap').css({'right' : '17px'});
							}
						}

						switch (settings.animationIn)
						{
							case "slide":
								animateMeerkat("show", "slide");
								break;
							case "fade":
								animateMeerkat("show", "fade");
								break;
							case "none":
								animateMeerkat("show", "none");
								break;
							default:
								alert('The animationIn option only accepts "slide", "fade", or "none"');
						}

						switch (settings.animationOut)
						{
							case "slide":
								animateMeerkat("hide", "slide");
								break;

							case "fade":
								animateMeerkat("hide", "fade");
								break;

							case "none":
								if(settings.timer != null){
									$('#meerkat-wrap').delay(settings.timer).hide(0).queue(function(){
										$(this).destroyMeerkat();
									});
								}
								$(settings.close).click(function(){
									$('#meerkat-wrap').hide().queue(function(){
										$(this).destroyMeerkat();
									});
								});
								$(settings.dontShowAgain).click(function(){
									$('#meerkat-wrap').hide().queue(function(){
										$(this).destroyMeerkat();
									});
									createCookie('meerkat','dontshow', settings.cookieExpires);
								});
								break;

							default:
								alert('The animationOut option only accepts "slide", "fade", or "none"');
						}
					} else {
						$(element).hide();
					}
				});
			},
			destroyMeerkat: function() {
				$('#meerkat-wrap').replaceWith( $('#meerkat-container').contents().hide() );
			}
		});
	}(jQuery));
	return jQuery;
});