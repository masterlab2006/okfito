<?php
      
      //$success_url = './success';
      
      $server = $_SERVER['HTTP_HOST'];
      $theme = $_POST['tov_id'];
      $name = $_POST['name'];
      
      if (isset($_POST['phone'])) {$phone = $_POST['phone'];}
      if (empty($phone))
      {
        echo "I can not send!";
        exit;
      }
      
      $success_url = './upsell/index.php?name='.$_POST['name'].'&phone='.$_POST['phone'].'';
      
      $mail_header = "MIME-Version: 1.0\r\n";
      $mail_header.= "Content-type: text/html; charset=UTF-8\r\n";
      $mail_header.= "From: okfito.ru <informer@$server>\r\n";
      $mail_header.= "Reply-to: Reply to Name <reply@$server>\r\n";
      
      // $to = "axel.shin@gmail.com";
      $to = "okfitogreen@gmail.com";
      $subject = "Заявка с формы Чек-лист по уходу за фитостеной из живых и стабилизированных растений: $server";
      
      $message = "
<br><b>Имя:</b> ".$_POST['name']."
<br><b>Телефон:</b> ".$_POST['phone']."
<br><b>Город:</b> ".$_POST['city']."
<br><b>Размер панно:</b> ".$_POST['square']."
<br><b>IP-адрес посетителя:</b> ".@$_SERVER['REMOTE_ADDR']."
      ";
      if (mail($to,$subject,$message,$mail_header))
      echo 'success';
      //header('Location: '.$success_url);
      else echo 'failed';
    ?>