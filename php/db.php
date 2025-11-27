<?php
// db.php

require_once 'config.php';

// Mostrar errores en desarrollo
if (defined('APP_DEBUG') && APP_DEBUG) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
}

// Crear conexión
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar
if ($conn->connect_error) {
    // En producción no mostrar detalles sensibles
    if (defined('APP_DEBUG') && APP_DEBUG) {
        die("Error de conexión: (" . $conn->connect_errno . ") " . $conn->connect_error);
    } else {
        die("Error de conexión a la base de datos.");
    }
}

// Charset
$conn->set_charset(DB_CHARSET);

// Helper: función simple para usar el prefijo de tablas
function t($tabla) {
    return TABLE_PREFIX . $tabla;
}
