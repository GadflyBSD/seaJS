/**
 * Created by Administrator on 14-4-1.
 */
define(function(require, exports, module){
	var jQuery = require('jquery');
	(function ($) {
		$.extend($.fn, {
			productSelect: function(options){
				var dom = this,
					config = {
						market: '市场价',
						present: '当前价',
						number: '数量',
						numberInput: 'number',
						priceInput: 'price',
						propTextInput: 'propText',
						propertyInput: 'prop',
						css: 'Other/productSelect/jquery.productSelect.css'
					},
					getPrice = function(price){
						var defaultstats = true,
							val='';
						$('.goods-property', $(dom)).each(function(){
							if($(this).data('attrval') == undefined){
								defaultstats=false;
							}else{
								val+=val!=""?"_":"";
								val+= $(this).data('attrval');
							}
						});
						if(!!defaultstats){
							$('.presentPrice', $(dom)).find('dd>span>strong').text('￥'+price[val]);
							$('input:eq(0)', $(dom)).val(price[val]);
						}
					};
				$.seaBase.run(config, options, function(config){
					config.property.success = function(data, textStatus, jqXHR){
						$(dom).append('<input type="hidden" name="'+config.priceInput+'"><input type="hidden" name="'+config.propTextInput+'">');
						if(config.market){
							$(dom).append('<dl class="marketPrice"><dt>'+config.market+'</dt><dd><span><strong></strong></span></dd></dl>')
						}
						if(config.present){
							$(dom).append('<dl class="presentPrice"><dt>'+config.present+'</dt><dd><span><strong></strong></span></dd></dl>')
						}
						$.each(data, function(i, d){
							var prop = '<dl class="goods-property spec'+d.type+'"><dt>'+ d.prop+'</dt><dd><ul>';
							$.each(d.value, function(n, s){
								prop += '<li data-aid="'+n+'"><a href="javascript:;" title="'+ s.alt+'">';
								if(d.type == 'Img')
									prop += '<img src="'+ s.src+'" alt="'+s.alt+'">';
								else
									prop += s.alt;
								prop += '</a><i></i></li>';
							});
							prop += '</ul><input type="hidden" name="'+config.propertyInput+'['+i+']"></dd></dl>';
							$(dom).append(prop);
						});
						if(config.number){
							var requireFile = ['NumberPicker','dpNumberPicker/css/jquery.dpNumberPicker.plain.css'];
							$(dom).append('<dl class="numberPicker"><dt>'+config.number+'</dt><dd></dd></dl>');
							require.async(requireFile, function(){$(dom).find('.numberPicker>dd').dpNumberPicker({Name: config.numberInput, min:1, value:1});});
						}
					};
					config.price.success = function(data){
						var ta = new Array;
						$.each(data, function(i, d){
							ta.push(d);
						});
						$('.marketPrice', $(dom)).find('dd>span>strong').text('￥'+Math.max.apply(null,ta));
						$('.presentPrice', $(dom)).find('dd>span>strong').text('￥'+Math.min.apply(null,ta)+' - '+Math.max.apply(null,ta));
						$('li>a', $(dom)).on('click', function(){
							var aid = $(this).closest('li').data('aid');
							var propText = $('input:eq(1)', $(dom)).val();
							$(this).closest('li').addClass('selected').siblings().removeClass('selected');
							$(this).closest('dl').data('attrval', aid).find('input:eq(0)').val(aid);
							propText += $(this).closest('dl').find('dt').text() + ':' + $(this).attr('title') + ';';
							$('input:eq(1)', $(dom)).val(propText);
							getPrice(data);
						});
					};
					$.ajax(config.property);
					$.ajax(config.price);
				});
			}
		});
	}(jQuery));
	return jQuery;
});