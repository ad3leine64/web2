
// ==================================================
// INFANCIA SANA
// JAVASCRIPT - PÁGINA NOSOTROS
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

    const elementos = document.querySelectorAll(`
        .nosotros-intro h1,
        .intro-text p,
        .nosotros-mvv h2,
        .mvv-item,
        .nosotros-objetivos h2,
        .objetivo-item
    `);

    if (!elementos.length) return;

    // Preparar todos los elementos
    elementos.forEach(elemento => {
        elemento.classList.add("reveal");
    });

    const observer = new IntersectionObserver((entradas) => {

        entradas.forEach(entrada => {

            if (entrada.isIntersecting) {

                entrada.target.classList.add("visible");

                observer.unobserve(entrada.target);
            }

        });

    }, {
        threshold: 0.05
    });

    // Dar tiempo a que se aplique el estado inicial
    setTimeout(() => {

        elementos.forEach(elemento => {
            observer.observe(elemento);
        });

    }, 150);

});