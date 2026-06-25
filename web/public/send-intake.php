<?php

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido.'
    ]);
    exit;
}

if (!empty($_POST['website'] ?? '')) {
    echo json_encode([
        'success' => true,
        'message' => 'Formulario recibido.'
    ]);
    exit;
}

function cleanText($value)
{
    return trim(strip_tags($value ?? ''));
}

function renderTemplate($templatePath, $data)
{
    if (!file_exists($templatePath)) {
        throw new Exception('No existe el template: ' . $templatePath);
    }

    extract($data, EXTR_SKIP);

    ob_start();
    require $templatePath;
    return ob_get_clean();
}

function createMailer($smtpHost, $smtpPort, $smtpUser, $smtpPass, $fromEmail, $fromName)
{
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpPort;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($fromEmail, $fromName);
    $mail->isHTML(true);

    return $mail;
}

$tipoConsulta = cleanText($_POST['tipo_consulta'] ?? '');
$modalidad = cleanText($_POST['modalidad'] ?? '');
$zonaReferencia = cleanText($_POST['zona_referencia'] ?? '');
$motivoConsulta = cleanText($_POST['motivo_consulta'] ?? '');
$ciudadPais = cleanText($_POST['ciudad_pais'] ?? '');
$disponibilidad = cleanText($_POST['disponibilidad'] ?? '');
$nombreApellido = cleanText($_POST['nombre_apellido'] ?? '');
$edad = cleanText($_POST['edad'] ?? '');
$emailRaw = cleanText($_POST['email'] ?? '');
$email = filter_var($emailRaw, FILTER_VALIDATE_EMAIL);
$whatsapp = cleanText($_POST['whatsapp'] ?? '');
$tipoTerapia = cleanText($_POST['tipo_terapia'] ?? '');
$tipoTerapiaOtra = cleanText($_POST['tipo_terapia_otra'] ?? '');
$generoProfesional = cleanText($_POST['genero_profesional'] ?? '');
$privacyPolicy = isset($_POST['privacy_policy']);

if (
    !$tipoConsulta ||
    !$modalidad ||
    !$motivoConsulta ||
    !$ciudadPais ||
    !$disponibilidad ||
    !$nombreApellido ||
    !$edad ||
    !$email ||
    !$whatsapp ||
    !$tipoTerapia ||
    !$generoProfesional ||
    !$privacyPolicy
) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Faltan campos obligatorios.'
    ]);
    exit;
}

if ((int) $edad < 18 || (int) $edad > 120) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'La edad ingresada no es válida.'
    ]);
    exit;
}

$formData = [
    'tipoConsulta' => $tipoConsulta,
    'modalidad' => $modalidad,
    'zonaReferencia' => $zonaReferencia,
    'motivoConsulta' => $motivoConsulta,
    'ciudadPais' => $ciudadPais,
    'disponibilidad' => $disponibilidad,
    'nombreApellido' => $nombreApellido,
    'edad' => $edad,
    'email' => $email,
    'whatsapp' => $whatsapp,
    'tipoTerapia' => $tipoTerapia,
    'tipoTerapiaOtra' => $tipoTerapiaOtra,
    'generoProfesional' => $generoProfesional,
    'privacyPolicy' => $privacyPolicy ? 'Sí' : 'No',
];

$smtpHost = 'smtp.hostinger.com';
$smtpPort = 587;
$smtpUser = 'contacto@psicologiaenlinea.com.ar';
$smtpPass = 'TU_PASSWORD_SMTP';

$fromEmail = 'contacto@psicologiaenlinea.com.ar';
$fromName = 'Psicología en Línea';

$adminEmail = 'cliente@dominio.com';
$adminName = 'Psicología en Línea';

$templateAdmin = __DIR__ . '/mail-template/consultante-admin-template.php';
$templateUser = __DIR__ . '/mail-template/consultante-user-template.php';

try {
    $bodyAdmin = renderTemplate($templateAdmin, $formData);

    $mailAdmin = createMailer(
        $smtpHost,
        $smtpPort,
        $smtpUser,
        $smtpPass,
        $fromEmail,
        $fromName
    );

    $mailAdmin->addAddress($adminEmail, $adminName);
    $mailAdmin->addReplyTo($email, $nombreApellido);

    $mailAdmin->Subject = 'Nueva solicitud de psicólogo - ' . $nombreApellido;
    $mailAdmin->Body = $bodyAdmin;
    $mailAdmin->AltBody = strip_tags(
        str_replace(['<br>', '<br/>', '<br />'], "\n", $bodyAdmin)
    );

    $mailAdmin->send();

    $bodyUser = renderTemplate($templateUser, $formData);

    $mailUser = createMailer(
        $smtpHost,
        $smtpPort,
        $smtpUser,
        $smtpPass,
        $fromEmail,
        $fromName
    );

    $mailUser->addAddress($email, $nombreApellido);
    $mailUser->addReplyTo($fromEmail, $fromName);

    $mailUser->Subject = 'Recibimos tu formulario | Psicología en Línea';
    $mailUser->Body = $bodyUser;
    $mailUser->AltBody = strip_tags(
        str_replace(['<br>', '<br/>', '<br />'], "\n", $bodyUser)
    );

    $mailUser->send();

    echo json_encode([
        'success' => true,
        'message' => 'Formulario enviado correctamente.'
    ]);
} catch (Exception $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'No se pudo enviar el formulario.'
    ]);
}
