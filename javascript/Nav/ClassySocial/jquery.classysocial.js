/*!
 * jQuery ClassySocial
 * www.class.pm
 *
 * Written by Marius Stanciu - Sergiu <marius@class.pm>
 * Licensed under the MIT license www.class.pm/LICENSE-MIT
 * Version 2.2.0
 *
 */
define(function(require, exports, module){
	var jQuery = require('jquery');
	(function($) {
		$.fn.ClassySocial = function(options) {
			var dom = this, config = {
				event: 'click', //click, hover
				css: 'Nav/ClassySocial/css/jquery.classysocial.css'
			};
			$(this).addClass('classysocial');
			$.seaBase.run(config, options, function(config){
				var ClassySocial = function(element) {
					this.profiles = {
						facebook: {
							url: 'http://www.facebook.com/{handle}',
							name: 'Facebook',
							tip: 'View my Facebook page'
						},
						google: {
							url: 'https://plus.google.com/{handle}',
							name: 'Google Plus',
							tip: 'View my Google Plus profile'
						},
						twitter: {
							url: 'https://twitter.com/{handle}',
							name: 'Twitter',
							tip: 'Check out my Twitter profile'
						},
						pinterest: {
							url: 'http://pinterest.com/{handle}',
							name: 'Pinterest',
							tip: 'View my Pinterest profile'
						},
						linkedin: {
							url: 'http://www.linkedin.com/profile/view?id={handle}',
							name: 'LinkedIn',
							tip: 'View my LinkedIn profile'
						},
						dribbble: {
							url: 'http://dribbble.com/{handle}',
							name: 'Dribbble',
							tip: 'View my Dribble page'
						},
						email: {
							url: 'mailto:{handle}',
							name: 'Email',
							tip: 'Send me an e-mail'
						},
						socl: {
							url: 'http://www.so.cl/#/profile/{handle}',
							name: 'Socl',
							tip: 'View my Socl profile'
						},
						instagram: {
							url: 'http://instagram.com/{handle}',
							name: 'Instagram',
							tip: 'View my Instagram profile'
						},
						vimeo: {
							url: 'http://vimeo.com/{handle}',
							name: 'Vimeo',
							tip: 'View my Vimeo profile'
						},
						youtube: {
							url: 'http://www.youtube.com/user/{handle}',
							name: 'YouTube',
							tip: 'Check out my Youtube profile'
						},
						github: {
							url: "https://www.github.com/{handle}",
							name: 'GitHub',
							tip: 'View my GitHub developer profile'
						},
						blogger: {
							profile_url: "http://www.blogger.com/profile/{handle}",
							name: 'Blogger',
							tip: 'View my Blogger profile'
						},
						deviantart: {
							url: 'https://{handle}.deviantart.com',
							name: 'DeviantArt',
							tip: 'Check out my DeviantArt page'
						},
						flickr: {
							url: 'http://www.flickr.com/photos/{handle}',
							name: 'Flickr',
							tip: 'View my Flickr images'
						},
						skype: {
							url: 'skype:{handle}?userinfo',
							name: 'Skype',
							tip: 'Call me on Skype'
						},
						steam: {
							url: 'http://steamcommunity.com/profiles/{handle}',
							name: 'Steam',
							tip: 'View my Steam profile'
						},
						wordpress: {
							url: 'http://{handle}.wordpress.com',
							name: 'Wordpress',
							tip: 'View my wordpress.com profile'
						},
						yahoo: {
							url: 'http://profile.yahoo.com/y/pulse/{handle}',
							name: 'Yahoo',
							tip: 'Check out my Yahoo profile'
						}
					};
					var el = $(element),
						networks = (el.data('networks'))?el.data('networks').toLowerCase().split(","):(config.networks)?config.networks:undefined,
						orientation = (el.data('orientation'))?el.data('orientation').toLowerCase():(config.orientation)?config.orientation:'default',
						arcStart = (el.data('arcStart'))?parseInt(el.data('arcStart')):(config.arcStart)?config.arcStart:0,
						arcLength = (el.data('arcLength'))?parseInt(el.data('arcLength')):(config.arcLength)?config.arcLength:180,
						radius = (el.data('radius'))?parseInt(el.data('radius')):(config.radius)?config.radius:80,
						gap = (el.data('gap'))?parseInt(el.data('gap')):(config.gap)?config.gap:50,
						picture = (el.data('picture'))?el.data('picture'):(config.picture)?config.picture:seajs.data.base+'Nav/ClassySocial/images/share_core_square.jpg',
						imageType = (el.data('imageType'))?el.data('imageType'):(config.imageType)?config.imageType:'picture',
						theme = (el.data('theme'))?el.data('theme'):(config.theme)?config.theme:'default';

					this.__constructor = function() {
						el.addClass('bubble');
						var template = this.template;
						if (imageType === 'facebook') {
							picture = 'https://graph.facebook.com/' + picture + '/picture?type=large';
						}
						if(networks && networks.length>0){
							el.html(template["container"].replace(/\{imageURL\}/gi, picture));
							var container = el.find(".scontainer");
							for (var t = 0; t < networks.length; t++) {
								var i = networks[t], o = this.profiles[i], u;
								if (o['url'] && el.attr('data-' + i + '-handle')) {
									u = o['url'].replace(/\{handle\}/gi, el.attr('data-' + i + '-handle'));
								}
								else {
									continue;
								}
								var a = template['button'].replace(/\{URL\}/gi, u).replace(/\{tip\}/gi, o['tip']).replace(/\{name\}/gi, o['name']).replace(/\{network\}/gi, i), f = $(a);
								container.append(f);
							}
						}else{
							var scontainer = '<a class="smain ' + theme + '" title="Find Me Here" alt="Find Me Here">' +
								'<img src="'+picture+'" title="Find Me Here" alt="Find Me Here"/>' +
								'</a>' +
								'<div class="scontainer ' + theme + '">'+$(dom).html()+'</div>';
							el.html(scontainer);
							$('.scontainer>a', el).each(function(i, d){
								$(d).addClass('sbutton');
							});
						}
						return this._build(template);
					};

					this._build = function(template) {
						var tpl = template['orientations'][orientation] ? template['orientations'][orientation] : template['orientations']['arc'];
						if(config.event == 'hover') el.find('.smain').hover(tpl);
						else el.find('.smain').click(tpl);
						return this;
					};

					this.template = {
						container: '<a class="smain ' + theme + '" title="Find Me Here" alt="Find Me Here">' +
							'<img src="{imageURL}" title="Find Me Here" alt="Find Me Here"/>' +
							'</a>' +
							'<div class="scontainer ' + theme + '"></div>',
						button: '<a class="sbutton {network}" title="{tip}" target="_blank" href="{URL}" data-network="{network}">{name}</a>',
						orientations: {
							arc: function() {
								if ($(this).hasClass('disabled')) {
									return;
								}
								var e = 250, t = 250, r = el.find('.sbutton').length, i = e + (r - 1) * t, s = 0;
								var o = $(this).outerWidth(), l = $(this).outerHeight();
								var c = el.find('.sbutton:eq(0)').outerWidth(), h = el.find('.sbutton:eq(0)').outerHeight();
								var p = (o - c) / 2, d = (l - h) / 2;
								if (!$(this).hasClass('active')) {
									$(this).addClass('disabled').delay(i).queue(function(e) {
										$(this).removeClass('disabled').addClass('active');
										e();
									});
									var v = arcLength / r, m = arcStart + v / 2;
									el.find('.sbutton').each(function() {
										var n = m / 180 * Math.PI, r = p + radius * Math.cos(n), i = d + radius * Math.sin(n);
										$(this).css({
											display: 'block',
											left: p + 'px',
											top: d + 'px'
										}).stop().delay(t * s).animate({
												left: r + 'px',
												top: i + 'px'
											}, e);
										m += v;
										s++;
									});
								}
								else {
									s = r - 1;
									$(this).addClass('disabled').delay(i).queue(function(e) {
										$(this).removeClass('disabled').removeClass('active');
										e();
									});
									el.find('.sbutton').each(function() {
										$(this).stop().delay(t * s).animate({
											left: p,
											top: d
										}, e);
										s--;
									});
								}
							},
							linedown: function() {
								if ($(this).hasClass('disabled')) {
									return;
								}
								var e = 500, t = 250, r = el.find('.sbutton').length, i = gap, s = e + (r - 1) * t, o = 1;
								var a = $(this).outerWidth(), f = $(this).outerHeight();
								var c = el.find('.sbutton:eq(0)').outerWidth(), h = el.find('.sbutton:eq(0)').outerHeight();
								var p = (a - c) / 2, d = (f - h) / 2, v = arcStart / 180 * Math.PI;
								if (!$(this).hasClass('active')) {
									$(this).addClass('disabled').delay(s).queue(function(e) {
										$(this).removeClass('disabled').addClass('active');
										e();
									});
									el.find('.sbutton').each(function() {
										var n = p + (p + i * o) * Math.cos(v), r = d + (d + i * o) * Math.sin(v);
										$(this).css({
											display: 'block',
											left: d + 'px',
											top: p + 'px'
										}).stop().delay(t * o).animate({
												left: r + 'px',
												top: n + 'px'
											}, e);
										o++;
									});
								}
								else {
									o = r;
									$(this).addClass('disabled').delay(s).queue(function(e) {
										$(this).removeClass('disabled').removeClass('active');
										e();
									});
									el.find('.sbutton').each(function() {
										$(this).stop().delay(t * o).animate({
											left: d,
											top: p
										}, e);
										o--;
									});
								}
							},
							line: function() {
								if ($(this).hasClass('disabled')) {
									return;
								}
								var e = 500, t = 250, r = el.find('.sbutton').length, i = gap, s = e + (r - 1) * t, o = 1;
								var a = $(this).outerWidth(), f = $(this).outerHeight();
								var c = el.find('.sbutton:eq(0)').outerWidth(), h = el.find('.sbutton:eq(0)').outerHeight();
								var p = (a - c) / 2, d = (f - h) / 2, v = arcStart / 180 * Math.PI;
								if (!$(this).hasClass('active')) {
									$(this).addClass('disabled').delay(s).queue(function(e) {
										$(this).removeClass('disabled').addClass('active');
										e();
									});
									el.find('.sbutton').each(function() {
										var n = p + (p + i * o) * Math.cos(v), r = d + (d + i * o) * Math.sin(v);
										$(this).css({
											display: 'block',
											left: p + 'px',
											top: d + 'px'
										}).stop().delay(t * o).animate({
												left: n + 'px',
												top: r + 'px'
											}, e);
										o++;
									});
								}
								else {
									o = r;
									$(this).addClass('disabled').delay(s).queue(function(e) {
										$(this).removeClass('disabled').removeClass('active');
										e();
									});
									el.find('.sbutton').each(function() {
										$(this).stop().delay(t * o).animate({
											left: p,
											top: d
										}, e);
										o--;
									});
								}
							}
						}
					};
					return this.__constructor();
				};
				return $(dom).each(function() {
					return new ClassySocial(this);
				});
			});
		};
	})(jQuery);
	return jQuery;
});