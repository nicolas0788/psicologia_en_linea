<?php

$data = [
    'nombreApellido' => 'Juan Pérez',
    'edad' => '32',
    'email' => 'juan@email.com',
    'whatsapp' => '+54 9 11 1234 5678',
    'ciudadPais' => 'Buenos Aires, Argentina',
    'tipoConsulta' => 'Individual',
    'modalidad' => 'Virtual',
    'zonaReferencia' => 'Recoleta',
    'disponibilidad' => 'Lunes a viernes',
    'tipoTerapia' => 'TCC',
    'tipoTerapiaOtra' => '',
    'generoProfesional' => 'Mujer',
    'motivoConsulta' => 'Ansiedad y estrés laboral.',
    'privacyPolicy' => 'Sí',
];

extract($data, EXTR_SKIP);

require __DIR__ . '/mail-templates/admin-template.php';
