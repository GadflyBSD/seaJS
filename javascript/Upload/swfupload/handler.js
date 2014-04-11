/**
 * Created by Administrator on 14-3-14.
 */
define( function(require, exports, module) {
	function swfUploadPreLoad() {
		var self = this;
		var loading = function () {
			//document.getElementById("divSWFUploadUI").style.display = "none";
			document.getElementById("divLoadingContent").style.display = "";

			var longLoad = function () {
				document.getElementById("divLoadingContent").style.display = "none";
				document.getElementById("divLongLoading").style.display = "";
			};
			this.customSettings.loadingTimeout = setTimeout(function () {
					longLoad.call(self)
				},
				15 * 1000
			);
		};

		this.customSettings.loadingTimeout = setTimeout(function () {
				loading.call(self);
			},
			1*1000
		);
	}
	function swfUploadLoaded() {
		var self = this;
		clearTimeout(this.customSettings.loadingTimeout);
		document.getElementById("divSWFUploadUI").style.visibility = "visible";
		document.getElementById("divSWFUploadUI").style.display = "block";
		//document.getElementById("divLoadingContent").style.display = "none";
		//document.getElementById("divLongLoading").style.display = "none";
		//document.getElementById("divAlternateContent").style.display = "none";

		//document.getElementById("btnBrowse").onclick = function () { self.selectFiles(); };
		document.getElementById("btnCancel").onclick = function () { self.cancelQueue(); };
	}

	function swfUploadLoadFailed() {
		clearTimeout(this.customSettings.loadingTimeout);
		document.getElementById("divSWFUploadUI").style.display = "none";
		document.getElementById("divLoadingContent").style.display = "none";
		document.getElementById("divLongLoading").style.display = "none";
		document.getElementById("divAlternateContent").style.display = "";
	}


	function fileQueued(file) {
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setStatus("Pending...");
			progress.toggleCancel(true, this);

		} catch (ex) {
			this.debug(ex);
		}

	}

	function fileQueueError(file, errorCode, message) {
		try {
			if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
				alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
				return;
			}

			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setError();
			progress.toggleCancel(false);

			switch (errorCode) {
				case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
					progress.setStatus("File is too big.");
					this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
					progress.setStatus("Cannot upload Zero Byte files.");
					this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
					progress.setStatus("Invalid File Type.");
					this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				default:
					if (file !== null) {
						progress.setStatus("Unhandled Error");
					}
					this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
			}
		} catch (ex) {
			this.debug(ex);
		}
	}

	function fileDialogComplete(numFilesSelected, numFilesQueued, totalNumFilesQueued) {
		try {
			if (numFilesSelected > 0) {
				var that = this;
				document.getElementById(this.customSettings.cancelButtonId).disabled = false;
				var progress = new FileProgress(file, this.customSettings.progressTarget);
				Messenger.update({
					message: '选择了'+numFilesSelected+'个文件，'+numFilesQueued+'个文件加入上传队列，上传队列中共有'+totalNumFilesQueued+'个文件',
					type: 'error',
					actions: {
						retry: {
							label: '上传',
							phrase: 'Retrying TIME',
							auto: true,
							delay: 10,
							action: function(){
								that.startUpload();
								Messenger.hide()
							}
						},
						cancel: {
							label: "稍后上传",
							action: function(){
								Messenger.cancel();
							}
						},
						delete: {
							label: "清除队列",
							action: function(){
								that.cancelQueue();
								Messenger.hide();
							}
						}
					}
				});
			}
			/* I want auto start the upload and I can do that here */
		} catch (ex)  {
			this.debug(ex);
		}
	}

	function uploadStart(file) {
		try {
			/* I don't want to do any file validation or anything,  I'll just update the UI and
			 return true to indicate that the upload should start.
			 It's important to update the UI here because in Linux no uploadProgress events are called. The best
			 we can do is say we are uploading.
			 */
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setStatus("Uploading...");
			progress.toggleCancel(true, this);
		}catch (ex) {}

		return true;
	}

	function uploadProgress(file, bytesLoaded, bytesTotal) {
		try {
			var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setProgress(percent);
			progress.setStatus("Uploading...");
		} catch (ex) {
			this.debug(ex);
		}
	}

	function uploadSuccess(file, serverData) {
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget),
				itemHTML = '<li><div class="thumbImage"><a sea-toggle="Colorbox" href="${url}"><img src="${url}" class="uploadify-thumbnail" ' +
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
			progress.setComplete();
			progress.setStatus("Complete.");
			progress.toggleCancel(false);
		} catch (ex) {
			this.debug(ex);
		}
	}

	function uploadError(file, errorCode, message) {
		try {
			var progress = new FileProgress(file, this.customSettings.progressTarget);
			progress.setError();
			progress.toggleCancel(false);
			switch (errorCode) {
				case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
					progress.setStatus("Upload Error: " + message);
					this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
					progress.setStatus("Upload Failed.");
					this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.IO_ERROR:
					progress.setStatus("Server (IO) Error");
					this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
					progress.setStatus("Security Error");
					this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
					progress.setStatus("Upload limit exceeded.");
					this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
					progress.setStatus("Failed Validation.  Upload skipped.");
					this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
				case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
					// If there aren't any files left (they were all cancelled) disable the cancel button
					if (this.getStats().files_queued === 0) {
						document.getElementById(this.customSettings.cancelButtonId).disabled = true;
					}
					progress.setStatus("Cancelled");
					progress.setCancelled();
					break;
				case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
					progress.setStatus("Stopped");
					break;
				default:
					progress.setStatus("Unhandled Error: " + errorCode);
					this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
					break;
			}
		} catch (ex) {
			this.debug(ex);
		}
	}

	function uploadComplete(file) {
		if (this.getStats().files_queued === 0) {
			document.getElementById(this.customSettings.cancelButtonId).disabled = true;
		}
	}

// This event comes from the Queue Plugin
	function queueComplete(numFilesUploaded) {
		Messenger().hideAll();
		Messenger.post({
			type: 'success',
			message: numFilesUploaded + " file:" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.",
		});
			var status = document.getElementById("divStatus");
		status.innerHTML = numFilesUploaded + " file:" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.";
	}

	function MessengerProgress(file, targetID){
		require.async('messenger', function(){
			var Messenger = Messenger().post("Welcome to the darkside (tm)").hide();
			this.DialogComplete = function(numFilesSelected, numFilesQueued, totalNumFilesQueued){
				Messenger.update({
					message: '选择了'+numFilesSelected+'个文件，'+numFilesQueued+'个文件加入上传队列，上传队列中共有'+totalNumFilesQueued+'个文件',
					type: 'error',
					actions: {
						retry: {
							label: '上传',
							phrase: 'Retrying TIME',
							auto: true,
							delay: 10,
							action: function(){
								that.startUpload();
								Messenger.hide()
							}
						},
						cancel: {
							label: "稍后上传",
							action: function(){
								Messenger.cancel();
							}
						},
						delete: {
							label: "清除队列",
							action: function(){
								that.cancelQueue();
								Messenger.hide();
							}
						}
					}
				});
			}
		});
	}
// Constructor
// file is a SWFUpload file object
// targetID is the HTML element id attribute that the FileProgress HTML structure will be added to.
// Instantiating a new FileProgress object with an existing file will reuse/update the existing DOM elements
	function FileProgress(file, targetID) {
		this.fileProgressID = file.id;
		this.opacity = 100;
		this.height = 0;
		this.fileProgressWrapper = document.getElementById(this.fileProgressID);
		if (!this.fileProgressWrapper) {
			this.fileProgressWrapper = document.createElement("div");
			this.fileProgressWrapper.className = "progressWrapper";
			this.fileProgressWrapper.id = this.fileProgressID;
			this.fileProgressElement = document.createElement("div");
			this.fileProgressElement.className = "progressContainer";
			var progressCancel = document.createElement("a");
			progressCancel.className = "progressCancel";
			progressCancel.href = "#";
			progressCancel.style.visibility = "hidden";
			progressCancel.appendChild(document.createTextNode(" "));
			var progressText = document.createElement("div");
			progressText.className = "progressName";
			progressText.appendChild(document.createTextNode(file.name));
			var progressBar = document.createElement("div");
			progressBar.className = "progressBarInProgress";
			var progressStatus = document.createElement("div");
			progressStatus.className = "progressBarStatus";
			progressStatus.innerHTML = "&nbsp;";
			this.fileProgressElement.appendChild(progressCancel);
			this.fileProgressElement.appendChild(progressText);
			this.fileProgressElement.appendChild(progressStatus);
			this.fileProgressElement.appendChild(progressBar);
			this.fileProgressWrapper.appendChild(this.fileProgressElement);
			document.getElementById(targetID).appendChild(this.fileProgressWrapper);
		} else {
			this.fileProgressElement = this.fileProgressWrapper.firstChild;
			this.reset();
		}
		this.height = this.fileProgressWrapper.offsetHeight;
		this.setTimer(null);
	}

	FileProgress.prototype.setTimer = function (timer) {
		this.fileProgressElement["FP_TIMER"] = timer;
	};
	FileProgress.prototype.getTimer = function (timer) {
		return this.fileProgressElement["FP_TIMER"] || null;
	};

	FileProgress.prototype.reset = function () {
		this.fileProgressElement.className = "progressContainer";
		this.fileProgressElement.childNodes[2].innerHTML = "&nbsp;";
		this.fileProgressElement.childNodes[2].className = "progressBarStatus";
		this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
		this.fileProgressElement.childNodes[3].style.width = "0%";
		this.appear();
	};

	FileProgress.prototype.setProgress = function (percentage) {
		this.fileProgressElement.className = "progressContainer green";
		this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
		this.fileProgressElement.childNodes[3].style.width = percentage + "%";
		this.appear();
	};
	FileProgress.prototype.setComplete = function () {
		this.fileProgressElement.className = "progressContainer blue";
		this.fileProgressElement.childNodes[3].className = "progressBarComplete";
		this.fileProgressElement.childNodes[3].style.width = "";
		var oSelf = this;
		this.setTimer(setTimeout(function () {
			oSelf.disappear();
		}, 10000));
	};
	FileProgress.prototype.setError = function () {
		this.fileProgressElement.className = "progressContainer red";
		this.fileProgressElement.childNodes[3].className = "progressBarError";
		this.fileProgressElement.childNodes[3].style.width = "";
		var oSelf = this;
		this.setTimer(setTimeout(function () {
			oSelf.disappear();
		}, 5000));
	};
	FileProgress.prototype.setCancelled = function () {
		this.fileProgressElement.className = "progressContainer";
		this.fileProgressElement.childNodes[3].className = "progressBarError";
		this.fileProgressElement.childNodes[3].style.width = "";
		var oSelf = this;
		this.setTimer(setTimeout(function () {
			oSelf.disappear();
		}, 2000));
	};
	FileProgress.prototype.setStatus = function (status) {
		this.fileProgressElement.childNodes[2].innerHTML = status;
	};

// Show/Hide the cancel button
	FileProgress.prototype.toggleCancel = function (show, swfUploadInstance) {
		this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
		if (swfUploadInstance) {
			var fileID = this.fileProgressID;
			this.fileProgressElement.childNodes[0].onclick = function () {
				swfUploadInstance.cancelUpload(fileID);
				return false;
			};
		}
	};

	FileProgress.prototype.appear = function () {
		if (this.getTimer() !== null) {
			clearTimeout(this.getTimer());
			this.setTimer(null);
		}
		if (this.fileProgressWrapper.filters) {
			try {
				this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity = 100;
			} catch (e) {
				// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
				this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=100)";
			}
		} else {
			this.fileProgressWrapper.style.opacity = 1;
		}
		this.fileProgressWrapper.style.height = "";
		this.height = this.fileProgressWrapper.offsetHeight;
		this.opacity = 100;
		this.fileProgressWrapper.style.display = "";
	};

// Fades out and clips away the FileProgress box.
	FileProgress.prototype.disappear = function () {
		var reduceOpacityBy = 15;
		var reduceHeightBy = 4;
		var rate = 30;	// 15 fps
		if (this.opacity > 0) {
			this.opacity -= reduceOpacityBy;
			if (this.opacity < 0) {
				this.opacity = 0;
			}
			if (this.fileProgressWrapper.filters) {
				try {
					this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity = this.opacity;
				} catch (e) {
					// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
					this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + this.opacity + ")";
				}
			} else {
				this.fileProgressWrapper.style.opacity = this.opacity / 100;
			}
		}
		if (this.height > 0) {
			this.height -= reduceHeightBy;
			if (this.height < 0) {
				this.height = 0;
			}
			this.fileProgressWrapper.style.height = this.height + "px";
		}
		if (this.height > 0 || this.opacity > 0) {
			var oSelf = this;
			this.setTimer(setTimeout(function () {
				oSelf.disappear();
			}, rate));
		} else {
			this.fileProgressWrapper.style.display = "none";
			this.setTimer(null);
		}
	};

	(function ($) {
		$.extend($.fn, {
			'seaSWFupload': function(options){
				var config = {
					flash_url : seajs.data.base+"swfupload/swfupload.swf",
					flash9_url : seajs.data.base+"swfupload/swfupload_fp9.swf",
					upload_url: seajs.data.base+"swfupload/upload.php",
					post_params: {
						"PHPSESSID" : "NONE",
						"HELLO-WORLD" : "Here I Am",
						".what" : "OKAY"
					},
					file_size_limit : "100 MB",
					file_types : "*.*",
					file_types_description : "All Files",
					file_upload_limit : 100,
					file_queue_limit : 0,
					custom_settings : {
						progressTarget : "fsUploadProgress",
						cancelButtonId : "btnCancel"
					},
					queue: true,
					speed: true,
					debug: false,
					// Button Settings
					button_image_url : seajs.data.base+"swfupload/XPButtonNoText_61x22.png",
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
					swfupload_loaded_handler : swfUploadLoaded,
					file_queued_handler : fileQueued,
					file_queue_error_handler : fileQueueError,
					file_dialog_complete_handler : fileDialogComplete,
					upload_start_handler : uploadStart,
					upload_progress_handler : uploadProgress,
					upload_error_handler : uploadError,
					upload_success_handler : uploadSuccess,
					upload_complete_handler : uploadComplete,
					queue_complete_handler : queueComplete
				};
				$.seaBase.run(config, options, function(config){
					var requireFile = ['SWFupload', (config.css)?config.css:'uploadify/uploadify.css'];
					require.async(requireFile, function(){
						var swfu;
						Messenger = Messenger().post("Welcome to the darkside (tm)").hide();
						SWFUpload.onload = function(){config};
						swfu = new SWFUpload(config);
						$('#'+swfu.movieName).parent('div').append("<ul id='"+swfu.movieName+"_Queue' class='SWFUpload_Queue'\>");
						console.log(swfu);
					});
				});
			}
		});
	}(jQuery));
	return jQuery;
});