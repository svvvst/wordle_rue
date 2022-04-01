<?php
  // set the default timezone to use.
  date_default_timezone_set('UTC');
  $startDate = new DateTime("20220322");
  $nowDateTime = new DateTime();

  $todayStr = $nowDateTime->format("Ymd");
  $todayDate = DateTime::createFromFormat("Ymd",$todayStr);
  $diff = $startDate->diff($todayDate,true);

  $skipDays = 1; // used to skip daily entry if word is uncommon or typo
  $days = $diff->format("%a") + $skipDays;

  // echo $days;

  // Login Information
  $hostname = "ducatelli.junkdrawer.dreamhost.com";
  $user = "rusynpedia_guest";
  $pass = "password123";
  $db = "wordlerusynpediadb";

  // Create connection
  $conn = new mysqli($hostname, $user, $pass, $db);
  $conn->set_charset("utf8mb4");
      
  // Check connection
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }
    
  $sql = "SELECT word FROM wordlist WHERE id = " . $days;
  $result = $conn->query($sql);

  if ($result == false) {
    echo "query fail";
  } 
    
  $row = $result->fetch_field();
  echo $result->fetch_assoc()["word"];
?>