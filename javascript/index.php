<?php
/* 不压缩 */
$MINIFY = false;
/* 默认cdn地址 */
$YOUR_CDN = 'http://www.cter1332.net/Public/SeaJS/';

require 'jsmin.php';
require 'cssmin.php';

/**
 * set e-tag cache
 */
function cache($etag){
	$etag = $etag; //标记字符串，可以任意修改
	if (@$_SERVER['HTTP_IF_NONE_MATCH'] == $etag){
		header('Etag:'.$etag,true,304);
		exit;
	}
	else header('Etag:'.$etag);
}

function get_contents($url){
	$ch =curl_init($url);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$str =curl_exec($ch);
	curl_close($ch);
	if ($str !==false) {
		return $str;
	}else {
		return '';
	}
}

//得到扩展名
function get_extend($file_name) {
	$extend =explode("." , $file_name);
	$va=count($extend)-1;
	return $extend[$va];
}

/**
 * logic begin
 */
$files = array();
//cdn上存在的各种可能的文件类型
$header = array(
	'js' => 'Content-Type: application/x-javascript',
	'css' => 'Content-Type: text/css',
	'jpg' => 'Content-Type: image/jpg',
	'gif' => 'Content-Type: image/gif',
	'png' => 'Content-Type: image/png',
	'jpeg' => 'Content-Type: image/jpeg',
	'swf' => 'Content-Type: application/x-shockwave-flash'
);
$type = '';
$R_files = array();
$prefix = getcwd().'/';

// 处理请求中附带的文件列表，得到原始数据
$split_a= explode("??",$_SERVER['REQUEST_URI']);
$tmp_files = explode(",",$split_a[1]);

if(preg_match('/,/',$split_a[1])){//多文件
	$_tmp = explode(',',$split_a[1]);
	foreach($_tmp as $v){
		$R_files[] = $prefix.$v;
	}
}else{//单文件
	$R_files[] = $prefix.$split_a[1];
}
// 得到需要读取的文件列表
foreach ($R_files as $k){
	//最常见的替换规则
	$k = preg_replace(
		array('/_(js|css|gif|png|jpg|jpeg|swf)$/','/yui\/2_8_0r4/','/yui\/3_0_0/','/(\d+)_(\d+)_(\d+)/','/(\d+)_(\d+)/','/_v(\d)/'),
		array('.$1','yui/2.8.0r4','yui/3.0.0','$1.$2.$3','$1.$2','.v$1'),
		trim($k,'/')
	);
	//在这里添加转换过头的各种情况
	$k = str_replace('global.v5.css','global_v5.css',$k);
	$k = str_replace('detail.v2.css','detail_v2.css',$k);
	$k = str_replace('cubee_combo','cubee.combo',$k);

	if(empty($type)) {
		$type = get_extend($k);
	}
	//文件存在
	if(file_exists($k)) {
		$in_str = file_get_contents($k);
		//处理文本
		if(preg_match('/js|css/',$type)){
			//$files[] = file_get_contents($k);
			if($MINIFY == true && $type == 'js'){
				$files[] = JSMin::minify($in_str);
			}else if($MINIFY == true && $type == 'css'){
				$files[] = cssmin::minify($in_str);
			}else{
				$files[] = $in_str;
			}
		}else{
			//处理非文本
			$files[] = array($in_str);
		}
	}else{
		//文件不存在
		$in_sta = file($YOUR_CDN.$k);
		//文本的处理
		if(preg_match('/js|css/',$type)){
			$files[] = '/* '.$k.' */';
			$inner_str = join('',$in_sta);
			if($MINIFY == true && $type == 'js'){
				$files[] = JSMin::minify($inner_str);
			}else if($MINIFY == true && $type == 'css'){
				$files[] = cssmin::minify($inner_str);
			}else{
				$files[] = $inner_str;
			}
		}else{
			//非文本的处理
			$files[] = $in_sta;
		}
	}
}

header("Expires: " . date("D, j M Y H:i:s", strtotime("now + 10 years")) ." GMT");
//文本的处理
header($header[$type]);//文件类型
if(preg_match('/js|css/',$type)){
	$result = join("\n",$files);
}else{
	//非文本的处理
	$result = join("",$files[0]);
}
cache(md5($result));//etag,处理Etag是否多余?
echo $result;
?>
