<?php

/** @var string $nombreApellido */
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Recibimos tu formulario | Psicología en Línea</title>
</head>

<body style="margin:0; padding:0; background-color:#F3EEF7; font-family:'Nunito Sans', Arial, sans-serif; color:#2F2438;">

    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
        Gracias por completar el formulario. Te vamos a contactar por WhatsApp con la información correspondiente.
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3EEF7; padding:32px 16px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background-color:#FFFFFF; border-radius:22px; overflow:hidden; box-shadow:0 10px 30px rgba(48, 31, 66, 0.16);">

                    <tr>
                        <td style="background:linear-gradient(135deg, #3B234F 0%, #4B2E63 45%, #6A4C93 100%); padding:34px 32px; text-align:center;">
                            <h1 style="margin:0; color:#FFFFFF; font-size:28px; line-height:1.25; font-weight:800;">
                                Muchas gracias
                            </h1>

                            <p style="margin:10px 0 0; color:#E8DDF2; font-size:16px; line-height:1.5;">
                                Recibimos tu formulario correctamente.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:34px 32px 24px;">

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.65;">
                                Hola <?= htmlspecialchars($nombreApellido) ?>,
                            </p>

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.65;">
                                Vamos a revisar la información que compartiste para orientarte con una
                                <strong>opción profesional sugerida</strong>, considerando los datos y preferencias que nos brindaste.
                            </p>

                            <div style="background-color:#F1EAF6; border:1px solid #D9C8E8; border-radius:16px; padding:22px; margin:26px 0;">
                                <p style="margin:0 0 10px; font-size:15px; line-height:1.5; color:#4B2E63;">
                                    Te vamos a contactar por WhatsApp desde:
                                </p>

                                <p style="margin:0; font-size:22px; line-height:1.4; font-weight:800; color:#3B234F;">
                                    +54 9 11 4947-4689
                                </p>
                            </div>

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.65;">
                                En ese mensaje vas a recibir la información del/la profesional sugerido/a, la
                                <strong>modalidad de atención</strong> y los <strong>honorarios vigentes</strong>.
                            </p>

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.65;">
                                Con esa información, vas a poder decidir si querés avanzar.
                            </p>

                            <p style="margin:0 0 26px; font-size:16px; line-height:1.65;">
                                No hace falta responder este correo ni completar nuevamente el formulario.
                            </p>

                            <p style="margin:0; font-size:16px; line-height:1.65;">
                                Saludos,<br>
                                <strong>Equipo de Psicología en Línea</strong><br>

                                <a href="https://www.psicologiaenlinea.com.ar" style="color:#4B2E63; text-decoration:none; font-weight:700;">
                                    www.psicologiaenlinea.com.ar
                                </a>
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#F7F3FA; border-top:1px solid #E3D7EC; padding:20px 32px; text-align:center;">
                            <p style="margin:0; font-size:12.5px; line-height:1.55; color:#6C5D78;">
                                Este mensaje confirma la recepción del formulario. Psicología en Línea no atiende urgencias ni emergencias.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>