window.addEventListener("load", function() {
    setTimeout(function() {
        document.getElementById("pantalla-carga").style.display = "none";
        document.getElementById("Cprincipal").style.display = "block";
    }, 3000);
});

function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll(".seccion-contenido");
    secciones.forEach((seccion) => {
        seccion.classList.remove("activo");
    });

    document.getElementById(seccionId).classList.add("activo");

    const botones = document.querySelectorAll(".boton-nav");
    botones.forEach((btn) => {
        btn.classList.remove("activo");
    });
    event.target.classList.add("activo");
}

document.addEventListener("DOMContentLoaded", function() {
    const cambioTema = document.getElementById("cambio-tema");

    //DE C A B DE B A C
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
        document.body.classList.add("modo-oscuro");
        cambioTema.checked = true;
    }

    cambioTema.addEventListener("change", function() {
        if (this.checked) {
            document.body.classList.add("modo-oscuro");
            localStorage.setItem("tema", "oscuro");
        } else {
            document.body.classList.remove("modo-oscuro");
            localStorage.setItem("tema", "claro");
        }
    });
});