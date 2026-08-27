<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

/*
|--------------------------------------------------------------------------
| 1. Validar método HTTP
|--------------------------------------------------------------------------
*/

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');

    echo json_encode(
        [
            'success' => false,
            'message' => 'Método no permitido.',
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

/*
|--------------------------------------------------------------------------
| Dependencias
|--------------------------------------------------------------------------
*/

// Security
require_once __DIR__
    . '../backend/security/IpRateLimiter.php';

// Composer
require_once __DIR__
    . '../backend/vendor/autoload.php';

// Forms
require_once __DIR__
    . '../backend/forms/FormManager.php';

// Form configurations
require_once __DIR__
    . '../backend/forms/configurations/contactForm.php';

require_once __DIR__
    . '../backend/forms/configurations/intakeForm.php';

require_once __DIR__
    . '../backend/forms/configurations/intakeFormPro.php';

require_once __DIR__
    . '../backend/forms/configurations/testFormConfiguration.php';





/*
|--------------------------------------------------------------------------
| 2. Aplicar límite de frecuencia por IP
|--------------------------------------------------------------------------
|
| Se utiliza REMOTE_ADDR porque proviene de la conexión con el servidor
| y no de un encabezado libremente manipulable por el cliente.
|
| Si en producción se utiliza un proxy inverso confiable, la obtención
| de la IP deberá configurarse específicamente para ese proxy.
|
*/

$clientIp = $_SERVER['REMOTE_ADDR'] ?? '';

if (
    !is_string($clientIp)
    || filter_var($clientIp, FILTER_VALIDATE_IP) === false
) {
    $clientIp = 'unknown';
}

$rateLimiter = new IpRateLimiter(
    __DIR__ . '../backend/storage/rate-limit'
);

try {
    $retryAfter = $rateLimiter->consume($clientIp);

    if ($retryAfter !== null) {
        $retryAfter = max(1, $retryAfter);

        http_response_code(429);

        header('Content-Type: application/json; charset=utf-8');
        header('Retry-After: ' . $retryAfter);

        echo json_encode(
            [
                'success' => false,
                'message' => $retryAfter <= 3
                    ? 'Esperá unos segundos antes de volver a enviar el formulario.'
                    : 'Alcanzaste el límite temporal de envíos. Intentá nuevamente más tarde.',
                'retryAfter' => $retryAfter,
            ],
            JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE
        );

        exit;
    }
} catch (\Throwable $exception) {
    error_log(
        sprintf(
            'Error en el limitador de envíos: %s en %s:%d',
            $exception->getMessage(),
            $exception->getFile(),
            $exception->getLine()
        )
    );

    /*
     * Fail closed:
     * si la protección falla, no se procesa el formulario.
     */

    http_response_code(503);

    header('Content-Type: application/json; charset=utf-8');
    header('Retry-After: 5');

    echo json_encode(
        [
            'success' => false,
            'message' =>
            'No se pudo procesar el envío. Intentá nuevamente en unos segundos.',
            'retryAfter' => 5,
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


/*
|--------------------------------------------------------------------------
| 3. Obtener campos y archivos
|--------------------------------------------------------------------------
|
| PHP separa automáticamente una petición multipart/form-data:
|
| $_POST  -> campos normales
| $_FILES -> archivos subidos
|
*/

$data = $_POST;
$files = $_FILES;


/*
|--------------------------------------------------------------------------
| 4. Identificar el formulario
|--------------------------------------------------------------------------
*/

$formType = $data['formName'] ?? null;

if (
    !is_string($formType)
    || trim($formType) === ''
) {
    http_response_code(400);

    echo json_encode(
        [
            'success' => false,
            'message' => 'Formulario no identificado.',
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


/*
|--------------------------------------------------------------------------
| 5. Instanciar y configurar el formulario
|--------------------------------------------------------------------------
*/

$form = new Form();

switch ($formType) {
    case 'contact':
        configureContactForm(
            $form,
            $data
        );
        break;

    case 'test':
        configureTestForm(
            $form,
            $data
        );
        break;

    case 'intake':
        configureIntakeForm(
            $form,
            $data
        );
        break;

    case 'pro-form':
        /*
         * Este formulario recibe tanto campos normales como archivos.
         */

        configureIntakeFormPro(
            $form,
            $data,
            $files
        );
        break;

    default:
        http_response_code(400);

        echo json_encode(
            [
                'success' => false,
                'message' => 'Formulario no válido.',
            ],
            JSON_UNESCAPED_UNICODE
        );

        exit;
}


/*
|--------------------------------------------------------------------------
| 6. Ejecutar validaciones y acciones
|--------------------------------------------------------------------------
|
| Form recibe los campos normales.
|
| Los archivos ya fueron entregados a configureIntakeFormPro(),
| que podrá utilizarlos tanto en sus policies como en la creación
| de IntakeFormProMailAction.
|
*/

try {
    $result = $form->run($data);
} catch (\Throwable $exception) {
    error_log(
        'Error al procesar el formulario "' . $formType . '": '
            . $exception->getMessage()
    );

    http_response_code(500);

    echo json_encode(
        [
            'success' => false,
            'message' =>
            'No se pudo procesar el formulario. Intentá nuevamente más tarde.',
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


/*
|--------------------------------------------------------------------------
| 7. Determinar el código HTTP
|--------------------------------------------------------------------------
*/

if (($result['success'] ?? false) !== true) {
    http_response_code(422);
}


/*
|--------------------------------------------------------------------------
| 8. Responder al frontend
|--------------------------------------------------------------------------
*/

try {
    echo json_encode(
        $result,
        JSON_THROW_ON_ERROR
            | JSON_UNESCAPED_UNICODE
            | JSON_UNESCAPED_SLASHES
    );
} catch (\JsonException $exception) {
    error_log(
        'No se pudo codificar la respuesta del formulario "'
            . $formType
            . '": '
            . $exception->getMessage()
    );

    http_response_code(500);

    echo json_encode(
        [
            'success' => false,
            'message' =>
            'No se pudo generar la respuesta del servidor.',
        ],
        JSON_UNESCAPED_UNICODE
    );
}
