/**
 * Created by Administrator on 14-3-3.
 */
define( function(require, exports, module) {
	var jQuery = require('jquery');
	(function ($) {
		var setting = {
			swf: seajs.data.base+'Upload/uploadify/uploadify.swf',
			uploader: seajs.data.base+'Upload/uploadify/uploadify.php',
			buttonText: '选择上传文件',
			onSelect: function(file){
				$('#'+file.id).append('<div id="'+file.id+'_img"></div>');
				require.async('loadImages', function(){
					document.getElementById('file-input').onchange = function (e) {
						loadImage(
							e.target.files[0],
							function (img) {
								$('#'+file.id+'_img').append(img);
							},
							{maxWidth: 100} // Options
						);
					}
					//console.log(loadImage());
				});
				alert(0);
			},
			queueTemplate: '<li><div class="thumbImage"><a sea-toggle="Colorbox" href="${url}"><img src="${url}" class="uploadify-thumbnail" ' +
				'sea-toggle="centerImage"/></a></div><div class="uploadifyTextarea"><textarea name="uploadifyText${multi}" placeholder="请填写图片说明"></textarea>' +
				'<input type="text" name="uploadifyName${multi}" value="${name}" /></div><div><input type="hidden" name="uploadifyUrl${multi}" value="${url}" />' +
				'<input type="radio" name="uploadifyFlag${multi}" sea-options="onText:\'设为封面\',offText:\'取消封面\'" sea-toggle="Switch"></div>' +
				'<a href="javascript:voil(0);">删除</a></li>',
			onUploadSuccess : function(file, data, response) {
				var itemHTML, itemData = $.extend({id: file.id, name: file.name, size: file.size, multi: (setting.multi)?'[]':''}, $.parseJSON(data));
				if (response == 0) {
					alert('文件：【' + file.name + '】上传失败！');
					return false;
				}else{
					var itemHTML = setting.queueTemplate;
					for (var d in itemData) {
						itemHTML = itemHTML.replace(new RegExp('\\$\\{' + d + '\\}', 'g'), itemData[d]);
					}
					$('#'+this.movieName+'_Queue').append(itemHTML);
					$('#'+this.movieName+'_Queue').seaLoad();
					$('#'+this.movieName+'_Queue').on('click', 'li>a', function(){
						if(confirm('真的要删除最近上传的【'+file.name+'】文件吗？')){
							$(this).closest('li').remove();
						}
						return false;
					});
					return true;
				}
			}
		};
		$.extend($.fn, {
			'seaUploadify': function(options){
				var dom = '#'+$(this).attr('id');
				require.async('uploadify', function(){
					$.seaBase.run({css: 'Upload/uploadify/uploadify.css'}, options, function(config){
						$(dom).uploadify($.extend(setting, options));
						setting.multi = $(dom).data('uploadify').settings.multi;
						setting.movieName = $(dom).data('uploadify').movieName;
						$(dom).parent('div').append("<ul id='"+setting.movieName+"_Queue' class='SWFUpload_Queue'\>");
					});
				});
			}
		});
	}(jQuery));
	return jQuery;
});