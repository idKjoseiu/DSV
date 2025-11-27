// ===============================================================================================================================================================
// ===============   PROVEEDORES   =====================
// ===============================================================================================================================================================
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
                    <td colspan="5" style="text-align:center; padding:2rem;">
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
                            <button class="boton-advertencia boton-pequeno" onclick="editarProveedor(${p.id_proveedor})">Editar</button>
                            <button class="boton-peligro boton-pequeno" onclick="eliminarProveedor(${p.id_proveedor})">Eliminar</button>
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
    
    // Validar antes de guardar
    if (!validarFormularioProveedor()) {
        return;
    }

    let datos = {
        accion: "crear",
        codigo: document.getElementById("codigo-proveedor").value.trim(),
        nombre: document.getElementById("nombre-proveedor").value.trim(),
        ruc: document.getElementById("ruc-proveedor").value.trim(),
        dv: document.getElementById("dv-proveedor").value.trim(),
        direccion: document.getElementById("direccion-proveedor").value.trim()
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
// EDITAR (CARGAR DATOS AL FORMULARIO)(PROVEEDOR)
// =====================================================
function modificarProveedor() {

    const modulo = document.querySelector("#proveedores");
    const id = modulo.getAttribute("data-id");
    
    // Validar antes de modificar
    if (!validarFormularioProveedor()) {
        return;
    }

    let datos = {
        accion: "modificar",
        id: id,
        codigo: document.getElementById("codigo-proveedor").value.trim(),
        nombre: document.getElementById("nombre-proveedor").value.trim(),
        ruc: document.getElementById("ruc-proveedor").value.trim(),
        dv: document.getElementById("dv-proveedor").value.trim(),
        direccion: document.getElementById("direccion-proveedor").value.trim()
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
// GUARDAR MODIFICACIÓN(PROVEEDOR)
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

// =====================================================
// ===============   CATEGORÍAS   ======================
// =====================================================

// Cargar al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();

    // Botones dentro del módulo categorías
    const modulo = document.querySelector("#categorias");

    // Botón Crear (boton-exito)
    modulo.querySelector(".boton-exito").addEventListener("click", guardarCategoria);

    // Botón Modificar (boton-advertencia)
    modulo.querySelector(".boton-advertencia").addEventListener("click", modificarCategoria);

    // Botón Limpiar (boton-secundario)
    modulo.querySelector(".boton-secundario").addEventListener("click", limpiarFormularioCategoria);
});


// =====================================================
// LISTAR CATEGORÍAS
// =====================================================
function cargarCategorias() {

    $.post("php/categorias.php", { accion: "listar" }, function (respuesta) {

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
                    <td colspan="3" style="text-align:center; padding:2rem;">
                        No hay categorías registradas
                    </td>
                </tr>
            `;
        } else {
            datos.forEach(c => {
                tabla += `
                    <tr>
                        <td>${c.nombre}</td>
                        <td>${c.descripcion}</td>
                        <td>
                            <button class="boton-advertencia boton-pequeno" onclick="editarCategoria(${c.id_categoria})">Editar</button>
                            <button class="boton-peligro boton-pequeno" onclick="eliminarCategoria(${c.id_categoria})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }

        document.getElementById("tabla-categorias").innerHTML = tabla;
    });
}


// =====================================================
// CREAR CATEGORÍA
// =====================================================
function guardarCategoria() {

    const nombre = document.getElementById("nombre-categoria").value.trim();
    const descripcion = document.getElementById("descripcion-categoria").value.trim();

    // Validación básica
    if (!nombre || !descripcion) {
        alert("Por favor complete todos los campos");
        return;
    }

    let datos = {
        accion: "crear",
        nombre: nombre,
        descripcion: descripcion
    };

    $.post("php/categorias.php", datos, function (res) {

        if (res.trim() === "ok") {
            alert("Categoría registrada correctamente");

            cargarCategorias();
            limpiarFormularioCategoria();

        } else {
            alert("Error al registrar categoría");
        }
    });
}


// =====================================================
// EDITAR (CARGAR DATOS AL FORMULARIO)
// =====================================================
function editarCategoria(id) {

    $.post("php/categorias.php", { accion: "listar" }, function (respuesta) {

        let datos = JSON.parse(respuesta);
        let c = datos.find(item => item.id_categoria == id);

        if (!c) return;

        // Rellenar inputs
        document.getElementById("nombre-categoria").value = c.nombre;
        document.getElementById("descripcion-categoria").value = c.descripcion;

        // Guardamos el ID en un atributo oculto
        document.getElementById("categorias").setAttribute("data-id", id);

        // Alternar botones
        const modulo = document.querySelector("#categorias");
        modulo.querySelector(".boton-exito").style.display = "none"; // ocultar crear
        modulo.querySelector(".boton-advertencia").style.display = "inline-block"; // mostrar modificar
        
        // Scroll al formulario
        modulo.scrollIntoView({ behavior: 'smooth' });
    });
}


// =====================================================
// GUARDAR MODIFICACIÓN
// =====================================================
function modificarCategoria() {

    const modulo = document.querySelector("#categorias");
    const id = modulo.getAttribute("data-id");

    if (!id) {
        alert("Primero debe seleccionar una categoría para modificar");
        return;
    }

    const nombre = document.getElementById("nombre-categoria").value.trim();
    const descripcion = document.getElementById("descripcion-categoria").value.trim();

    // Validación básica
    if (!nombre || !descripcion) {
        alert("Por favor complete todos los campos");
        return;
    }

    let datos = {
        accion: "modificar",
        id: id,
        nombre: nombre,
        descripcion: descripcion
    };

    $.post("php/categorias.php", datos, function (res) {
        if (res.trim() === "ok") {

            alert("Categoría modificada exitosamente");

            cargarCategorias();
            limpiarFormularioCategoria();

        } else {
            alert("Error al modificar categoría");
        }
    });
}


// =====================================================
// ELIMINAR CATEGORÍA
// =====================================================
function eliminarCategoria(id) {

    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    $.post("php/categorias.php", { accion: "eliminar", id: id }, function (res) {

        if (res.trim() === "ok") {
            alert("Categoría eliminada");
            cargarCategorias();
        } else {
            alert("No se puede eliminar categoría: está asociada a facturas");
        }
    });
}


// =====================================================
// LIMPIAR FORMULARIO
// =====================================================
function limpiarFormularioCategoria() {

    document.getElementById("nombre-categoria").value = "";
    document.getElementById("descripcion-categoria").value = "";

    const modulo = document.querySelector("#categorias");

    // Quitar ID almacenado
    modulo.removeAttribute("data-id");

    // Alternar botones
    modulo.querySelector(".boton-exito").style.display = "inline-block";  // mostrar Crear
    modulo.querySelector(".boton-advertencia").style.display = "none";     // ocultar Modificar
}
