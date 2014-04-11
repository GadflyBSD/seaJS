define( function(require, exports, module) {
	var jQuery = require('linq');
	(function ($) {
		$.extend({
			linq: function(data, upid, value, id, def_name){
				$('#'+id).empty().prepend('<option value="">请选择'+def_name+'</option>');
				data.Where(function(x){ return x.upid == upid })
					.ForEach(function(x){
						if(x.name == value)
							$('#'+id).append('<option value="'+x.name+'" _value="'+x.id+'" selected="selected">'+x.name+'</option>');
						else
							$('#'+id).append('<option value="'+x.name+'" _value="'+x.id+'">'+x.name+'</option>');
					});
			}
		});
		$.fn.community = function(param){
			var config = {'class': 'form-control', 'province': 'resideprovince', 'city': 'residecity', 'dist': 'residedist',
				'pDefault': 0, 'cDefault': 0, 'dDefault': 0};
			$.extend(config, param);
			$(this).find('.city:eq(0)').empty().append('<select id="' + config.province + '" name="' + config.province + '" class="'+config.class+'" data-rule="所在省份:required"></select>');
			$(this).find('.city:eq(1)').empty().append('<select id="' + config.city + '" name="' + config.city + '" class="'+config.class+'" data-rule="所在城市:required"></select>');
			$(this).find('.city:eq(2)').empty().append('<select id="' + config.dist + '" name="' + config.dist + '" class="'+config.class+'" data-rule="所在区县:required"></select>');
			if (config.cDefault == 0) $('#'+config.city).empty().hide();
			if (config.dDefault == 0) $('#'+config.dist).empty().hide();
			$.get('/Public/city.json', function(city){
				var data = $.Enumerable.From(city);
				$.linq(data, 0, config.pDefault, config.province, '省份');
				var upid = $('#'+config.province+' option:selected').attr('_value');
				$.linq(data, upid, config.cDefault, config.city, '城市');
				upid = $('#'+config.city+' option:selected').attr('_value');
				$.linq(data, upid, config.dDefault, config.dist, '区县');
				$('#'+config.province).bind('change', function(){
					if($("#"+config.province).val()) $('#'+config.city).show();
					$('#'+config.dist).hide();
					$.linq(data, $("#"+config.province+' option:selected').attr('_value'), 0, config.city, '城市');
				});
				$('#'+config.city).bind('change', function(){
					if($("#"+config.city).val()) $('#'+config.dist).show();
					$.linq(data, $("#"+config.city+' option:selected').attr('_value'), 0, config.dist, '区县');
				});
			});
		};
	}(jQuery));
	return jQuery;
});