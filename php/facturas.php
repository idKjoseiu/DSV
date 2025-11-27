<?php
// Importamos la conexión
include "db.php";

// Recibimos la acción (crear, modificar, eliminar, listar)
$accion = $_POST["accion"] ?? "";

// CREAR FACTURA
if ($accion == "crear") {

    $fecha = $_POST["fecha"];
    $numero = $_POST["numero"];
    $id_proveedor = $_POST["id_proveedor"];
    $id_categoria = $_POST["id_categoria"];
    $subtotal = $_POST["subtotal"];
    $itbms = $_POST["itbms"];
    $total = $_POST["total"];

    $sql = "INSERT INTO facturas (fecha, numero, id_proveedor, id_categoria, subtotal, itbms, total)
            VALUES ('$fecha', '$numero', '$id_proveedor', '$id_categoria', '$subtotal', '$itbms', '$total')";

    if ($conn->query($sql)) {
        echo "ok";
    } else {
        echo "error";
    }
}


// MODIFICAR FACTURA
if ($accion == "modificar") {

    $id = $_POST["id"];
    $fecha = $_POST["fecha"];
    $numero = $_POST["numero"];
    $id_proveedor = $_POST["id_proveedor"];
    $id_categoria = $_POST["id_categoria"];
    $subtotal = $_POST["subtotal"];
    $itbms = $_POST["itbms"];
    $total = $_POST["total"];

    $sql = "UPDATE facturas SET 
            fecha='$fecha',
            numero='$numero',
            id_proveedor='$id_proveedor',
            id_categoria='$id_categoria',
            subtotal='$subtotal',
            itbms='$itbms',
            total='$total'
            WHERE id_factura=$id";

    echo $conn->query($sql) ? "ok" : "error";
}


// ELIMINAR FACTURA
if ($accion == "eliminar") {
    
    $id = $_POST["id"];

    $sql = "DELETE FROM facturas WHERE id_factura=$id";

    echo $conn->query($sql) ? "ok" : "error";
}


// LISTAR FACTURAS (con JOIN para mostrar nombres de proveedor y categoría)
if ($accion == "listar") {

    $res = $conn->query("SELECT 
                            f.id_factura,
                            f.fecha,
                            f.numero,
                            f.id_proveedor,
                            f.id_categoria,
                            f.subtotal,
                            f.itbms,
                            f.total,
                            p.nombre AS nombre_proveedor,
                            c.nombre AS nombre_categoria
                        FROM facturas f
                        INNER JOIN proveedores p ON f.id_proveedor = p.id_proveedor
                        INNER JOIN categorias c ON f.id_categoria = c.id_categoria
                        ORDER BY f.fecha DESC");

    $facturas = [];

    while ($row = $res->fetch_assoc()) {
        $facturas[] = $row;
    }

    echo json_encode($facturas);
}
?>