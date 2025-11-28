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
        modulo.querySelector(".boton-advertencia").style.display = "inline-block"; // mostrar modificar
        
        // Scroll al formulario
        modulo.scrollIntoView({ behavior: 'smooth' });
    });
}


// =====================================================
// CREAR PROVEEDOR
// =====================================================
function guardarProveedor() {
    
    

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
// LIMPIAR FORMULARIO(PROVEEDOR)
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

// Esperar a que el DOM esté completamente cargado
window.addEventListener("load", function() {
    
    // Esperar un poco más para asegurar que todo esté listo
    setTimeout(function() {
        cargarCategorias();
        inicializarBotonesCategorias();
    }, 500);
});

function inicializarBotonesCategorias() {
    const modulo = document.querySelector("#categorias");
    
    if (!modulo) {
        console.error("No se encontró el módulo de categorías");
        return;
    }

    // Botón Crear (boton-exito)
    const btnCrear = modulo.querySelector(".boton-exito");
    if (btnCrear) {
        btnCrear.addEventListener("click", guardarCategoria);
    }

    // Botón Modificar (boton-advertencia)
    const btnModificar = modulo.querySelector(".boton-advertencia");
    if (btnModificar) {
        btnModificar.addEventListener("click", modificarCategoria);
    }

    // Botón Limpiar (boton-secundario)
    const btnLimpiar = modulo.querySelector(".boton-secundario");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", limpiarFormularioCategoria);
    }
}


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

// ===============================================================================================================================================================
// ===============   FACTURAS   =====================
// ===============================================================================================================================================================

// Cargar lista y llenar selects al abrir la página
document.addEventListener("DOMContentLoaded", () => {
    cargarFacturas();
    cargarProveedoresSelect();
    cargarCategoriasSelect();

    // Botones dentro del módulo
    const modulo = document.querySelector("#facturas");

    // Botón Crear (boton-exito)
    modulo.querySelector(".boton-exito").addEventListener("click", guardarFactura);

    // Botón Modificar (boton-advertencia)
    modulo.querySelector(".boton-advertencia").addEventListener("click", modificarFactura);

    // Botón Eliminar (boton-peligro)
    modulo.querySelector(".boton-peligro").addEventListener("click", eliminarFacturaActual);

    // Botón Limpiar (boton-secundario)
    modulo.querySelector(".boton-secundario").addEventListener("click", limpiarFormularioFactura);

    // Calcular total automáticamente
    document.getElementById("subtotal-factura").addEventListener("change", calcularTotal);
    document.getElementById("itbms-factura").addEventListener("change", calcularTotal);
});


// =====================================================
// CARGAR PROVEEDORES EN SELECT
// =====================================================
function cargarProveedoresSelect() {
    $.post("php/proveedores.php", { accion: "listar" }, function (respuesta) {
        let datos = JSON.parse(respuesta);
        let select = document.getElementById("proveedor-factura");
        
        select.innerHTML = '<option value="">Seleccione un proveedor</option>';
        
        datos.forEach(p => {
            select.innerHTML += `<option value="${p.id_proveedor}">${p.nombre}</option>`;
        });
    });
}


// =====================================================
// CARGAR CATEGORÍAS EN SELECT
// =====================================================
function cargarCategoriasSelect() {
    $.post("php/categorias.php", { accion: "listar" }, function (respuesta) {
        let datos = JSON.parse(respuesta);
        let select = document.getElementById("categoria-factura");
        
        select.innerHTML = '<option value="">Seleccione una categoría</option>';
        
        datos.forEach(c => {
            select.innerHTML += `<option value="${c.id_categoria}">${c.nombre}</option>`;
        });
    });
}


// =====================================================
// CALCULAR TOTAL (SUBTOTAL + ITBMS)
// =====================================================
function calcularTotal() {
    const subtotal = parseFloat(document.getElementById("subtotal-factura").value) || 0;
    const itbms = subtotal * 0.07; // Calcular ITBMS como 7% del subtotal
    const total = subtotal + itbms;
    
    document.getElementById("itbms-factura").value = itbms.toFixed(2);
    document.getElementById("total-factura").value = total.toFixed(2);
}


// =====================================================
// LISTAR FACTURAS
// =====================================================
function cargarFacturas() {
    $.post("php/facturas.php", { accion: "listar" }, function (respuesta) {
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
                    <td colspan="8" style="text-align:center; padding:2rem;">
                        No hay facturas registradas
                    </td>
                </tr>
            `;
        } else {
            datos.forEach(f => {
                tabla += `
                    <tr>
                        <td>${f.fecha}</td>
                        <td>${f.numero}</td>
                        <td>${f.nombre_proveedor}</td>
                        <td>${f.nombre_categoria}</td>
                        <td>$${parseFloat(f.subtotal).toFixed(2)}</td>
                        <td>$${parseFloat(f.itbms).toFixed(2)}</td>
                        <td>$${parseFloat(f.total).toFixed(2)}</td>
                        <td>
                            <button class="boton-advertencia boton-pequeno" onclick="editarFactura(${f.id_factura})">Editar</button>
                            <button class="boton-peligro boton-pequeno" onclick="eliminarFactura(${f.id_factura})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        }

        document.getElementById("tabla-facturas").innerHTML = tabla;
    });
}


// =====================================================
// CREAR FACTURA
// =====================================================
function guardarFactura() {
    const fecha = document.getElementById("fecha-factura").value.trim();
    const numero = document.getElementById("numero-factura").value.trim();
    const id_proveedor = document.getElementById("proveedor-factura").value;
    const id_categoria = document.getElementById("categoria-factura").value;
    const subtotal = document.getElementById("subtotal-factura").value;
    const itbms = document.getElementById("itbms-factura").value;
    const total = document.getElementById("total-factura").value;

    if (!fecha || !numero || !id_proveedor || !id_categoria || !subtotal || !itbms) {
        alert("Por favor complete todos los campos");
        return;
    }

    let datos = {
        accion: "crear",
        fecha: fecha,
        numero: numero,
        id_proveedor: id_proveedor,
        id_categoria: id_categoria,
        subtotal: subtotal,
        itbms: itbms,
        total: total
    };

    $.post("php/facturas.php", datos, function (res) {
        if (res.trim() === "ok") {
            alert("Factura registrada correctamente");
            cargarFacturas();
            limpiarFormularioFactura();
        } else {
            alert("Error al registrar factura");
        }
    });
}


// =====================================================
// EDITAR (CARGAR DATOS AL FORMULARIO)
// =====================================================
function editarFactura(id) {
    $.post("php/facturas.php", { accion: "listar" }, function (respuesta) {
        let datos = JSON.parse(respuesta);
        let f = datos.find(item => item.id_factura == id);

        if (!f) return;

        // Rellenar inputs
        document.getElementById("fecha-factura").value = f.fecha;
        document.getElementById("numero-factura").value = f.numero;
        document.getElementById("proveedor-factura").value = f.id_proveedor;
        document.getElementById("categoria-factura").value = f.id_categoria;
        document.getElementById("subtotal-factura").value = f.subtotal;
        document.getElementById("itbms-factura").value = f.itbms;
        document.getElementById("total-factura").value = f.total;

        // Guardamos el ID en un atributo oculto
        document.getElementById("facturas").setAttribute("data-id", id);

        // Alternar botones
        const modulo = document.querySelector("#facturas");
        modulo.querySelector(".boton-exito").style.display = "none"; // ocultar crear
        modulo.querySelector(".boton-advertencia").style.display = "inline-block"; // mostrar modificar
        // NO mostrar botón eliminar (ya existe en la tabla)
        
        // Scroll al formulario
        modulo.scrollIntoView({ behavior: 'smooth' });
    });
}


// =====================================================
// GUARDAR MODIFICACIÓN
// =====================================================
function modificarFactura() {
    const modulo = document.querySelector("#facturas");
    const id = modulo.getAttribute("data-id");

    if (!id) {
        alert("Primero debe seleccionar una factura para modificar");
        return;
    }

    const fecha = document.getElementById("fecha-factura").value.trim();
    const numero = document.getElementById("numero-factura").value.trim();
    const id_proveedor = document.getElementById("proveedor-factura").value;
    const id_categoria = document.getElementById("categoria-factura").value;
    const subtotal = document.getElementById("subtotal-factura").value;
    const itbms = document.getElementById("itbms-factura").value;
    const total = document.getElementById("total-factura").value;

    if (!fecha || !numero || !id_proveedor || !id_categoria || !subtotal || !itbms) {
        alert("Por favor complete todos los campos");
        return;
    }

    let datos = {
        accion: "modificar",
        id: id,
        fecha: fecha,
        numero: numero,
        id_proveedor: id_proveedor,
        id_categoria: id_categoria,
        subtotal: subtotal,
        itbms: itbms,
        total: total
    };

    $.post("php/facturas.php", datos, function (res) {
        if (res.trim() === "ok") {
            alert("Factura modificada exitosamente");
            cargarFacturas();
            limpiarFormularioFactura();
        } else {
            alert("Error al modificar factura");
        }
    });
}


// =====================================================
// ELIMINAR FACTURA (ACTUAL)
// =====================================================
function eliminarFacturaActual() {
    const modulo = document.querySelector("#facturas");
    const id = modulo.getAttribute("data-id");

    if (!id) {
        alert("Primero debe seleccionar una factura para eliminar");
        return;
    }

    eliminarFactura(id);
}


// =====================================================
// ELIMINAR FACTURA
// =====================================================
function eliminarFactura(id) {
    if (!confirm("¿Seguro que deseas eliminar esta factura?")) return;

    $.post("php/facturas.php", { accion: "eliminar", id: id }, function (res) {
        if (res.trim() === "ok") {
            alert("Factura eliminada");
            cargarFacturas();
            limpiarFormularioFactura();
        } else {
            alert("Error al eliminar factura");
        }
    });
}


// =====================================================
// LIMPIAR FORMULARIO
// =====================================================
function limpiarFormularioFactura() {
    document.getElementById("fecha-factura").value = "";
    document.getElementById("numero-factura").value = "";
    document.getElementById("proveedor-factura").value = "";
    document.getElementById("categoria-factura").value = "";
    document.getElementById("subtotal-factura").value = "";
    document.getElementById("itbms-factura").value = "";
    document.getElementById("total-factura").value = "";

    const modulo = document.querySelector("#facturas");

    // Quitar ID almacenado
    modulo.removeAttribute("data-id");

    // Alternar botones
    modulo.querySelector(".boton-exito").style.display = "inline-block";  // mostrar Crear
    modulo.querySelector(".boton-advertencia").style.display = "none";     // ocultar Modificar
    // NO ocultar botón eliminar (solo debe estar en tabla)
}