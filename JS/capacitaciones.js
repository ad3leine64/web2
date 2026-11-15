
/* ==================================================
   INFANCIA SANA
   PÁGINA CAPACITACIONES
================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ==================================================
       01. ELEMENTOS PRINCIPALES
    ================================================== */

    const main = document.querySelector(".capacitaciones-main");

    if (!main) return;

    const tarjetas = document.querySelectorAll(".capacitacion-card");

    const filtroTema = document.getElementById("filtro-tema");
    const filtroPublico = document.getElementById("filtro-publico");

    // Duración del cierre del acordeón (debe coincidir con el CSS)
    const DURACION_CIERRE = 650;

    // Tiempo entre tarjetas que aparecen juntas (segundos)
    const ESCALONADO = 0.15;

    // Duración de la animación de aparición en CSS (ms)
    const DURACION_APARICION = 800;


    /* ==================================================
       02. CARGA DE IMÁGENES
    ================================================== */

    const imagenes = document.querySelectorAll(".imagen-placeholder");

    imagenes.forEach(imagen => {

        const nombreImagen = imagen.dataset.imagen;

        if (!nombreImagen) {
            imagen.classList.add("imagen-no-disponible");
            return;
        }

        // Permite utilizar tanto un nombre de archivo
        // como una ruta completa dentro de data-imagen.

        const rutaImagen = nombreImagen.includes("/")
            ? nombreImagen
            : `assets/images/${nombreImagen}`;

        const comprobacion = new Image();

        comprobacion.onload = () => {

            imagen.style.backgroundImage = `url("${rutaImagen}")`;

            imagen.classList.remove("imagen-no-disponible");
            imagen.classList.add("imagen-cargada");

        };

        comprobacion.onerror = () => {

            imagen.classList.remove("imagen-cargada");
            imagen.classList.add("imagen-no-disponible");

        };

        comprobacion.src = rutaImagen;

    });


    /* ==================================================
       03. ACORDEÓN DE TARJETAS
    ================================================== */

    // Mide la altura real del texto y la guarda en --alto.
    // Así la animación de apertura recorre justo esa altura
    // (con un tope fijo de 500px la animación terminaba casi al instante).

    function medirDetalle(contenido) {

        const interno = contenido.firstElementChild;

        if (!interno) return;

        // 16px = espacio inferior que se suma al abrir (ver CSS).

        contenido.style.setProperty(
            "--alto",
            `${interno.offsetHeight + 16}px`
        );

    }

    const botones = document.querySelectorAll(".capacitacion-toggle");

    botones.forEach((boton, indice) => {

        const tarjeta = boton.closest(".capacitacion-card");

        if (!tarjeta) return;

        const contenidoId = boton.getAttribute("aria-controls");

        const contenido = contenidoId
            ? document.getElementById(contenidoId)
            : tarjeta.querySelector(".capacitacion-detalle");

        if (!contenido) return;

        // Si el HTML no los trae, se vinculan botón y contenido
        // para que los lectores de pantalla entiendan la relación.

        if (!contenido.id) {
            contenido.id = `capacitacion-detalle-${indice + 1}`;
        }

        boton.setAttribute("aria-controls", contenido.id);

        let cierrePendiente = null;

        // El contenido comienza cerrado.

        contenido.hidden = true;

        boton.setAttribute("aria-expanded", "false");


        boton.addEventListener("click", () => {

            const estaAbierto =
                boton.getAttribute("aria-expanded") === "true";


            if (cierrePendiente) {
                clearTimeout(cierrePendiente);
                cierrePendiente = null;
            }


            if (!estaAbierto) {

                // Abrir

                contenido.hidden = false;

                medirDetalle(contenido);

                // Forzar el cálculo del estado inicial
                // para que la transición pueda comenzar.

                void contenido.offsetHeight;

                tarjeta.classList.add("activo");

                boton.setAttribute("aria-expanded", "true");

            } else {

                // Cerrar

                tarjeta.classList.remove("activo");

                boton.setAttribute("aria-expanded", "false");

                // Ocultar el contenido después de la transición.

                cierrePendiente = setTimeout(() => {

                    if (
                        boton.getAttribute("aria-expanded") === "false"
                    ) {
                        contenido.hidden = true;
                    }

                    cierrePendiente = null;

                }, DURACION_CIERRE);

            }

        });

    });


    // Si cambia el ancho de la pantalla el texto se reacomoda,
    // así que se vuelve a medir en las tarjetas abiertas.

    window.addEventListener("resize", () => {

        document
            .querySelectorAll(".capacitacion-card.activo .capacitacion-detalle")
            .forEach(medirDetalle);

    });


    /* ==================================================
       04. ANIMACIÓN DE APARICIÓN
       MISMO SISTEMA QUE PROGRAMAS
    ================================================== */

    const elementos = main.querySelectorAll(
        ".capacitaciones-heading, " +
        ".capacitaciones-filtros, " +
        ".capacitacion-card, " +
        ".capacitaciones-solicitud"
    );

    const esTarjeta = elemento =>
        elemento.classList.contains("capacitacion-card");

    // Igual que en Programas, las animaciones se muestran siempre.
    // Solo si el navegador no admite IntersectionObserver
    // todo queda visible de inmediato.

    const animar = "IntersectionObserver" in window;

    let observer = null;


    // Muestra un elemento con la animación de aparición.
    // En las tarjetas, al terminar la animación se activa la clase
    // "revelada", que quita el retraso y deja el hover rápido.

    function revelar(elemento, retraso = 0) {

        if (esTarjeta(elemento)) {
            elemento.style.setProperty("--retraso", `${retraso}s`);
        }

        elemento.classList.add("visible");

        if (esTarjeta(elemento)) {

            setTimeout(() => {

                elemento.classList.add("revelada");

            }, retraso * 1000 + DURACION_APARICION + 50);

        }

    }


    // Vuelve a reproducir la aparición de una tarjeta
    // (por ejemplo, cuando un filtro la vuelve a mostrar).

    function reanimarTarjeta(tarjeta, retraso = 0) {

        tarjeta.classList.remove("visible", "revelada");

        // Reinicia el estado inicial antes de volver a animar.

        void tarjeta.offsetHeight;

        revelar(tarjeta, retraso);

    }


    if (!animar) {

        elementos.forEach(elemento => {

            elemento.classList.add("visible");

            if (esTarjeta(elemento)) {
                elemento.classList.add("revelada");
            }

        });

    } else {

        observer = new IntersectionObserver((entradas) => {

            // Las tarjetas que aparecen a la vez se escalonan
            // según su orden real, sin depender de nth-child.

            let posicion = 0;

            entradas.forEach(entrada => {

                if (!entrada.isIntersecting) return;

                const elemento = entrada.target;

                revelar(
                    elemento,
                    esTarjeta(elemento) ? posicion * ESCALONADO : 0
                );

                if (esTarjeta(elemento)) posicion++;

                // Evita que el elemento vuelva a animarse
                // al subir y bajar por la página.

                observer.unobserve(elemento);

            });

        }, {
            threshold: 0.15
        });

        elementos.forEach(elemento => {
            observer.observe(elemento);
        });

    }


    /* ==================================================
       05. FILTROS
    ================================================== */

    function normalizarTexto(texto) {

        return (texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }


    // Compara palabra por palabra (no por fragmentos de texto),
    // para que "esi" no coincida con otras palabras que lo contengan.

    function coincide(valorTarjeta, seleccion) {

        if (!seleccion || seleccion === "todos") return true;

        return normalizarTexto(valorTarjeta)
            .split(/\s+/)
            .includes(seleccion);

    }


    function aplicarFiltros() {

        const temaSeleccionado = normalizarTexto(
            filtroTema ? filtroTema.value : ""
        );

        const publicoSeleccionado = normalizarTexto(
            filtroPublico ? filtroPublico.value : ""
        );

        let reaparecidas = 0;

        tarjetas.forEach(tarjeta => {

            const mostrar =
                coincide(tarjeta.dataset.tema, temaSeleccionado) &&
                coincide(tarjeta.dataset.publico, publicoSeleccionado);

            const estabaOculta = tarjeta.hidden;

            tarjeta.hidden = !mostrar;

            // Si la tarjeta ya se había mostrado antes y vuelve
            // a aparecer, repite la animación de entrada.

            if (
                mostrar &&
                estabaOculta &&
                animar &&
                tarjeta.classList.contains("visible")
            ) {

                reanimarTarjeta(tarjeta, reaparecidas * ESCALONADO);

                reaparecidas++;

            }

        });

    }


    if (filtroTema) {
        filtroTema.addEventListener("change", aplicarFiltros);
    }

    if (filtroPublico) {
        filtroPublico.addEventListener("change", aplicarFiltros);
    }

});
