/**
 * Created by Administrator on 14-2-24.
 */
define( function(require, exports, module) {
	var jQuery = require('jquery');
	require('TopAdvertisement/TopAdvertisement.css');
	(function( $ ) {
		$.extend($, {
			open_gg960: function (param){
				$('.gg_full .gg_fcon').html(param.gg960Con).slideDown(300,function(){
					if(param.showBtn !== false){
						$('.gg_full .gg_fbtn').fadeIn();
					}
					if(param.gg960Time){clearTimeout(param.gg960Time);}
					param.gg960Time = setTimeout($.close_gg960,param.gg960ShowTime);
				});
			},
			close_gg960: function (){
				$('.gg_full .gg_fcon').slideUp(500,function(){
					$(this).html('');
					$('.gg_fclose').hide();
					$('.gg_freplay').show();
				});
			}
		});
		$.extend($.fn, {
			TopAdvertisement: function(options){
				var config = {gg960ShowTime: 10000, gg960Time: null, fullAdType: 'swf', fullAdUrl: '/', fullAdName: 'images/qpad.swf',showBtn:true};
				$.extend(options,config);
				$.seaBase.run(config, options, function(config){
					$(this).append('<div class="gg_fbtn"><a style="display: none" class=gg_freplay title=重播 href="#"></a><a class=gg_fclose title=关闭 href="#"></a></div><div class=gg_fcon></div>');
					if(config.fullAdName){
						if(config.fullAdType == 'swf'){
							config.gg960Con = '<embed wmode="transparent" height="400" width="980" flashvars="alink1='+config.fullAdUrl+'" allowscriptaccess="always" quality="high" name="Advertisement" id="Advertisement" style="" type="application/x-shockwave-flash" src="'+config.fullAdName+'"></embed>';
						}else{
							config.gg960Con = '<a href="'+config.fullAdUrl+'" target="_blank"><img width="980" height="400" src="images/qpad.jpg"/></a>';//flash无法显示时，显示JPG广告
						}
						setTimeout($.open_gg960(config),1500);//延迟显示
					}
					$('.gg_fclose').click(function(){
						if(config.gg960Time){clearTimeout(config.gg960Time);}
						$.close_gg960();
						return false;
					});
					$('.gg_freplay').click(function(){
						if(config.gg960Time){clearTimeout(config.gg960Time);}
						$.open_gg960(false);
						$('.gg_freplay').hide();
						$('.gg_fclose').show();
						return false;
					});
				});
			}

		});
	})( jQuery );
	return jQuery;
});