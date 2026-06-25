<?php

$data = [
    'nombreApellido' => 'Juan Pérez',
];

extract($data, EXTR_SKIP);

require __DIR__ . '/mail-templates/user-template.php';
