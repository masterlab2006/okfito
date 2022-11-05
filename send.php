<?php
    require_once "SendMailSmtpClass.php";

    const RECAPTCHA_V3_SECRET_KEY = '6LfSq2AbAAAAAGVS_GHDM9D_F-hVt4_RyS6oYdTu';
    $mailSMTP = new SendMailSmtpClass('info@impresario-group.ru', 'dev#mas#ural', 'mail.netangels.ru', 'noreply');
    
    function sendmail($title, $message, $mailSMTP){
        $to = 'impresario-group@mail.ru';
        $subject = $title;
        $headers = "From: support<info@impresario-group.ru>/\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        return $mailSMTP->send($to, $subject, $message, $headers);
    }
    
    $message = '<p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol; position: relative; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">Ваше имя: ' . $_POST['name'] . '</p>';
    $message .= '<p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol; position: relative; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">Ваша почта: ' . $_POST['email'] . '</p>';
    $message .= '<p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol; position: relative; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">Ваш телефон: ' . $_POST['phone'] . '</p>';
    $message .= '<p style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol; position: relative; font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">Ваш вопрос: ' . $_POST['comment'] . '</p>';
    
//    $token = $_POST['token'];
//    $ch = curl_init();
//    curl_setopt($ch, CURLOPT_URL,"https://www.google.com/recaptcha/api/siteverify");
//    curl_setopt($ch, CURLOPT_POST, 1);
//    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array('secret' => RECAPTCHA_V3_SECRET_KEY, 'response' => $token)));
//    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//    $response = curl_exec($ch);
//    curl_close($ch);
//    $arrResponse = json_decode($response, true);
    
//    if($arrResponse["success"] === '1' && $arrResponse["score"] >= 0.5) {
        return sendmail($_POST['title'], $message, $mailSMTP);
//    }
//return false;
