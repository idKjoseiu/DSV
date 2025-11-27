<?php
// Importamos la conexión
include "db.php";

// Recibimos la acción (crear, modificar, eliminar, listar)
$accion = $_POST["accion"] ?? "";

// CREAR PROVEEDOR
if ($accion == "crear") {

    $codigo = $_POST["codigo"];
    $nombre = $_POST["nombre"];
    $ruc = $_POST["ruc"];
    $dv = $_POST["dv"];
    $direccion = $_POST["direccion"];

    $sql = "INSERT INTO proveedores (codigo, nombre, ruc, dv, direccion)
            VALUES ('$codigo', '$nombre', '$ruc', '$dv', '$direccion')";

    if ($conn->query($sql)) {
        echo "ok";
    } else {
        echo "error";
    }
}


// MODIFICAR PROVEEDOR
if ($accion == "modificar") {

    $id = $_POST["id"];
    $codigo = $_POST["codigo"];
    $nombre = $_POST["nombre"];
    $ruc = $_POST["ruc"];
    $dv = $_POST["dv"];
    $direccion = $_POST["direccion"];

    $sql = "UPDATE proveedores SET 
            codigo='$codigo',
            nombre='$nombre',
            ruc='$ruc',
            dv='$dv',
            direccion='$direccion'
            WHERE id_proveedor=$id";

    echo $conn->query($sql) ? "ok" : "error";
}


// ELIMINAR PROVEEDOR
if ($accion == "eliminar") {
    
    $id = $_POST["id"];

    $sql = "DELETE FROM proveedores WHERE id_proveedor=$id";

    echo $conn->query($sql) ? "ok" : "error";
}


// LISTAR PROVEEDORES (para llenar selects de consultas)
if ($accion == "listar") {

    $res = $conn->query("SELECT * FROM proveedores ORDER BY nombre");

    $proveedores = [];

    while ($row = $res->fetch_assoc()) {
        $proveedores[] = $row;
    }

    echo json_encode($proveedores);
}
?>
