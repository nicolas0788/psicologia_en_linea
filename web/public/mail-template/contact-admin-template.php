<?php

/** @var string $tipoContacto */
/** @var string $nombre */
/** @var string $email */
/** @var string $mensaje */
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Nuevo mensaje de contacto</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;">
        <tr>
            <td align="center" style="padding:32px 12px;">

                <table width="620" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;">
                    <tr>
                        <td style="background:#3C329C;color:#ffffff;padding:28px;text-align:center;">
                            <h1 style="margin:0;font-size:24px;line-height:1.3;">
                                Nuevo mensaje de contacto
                            </h1>

                            <p style="margin:8px 0 0;font-size:14px;line-height:1.4;">
                                Psicología en Línea
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:32px;color:#333333;">

                            <h2 style="margin:0 0 18px;font-size:20px;color:#222222;">
                                Datos del contacto
                            </h2>

                            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px;line-height:1.5;">
                                <tr>
                                    <td style="border-bottom:1px solid #eeeeee;width:40%;"><strong>Tipo de contacto</strong></td>
                                    <td style="border-bottom:1px solid #eeeeee;"><?= htmlspecialchars($tipoContacto) ?></td>
                                </tr>

                                <tr>
                                    <td style="border-bottom:1px solid #eeeeee;"><strong>Nombre y apellido</strong></td>
                                    <td style="border-bottom:1px solid #eeeeee;"><?= htmlspecialchars($nombre) ?></td>
                                </tr>

                                <tr>
                                    <td style="border-bottom:1px solid #eeeeee;"><strong>Email</strong></td>
                                    <td style="border-bottom:1px solid #eeeeee;"><?= htmlspecialchars($email) ?></td>
                                </tr>
                            </table>

                            <hr style="border:none;border-top:1px solid #eeeeee;margin:28px 0;">

                            <h2 style="margin:0 0 12px;font-size:20px;color:#222222;">
                                Mensaje
                            </h2>

                            <div style="background:#fafafa;padding:18px;border-radius:8px;font-size:15px;line-height:1.7;color:#555555;">
                                <?= nl2br(htmlspecialchars($mensaje)) ?>
                            </div>

                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f7f7fa;padding:18px;text-align:center;font-size:12px;color:#777777;">
                            Este email fue generado automáticamente desde el formulario de contacto.
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>

</html>