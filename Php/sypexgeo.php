<?php
include("./application/protected/SxGeo.php");
$SxGeo = new SxGeo('./application/protected/SxGeo.dat');
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED'];
} elseif (!empty($_SERVER['HTTP_X_CLUSTER_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_FORWARDED_FOR'];
} elseif (!empty($_SERVER['HTTP_FORWARDED'])) {
    $ip = $_SERVER['HTTP_FORWARDED'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}
$country_code = $SxGeo->getCountry($ip);
//$SxGeo->get($ip);
$forbidden = ['UA', 'RU'];
$allowed = ['US', 'GB', 'IE', 'IS', 'CN', 'JP', 'DE', 'CA', 'PL'];
if (!empty($country_code) && in_array($country_code, $allowed)):?>
    <!--    <script data-ad-client="ca-pub-7558972045892090" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>-->
<?php endif;?>