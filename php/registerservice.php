<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST');  
include("functions.php");

if(isset($_POST['username']) && isset($_POST['email']) && isset($_POST['password'])){
	

    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
echo register($username, $email, $password);

}
?>