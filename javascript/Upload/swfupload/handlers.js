/**
 * Created by Administrator on 14-3-18.
 */
define( function(require, exports, module) {
	var jQuery  = require('jquery');
	function swfUploadPreLoad() {
		if (!this.support.loading) {
			alert("You need the Flash Player 9.028 or above to use SWFUpload.");
			return false;
		}
	}

	function swfUploadLoadFailed() {
		alert("Something went wrong while loading SWFUpload. If this were a real application we'd clean up and then give you an alternative");
	}

	function fileQueued(file) {
		try {
			$('#tdFilesQueued').text(this.getStats().files_queued);
		} catch (ex) {
			this.debug(ex);
		}

	}

	function fileDialogComplete(numFilesSelected, numFilesQueued, totalNumFilesQueued) {
		try {
			if (numFilesSelected > 0) {
				$.DialogComplete(this, numFilesSelected, numFilesQueued, totalNumFilesQueued);
			}
		} catch (ex)  {
			this.debug(ex);
		}
	}

	function uploadProgress(file, bytesLoaded, bytesTotal) {
		//try {
			this.customSettings.progressCount++;
			updateDisplay.call(this, file);
		//} catch (ex) {
		//	this.debug(ex);
		//}

	}

	function uploadSuccess(file, serverData) {
		try {
			var itemHTML = '<li><div class="thumbImage"><a sea-toggle="Colorbox" href="${url}"><img src="${url}" class="uploadify-thumbnail" ' +
					'sea-toggle="centerImage"/></a></div><div class="uploadifyTextarea"><textarea name="uploadifyText${multi}" placeholder="请填写图片说明"></textarea>' +
					'<input type="text" name="uploadifyName${multi}" value="${name}" /></div><div><input type="hidden" name="uploadifyUrl${multi}" value="${url}" />' +
					'<input type="radio" name="uploadifyFlag${multi}" sea-options="onText:\'设为封面\',offText:\'取消封面\'" sea-toggle="Switch"></div>' +
					'<a href="javascript:voil(0);">删除</a></li>',
				itemData = $.extend({id: file.id, name: file.name, size: file.size, multi: (this.settings.file_upload_limit !=1)?'[]':''}, $.parseJSON(serverData));
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
			updateDisplay.call(this, file);
		} catch (ex) {
			this.debug(ex);
		}
	}

	function uploadStart(file) {
		try {
			$.uploadStart(file);
			this.customSettings.progressCount = 0;
			updateDisplay.call(this, file);
		}catch (ex) {
			this.debug(ex);
		}
	}

	function queueComplete(numFilesUploaded) {
		$.QueueComplete(numFilesUploaded);
	}

	function uploadComplete(file) {
		$('#tdFilesQueued').text(this.getStats().files_queued);
		$('#tdFilesUploaded').text(this.getStats().successful_uploads);
		$('#tdErrors').text(this.getStats().upload_errors);
	}

	function updateDisplay(file) {
		$('#tdCurrentSpeed').text(SWFUpload.speed.formatBPS(file.currentSpeed));
		$('#tdAverageSpeed').text(SWFUpload.speed.formatBPS(file.averageSpeed));
		$('#tdMovingAverageSpeed').text(SWFUpload.speed.formatBPS(file.movingAverageSpeed));
		$('#tdTimeRemaining').text(SWFUpload.speed.formatTime(file.timeRemaining));
		$('#tdTimeElapsed').text(SWFUpload.speed.formatTime(file.timeElapsed));
		$('#tdPercentUploaded').text(SWFUpload.speed.formatPercent(file.percentUploaded));
		$('#tdSizeUploaded').text(SWFUpload.speed.formatBytes(file.sizeUploaded));
		$('#tdProgressEventCount').text(this.customSettings.progressCount);
	}

	(function ($) {
		$.extend($, {
			Messenger: function(message){
				require.async('messenger', function(){
					Messenger().hideAll();
					Messenger().post({
						type: 'success',
						message: message
					});
				});
			},
			DialogComplete: function(SWFupload, numFilesSelected, numFilesQueued, totalNumFilesQueued){

				require.async('messenger', function(){
					var Mess = Messenger().post({
						message: '选择了'+numFilesSelected+'个文件，'+numFilesQueued+'个文件加入上传队列，上传队列中共有'+totalNumFilesQueued+'个文件',
						type: 'error',
						actions: {
							retry: {
								label: '上传',
								phrase: 'Retrying TIME',
								auto: true,
								delay: 10,
								action: function(){
									SWFupload.startUpload();
									Mess.hide()
								}
							},
							cancel: {
								label: "稍后上传",
								action: function(){
									Mess.cancel();
								}
							},
							delete: {
								label: "清除队列",
								action: function(){
									SWFupload.cancelQueue();
									Mess.hide();
								}
							}
						}
					});
				});
			},
			QueueComplete: function(numFilesUploaded){
				var message = numFilesUploaded + " file:" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.";
				$.Messenger(message);
			},
			uploadStart: function(file){
				var message = file.name + '文件正在上传...';
				$.Messenger(message);
			}
		});
		$.extend($.fn, {
			'seaSWFupload': function(options){
				var $this = $(this),
					config = {
					flash_url : seajs.data.base+"Upload/swfupload/swfupload.swf",
					flash9_url : seajs.data.base+"Upload/swfupload/swfupload_fp9.swf",
					upload_url: seajs.data.base+"Upload/swfupload/upload.php",
					css: "Upload/uploadify/uploadify.css",
					file_size_limit : "100 MB",
					file_types : "*.*",
					file_types_description : "All Files",
					file_upload_limit : 100,
					file_queue_limit : 0,
					debug: false,
					// Button Settings
					button_image_url : seajs.data.base+"Upload/swfupload/XPButtonNoText_61x22.png",
					button_placeholder_id : "spanButtonPlaceholder",
					button_width: 61,
					button_height: 22,
					button_text: '<span class="theFont">上传图片</span>',
					button_text_style: ".theFont { font-size: 12; }",
					button_text_left_padding: 5,
					button_text_top_padding: 0,
					// The event handler functions are defined in handlers.js
					swfupload_preload_handler : swfUploadPreLoad,
					swfupload_load_failed_handler : swfUploadLoadFailed,
					//swfupload_loaded_handler : swfUploadLoaded,
					file_queued_handler : fileQueued,
					//file_queue_error_handler : fileQueueError,
					file_dialog_complete_handler : fileDialogComplete,
					upload_start_handler : uploadStart,
					upload_progress_handler : uploadProgress,
					//upload_error_handler : uploadError,
					upload_success_handler : uploadSuccess,
					upload_complete_handler : uploadComplete,
					queue_complete_handler : queueComplete
				};
				$.seaBase.run(config, options, function(config){
					if(!config.id) config.id = 'seaSWFupload_'+ $.mathRand();
					$this.attr('id', config.id);
					require.async('SWFupload', function(){
						var SWFuploadUI = '<table cellspacing="0" id="SWFuploadUI" width="80%"><tr><td><table cellspacing="0">'+
							'<tr><td>文件队列数：</td><td id="tdFilesQueued"></td></tr>'+
							'<tr><td>已上传文件数：</td><td id="tdFilesUploaded"></td></tr>'+
							'<tr><td>上传错误数：</td><td id="tdErrors"></td></tr></table></td><td><table cellspacing="0">'+
							'<tr><td>Current Speed:</td><td id="tdCurrentSpeed"></td></tr>'+
							'<tr><td>Average Speed:</td><td id="tdAverageSpeed"></td></tr>'+
							'<tr><td>Moving Average Speed:</td><td id="tdMovingAverageSpeed"></td></tr>'+
							'<tr><td>Time Remaining</td><td id="tdTimeRemaining"></td></tr>'+
							'<tr><td>Time Elapsed</td><td id="tdTimeElapsed"></td></tr>'+
							'<tr><td>Percent Uploaded</td><td id="tdPercentUploaded"></td></tr>'+
							'<tr><td>Size Uploaded</td><td id="tdSizeUploaded"></td></tr>'+
							'<tr><td>Progress Event Count</td><td id="tdProgressEventCount"></td></tr></table></td></tr></table>';
						$(dom).parent('div').append(SWFuploadUI);
						SWFUpload.onload = function(){config};
						var swfu = new SWFUpload(config);
						$('#'+swfu.movieName).parent('div').append("<ul id='"+swfu.movieName+"_Queue' class='SWFUpload_Queue'\>");
						//console.log(swfu);
					});
				});
			}
		});
	}(jQuery));
	return jQuery;
});