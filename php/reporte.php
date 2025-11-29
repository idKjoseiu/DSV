<?php
include "db.php";

$accion = $_POST["accion"] ?? "";


// LISTAR TODAS LAS FACTURAS
if ($accion == "listar") {

    $sql = "SELECT 
                f.fecha,
                f.numero,
                p.nombre AS proveedor,
                c.nombre AS categoria,
                f.subtotal,
                f.itbms,
                f.total
            FROM facturas f
            INNER JOIN proveedores p ON p.id_proveedor = f.id_proveedor
            INNER JOIN categorias c ON c.id_categoria = f.id_categoria
            ORDER BY f.fecha DESC";

    $res = $conn->query($sql);

    $data = [];

    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
}


// REPORTE CON FILTROS
if ($accion == "filtrar") {

    $fecha_inicio = $_POST["fecha_inicio"] ?? "";
    $fecha_fin = $_POST["fecha_fin"] ?? "";
    $proveedor = $_POST["proveedor"] ?? "";
    $categoria = $_POST["categoria"] ?? "";

    // Base de consulta
    $sql = "SELECT 
                f.fecha,
                f.numero,
                p.nombre AS proveedor,
                c.nombre AS categoria,
                f.subtotal,
                f.itbms,
                f.total
            FROM facturas f
            INNER JOIN proveedores p ON p.id_proveedor = f.id_proveedor
            INNER JOIN categorias c ON c.id_categoria = f.id_categoria
            WHERE 1 = 1";

    // Filtros dinámicos
    if ($fecha_inicio != "") {
        $sql .= " AND f.fecha >= '$fecha_inicio'";
    }
    if ($fecha_fin != "") {
        $sql .= " AND f.fecha <= '$fecha_fin'";
    }
    if ($proveedor != "") {
        $sql .= " AND f.id_proveedor = '$proveedor'";
    }
    if ($categoria != "") {
        $sql .= " AND f.id_categoria = '$categoria'";
    }

    $sql .= " ORDER BY f.fecha DESC";

    $res = $conn->query($sql);

    $data = [];

    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
}
?>
