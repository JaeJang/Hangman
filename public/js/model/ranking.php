<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_DATABASE', 'assignment1');

$name = $_GET["name"];
$score = $_GET["score"];

$conn = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysqli_select_db($conn, DB_DATABASE);

$sql_new_user = "INSERT INTO rank(name, score) VALUES('$name','$score')";
$result = mysqli_query($conn, $sql_new_user);
$id = mysqli_insert_id($conn);



$sql_ranks = "SELECT * FROM rank ORDER BY score DESC, name ASC";
$result = mysqli_query($conn, $sql_ranks);


$rank = 1;
$index = 1;

while($row = mysqli_fetch_assoc($result))
{
    $score = $row['score'];
    if($index > 1){
        if($score != $pre_score)
        {
            $rank++;
        }
    }
    //$user = [$rank, $name];    
    $users[$index] = [$rank, $row['name'], $score, $row['uid']];
    $pre_score = $score;
    $index++;
}
$users[0] = $id;

echo json_encode($users);
?>