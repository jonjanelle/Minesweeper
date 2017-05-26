<?php
$dateTime1 = new DateTime('2017-05-26 05:30:21');
$dateTime2 = new DateTime('2017-05-25 01:02:03');

$timeDiff = $dateTime2->diff($dateTime1);

if ($dateTime1<$dateTime2){
  echo "<p>dateTime1 comes before dateTime2</p>";
} else {
  echo "<p>dateTime2 comes before dateTime1</p>";
}
echo $dateTime1->format("Y-m-d H:i:s"), PHP_EOL;
