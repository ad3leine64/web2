
/* ==================================================
   INFANCIA SANA
   PÁGINA NOVEDADES
================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ==================================================
       01. ELEMENTOS PRINCIPALES
    ================================================== */

    const main = document.querySelector(".novedades-main");

    if (!main) return;

    const IS = window.InfanciaSana;

    if (!IS || !IS.novedadesPara || !IS.crearTarjetaNovedad) return;

    const encabezado = main.querySelector(".novedades-presentacion");
    const grilla = main.querySelector(".novedades-grid");
    const paginacion = main.querySelector(".novedades-paginas");

    if (!grilla) return;

    const novedades = IS.novedadesPara("novedades");

    // Tiempo entre tarjetas que aparecen juntas (segundos)
    const ESCALONADO = 0.15;

    // Duración de la animación de aparición en CSS (ms)
    const DURACION_APARICION = 800;

    // Duración de la salida al cambiar de página (ms)
    const DURACION_SALIDA = 260;

    // 4 tarjetas por página (2x2); 2 en pantallas angostas
    const pantallaAngosta = window.matchMedia("(max-width: 700px)");

    let porPagina = pantallaAngosta.matches ? 2 : 4;
    let paginaActual = 0;
    let cambiando = false;
    let grillaVista = false;      // ya apareció en pantalla al menos una vez


    function totalPaginas() {
        return Math.max(1, Math.ceil(novedades.length / porPagina));
    }


    /* ==================================================
       02. ANIMACIÓN DE LAS TARJETAS
    ================================================== */

    function revelarTarjetas() {

        grilla.querySelectorAll(".nv-card").forEach((tarjeta, i) => {

            const retraso = i * ESCALONADO;

            tarjeta.style.setProperty("--retraso", `${retraso}s`);
            tarjeta.classList.add("visible");

            // Al terminar la entrada se quita el retraso,
            // así el hover responde al instante.

            setTimeout(() => {
                tarjeta.classList.add("revelada");
            }, retraso * 1000 + DURACION_APARICION + 50);

        });

    }


    /* ==================================================
       03. DIBUJAR UNA PÁGINA
    ================================================== */

    function dibujarPagina(pagina) {

        const desde = pagina * porPagina;
        const tarjetas = novedades.slice(desde, desde + porPagina);

        grilla.innerHTML = "";

        tarjetas.forEach(novedad => {
            grilla.appendChild(IS.crearTarjetaNovedad(novedad));
        });

        // Evita que la sección "salte" si la página tiene menos tarjetas.

        const alto = grilla.offsetHeight;
        const guardado = parseFloat(
            grilla.style.getPropertyValue("--alto-grilla")
        ) || 0;

        if (alto > guardado) {
            grilla.style.setProperty("--alto-grilla", `${alto}px`);
        }

        paginaActual = pagina;

        actualizarPuntos();

    }


    /* ==================================================
       04. PUNTOS DE PAGINACIÓN
    ================================================== */

    function crearPuntos() {

        if (!paginacion) return;

        paginacion.innerHTML = "";

        const total = totalPaginas();

        paginacion.hidden = total <= 1;

        for (let i = 0; i < total; i++) {

            const punto = document.createElement("button");

            punto.type = "button";
            punto.className = "nv-punto";
            punto.setAttribute("aria-label", `Ir a la página ${i + 1}`);

            punto.addEventListener("click", () => irA(i));

            paginacion.appendChild(punto);

        }

    }

    function actualizarPuntos() {

        if (!paginacion) return;

        paginacion.querySelectorAll(".nv-punto").forEach((punto, i) => {

            const activo = i === paginaActual;

            punto.classList.toggle("activo", activo);

            if (activo) {
                punto.setAttribute("aria-current", "true");
            } else {
                punto.removeAttribute("aria-current");
            }

        });

    }


    /* ==================================================
       05. CAMBIO DE PÁGINA
    ================================================== */

    function irA(pagina) {

        const destino = (pagina + totalPaginas()) % totalPaginas();

        if (cambiando || destino === paginaActual) return;

        cambiando = true;

        // Sale la página actual...

        grilla.classList.add("saliendo");

        setTimeout(() => {

            // ...y entra la nueva con la misma animación escalonada.

            dibujarPagina(destino);

            grilla.classList.remove("saliendo");

            // Fuerza el estado inicial antes de animar.
            void grilla.offsetHeight;

            revelarTarjetas();

            cambiando = false;

        }, DURACION_SALIDA);

    }


    /* ==================================================
       06. DESLIZAR CON MOUSE O DEDO
    ================================================== */

    let inicioX = 0;

    grilla.addEventListener("pointerdown", e => {
        inicioX = e.clientX;
    });

    grilla.addEventListener("pointerup", e => {

        const diferencia = e.clientX - inicioX;

        if (Math.abs(diferencia) < 60) return;

        irA(paginaActual + (diferencia < 0 ? 1 : -1));

    });


    /* ==================================================
       07. CAMBIO DE TAMAÑO DE PANTALLA
    ================================================== */

    pantallaAngosta.addEventListener("change", () => {

        // Conserva la primera novedad que se estaba viendo.

        const primera = paginaActual * porPagina;

        porPagina = pantallaAngosta.matches ? 2 : 4;

        grilla.style.removeProperty("--alto-grilla");

        crearPuntos();
        dibujarPagina(Math.floor(primera / porPagina));

        if (grillaVista) {
            grilla.querySelectorAll(".nv-card").forEach(tarjeta => {
                tarjeta.classList.add("visible", "revelada");
            });
        }

    });


    /* ==================================================
       08. INICIO + APARICIÓN AL HACER SCROLL
    ================================================== */

    crearPuntos();
    dibujarPagina(0);

    if (!("IntersectionObserver" in window)) {

        if (encabezado) encabezado.classList.add("visible");

        grillaVista = true;
        revelarTarjetas();

        return;

    }

    const observer = new IntersectionObserver((entradas) => {

        entradas.forEach(entrada => {

            if (!entrada.isIntersecting) return;

            if (entrada.target === grilla) {
                grillaVista = true;
                revelarTarjetas();
            } else {
                entrada.target.classList.add("visible");
            }

            observer.unobserve(entrada.target);

        });

    }, {
        threshold: 0.15
    });

    if (encabezado) observer.observe(encabezado);

    observer.observe(grilla);

});
