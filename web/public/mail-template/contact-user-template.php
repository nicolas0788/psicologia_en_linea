<?php

/** @var string $nombre */
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Recibimos tu mensaje | Psicología en Línea</title>
</head>

<body style="margin:0; padding:0; background-color:#F3EEF7; font-family:'Nunito Sans', Arial, sans-serif; color:#2F2438;">

    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
        Gracias por contactarnos. Recibimos tu mensaje correctamente.
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3EEF7; padding:32px 16px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px; background-color:#FFFFFF; border-radius:22px; overflow:hidden; box-shadow:0 10px 30px rgba(48, 31, 66, 0.16);">

                    <tr>
                        <td style="background:linear-gradient(135deg, #3B234F 0%, #4B2E63 45%, #6A4C93 100%); padding:34px 32px; text-align:center;">
                            <h1 style="margin:0; color:#FFFFFF; font-size:28px; line-height:1.25; font-weight:800;">
                                Mensaje recibido
                            </h1>

                            <p style="margin:10px 0 0; color:#E8DDF2; font-size:16px; line-height:1.5;">
                                Gracias por escribirnos.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:34px 32px 24px;">

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.65;">
                                Hola <?= htmlspecialchars($nombre) ?>,
                            </p>

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.65;">
                                Recibimos correctamente tu mensaje de contacto.
                            </p>

                            <p style="margin:0 0 18px; font-size:16px; line-height:1.65;">
                                Vamos a revisar la información que nos enviaste y, si corresponde, nos pondremos en contacto con vos.
                            </p>

                            <div style="background-color:#F1EAF6; border:1px solid #D9C8E8; border-radius:16px; padding:22px; margin:26px 0;">
                                <p style="margin:0 0 10px; font-size:15px; line-height:1.5; color:#4B2E63;">
                                    También podés escribirnos por WhatsApp:
                                </p>

                                <p style="margin:0; font-size:22px; line-height:1.4; font-weight:800; color:#3B234F;">
                                    +54 9 11 4947-4689
                                </p>
                            </div>

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
                                Este mensaje confirma la recepción del formulario de contacto.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>