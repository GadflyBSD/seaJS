<?php
$targetFolder = '/uploads'; // Relative to the root
if (!empty($_FILES)) {
	$tempFile = $_FILES['Filedata']['tmp_name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
	$targetFile = rtrim($targetPath,'/') . '/' . $_FILES['Filedata']['name'];
	if(!file_exists($targetPath)){
		mkdirs(str_replace('//','/',$targetPath), 0755, true);
	}
	// Validate the file type
	$fileTypes = array('jpg','jpeg','gif','png'); // File extensions
	$fileParts = pathinfo($_FILES['Filedata']['name']);

	if (in_array($fileParts['extension'],$fileTypes)) {
		move_uploaded_file($tempFile,$targetFile);
		header('Content-type: text/html; charset=UTF-8');
		echo json_encode(array('error' => 0, 'url' => '/uploads/'.$_FILES['Filedata']['name']));
	} else {
		echo 'Invalid file type.';
	}
}

function mkdirs($dir){
	if(!is_dir($dir)){
		if(!mkdirs(dirname($dir))){
			return false;
		}
		if(!mkdir($dir,0777)){
			return false;
		}
	}
	return true;
}
?>