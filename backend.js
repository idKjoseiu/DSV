// =====================================================
// ===============   PROVEEDORES   =====================
// =====================================================

// Cargar lista al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    cargarProveedores();

    // Botones dentro del módulo
    const modulo = document.querySelector("#proveedores");

    // Botón Crear (boton-exito)
    modulo.querySelector(".boton-exito").addEventListener("click", guardarProveedor);

    // Botón Modificar (boton-advertencia)
    modulo.querySelector(".boton-advertencia").addEventListener("click", modificarProveedor);

    // Botón Limpiar (boton-secundario)
    modulo.querySelector(".boton-secundario").addEventListener("click", limpiarFormularioProveedor);
});


// =====================================================
// LISTAR PROVEEDORES
// =====================================================
function cargarProveedores() {

    $.post("php/proveedores.php", { accion: "listar" }, function (respuesta) {

        let datos = [];
        try {
            datos = JSON.parse(respuesta);
        } catch (e) {
            console.error("JSON inválido:", respuesta);
            return;
        }

        let tabla = "";

        if (datos.length === 0) {
            tabla = `
                <tr>
                    <td colspan="7" style="text-align:center; padding:2rem;">
                        No hay proveedores registrados
                    </td>
                </tr>
            `;
        } else {
            datos.forEach(p => {
                tabla += `
                    <tr>
                        <td>${p.codigo}</td>
                        <td>${p.nombre}</td>
                        <td>${p.ruc}-${p.dv}</td>
                        <td>${p.direccion}</td>
                        <td>
                            <button class="boton-advertencia" onclick="editarProveedor(${p.id_proveedor})">Editar</button>
                            <button class="boton-peligro" onclick="eliminarProveedor(${p.id_proveedor})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }

        document.getElementById("tabla-proveedores").innerHTML = tabla;
    });
}


// =====================================================
// CREAR PROVEEDOR
// =====================================================
function guardarProveedor() {

    let datos = {
        accion: "crear",
        codigo: document.getElementById("codigo-proveedor").value,
        nombre: document.getElementById("nombre-proveedor").value,
        ruc: document.getElementById("ruc-proveedor").value,
        dv: document.getElementById("dv-proveedor").value,
        direccion: document.getElementById("direccion-proveedor").value
    };

    $.post("php/proveedores.php", datos, function (res) {

        if (res.trim() === "ok") {
            alert("Proveedor registrado correctamente");

            cargarProveedores();
            limpiarFormularioProveedor();

        } else {
            alert("Error al registrar proveedor");
        }
    });
}


// =====================================================
// EDITAR (CARGAR DATOS AL FORMULARIO)
// =====================================================
function editarProveedor(id) {

    $.post("php/proveedores.php", { accion: "listar" }, function (respuesta) {

        let datos = JSON.parse(respuesta);
        let p = datos.find(item => item.id_proveedor == id);

        if (!p) return;

        // Rellenar inputs
        document.getElementById("codigo-proveedor").value = p.codigo;
        document.getElementById("nombre-proveedor").value = p.nombre;
        document.getElementById("ruc-proveedor").value = p.ruc;
        document.getElementById("dv-proveedor").value = p.dv;
        document.getElementById("direccion-proveedor").value = p.direccion;

        // Guardamos el ID en un atributo oculto
        document.getElementById("proveedores").setAttribute("data-id", id);

        // Alternar botones
        const modulo = document.querySelector("#proveedores");
        modulo.querySelector(".boton-exito").style.display = "none"; // ocultar crear
        modulo.querySelector(".boton-advertencia").style.display = "inline-block"; // mostrar editar
    });
}


// =====================================================
// GUARDAR MODIFICACIÓN
// =====================================================
function modificarProveedor() {

    const modulo = document.querySelector("#proveedores");
    const id = modulo.getAttribute("data-id");

    let datos = {
        accion: "modificar",
        id: id,
        codigo: document.getElementById("codigo-proveedor").value,
        nombre: document.getElementById("nombre-proveedor").value,
        ruc: document.getElementById("ruc-proveedor").value,
        dv: document.getElementById("dv-proveedor").value,
        direccion: document.getElementById("direccion-proveedor").value
    };

    $.post("php/proveedores.php", datos, function (res) {
        if (res.trim() === "ok") {

            alert("Proveedor modificado exitosamente");

            cargarProveedores();
            limpiarFormularioProveedor();

        } else {
            alert("Error al modificar proveedor");
        }
    });
}


// =====================================================
// ELIMINAR PROVEEDOR
// =====================================================
function eliminarProveedor(id) {

    if (!confirm("¿Seguro que deseas eliminar este proveedor?")) return;

    $.post("php/proveedores.php", { accion: "eliminar", id: id }, function (res) {

        if (res.trim() === "ok") {
            alert("Proveedor eliminado");
            cargarProveedores();
        } else {
            alert("No se puede eliminar proveedor: está asociado a facturas");
        }
    });
}


// =====================================================
// LIMPIAR FORMULARIO
// =====================================================
function limpiarFormularioProveedor() {

    document.getElementById("codigo-proveedor").value = "";
    document.getElementById("nombre-proveedor").value = "";
    document.getElementById("ruc-proveedor").value = "";
    document.getElementById("dv-proveedor").value = "";
    document.getElementById("direccion-proveedor").value = "";

    const modulo = document.querySelector("#proveedores");

    // Quitar ID almacenado
    modulo.removeAttribute("data-id");

    // Alternar botones
    modulo.querySelector(".boton-exito").style.display = "inline-block";  // mostrar Crear
    modulo.querySelector(".boton-advertencia").style.display = "none";     // ocultar Modificar
}
