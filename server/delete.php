<?php

header('Access-Control-Allow-Origin: *');

$target_path = dirname(__DIR__)."/ionic-upload/uploads/";
$file = ($_GET['name'] != null || $_GET['name'] != '') ? $_GET['name'] : null;

if($file != null) {

    echo $target_path.$file;

    if(file_exists($target_path.$file)) {
        unlink($target_path.$file);
        echo json_encode([
            'status' => 200,
            'msg' => "delete successful"
        ]);
        exit();
    }else {
        echo json_encode([
            'status' => 400,
            'msg' => "File not found, please try again!"
        ]);
        exit();
    }

}else {
    echo json_encode([
        'status' => 400,
        'msg' => "File name is invalid, please try again!"
    ]);
    exit();
}