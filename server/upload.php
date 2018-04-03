<?php

header('Access-Control-Allow-Origin: *');

$target_path = dirname(__DIR__)."/ionic-upload/uploads/";

$target_path = $target_path . basename($_FILES['file']['name']);

$ext = pathinfo($target_path, PATHINFO_EXTENSION);
$new_file_name = md5(time()).'.'.$ext;

//Upload File
if (move_uploaded_file($_FILES['file']['tmp_name'], "uploads/".$new_file_name)) {
    echo json_encode([
        'status' => 200,
        'name' => $new_file_name,
        'msg' => "upload successful"
    ]);
    exit();
} else {
    echo json_encode([
        'status' => 400,
        'msg' => "There was an error uploading the file, please try again!"
    ]);
    exit();
}