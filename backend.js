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
            showNotification("success", "Proveedor registrado correctamente");
            cargarProveedores();
            limpiarFormularioProveedor();

        } else {
            showNotification("error", "Error al registrar proveedor");
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

            showNotification("success", "Proveedor modificado exitosamente");

            cargarProveedores();
            limpiarFormularioProveedor();

        } else {
            showNotification("error", "Error al modificar proveedor");
        }
    });
}


// =====================================================
// ELIMINAR PROVEEDOR
// =====================================================
function eliminarProveedor(id) {

    showConfirm("¿Seguro que deseas eliminar este proveedor?").then(confirmed => {
        if (!confirmed) return;

        $.post("php/proveedores.php", { accion: "eliminar", id: id }, function (res) {

            if (res.trim() === "ok") {
                showNotification("success", "Proveedor eliminado");
                cargarProveedores();
            } else {
                showNotification("error", "No se puede eliminar proveedor: está asociado a facturas");
            }
        });
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
        showNotification("warning", "Por favor complete todos los campos");
        return;
    }

    let datos = {
        accion: "crear",
        nombre: nombre,
        descripcion: descripcion
    };

    $.post("php/categorias.php", datos, function (res) {

        if (res.trim() === "ok") {
            showNotification("success", "Categoría registrada correctamente");

            cargarCategorias();
            limpiarFormularioCategoria();

        } else {
            showNotification("error", "Error al registrar categoría");
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
        showNotification("warning", "Primero debe seleccionar una categoría para modificar");
        return;
    }

    const nombre = document.getElementById("nombre-categoria").value.trim();
    const descripcion = document.getElementById("descripcion-categoria").value.trim();

    // Validación básica
    if (!nombre || !descripcion) {
        showNotification("warning", "Por favor complete todos los campos");
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

            showNotification("success", "Categoría modificada exitosamente");

            cargarCategorias();
            limpiarFormularioCategoria();

        } else {
            showNotification("error", "Error al modificar categoría");
        }
    });
}


// =====================================================
// ELIMINAR CATEGORÍA
// =====================================================
function eliminarCategoria(id) {

    showConfirm("¿Seguro que deseas eliminar esta categoría?").then(confirmed => {
        if (!confirmed) return;

        $.post("php/categorias.php", { accion: "eliminar", id: id }, function (res) {

            if (res.trim() === "ok") {
                showNotification("success", "Categoría eliminada");
                cargarCategorias();
            } else {
                showNotification("error", "No se puede eliminar categoría: está asociada a facturas");
            }
        });
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
        showNotification("warning", "Por favor complete todos los campos");
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
            showNotification("success", "Factura registrada correctamente");
            cargarFacturas();
            limpiarFormularioFactura();
        } else {
            showNotification("error", "Error al registrar factura");
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
        showNotification("warning", "Primero debe seleccionar una factura para modificar");
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
        showNotification("warning", "Por favor complete todos los campos");
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
            showNotification("success", "Factura modificada exitosamente");
            cargarFacturas();
            limpiarFormularioFactura();
        } else {
            showNotification("error", "Error al modificar factura");
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
        showNotification("warning", "Primero debe seleccionar una factura para eliminar");
        return;
    }

    // Reusar la confirmación moderna
    eliminarFactura(id);
}

// =====================================================
// ELIMINAR FACTURA
// =====================================================
function eliminarFactura(id) {
    showConfirm("¿Seguro que deseas eliminar esta factura?").then(confirmed => {
        if (!confirmed) return;

        $.post("php/facturas.php", { accion: "eliminar", id: id }, function (res) {
            if (res.trim() === "ok") {
                showNotification("success", "Factura eliminada");
                cargarFacturas();
                limpiarFormularioFactura();
            } else {
                showNotification("error", "Error al eliminar factura");
            }
        });
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

// ===============================================================================================================================================================
// ===============   REPORTES   =====================
// ===============================================================================================================================================================

// Inicializar reportes al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarFacturasReportes();
    cargarProveedoresFiltro();
    categoriasFiltro();
    
    // Botones de reportes
    const modulo = document.querySelector("#reportes");
    
    // Botón Buscar
    const btnBuscar = modulo.querySelector(".boton-primario");
    if (btnBuscar) {
        btnBuscar.addEventListener("click", filtrarFacturas);
    }
    
    // Botón Exportar CSV
    const btnExportar = modulo.querySelector(".boton-exito");
    if (btnExportar) {
        btnExportar.addEventListener("click", exportarCSV);
    }
    
    // Botón Limpiar Filtros (se obtiene desde el propio módulo para evitar índices incorrectos)
    const btnLimpiar = modulo.querySelector(".boton-secundario");
     if (btnLimpiar) {
         btnLimpiar.addEventListener("click", limpiarFiltros);
     }
});


// =====================================================
// CARGAR TODAS LAS FACTURAS EN REPORTE
// =====================================================
function cargarFacturasReportes() {
    $.post("php/reporte.php", { accion: "listar" }, function (respuesta) {
        let datos = [];
        try {
            datos = JSON.parse(respuesta);
        } catch (e) {
            console.error("JSON inválido:", respuesta);
            return;
        }

        mostrarTablaReportes(datos);
        calcularTotales(datos);
    });
}


// =====================================================
// CARGAR PROVEEDORES EN FILTRO
// =====================================================
function cargarProveedoresFiltro() {
    $.post("php/proveedores.php", { accion: "listar" }, function (respuesta) {
        let datos = JSON.parse(respuesta);
        let select = document.getElementById("proveedor-filtro");
        
        select.innerHTML = '<option value="">Todos los proveedores</option>';
        
        datos.forEach(p => {
            select.innerHTML += `<option value="${p.id_proveedor}">${p.nombre}</option>`;
        });
    });
}


// =====================================================
// CARGAR CATEGORÍAS EN FILTRO
// =====================================================
function categoriasFiltro() {
    $.post("php/categorias.php", { accion: "listar" }, function (respuesta) {
        let datos = JSON.parse(respuesta);
        let select = document.getElementById("categoria-filtro");
        
        select.innerHTML = '<option value="">Todas las categorías</option>';
        
        datos.forEach(c => {
            select.innerHTML += `<option value="${c.id_categoria}">${c.nombre}</option>`;
        });
    });
}


// =====================================================
// FILTRAR FACTURAS
// =====================================================
function filtrarFacturas() {
    const fecha_inicio = document.getElementById("fecha-inicio-filtro").value;
    const fecha_fin = document.getElementById("fecha-fin-filtro").value;
    const proveedor = document.getElementById("proveedor-filtro").value;
    const categoria = document.getElementById("categoria-filtro").value;

    let datos = {
        accion: "filtrar",
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        proveedor: proveedor,
        categoria: categoria
    };

    $.post("php/reporte.php", datos, function (respuesta) {
        let resultados = [];
        try {
            resultados = JSON.parse(respuesta);
        } catch (e) {
            console.error("JSON inválido:", respuesta);
            return;
        }

        mostrarTablaReportes(resultados);
        calcularTotales(resultados);
    });
}


// =====================================================
// MOSTRAR TABLA DE REPORTES
// =====================================================
function mostrarTablaReportes(datos) {
    let tabla = "";

    if (datos.length === 0) {
        tabla = `
            <tr>
                <td colspan="7" style="text-align:center; padding:2rem;">
                    No hay facturas encontradas con los filtros seleccionados
                </td>
            </tr>
        `;
    } else {
        datos.forEach(f => {
            tabla += `
                <tr>
                    <td>${f.fecha}</td>
                    <td>${f.numero}</td>
                    <td>${f.proveedor}</td>
                    <td>${f.categoria}</td>
                    <td>$${parseFloat(f.subtotal).toFixed(2)}</td>
                    <td>$${parseFloat(f.itbms).toFixed(2)}</td>
                    <td>$${parseFloat(f.total).toFixed(2)}</td>
                </tr>
            `;
        });
    }

    document.getElementById("tabla-reportes").innerHTML = tabla;
}


// =====================================================
// CALCULAR TOTALES
// =====================================================
function calcularTotales(datos) {
    let sumaTotal = 0;
    
    datos.forEach(f => {
        sumaTotal += parseFloat(f.total);
    });

    const tarjetaTotales = document.querySelector(".tarjeta-totales");
    tarjetaTotales.querySelector(".monto-total").textContent = "$" + sumaTotal.toFixed(2);
    tarjetaTotales.querySelector("p").textContent = `Basado en ${datos.length} facturas encontradas`;
}


// =====================================================
// EXPORTAR A CSV
// =====================================================
function exportarCSV() {
    // Obtener datos de la tabla
    const tabla = document.getElementById("tabla-reportes");
    const filas = tabla.querySelectorAll("tr");

    // Verificar si hay datos
    if (filas.length === 0 || (filas.length === 1 && filas[0].textContent.includes("No hay facturas"))) {
        showNotification("info", "No hay facturas para exportar");
        return;
    }

    // Encabezados
    const encabezados = ["Fecha", "No. Factura", "Proveedor", "Categoría", "Subtotal", "ITBMS", "Total"];
    let csv = encabezados.join(",") + "\n";

    // Datos
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length > 0) {
            let fila_csv = [];
            celdas.forEach(celda => {
                let valor = celda.textContent.trim();
                // Escapar comillas y envolver en comillas si contiene comas
                valor = valor.replace(/"/g, '""');
                if (valor.includes(",")) {
                    valor = `"${valor}"`;
                }
                fila_csv.push(valor);
            });
            csv += fila_csv.join(",") + "\n";
        }
    });

    // Agregar fila de totales
    const tarjetaTotales = document.querySelector(".tarjeta-totales");
    const montoTotal = tarjetaTotales.querySelector(".monto-total").textContent;
    const cantidadFacturas = tarjetaTotales.querySelector("p").textContent;
    
    csv += "\n,,,Totales:,,,\n";
    csv += `"${cantidadFacturas}","${montoTotal}"\n`;

    // Crear y descargar archivo
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_facturas_${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Después de descarga
    showNotification("success", "Archivo CSV descargado exitosamente");
}


// =====================================================
// LIMPIAR FILTROS
// =====================================================
function limpiarFiltros() {
    document.getElementById("fecha-inicio-filtro").value = "";
    document.getElementById("fecha-fin-filtro").value = "";
    document.getElementById("proveedor-filtro").value = "";
    document.getElementById("categoria-filtro").value = "";

    cargarFacturasReportes();
}

/* ---------------------------
   Sistema de notificaciones
   --------------------------- */
function showNotification(tipo = "info", mensaje = "", duracion = 4000) {
    // Intentar obtener contenedor existente o crear uno
    let cont = document.getElementById("notificaciones");
    if (!cont) {
        cont = document.createElement("div");
        cont.id = "notificaciones";
        cont.setAttribute("aria-live", "polite");
        document.body.appendChild(cont);
    }

    const notif = document.createElement("div");
    notif.className = `notificacion notificacion--${tipo}`;

    // Iconos sencillos (se puede poner svg pero me da pereza)
    const iconMap = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ"
    };
    const icon = iconMap[tipo] || iconMap.info;

    notif.innerHTML = `<div class="icono">${icon}</div><div class="contenido">${mensaje}</div>`;

    // Cerrar al hacer click
    notif.addEventListener("click", () => closeNotif(notif));

    cont.appendChild(notif);

    // Auto-cierre
    const timeoutId = setTimeout(() => closeNotif(notif), duracion);

    function closeNotif(el) {
        clearTimeout(timeoutId);
        if (!el.classList.contains("notificacion--cerrando")) {
            el.classList.add("notificacion--cerrando");
            // Esperar animación y remover
            setTimeout(() => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            }, 300);
        }
    }

    return notif;
}

/* ---------------------------
   Sistema de confirmación de eliminacion
   --------------------------- */
function showConfirm(mensaje = "¿Confirmar?", opciones = {}) {
    // Devuelve Promise<boolean>
    return new Promise(resolve => {
        const overlay = document.createElement("div");
        overlay.className = "confirm-overlay";

        const dialog = document.createElement("div");
        dialog.className = "confirm-dialog";

        const titulo = document.createElement("div");
        titulo.className = "confirm-titulo";
        titulo.textContent = opciones.titulo || "Confirmación";

        const msg = document.createElement("div");
        msg.className = "confirm-mensaje";
        msg.textContent = mensaje;

        const botones = document.createElement("div");
        botones.className = "confirm-botones";

        const btnCancel = document.createElement("button");
        btnCancel.className = "confirm-btn confirm-btn--cancel";
        btnCancel.textContent = opciones.textoCancelar || "Cancelar";

        const btnAccept = document.createElement("button");
        btnAccept.className = "confirm-btn confirm-btn--accept";
        btnAccept.textContent = opciones.textoAceptar || "Sí, eliminar";

        // Si se pasa tipo 'alt' para aceptar (ej: confirmaciones positivas)
        if (opciones.acceptAlt) btnAccept.classList.add("alt");

        botones.appendChild(btnCancel);
        botones.appendChild(btnAccept);

        dialog.appendChild(titulo);
        dialog.appendChild(msg);
        dialog.appendChild(botones);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Manejo de respuesta
        function limpiar() {
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }

        btnCancel.addEventListener("click", () => {
            limpiar();
            resolve(false);
        });

        btnAccept.addEventListener("click", () => {
            limpiar();
            resolve(true);
        });

        // Cerrar si el usuario hace click fuera del dialog
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                limpiar();
                resolve(false);
            }
        });

        // Esc esc para cancelar
        function onKey(e) {
            if (e.key === "Escape") {
                limpiar();
                resolve(false);
                document.removeEventListener("keydown", onKey);
            }
        }
        document.addEventListener("keydown", onKey);
    });
}