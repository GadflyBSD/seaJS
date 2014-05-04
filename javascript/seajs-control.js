/**
 * Created by Administrator on 14-1-28.
 * dfhdfh
 */
define(function(require, exports, module){
	var jQuery = require('jquery');
	(function ($) {
		$.extend($.fn, {
			coffee: function(obj){
				for(var eName in obj)
					for(var selector in obj[eName])
						$(this).on(eName, selector, obj[eName][selector]);
			},
			seaLoad: function(param){
				$('[data-sea]', $(this)).each(function(i, dom){
					var module = $(dom).data('sea'),
						options = {title: ($(dom).attr('title'))?$(dom).attr('title'):$(dom).text()},
						conf = $(dom).data('config'), opti = $(dom).data('option'),
						optStr = (typeof arguments[0] == 'string')?arguments[0]:(typeof arguments[1] == 'string')?arguments[1]:'SeaOptions';
					if($(dom).attr('href') || $(dom).data('target')) options.target = ($(dom).data('target'))?$(dom).data('target'):$(dom).attr('href');
					try{
						$.extend(options, eval('({'+$(dom).data('option')+'})'));
					}catch(error){
						try{
							$.extend(options, eval('('+$(dom).data('option')+')'));
						}catch(error){}
					}
					$.extend(options, (conf)?eval(optStr+'.'+conf):(typeof opti == 'object')?opti:{});
					if($(dom).data('tmpl')){
						if(typeof options.tmpl != 'object') options.tmpl= {};
						try{
							$.extend(options.tmpl, eval('({'+$(dom).data('tmpl')+'})'));
						}catch(error){
							try{
								$.extend(options.tmpl, eval('('+$(dom).data('tmpl')+')'));
							}catch(error){}
						}
					}
					if(typeof param == 'object') $.extend(options, param);
					$(dom).seaModule(module, options);
				});
			},
			seaModule: function(){
				var module = (typeof arguments[0] == 'string')?arguments[0]:'alert',
					option = (typeof arguments[1] == 'object')?arguments[1]:{},
					$this = $(this);
				require.async(module, function(){
					$.extend($.fn, {seaFunction: eval('$.fn.'+module)});
					$this.seaFunction(option);
				});
			}
		});
		$.extend($, {
			seaBase: {
				getMoment: function(getDate){
					var d = new Date(getDate);
					var x = (1901 - d.getFullYear()) % 12;
					var sign = {
						year: d.getFullYear(),
						month: d.getMonth() + 1,
						day: d.getDate()
					};
					with (sign){
						sign.constellation = function(){
							if (month == 1 && day >=20 || month == 2 && day <=18) {return "水瓶座";}
							if (month == 1 && day > 31) {return "Huh?";}
							if (month == 2 && day >=19 || month == 3 && day <=20) {return "双鱼座";}
							if (month == 2 && day > 29) {return "Say what?";}
							if (month == 3 && day >=21 || month == 4 && day <=19) {return "白羊座";}
							if (month == 3 && day > 31) {return "OK.  Whatever.";}
							if (month == 4 && day >=20 || month == 5 && day <=20) {return "金牛座";}
							if (month == 4 && day > 30) {return "I'm soooo sorry!";}
							if (month == 5 && day >=21 || month == 6 && day <=21) {return "双子座";}
							if (month == 5 && day > 31) {return "Umm ... no.";}
							if (month == 6 && day >=22 || month == 7 && day <=22) {return "巨蟹座";}
							if (month == 6 && day > 30) {return "Sorry.";}
							if (month == 7 && day >=23 || month == 8 && day <=22) {return "狮子座";}
							if (month == 7 && day > 31) {return "Excuse me?";}
							if (month == 8 && day >=23 || month == 9 && day <=22) {return "处女座";}
							if (month == 8 && day > 31) {return "Yeah. Right.";}
							if (month == 9 && day >=23 || month == 10 && day <=22) {return "天秤座";}
							if (month == 9 && day > 30) {return "Try Again.";}
							if (month == 10 && day >=23 || month == 11 && day <=21) {return "天蝎座";}
							if (month == 10 && day > 31) {return  "Forget it!";}
							if (month == 11 && day >=22 || month == 12 && day <=21) {return "人马座";}
							if (month == 11 && day > 30) {return "Invalid day";}
							if (month == 12 && day >=22 || month == 1 && day <=19) {return "摩羯座";}
							if (month == 12 && day > 31) {return "No way!";}
						}
						sign.zodiac = function(){
							if (x == 1 || x == -11) {return "鼠";}
							if (x == 0) {return "牛";}
							if (x == 11 || x == -1) {return "虎";}
							if (x == 10 || x == -2) {return "兔";}
							if (x == 9 || x == -3) {return "龙";}
							if (x == 8 || x == -4) {return "蛇";}
							if (x == 7 || x == -5) {return "马";}
							if (x == 6 || x == -6) {return "羊";}
							if (x == 5 || x == -7) {return "猴";}
							if (x == 4 || x == -8) {return "鸡";}
							if (x == 3 || x == -9) {return "狗";}
							if (x == 2 || x == -10) {return "猪";}
						}
					}
					return sign;
				},
				poshytipClass: function(param){
					switch (param){
						case 'darkgray':
							return 'tip-darkgray';
						case 'yellow':
							return 'tip-yellow';
						case 'violet':
							return 'tip-violet';
						case 'twitter':
							return  'tip-twitter';
						case 'skyblue':
							return  'tip-skyblue';
						default:
							return  'tip-yellowsimple';
					}
				},
				run: function(config, option, func){
					var async = new Array(),
						loading = function (){
							if(typeof config.before == 'function') config.before();
							if(typeof func == 'function') func(config);
							if(typeof config.after == 'function') config.after();
						};
					$.extend(config, option);
					if(config.easing && $.inArray(config.easing, ["linear", "swing"]) == -1) async.push('easing');
					if(config.css) async.push(config.css);
					if(async.length>0){
						require.async(async, function(){
							loading();
						});
					}else{
						loading();
					}
				},
				mathRand: function(){
					var Num="";
					for(var i=0;i<6;i++){
						Num+=Math.floor(Math.random()*10);
					}
					return Num;
				}
			},
			seaMethod: function(){
				var module = (typeof arguments[0] == 'string')?arguments[0]:'alert',
					option = (typeof arguments[1] == 'object')?arguments[1]:{};
				require.async(module, function(){
					$.extend($, {seaFunction: eval('$.'+module)});
					$.seaFunction(option);
				});
			}
		});
	}(jQuery));
	return jQuery;
});