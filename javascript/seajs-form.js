/**
 * Created by Administrator on 14-1-27.
 *
 * $.fn.formValidate 表单验证插件
 * HTML <form action="URL" method="ajax/post/get" data-form="validate" data-msgTime="2">
 *     action：指定表单提交方向
 *     method：指定表单提交方式
 *     data-toggle="validate"：自动调用表单验证插件
 *     data-msgTime：消息提示框多长时间后消失，默认值是5秒，可不用设定
 * @param Rules Object 自定义验证规则
 * @param callback Function 验证成功后的回调函数
 *          @param data Object 序列化后的表单所提交的数据
 *          @param note Json Ajax提交后的返回值
 *          @param mess Object 消息提示框对象
 *
 * $.fn.formDisplay 表单应用插件
 * @param 参照表单验证插件，传递自定义验证规则和回调函数
 * 根据HTML 标签属性触发
 * [data-form=validate]
 *      <form action="URL" method="ajax/post/get" data-form="validate"> 如果有【data-form="validate"】自动调用表单验证插件
 *      <button type="submit" disabled="disabled">提交按钮</button>，当鼠标焦点集中到表单任意input,select,textarea元素时，移除按钮的disabled属性，并异步加载表单验证插件
 *[data-form=reside]
 *      通过选择器[data-toggle=reside]判断表单是否有三级下拉菜单，如果有则动态加载
 *      exp.    <div data-form="reside">
 *                  <div class="city resideprovince"></div><div class="city residecity"></div><div class="city residedist"></div>
 *              </div>
 *[data-form=datepicker]
 *      通过选择器[data-toggle=datepicker]判断表单是否有时间选择器，如果有则动态加载
 *      exp.    <div data-form="datepicker">
 *                  <input type="text" name="datepicker" placeholder="点击选择日期">
 *              </div>
 *[data-form=buttons]
 *      通过选择器[data-toggle=buttons]判断表单是否有单选或多选按钮组，如果有则动态加载
 *      exp.    <div data-form="buttons">
 *                  <input type="radio" id="gender1" name="gender"><label for="gender1">男士</label>
 *                  <input type="radio" id="gender2" name="gender"><label for="gender2">女士</label>
 *              </div>
 *[data-form=verifyImg]
 *      通过选择器[data-toggle=verifyImg]判断表单是否有验证码，如果有则动态加载，验证码输入框的名称为：vdcode
 *      exp.    <div>
 *                  <label>请输入验证码</label>
 *                  <input type="text" name="vdcode"/>
 *                  <span><img title='刷新验证码' src='/Tool/verifyImg' data-form="verifyImg" /></span>
 *              </div>
 *[data-toggle=modalForm]
 *      通过选择器[data-toggle=modalForm]判断页面是否有模态弹出框表单，如果有则当点击弹出元素时异步加载
 *      注意：页面自动加载模式使用系统默认的表单验证规则和回调函数。如需特殊自定义，请自行书写javascript调用弹出表单，详见弹出框表单插件
 *      data-target="testreport" 的值指向jQuery.tmpl模板的ID，该ID模板为弹出框的具体内容；
 *              模板内的表单请如此标注ID：id="${id}DialogForm"，例如：<form action="URL" method="ajax" data-toggle="validate" id="${id}DialogForm">
 *      data-title="检测报告查询" 的值为弹出框的标题内容。
 *      exp.    <button type="button" data-form="modalForm" data-target="testreport" data-title="检测报告查询">检测报告查询</button>
 *
 * $.fn.formDialog 弹出框表单插件
 * 注意：如果是自定义表单验证规则或回调函数，不用定义data-toggle
 * @param 参照表单验证插件，传递自定义验证规则和回调函数
 * @exp
 *      HTML code
 *          <button type="button" data-target="testreport" data-title="检测报告查询">检测报告查询</button>
 *      Javascript code
 *          $('button:[data-target]').on('click', function(){
 *              $(this).formDialog(Rules, callback);
 *          });
 *      Template code
 *          <script id="testreport" type="text/x-jquery-tmpl">
 *              <form action="URL" method="ajax" id="${id}DialogForm">
 *                  ...some other code...
 *              </form>
 *          </script>
 *
 */
define( function(require, exports, module) {
	var jQuery  = require('jquery');
	(function($) {
		$.fn.extend({
			formValidate: function(){
				var param = {arguments: arguments, dom: this};
				var callback;
				require.async('validate/jquery.validate.min', function(){
					var rules = $.validateRules();
					if(typeof param.arguments[0] == 'object') $.extend(true, rules, param.arguments[0]);
					else if(typeof param.arguments[0] == 'function') callback = param.arguments[0];
					if(typeof param.arguments[1] == 'function') callback = param.arguments[1];
					//console.log(callback);
					$(param.dom).validate({
						rules: rules.Rules,
						messages: rules.Messages,
						submitHandler: function(form){
							var mess = $.globalMessenger().post({
								message: '请等待，正在提交数据...',
								type: 'info'
							});
							var data = $(form).serialize();
							if($(form).attr('method') == 'ajax'){
								$.post($(form).attr('action'), data, function(note){
									mess.update({
										message: note.msg,
										type: note.type,
										showCloseButton: true,
										hideAfter: ($(form).attr('data-msgTime'))?$(form).attr('data-msgTime'):5
									});
									if(typeof callback == 'function'){ callback(data, note, mess);}
									if(param.arguments[2]) param.arguments[2].close().remove();
								});
							}else{
								form.submit();
							}
						}
					});
				});
			},
			formCenter: function(){
				var param = arguments;
				$('form').each(function(i, dom){
					$('[type=submit]', dom).attr('disabled', 'disabled');
					if(jQuery(dom).is('form[form-async=async]')){
						jQuery(dom).on('focusin', 'input,select,textarea,iframe', function(){
							$('[type=submit]', dom).removeAttr('disabled');
						});
					}else{
						$('[type=submit]', dom).removeAttr('disabled');
					}
					$('[form-elements]', $(dom)).each(function(i, ele){
						$(ele).elementsDisplay($(ele).attr('form-elements'), $(dom).attr('id'));
					});
					jQuery(dom).on('focusin', 'input,select,textarea,iframe', function(){
						$(dom).closest('.ipt-group').removeClass('has-error has-success has-warning');
						$(dom).formValidate(param[0], param[1], param[2]);
					});
				});
			},
			formDialog: function(){
				var rules;
				var callback;
				if(typeof arguments[0] == 'object'){
					rules = arguments[0];
					if (typeof arguments[1] == 'function'){callback = arguments[1];}
				}else if(typeof arguments[0] == 'function'){
					callback = arguments[0];
				}
				var modal = {
					id : $(this).attr('data-target'),
					title: $(this).attr('data-title')
				};
				require.async('dialog', function(dialog){
					modal.content = $("#"+modal.id).tmpl({id: modal.id}).html();
					var dialogForm = dialog(modal).showModal();
					$('#'+modal.id+'DialogForm').formCenter(rules, callback, dialogForm);
				});
			},
			formWizard: function(){

			}
		});
		}(jQuery));
	return jQuery;
});