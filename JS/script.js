
/* ==================================================
   MOVIMIENTO DE FOTOGRAFÍA - PREVENCIÓN
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const seccion = document.querySelector(".prevencion");
    const foto = document.querySelector(".prevencion-background img");

    if (!seccion || !foto) return;

    let posicionActual = 0;
    let posicionObjetivo = 0;
    let animando = false;

    function calcularMovimiento() {

        const rect = seccion.getBoundingClientRect();

        const centroPantalla = window.innerHeight / 2;
        const centroSeccion = rect.top + rect.height / 2;

        posicionObjetivo = (centroPantalla - centroSeccion) * 0.25;

        posicionObjetivo = Math.max(
            -100,
            Math.min(100, posicionObjetivo)
        );

        if (!animando) {
            animando = true;
            requestAnimationFrame(actualizarMovimiento);
        }
    }

    function actualizarMovimiento() {

        posicionActual += (posicionObjetivo - posicionActual) * 0.045;

        foto.style.transform =
            `translate3d(0, ${posicionActual}px, 0)`;

        if (Math.abs(posicionObjetivo - posicionActual) > 0.1) {

            requestAnimationFrame(actualizarMovimiento);

        } else {

            posicionActual = posicionObjetivo;

            foto.style.transform =
                `translate3d(0, ${posicionActual}px, 0)`;

            animando = false;
        }
    }

    window.addEventListener("scroll", calcularMovimiento, {
        passive: true
    });

    window.addEventListener("resize", calcularMovimiento);

    calcularMovimiento();

});


/* ==================================================
   CARRUSEL DE NOVEDADES
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const carrusel = document.querySelector(".novedades-carousel");
    const track = document.querySelector(".novedades-track");

    const anterior = document.querySelector(".novedades-flecha.anterior");
    const siguiente = document.querySelector(".novedades-flecha.siguiente");

    const indicadoresContenedor = document.querySelector(
        ".novedades-indicadores"
    );

    if (!carrusel || !track || !anterior || !siguiente) return;

    const noticias = Array.from(
        track.querySelectorAll(".novedad-card")
    );

    if (noticias.length < 2) return;

    let indiceActual = 1;
    let bloqueado = false;
    let inicioX = 0;
    let animacionInicialActiva = true;

    const duracionNormal = 700;


    /* ==============================================
       CREAR INDICADORES PARA TODAS LAS NOTICIAS
    ============================================== */

    let indicadores = [];

    function crearIndicadores() {

        if (!indicadoresContenedor) return;

        indicadoresContenedor.innerHTML = "";

        noticias.forEach((noticia, i) => {

            const indicador = document.createElement("span");

            indicador.addEventListener("click", () => {

                if (animacionInicialActiva || bloqueado) return;

                const diferencia = i - indiceActual;

                animarCambio(i, Math.sign(diferencia) || 1);

            });

            indicadoresContenedor.appendChild(indicador);

        });

        indicadores = Array.from(
            indicadoresContenedor.querySelectorAll("span")
        );

    }


    /* ==============================================
       ACTUALIZAR INDICADORES
    ============================================== */

    function actualizarIndicadores() {

        indicadores.forEach((indicador, i) => {

            indicador.classList.toggle(
                "activo",
                i === indiceActual
            );

        });

    }


    /* ==============================================
       ORDEN Y VISIBILIDAD DE LAS TARJETAS
    ============================================== */

    function actualizarTarjetas() {

        const indiceIzquierda =
            (indiceActual - 1 + noticias.length) % noticias.length;

        const indiceDerecha =
            (indiceActual + 1) % noticias.length;

        const orden = [
            indiceIzquierda,
            indiceActual,
            indiceDerecha
        ];

        // Ocultar las noticias que no corresponden
        noticias.forEach((noticia, i) => {

            noticia.hidden = !orden.includes(i);

        });

        // Colocar las tres noticias en el orden correcto
        orden.forEach((indice, posicion) => {

            const noticia = noticias[indice];

            track.appendChild(noticia);

            noticia.classList.toggle(
                "novedad-destacada",
                posicion === 1
            );

            noticia.classList.toggle(
                "novedad-lateral",
                posicion !== 1
            );

        });

        actualizarIndicadores();

    }


    /* ==============================================
       ANIMACIÓN ENTRE POSICIONES
    ============================================== */

    function animarCambio(nuevoIndice, direccion = 1, duracion = duracionNormal) {

        if (bloqueado) return Promise.resolve();

        bloqueado = true;

        const posicionesAntes = new Map();

        // Guardar únicamente las tarjetas visibles
        noticias.forEach(noticia => {

            if (!noticia.hidden) {

                posicionesAntes.set(
                    noticia,
                    noticia.getBoundingClientRect()
                );

            }

        });

        indiceActual =
            (nuevoIndice + noticias.length) % noticias.length;

        actualizarTarjetas();

        return new Promise(resolve => {

            requestAnimationFrame(() => {

                const animaciones = [];

                noticias.forEach(noticia => {

                    if (noticia.hidden) return;

                    const despues = noticia.getBoundingClientRect();
                    const antes = posicionesAntes.get(noticia);

                    let fotogramas;

                    if (antes) {

                        // Tarjeta que ya estaba visible:
                        // se desplaza desde su posición anterior.

                        const dx =
                            antes.left + antes.width / 2 -
                            (despues.left + despues.width / 2);

                        const dy =
                            antes.top + antes.height / 2 -
                            (despues.top + despues.height / 2);

                        const sx = antes.width / despues.width;
                        const sy = antes.height / despues.height;

                        const giro = dx > 0 ? -30 : 30;

                        fotogramas = [
                            {
                                transform: `
                                    translate(${dx}px, ${dy}px)
                                    scale(${sx}, ${sy})
                                    rotateY(${giro}deg)
                                `
                            },
                            {
                                transform: `
                                    translate(0, 0)
                                    scale(1, 1)
                                    rotateY(0deg)
                                `
                            }
                        ];

                    } else {

                        // Tarjeta nueva que entra desde un lateral.

                        fotogramas = [
                            {
                                opacity: 0,
                                transform: `
                                    translateX(${direccion * 100}px)
                                    scale(0.75)
                                    rotateY(${direccion * -35}deg)
                                `
                            },
                            {
                                opacity: 1,
                                transform: `
                                    translateX(0)
                                    scale(1)
                                    rotateY(0deg)
                                `
                            }
                        ];

                    }

                    const animacion = noticia.animate(
                        fotogramas,
                        {
                            duration: duracion,
                            easing: "cubic-bezier(0.22, 0.8, 0.25, 1)"
                        }
                    );

                    animaciones.push(animacion);

                });

                Promise.all(
                    animaciones.map(animacion => animacion.finished)
                ).then(() => {

                    bloqueado = false;
                    resolve();

                }).catch(() => {

                    bloqueado = false;
                    resolve();

                });

            });

        });

    }


    /* ==============================================
       FLECHAS
    ============================================== */

    anterior.addEventListener("click", () => {

        if (animacionInicialActiva || bloqueado) return;

        animarCambio(indiceActual - 1, -1);

    });

    siguiente.addEventListener("click", () => {

        if (animacionInicialActiva || bloqueado) return;

        animarCambio(indiceActual + 1, 1);

    });


    /* ==============================================
       DESLIZAMIENTO CON MOUSE O DEDO
    ============================================== */

    carrusel.addEventListener("pointerdown", e => {

        inicioX = e.clientX;

    });

    carrusel.addEventListener("pointerup", e => {

        if (animacionInicialActiva || bloqueado) return;

        const diferencia = e.clientX - inicioX;

        if (Math.abs(diferencia) < 45) return;

        if (diferencia < 0) {

            animarCambio(indiceActual + 1, 1);

        } else {

            animarCambio(indiceActual - 1, -1);

        }

    });


    /* ==============================================
       ANIMACIÓN INICIAL: TRES VUELTAS RÁPIDAS
    ============================================== */

    async function animacionInicial() {

        actualizarTarjetas();

        const vueltas = 1;
        const movimientos = noticias.length * vueltas;

        for (let i = 0; i < movimientos; i++) {

            const progreso = i / movimientos;

            // Giro rápido y continuo con una pequeña aceleración
            const duracion = 145 - (progreso * 35);

            await animarCambio(
                indiceActual + 1,
                1,
                duracion
            );

        }

        animacionInicialActiva = false;

    }


    /* ==============================================
       INICIAR
    ============================================== */

    
crearIndicadores();

/* ==============================================
   INICIAR ANIMACIÓN CUANDO EL CARRUSEL SEA VISIBLE
============================================== */

let animacionInicialIniciada = false;

const observadorCarrusel = new IntersectionObserver((entradas) => {

    entradas.forEach(entrada => {

        if (
            entrada.isIntersecting &&
            !animacionInicialIniciada
        ) {

            animacionInicialIniciada = true;

            animacionInicial();

            observadorCarrusel.unobserve(carrusel);

        }

    });

}, {
    threshold: 0.35
});

observadorCarrusel.observe(carrusel);

});

/* ==================================================
   APARICIÓN Y DESAPARICIÓN DE PILARES AL SCROLL
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const pilares = document.querySelector(".pilares");
    const contenido = document.querySelector(".pilares-content");

    if (!pilares || !contenido) return;

    let yaDesplazo = false;
    let ultimoScroll = window.scrollY;

    function actualizarPilares() {

        const scrollActual = window.scrollY;

        // Detectar si el usuario empezó a bajar
        if (scrollActual > ultimoScroll) {
            yaDesplazo = true;
        }

        ultimoScroll = scrollActual;

        const posicion = contenido.getBoundingClientRect();

        // Mostrar solamente después de comenzar a desplazarse
        const debeMostrar =
            yaDesplazo &&
            posicion.top < window.innerHeight * 0.85 &&
            posicion.bottom > 0;

        if (debeMostrar) {
            pilares.classList.add("pilares-visible");
        } else {
            pilares.classList.remove("pilares-visible");
        }
    }

    // No activar la animación automáticamente al cargar
    pilares.classList.remove("pilares-visible");

    window.addEventListener("scroll", actualizarPilares, {
        passive: true
    });

});