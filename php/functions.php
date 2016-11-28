<?php
include("config.php");

function checkIfLoggedIn(){
	global $conn;
	if(isset($_SERVER['HTTP_TOKEN'])){
		$token = $_SERVER['HTTP_TOKEN'];
		$result = mysqli_query($conn, "SELECT * FROM user WHERE token='$token'");
		$num_rows = mysqli_num_rows($result);
		if($num_rows > 0)
		{
			return true;
		}
		else{	
			return false;
		}
	}
	else{
		return false;
	}
}

function getUsername(){
	global $conn;
	$username = "";
	$token = getToken();
	if($token != ""){
		$result = mysqli_query($conn, "SELECT * FROM user WHERE token='$token'");
		while($row = mysqli_fetch_assoc($result))
		{
			$username = $row['username'];
		}
	}
	return $username;
}

function login($username, $password){
	global $conn;
	$rarray = array();
	if(checkLogin($username,$password)){
		$id = sha1(uniqid());
		$result2 = mysqli_query($conn,"UPDATE user SET token='$id' WHERE username='$username'");
		$rarray['token'] = $id;
	} else{
		$rarray['error'] = "Invalid username/password";
	}
	return json_encode($rarray);
}

function checkLogin($username, $password){
	global $conn;
	$username = mysqli_real_escape_string($conn,$username);
	$password = md5(mysqli_real_escape_string($conn,$password));
	$result = mysqli_query($conn, "SELECT * FROM user WHERE username='$username' AND password='$password'");
	$num_rows = mysqli_num_rows($result);
	if($num_rows > 0)
	{
		return true;
	}
	else{	
		return false;
	}
}

function register($username,$email, $password){
	global $conn;
	$rarray = array();
	$errors = "";
	if(checkIfUserExists($username)){
		$errors .= "Username already exists\r\n";
	}
	if(strlen($username) < 5){
		$errors .= "Username must have at least 5 characters\r\n";
	}
	if(strlen($password) < 5){
		$errors .= "Password must have at least 5 characters\r\n";
	}

	if($errors == ""){
		$stmt = $conn->prepare("INSERT INTO user (username, email, password) VALUES (?, ?, ?)");
		$pass = md5($password);
		$stmt->bind_param("sss", $username, $email, $pass);
		if($stmt->execute()){
			$id = sha1(uniqid());
			$result2 = $conn->query("UPDATE user SET token='$id' WHERE username='$username'");
			$rarray['token'] = $id;
		}else{
			$rarray['error'] = "Database connection error";
		}
	} else{
		$rarray['error'] = json_encode($errors);
	}
	
	return json_encode($rarray);
}

function checkIfUserExists($username){
	global $conn;
	$result = mysqli_query($conn, "SELECT * FROM user WHERE username='$username'");
	$num_rows = mysqli_num_rows($result);
	if($num_rows > 0)
	{
		return true;
	}
	else{	
		return false;
	}
}


?>