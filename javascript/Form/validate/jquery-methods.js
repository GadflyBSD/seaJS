/**
 * Created by Administrator on 14-2-25.
 */
define( function(require, exports, module) {
	var jQuery  = require('jquery'),
		config = {
			async: true,
			callback: function(){},
			rules: {
				username: { required: true, byteRangeLength: [4,12]},
				realname: { required: true, chinese: true },
				oldpw: { required: true},
				password: { required: true, password: true},
				repasswd: { required: true, equalTo: "[name=password]" },
				age:{required: true, range: [17,75]},
				gender: { required: true},
				idcardtype: { required: true},
				idcard: {required: true, isIdCardNo: true},
				datepicker: { required: true},
				mobile: {required: true, isMobile: true},
				resideprovince: { required: true},
				residecity: { required: true},
				residedist: { required: true},
				occupation: { required: true},
				working: { required: true},
				address: { required: true},
				icq: { required: true},
				yahoo: { required: true},
				vdcode: { required:true, remote:{ url: "/Tool/verify", type: "post"} },
				title: { required: true, minlength: 5},
				catid: { required: true},
				author: { required: true},
				from: { required: true},
				fromurl: { required: true, url: true},
				summary: { required: true},
				"tag[]": { required: true},
				pic: { required: true},
				key: { required: true},
				content: {required: true, minlength: 50},
				message: {required: true, minlength: 10, maxlength:10000},
				catname: { required: true}
			},
			messages:{
				username: { required:'用户名必须填写！', byteRangeLength: "用户名需要{0}-{1}个字符(汉字算2个字符)"},
				realname: { required:'真实姓名必须填写！', chinese: "真实姓名必须使用中文！"},
				oldpw: '原始密码密码必须填写！',
				password: { required:'登录密码必须填写！'},
				repasswd: { required: '重复密码必须填写！', equalTo: '重复密码与新设定的密码不一致！'},
				age: {required: '年龄必须填写或选择！', range: '年龄必须在17岁至75岁范围之间！'},
				gender: '性别必须选择！',
				idcardtype: '证件类型必须选择！',
				idcard: { required: '证件号码必须填写！'},
				datepicker: '日期必须填写或选择！',
				mobile: { required: '联系手机必须填写！'},
				resideprovince:'所在省份必须填写！',
				residecity: '所在城市必须填写！',
				residedist: '所在区县必须填写！',
				occupation: '职业必须填写或者选择！',
				working: '职业必须填写或者选择！',
				address: '详细地址必须填写！',
				icq: '开户银行必须选择！',
				yahoo: '银行卡号必须填写！',
				vdcode: { required: '验证码必须填写！', remote: '验证码验证错误！' },
				title: { required: '文章标题不能为空！', minlength: '文章标题不能少于5个字符！'},
				catid: "文章栏目必须选择！",
				author: "文章作者必须填写！",
				from: "文章来源必须填写！",
				fromurl: "来源地址必须填写！",
				summary: "文章摘要必须填写！",
				"tag[]": "聚合标签必须选择！",
				pic: "必须上传封面图片！",
				keywords: "文章关键词必须选择或填写！",
				content: {required: '文章正文必须填写！', minlength: '文章正文不能少于50个字符'},
				message: {required: '评论信息必须填写！', minlength: '评论信息不能少于10个字符', maxlength: '评论信息不能多于10000个字符！'},
				catname: '分类栏目名称必须填写！'
			}
		},
		idCardNoUtil = {
		provinceAndCitys: {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
			31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",
			45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
			65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},
		powers: ["7","9","10","5","8","4","2","1","6","3","7","9","10","5","8","4","2"],
		parityBit: ["1","0","X","9","8","7","6","5","4","3","2"],
		genders: {male:"男",female:"女"},
		checkAddressCode: function(addressCode){
			var check = /^[1-9]\d{5}$/.test(addressCode);
			if(!check) return false;
			if(idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0,2))]){
				return true;
			}else{
				return false;
			}
		},
		checkBirthDayCode: function(birDayCode){
			var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
			if(!check) return false;
			var yyyy = parseInt(birDayCode.substring(0,4),10);
			var mm = parseInt(birDayCode.substring(4,6),10);
			var dd = parseInt(birDayCode.substring(6),10);
			var xdata = new Date(yyyy,mm-1,dd);
			if(xdata > new Date()){
				return false;//生日不能大于当前日期
			}else if ( ( xdata.getFullYear() == yyyy ) && ( xdata.getMonth () == mm - 1 ) && ( xdata.getDate() == dd ) ){
				return true;
			}else{
				return false;
			}
		},
		getParityBit: function(idCardNo){
			var id17 = idCardNo.substring(0,17);
			var power = 0;
			for(var i=0;i<17;i++){
				power += parseInt(id17.charAt(i),10) * parseInt(idCardNoUtil.powers[i]);
			}
			var mod = power % 11;
			return idCardNoUtil.parityBit[mod];
		},
		checkParityBit: function(idCardNo){
			var parityBit = idCardNo.charAt(17).toUpperCase();
			if(idCardNoUtil.getParityBit(idCardNo) == parityBit){
				return true;
			}else{
				return false;
			}
		},
		checkIdCardNo: function(idCardNo){  //15位和18位身份证号码的基本校验
			var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
			if(!check) return false;//判断长度为15位或18位
			if(idCardNo.length==15){
				return idCardNoUtil.check15IdCardNo(idCardNo);
			}else if(idCardNo.length==18){
				return idCardNoUtil.check18IdCardNo(idCardNo);
			}else{
				return false;
			}
		},
		check15IdCardNo: function(idCardNo){    //校验15位的身份证号码
			//15位身份证号码的基本校验
			var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
			if(!check) return false;
			//校验地址码
			var addressCode = idCardNo.substring(0,6);
			check = idCardNoUtil.checkAddressCode(addressCode);
			if(!check) return false;
			var birDayCode = '19' + idCardNo.substring(6,12);
			//校验日期码
			return idCardNoUtil.checkBirthDayCode(birDayCode);
		},
		//校验18位的身份证号码
		check18IdCardNo: function(idCardNo){
			//18位身份证号码的基本格式校验
			var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
			if(!check) return false;
			//校验地址码
			var addressCode = idCardNo.substring(0,6);
			check = idCardNoUtil.checkAddressCode(addressCode);
			if(!check) return false;
			//校验日期码
			var birDayCode = idCardNo.substring(6,14);
			check = idCardNoUtil.checkBirthDayCode(birDayCode);
			if(!check) return false;
			//验证校检码
			return idCardNoUtil.checkParityBit(idCardNo);
		},
		formateDateCN: function(day){
			var yyyy =day.substring(0,4);
			var mm = day.substring(4,6);
			var dd = day.substring(6);
			return yyyy + '-' + mm +'-' + dd;
		},
		//获取信息
		getIdCardInfo: function(idCardNo){
			var idCardInfo = {
				gender:"", //性别
				birthday:"" // 出生日期(yyyy-mm-dd)
			};
			if(idCardNo.length==15){
				var aday = '19' + idCardNo.substring(6,12);
				idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
				if(parseInt(idCardNo.charAt(14))%2==0){
					idCardInfo.gender=idCardNoUtil.genders.female;
				}else{
					idCardInfo.gender=idCardNoUtil.genders.male;
				}
			}else if(idCardNo.length==18){
				var aday = idCardNo.substring(6,14);
				idCardInfo.birthday=idCardNoUtil.formateDateCN(aday);
				if(parseInt(idCardNo.charAt(16))%2==0){
					idCardInfo.gender=idCardNoUtil.genders.female;
				}else{
					idCardInfo.gender=idCardNoUtil.genders.male;
				}
			}
			return idCardInfo;
		},
		getId15:function(idCardNo){
			if(idCardNo.length==15){
				return idCardNo;
			}else if(idCardNo.length==18){
				return idCardNo.substring(0,6) + idCardNo.substring(8,17);
			}else{
				return null;
			}
		},
		getId18: function(idCardNo){
			if(idCardNo.length==15){
				var id17 = idCardNo.substring(0,6) + '19' + idCardNo.substring(6);
				var parityBit = idCardNoUtil.getParityBit(id17);
				return id17 + parityBit;
			}else if(idCardNo.length==18){
				return idCardNo;
			}else{
				return null;
			}
		}
	};
	//验证护照是否正确
	function checknumber(number){
		var str=number;
		//在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
		var Expression=/(P\d{7})|(G\d{8})/;
		var objExp=new RegExp(Expression);
		if(objExp.test(str)==true){
			return true;
		}else{
			return false;
		}
	}
	(function($) {
		$.extend($.fn, {
			Validator: function(options){
				var $this = $(this);
				$('[type=submit]', $this).attr('disabled', 'disabled');
				$.seaBase.run(config, options, function(config){
					if(config.async == true){
						$this.on('focusin', 'input,select,textarea,iframe', function(){
							$this.seaValidate(config);
						});
					}else{
						$this.seaValidate(config);
					}
				});
			},
			seaValidate: function(config){
				var $this = $(this);
				require.async(['messenger', 'validate'], function(){
					$.validator.addMethod("byteRangeLength", function(value, element, param) {
						var length = value.length;
						for(var i = 0; i < value.length; i++){
							if(value.charCodeAt(i) > 127){
								length++;
							}
						}
						return this.optional(element) || ( length >= param[0] && length <= param[1] );
					}, "请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)");
					$.validator.addMethod("chinese", function(value, element) {
						return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
					}, '请输入正确的中文');
					$.validator.addMethod("password", function(value, element) {
						return this.optional(element) || /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,16}$/.test(value);
					}, '密码由6-16位数字、字母、特殊字符组合');
					$.validator.addMethod("isIdCardNo", function(value, element) {
						return this.optional(element) || idCardNoUtil.checkIdCardNo(value);
					}, "请正确输入您的身份证号码");
					$.validator.addMethod("passport", function(value, element) {
						return this.optional(element) || checknumber(value);
					}, "请正确输入您的护照编号");
					$.validator.addMethod("isMobile", function(value, element) {
						var length = value.length;
						var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
						return this.optional(element) || (length == 11 && mobile.test(value));
					}, "请正确填写您的手机号码");
					$.validator.addMethod("isTel", function(value, element) {
						var tel = /^\d{3,4}-?\d{7,9}$/; //电话号码格式010-12345678
						return this.optional(element) || (tel.test(value));
					}, "请正确填写您的电话号码");
					$.validator.addMethod("isPhone", function(value,element) {
						var length = value.length;
						var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
						var tel = /^\d{3,4}-?\d{7,9}$/;
						return this.optional(element) || (tel.test(value) || mobile.test(value));
					}, "请正确填写您的联系电话");
					$.validator.addMethod("isZipCode", function(value, element) {
						var tel = /^[0-9]{6}$/;
						return this.optional(element) || (tel.test(value));
					}, "请正确填写您的邮政编码");
					$.extend($.validator.messages, {
						required: "必选字段",
						remote: "请修正该字段",
						email: "请输入正确格式的电子邮件",
						url: "请输入合法的网址",
						date: "请输入合法的日期",
						dateISO: "请输入合法的日期 (ISO).",
						number: "请输入合法的数字",
						digits: "只能输入整数",
						creditcard: "请输入合法的信用卡号",
						equalTo: "请再次输入相同的值",
						accept: "请输入拥有合法后缀名的字符串",
						maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
						minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
						rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
						range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
						max: $.validator.format("请输入一个最大为 {0} 的值"),
						min: $.validator.format("请输入一个最小为 {0} 的值")
					});
					$.validator.setDefaults({
						debug:false,
						focusInvalid: false,
						onkeyup: false,
						onfocusout: false,
						onclick: false,
						ignore: ".ignore,:hidden",
						errorPlacement: function(error, element) {
							$.map(error, function(msg){
								$.globalMessenger().post({
									message: '<b>'+$(msg).html()+'</b>',
									type: 'error',
									showCloseButton: true
								});
							});
							element.closest('.form-group, .input-group').addClass('has-error');
						},
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
									if(config.callback && typeof config.callback == 'function'){ config.callback(data, note, mess);}
									if(config.dialog && typeof config.dialog == 'object') config.dialog.close().remove();
								});
							}else{
								form.submit();
							}
						}
					});
					$('[type=submit]', $this).removeAttr('disabled');
					if(typeof eval(config.submitHandler) == 'function') config.submitHandler = eval(config.submitHandler);
					if(typeof eval(config.errorPlacement) == 'function') config.errorPlacement = eval(config.errorPlacement);
					if(config.customRules && typeof eval(config.customRules) == 'object'){
						var customRules = eval(config.customRules);
						config.rules = customRules.rules;
						config.messages = customRules.messages;
					}
					if(config.expandRules && typeof eval(config.expandRules) == 'object'){
						var expandRules = eval(config.expandRules);
						$.extend(config.rules, expandRules.rules);
						$.extend(config.messages, expandRules.messages);
					}
					$this.validate(config);
					$('.form-group, .input-group', $this).on('focusin', function(){
						$(this).removeClass('has-error has-success has-warning');
						$(this).find('input,select,textarea,iframe').removeClass('error');
					});
				});
			}
		});
	}(jQuery));
	return jQuery;
});