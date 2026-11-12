
/* ==================================================
   INFANCIA SANA
   PÁGINA PROGRAMAS
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================================
       01. ACORDEÓN
    ================================================== */

    const botones = document.querySelectorAll(".programa-toggle");

    botones.forEach(boton => {

        const contenidoId = boton.getAttribute("aria-controls");
        const contenido = document.getElementById(contenidoId);

        if (!contenido) return;

        // Quitar hidden para permitir la animación
        contenido.hidden = false;

        boton.addEventListener("click", () => {

            const estaAbierto =
                boton.getAttribute("aria-expanded") === "true";

            boton.setAttribute("aria-expanded", String(!estaAbierto));

            boton.closest(".programa-item").classList.toggle(
                "activo",
                !estaAbierto
            );

        });

    });


    /* ==================================================
       02. ANIMACIÓN DE APARICIÓN
    ================================================== */

    const elementos = document.querySelectorAll(
        ".programas-main .programas-heading, .programas-main .programa-item"
    );

    const observer = new IntersectionObserver((entradas) => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visible");

                // Evitar que vuelva a animarse al subir y bajar
                observer.unobserve(entrada.target);

            }

        });

    }, {
        threshold: 0.15
    });

    elementos.forEach(elemento => {
        observer.observe(elemento);
    });

});
