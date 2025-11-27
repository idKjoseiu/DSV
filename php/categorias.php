<?php
include "db.php";

$accion = $_POST["accion"] ?? "";



// CREAR CATEGORIA
if ($accion == "crear") {

    $nombre = $_POST["nombre"];
    $descripcion = $_POST["descripcion"];

    $sql = "INSERT INTO categorias (nombre, descripcion)
            VALUES ('$nombre', '$descripcion')";

    echo $conn->query($sql) ? "ok" : "error";
}


// MODIFICAR CATEGORIA
if ($accion == "modificar") {

    $id = $_POST["id"];
    $nombre = $_POST["nombre"];
    $descripcion = $_POST["descripcion"];

    $sql = "UPDATE categorias SET
            nombre='$nombre',
            descripcion='$descripcion'
            WHERE id_categoria=$id";

    echo $conn->query($sql) ? "ok" : "error";
}



// ELIMINAR CATEGORIA
if ($accion == "eliminar") {

    $id = $_POST["id"];

    $sql = "DELETE FROM categorias WHERE id_categoria=$id";

    echo $conn->query($sql) ? "ok" : "error";
}



// LISTAR CATEGORIAS (para los select del frontend) 
if ($accion == "listar") {

    $res = $conn->query("SELECT * FROM categorias ORDER BY nombre");

    $categorias = [];

    while ($row = $res->fetch_assoc()) {
        $categorias[] = $row;
    }

    echo json_encode($categorias);
}
?>
