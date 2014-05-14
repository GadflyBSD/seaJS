<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 14-5-14
 * Time: 上午11:53
 */
define('UPLOAD_DIR', '/attached/');
define('MAX_SIZE', 1048576);
switch($_SERVER['REQUEST_SCHEME']){
	case 'http':
		if($_SERVER['SERVER_PORT'] == '80')
			$url = 'http://'.$_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF'];
		else
			$url = 'http://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF'];
		break;
	case 'https':
		if($_SERVER['SERVER_PORT'] == '443')
			$url = 'https://'.$_SERVER['SERVER_NAME'].$_SERVER['PHP_SELF'];
		else
			$url = 'https://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF'];
		break;
	default:
		$url = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['SERVER_NAME'].':'.$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF'];
}
$root = array(
	'path'  => dirname(__FILE__).UPLOAD_DIR,
	'url'   => dirname($url).UPLOAD_DIR,
	'ext'   => array(
		'image' => array('gif', 'jpg', 'jpeg', 'png', 'bmp'),
		'flash' => array('swf', 'flv'),
		'media' => array('swf', 'flv', 'mp3', 'wav', 'wma', 'wmv', 'mid', 'avi', 'mpg', 'asf', 'rm', 'rmvb'),
		'file' => array('doc', 'docx', 'xls', 'xlsx', 'ppt', 'htm', 'html', 'txt', 'zip', 'rar', 'gz', 'bz2'),
	)
);
if(@$_GET['ac'] != 'Upload'){
	//目录名
	$dir_name = empty($_GET['dir']) ? '' : trim($_GET['dir']);
	if (!in_array($dir_name, array('', 'image', 'flash', 'media', 'file'))) {
		echo "Invalid Directory name.";
		exit;
	}
	if ($dir_name !== '') {
		$root['path'] .= $dir_name;
		$root['url'] .= $dir_name;
		if (!file_exists($root['path'])) {
			mkdirs($root['path']);
		}
	}

	//根据path参数，设置各路径和URL
	if (empty($_GET['path'])) {
		$current_path = realpath($root['path']).'/';
		$current_url = $root['url'].'/';
		$current_dir_path = '';
		$moveup_dir_path = '';
	} else {
		$current_path = realpath($root['path']) . '/' . $_GET['path'];
		$current_url = $root['url'].'/'.$_GET['path'];
		$current_dir_path = $_GET['path'];
		$moveup_dir_path = preg_replace('/(.*?)[^\/]+\/$/', '$1', $current_dir_path);
	}
	//排序形式，name or size or type
	$order = empty($_GET['order']) ? 'name' : strtolower($_GET['order']);

	//不允许使用..移动到上一级目录
	if (preg_match('/\.\./', $current_path)) {
		echo 'Access is not allowed.';
		exit;
	}
	//最后一个字符不是/
	if (!preg_match('/\/$/', $current_path)) {
		echo 'Parameter is not valid.';
		exit;
	}
	//目录不存在或不是目录
	if (!file_exists($current_path) || !is_dir($current_path)) {
		echo 'Directory does not exist.';
		exit;
	}

	//遍历目录取得文件信息
	$file_list = array();
	if ($handle = opendir($current_path)) {
		$i = 0;
		while (false !== ($filename = readdir($handle))) {
			if ($filename{0} == '.') continue;
			$file = $current_path . $filename;
			if (is_dir($file)) {
				$file_list[$i]['is_dir'] = true; //是否文件夹
				$file_list[$i]['has_file'] = (count(scandir($file)) > 2); //文件夹是否包含文件
				$file_list[$i]['filesize'] = 0; //文件大小
				$file_list[$i]['is_photo'] = false; //是否图片
				$file_list[$i]['filetype'] = ''; //文件类别，用扩展名判断
			} else {
				$file_list[$i]['is_dir'] = false;
				$file_list[$i]['has_file'] = false;
				$file_list[$i]['filesize'] = filesize($file);
				$file_list[$i]['dir_path'] = '';
				$file_ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
				$file_list[$i]['is_photo'] = in_array($file_ext, $root['ext']);
				$file_list[$i]['filetype'] = $file_ext;
			}
			$file_list[$i]['filename'] = $filename; //文件名，包含扩展名
			$file_list[$i]['datetime'] = date('Y-m-d H:i:s', filemtime($file)); //文件最后修改时间
			$i++;
		}
		closedir($handle);
	}
	usort($file_list, 'cmp_func');

	$result = array();
//相对于根目录的上一级目录
	$result['moveup_dir_path'] = $moveup_dir_path;
//相对于根目录的当前目录
	$result['current_dir_path'] = $current_dir_path;
//当前目录的URL
	$result['current_url'] = $current_url;
//文件数
	$result['total_count'] = count($file_list);
//文件列表数组
	$result['file_list'] = $file_list;

//输出JSON字符串
	print_json($result);
}else{
	//PHP上传失败
	if (!empty($_FILES['imgFile']['error'])) {
		switch($_FILES['imgFile']['error']){
			case '1':
				$error = '超过php.ini允许的大小。';
				break;
			case '2':
				$error = '超过表单允许的大小。';
				break;
			case '3':
				$error = '图片只有部分被上传。';
				break;
			case '4':
				$error = '请选择图片。';
				break;
			case '6':
				$error = '找不到临时目录。';
				break;
			case '7':
				$error = '写文件到硬盘出错。';
				break;
			case '8':
				$error = 'File upload stopped by extension。';
				break;
			case '999':
			default:
				$error = '未知错误。';
		}
		print_json($error, 1);
	}

//有上传文件时
	if (empty($_FILES) === false) {
		//原文件名
		$file_name = $_FILES['imgFile']['name'];
		//服务器上临时文件名
		$tmp_name = $_FILES['imgFile']['tmp_name'];
		//文件大小
		$file_size = $_FILES['imgFile']['size'];
		//检查文件名
		if (!$file_name) {
			print_json("请选择文件。", 1);
		}
		//检查目录
		if (@is_dir($root['path']) === false) {
			print_json("上传目录不存在。", 1);
		}
		//检查目录写权限
		if (@is_writable($root['path']) === false) {
			print_json("上传目录没有写权限。", 1);
		}
		//检查是否已上传
		if (@is_uploaded_file($tmp_name) === false) {
			print_json("上传失败。", 1);
		}
		//检查文件大小
		if ($file_size > MAX_SIZE) {
			print_json("上传文件大小超过限制。", 1);
		}
		//检查目录名
		$dir_name = empty($_GET['dir']) ? 'image' : trim($_GET['dir']);
		if (empty($root['ext'][$dir_name])) {
			print_json("目录名不正确。", 1);
		}
		//获得文件扩展名
		$temp_arr = explode(".", $file_name);
		$file_ext = array_pop($temp_arr);
		$file_ext = trim($file_ext);
		$file_ext = strtolower($file_ext);
		//检查扩展名
		if (in_array($file_ext, $root['ext'][$dir_name]) === false) {
			print_json("上传文件扩展名是不允许的扩展名。\n只允许".implode(",", $root['ext'][$dir_name]) . "格式。", 1);
		}
		//创建文件夹
		$ymd = date("Ymd");
		$root['path'] .= ($dir_name !== '')?$dir_name."/".$ymd ."/":$ymd . "/";
		$root['url'] .= ($dir_name !== '')?$dir_name."/".$ymd ."/":$ymd . "/";;
		if (!file_exists($root['path'])) {
			mkdirs($root['path']);
		}
		//新文件名
		$new_file_name = date("YmdHis") . '_' . rand(10000, 99999) . '.' . $file_ext;
		//移动文件
		$file_path = $root['path'] . $new_file_name;
		if (move_uploaded_file($tmp_name, $file_path) === false) {
			print_json("上传文件失败。", 1);
		}
		@chmod($file_path, 0644);
		$file_url = $root['url'] . $new_file_name;

		print_json($file_url);
		exit;
	}
}

//排序
function cmp_func($a, $b) {
	global $order;
	if ($a['is_dir'] && !$b['is_dir']) {
		return -1;
	} else if (!$a['is_dir'] && $b['is_dir']) {
		return 1;
	} else {
		if ($order == 'size') {
			if ($a['filesize'] > $b['filesize']) {
				return 1;
			} else if ($a['filesize'] < $b['filesize']) {
				return -1;
			} else {
				return 0;
			}
		} else if ($order == 'type') {
			return strcmp($a['filetype'], $b['filetype']);
		} else {
			return strcmp($a['filename'], $b['filename']);
		}
	}
}

function mkdirs($dir){
	if(!is_dir($dir)){
		if(!mkdirs(dirname($dir)))
			return false;
		if(!mkdir($dir,0777))
			return false;
	}
	return true;
}

function print_json($msg, $error=0) {
	header('Content-type: text/html; charset=UTF-8');
	if($error != 0)
		echo json_encode(array('error' => 1, 'message' => $msg));
	else
		if(is_array($msg)) echo json_encode($msg);
		else echo json_encode(array('error' => 0, 'url' => $msg));
	exit;
}