/**
 * Created by Administrator on 14-3-29.
 */
define(function(require, exports, module){
	var jQuery = require('jquery');
	(function($){
		$.fn.artDialog = function(options){
			var config = {dialog: 'showModal', target: 'modalDialog'};
			$(this).on('click', function(){
				$.seaBase.run(config, options, function(settings){
					var requireFile = (settings.method == 'ajax')?['Dialog/artDialog/dialog-plus']:['Dialog/artDialog/dialog'];
					if(settings.method == 'tmpl') requireFile.push('tmpl');
					if(!settings.id) settings.id = 'seaArtDialog_'+ $.seaBase.mathRand();
					require.async(requireFile, function(dialog){
						if(settings.method == 'tmpl'){
							settings.content = $(settings.target).tmpl(settings.tmpl).html()
						}else if (settings.method == 'ajax'){
							settings.url = settings.target;
						}else{
							settings.content =$(settings.target).html()
						}
						if(settings.dialog == 'showModal')
							var dialogForm = dialog(settings).showModal();
						else if (settings.dialog == 'FloatLayer')
							var dialogForm = dialog(settings).show(document.getElementById(settings.float));
						else
							var dialogForm = dialog(settings).show();
						$('[dialog-id='+settings.id+']').seaLoad({dialog:dialogForm, object:dialog});
					});
				});
				return false;
			});
		}
	}(jQuery));
	return jQuery;
});