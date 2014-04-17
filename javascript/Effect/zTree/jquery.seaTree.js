/**
 * Created by Administrator on 14-4-16.
 */
define(function(require, exports, module){
	var jQuery = require('jquery');
	(function($){
		var newCount = 1, className = "dark";
		$.extend($, {
			treeAddHoverDom: function(treeId, treeNode){
				var sObj = $("#" + treeNode.tId + "_span"),
					zTree = $.fn.zTree.getZTreeObj($(this).closest('ul.ztree').attr('id'));;
				if (treeNode.editNameFlag || $("#"+treeNode.tId+"_add").length>0 || $("#"+treeNode.tId+"_display").length>0) return;
				var showStr = "<span class='button display' id='"+treeNode.tId+"_display' title='查看节点信息'></span>",
					addStr = "<span class='button add' id='"+treeNode.tId+"_add' title='添加新的节点'></span>";
				sObj.after(showStr+addStr);
				var addBtn = $("#"+treeNode.tId+'_add'),
					displayBtn = $("#"+treeNode.tId+'_display');
				if (addBtn) addBtn.bind("click", function(){
					if(typeof zTree.setting.callback.onAdd == 'function') zTree.setting.callback.onAdd(zTree, treeId, treeNode);
					return false;
				});
				if (displayBtn) displayBtn.bind("click", function(){
					if(typeof zTree.setting.callback.onDisplay == 'function') zTree.setting.callback.onDisplay(zTree, treeId, treeNode);
					return false;
				});
			},
			treeRemoveHoverDom: function(treeId, treeNode){
				$("#"+treeNode.tId+'_display').unbind().remove();
				$("#"+treeNode.tId+'_add').unbind().remove();
			},
			treeBeforeRemove: function(treeId, treeNode) {
				className = (className === "dark" ? "":"dark");
				var zTree = $.fn.zTree.getZTreeObj($("#"+treeNode.tId+'_remove').closest('ul.ztree').attr('id'));
				zTree.selectNode(treeNode);
				return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
			}
		});
		$.extend($.fn, {
			seaTree: function(options){
				var $this = $(this), zTreeObj,
					config ={
						edit: {
							enable: true,
							renameTitle: "编辑节点名称",
							removeTitle: "删除节点"
						},
						data: {
							simpleData: {
								enable: true
							}
						},
						view: {
							addHoverDom: $.treeAddHoverDom,
							removeHoverDom: $.treeRemoveHoverDom,
							selectedMulti: false
						},
						callback: {
							beforeRemove: $.treeBeforeRemove
						},
						async: {
							enable: true,
							type: "get",
							otherParam: { "type":"Category"},
							url: "/Tool/getTreeJson"
						},
						css: 'Effect/zTree/zTreeStyle/zTreeStyle.css',
						expand: false,
						id: 'seaTree_'+$.seaBase.mathRand()
					};
				$.seaBase.run(config, options, function(setting){
					$this.addClass('ztree').attr('id', setting.id);
					var asyncFile = ['ztreeCore'];
					if(setting.expand){
						if(setting.expand == 'all') asyncFile = 'zTreeAll';
						else asyncFile.push(setting.expand);
					}
					require.async(asyncFile, function(){
						if(setting.async.enable)
							zTreeObj = $.fn.zTree.init($this, setting);
						else if (typeof setting.nodes == 'object')
							zTreeObj = $.fn.zTree.init($this, setting, setting.nodes);
					});
				});
				return zTreeObj;
			}
		});
	})(jQuery);
	return jQuery;
});