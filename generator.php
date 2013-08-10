<?php

header('Content-Type: text/plain');

if (isset($_GET['size']) && $_GET['size'] > 0)
    $size = $_GET['size'];
else
    $size = 100;

if (isset($_GET['min']) && $_GET['min'] > 0)
    $min = $_GET['min'];
else
    $min = 1;

if (isset($_GET['max'])) {
    if ($_GET['max'] < $min)
        $max = $min;
    else
        $max = $_GET['max'];
} else
    $max = $min + 100;

if (isset($_GET['dens']) && $_GET['dens'] >= 0 && $_GET['dens'] <= 100)
    $dens = $_GET['dens'];
else
    $dens = 50;

$graph = '{ ';

for ($i = 0; $i < $size; $i++) {
    $graph .= '{';

    for ($j = 0; $j < $size; $j++) {
        if ($i == $j)
            $graph .= '0, ';
        else {
            $cond = rand(0, 99) < $dens;
            $val = $cond ? rand($min, $max) : 0;
            $graph .= $val . ', ';
        }
    }

    $graph = substr($graph, 0, strlen($graph) - 2) . '}, ';
}

echo substr($graph, 0, strlen($graph) - 2), ' }';
?>