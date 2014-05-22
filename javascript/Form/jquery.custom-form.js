/**
 * Created by Administrator on 14-4-3.
 */
define(function(require, exports, module){
	var jQuery = require('jquery');
	(function ($) {
		$.extend($.fn, {
			Calendar: function(options){
				var $this = $(this), config = {changeMonth: true, changeYear: true, dayNamesMin: ["日","一","二","三","四","五","六"],
					monthNamesShort: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
					yearSuffix: " 年 ", showMonthAfterYear: !0, yearRange: "c-3:c+0", dateFormat: "yy年mm月dd日"};
				require.async('ui/jquery.ui.datepicker.min', function(){
					$.seaBase.run(config, options, function(config){
						if(typeof config.onSelect == 'function'){
							config.onSelect = function(){
								var date = $.seaBase.getMoment($this.datepicker( "getDate" ));
								config.onSelect(date);
							}
						}
						$this.datepicker(config);
					});
				});
			},
			seaKindeditor: function(options){
				var $this = $(this), config = {filterMode : true, allowFileManager : true, langPath: '/Form/kindeditor/lang/',
					action: 'post', height: '300px', width: '670px', afterBlur: function(){this.sync();}};
				require.async('kindeditor', function(KindEditor){
					KindEditor.basePath = seajs.data.base+'Form/kindeditor/';
					$.seaBase.run(config, options, function(config){
						config.uploadJson = seajs.data.base+'../kindeditor.php?ac=Upload';
						config.fileManagerJson = seajs.data.base+'../kindeditor.php';
						KindEditor.create($this, config);
					});
				});
			},
			VerifyImg: function(){
				$(this).css('cursor', 'pointer');
				$(this).on('click', function(){
					$(this).attr('src', '/Tool/verifyImg/'+Math.random());
				});
			},
			SmartWizard: function(param){
				require.async('SmartWizard', function($){
					$(param).on('click', function(){
						$(this).formWizard();
					});
				});
			},
			RadioCheckbox: function(options){
				var $this = $(this),
					poshytip = {
					className: 'tip-yellowsimple',
					showOn: 'hover',
					alignTo: 'target',
					alignX: 'right',
					alignY: 'center',
					offsetX: 10,
					showTimeout: 100
				};
				if($this.attr('placeholder')) poshytip.content = $this.attr('placeholder');
				else if($this.attr('title')) poshytip.content = $this.attr('title');
				else poshytip.content = undefined;
				if(typeof poshytip.content != undefined){
					require.async('poshytip', function(){
						var html = $this.html();
						$this.empty().append('<span>'+html+'</span>');
						$('span', $this).poshytip(poshytip);
					});
				}
				require.async('ui/jquery.ui.button.min', function(){
					$this.buttonset(options);
				});
			},
			seaEditable: function(options){
				var $this = $(this), config = {type: 'text', url: 'post.php', pk: '1', toggle: 'click',placement: 'top'};
				$.seaBase.run(config, options, function(config){
					switch (config.style){
						case 'ui':
							options.style = 'editableUI';
							break;
						case 'bootstrap':
							options.style = 'editableBT';
							break;
						default:
							options.className = $.seaBase.poshytipClass(options.className);
							options.style = 'editablePT';
							options.css = 'poshytip/css/'+options.className+'.css';
					}
					require.async(options.style, function(){
						if(config.mode == 'inline') $.fn.editable.defaults.mode = 'inline';
						if(config.style == 'editablePT')
							$.fn.editableContainer.defaults.className = config.className;
						$this.editable(config);
					});
				});
			},
			seaSwitch: function(ele, options){
				var config = {animate: true, onText: 'ON', offText: 'OFF'};
				require.async('Switch', function(){
					$.seaBase.run(config, options, function(config){
						$(ele).bootstrapSwitch(config);
					});
				});
			},
		});
	}(jQuery));
	return jQuery;
});
