
/* ==================================================
   INFANCIA SANA
   PÁGINA RECURSOS
================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ==================================================
       01. ELEMENTOS PRINCIPALES
    ================================================== */

    const main = document.querySelector(".recursos-main");

    if (!main) return;

    const IS = window.InfanciaSana;

    if (!IS || !Array.isArray(IS.recursos)) return;

    const listado = main.querySelector(".recursos-listado");
    const vacio = main.querySelector(".recursos-vacio");
    const filtroTema = document.getElementById("filtro-tema");
    const filtroPublico = document.getElementById("filtro-publico");

    if (!listado) return;

    // Tiempo entre tarjetas que aparecen juntas (segundos)
    const ESCALONADO = 0.12;

    // Duración de la animación de aparición en CSS (ms)
    const DURACION_APARICION = 800;

    const NOMBRES_TEMA = {
        "educacion-digital": "Educación digital",
        "violencia-digital": "Violencia digital",
        "esi": "Educación sexual integral"
    };

    const ICONO_DESCARGA =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M12 4v10m0 0-4-4m4 4 4-4M5 19h14" fill="none" ' +
        'stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const ICONO_DOCUMENTO =
        '<svg viewBox="0 0 48 60" aria-hidden="true" focusable="false">' +
        '<path d="M6 2h26l12 12v42a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" ' +
        'fill="#FFFFFF"/>' +
        '<path d="M32 2v10a2 2 0 0 0 2 2h10z" fill="rgba(40,94,133,0.25)"/>' +
        '<rect x="11" y="24" width="26" height="3" rx="1.5" fill="rgba(40,94,133,0.35)"/>' +
        '<rect x="11" y="32" width="26" height="3" rx="1.5" fill="rgba(40,94,133,0.35)"/>' +
        '<rect x="11" y="40" width="17" height="3" rx="1.5" fill="rgba(40,94,133,0.35)"/>' +
        '</svg>';


    function escapar(texto) {

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    }

    function extension(archivo) {

        const partes = archivo.split(".");

        return partes.length > 1
            ? partes.pop().toUpperCase()
            : "";

    }


    /* ==================================================
       02. CREAR TARJETAS
    ================================================== */

    function crearTarjeta(recurso) {

        const tarjeta = document.createElement("article");

        tarjeta.className = `rc-card rc-tema-${recurso.tema}`;
        tarjeta.dataset.tema = recurso.tema;
        tarjeta.dataset.publico = recurso.publico;

        const disponible = Boolean(recurso.archivo);

        const tipoArchivo = disponible ? extension(recurso.archivo) : "";

        const meta = [recurso.formato, tipoArchivo, recurso.peso]
            .filter(Boolean)
            .join(" · ");

        // Con archivo: se descarga. Sin archivo: botón desactivado.

        const boton = disponible
            ? `<a class="rc-boton"
                  href="assets/recursos/${escapar(recurso.archivo)}"
                  download>
                   ${ICONO_DESCARGA} DESCARGAR
               </a>`
            : `<span class="rc-boton rc-boton-pendiente"
                     aria-disabled="true">
                   PRÓXIMAMENTE
               </span>`;

        tarjeta.innerHTML = `
            <div class="rc-portada">
                ${ICONO_DOCUMENTO}
                ${tipoArchivo ? `<span class="rc-extension">${escapar(tipoArchivo)}</span>` : ""}
            </div>

            <div class="rc-cuerpo">
                <span class="rc-tag">
                    ${escapar(NOMBRES_TEMA[recurso.tema] || recurso.tema)}
                </span>

                <h3 class="rc-titulo">${escapar(recurso.titulo)}</h3>

                <p class="rc-texto">${escapar(recurso.texto)}</p>

                <div class="rc-pie">
                    <span class="rc-meta">${escapar(meta)}</span>
                    ${boton}
                </div>
            </div>`;

        return tarjeta;

    }

    const tarjetas = IS.recursos.map(crearTarjeta);

    tarjetas.forEach(tarjeta => listado.appendChild(tarjeta));


    /* ==================================================
       03. ANIMACIÓN DE APARICIÓN
       MISMO SISTEMA QUE PROGRAMAS Y CAPACITACIONES
    ================================================== */

    const presentacion = main.querySelector(".recursos-presentacion");
    const filtros = main.querySelector(".recursos-filtros");

    function revelar(tarjeta, retraso = 0) {

        tarjeta.style.setProperty("--retraso", `${retraso}s`);
        tarjeta.classList.add("visible");

        setTimeout(() => {
            tarjeta.classList.add("revelada");
        }, retraso * 1000 + DURACION_APARICION + 50);

    }

    function reanimar(tarjeta, retraso = 0) {

        tarjeta.classList.remove("visible", "revelada");

        void tarjeta.offsetHeight;

        revelar(tarjeta, retraso);

    }

    const animar = "IntersectionObserver" in window;

    if (!animar) {

        [presentacion, filtros].forEach(el => {
            if (el) el.classList.add("visible");
        });

        tarjetas.forEach(t => t.classList.add("visible", "revelada"));

    } else {

        const observer = new IntersectionObserver((entradas) => {

            // Las tarjetas que entran juntas se escalonan por orden.

            let posicion = 0;

            entradas.forEach(entrada => {

                if (!entrada.isIntersecting) return;

                const el = entrada.target;

                if (el.classList.contains("rc-card")) {
                    revelar(el, posicion * ESCALONADO);
                    posicion++;
                } else {
                    el.classList.add("visible");
                }

                observer.unobserve(el);

            });

        }, {
            threshold: 0.15
        });

        [presentacion, filtros, ...tarjetas].forEach(el => {
            if (el) observer.observe(el);
        });

    }


    /* ==================================================
       04. FILTROS
    ================================================== */

    function normalizar(texto) {

        return (texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }

    // Compara palabra por palabra, no por fragmentos.

    function coincide(valorTarjeta, seleccion) {

        if (!seleccion || seleccion === "todos") return true;

        return normalizar(valorTarjeta)
            .split(/\s+/)
            .includes(seleccion);

    }

    function aplicarFiltros() {

        const tema = normalizar(filtroTema ? filtroTema.value : "");
        const publico = normalizar(filtroPublico ? filtroPublico.value : "");

        let reaparecidas = 0;
        let visibles = 0;

        tarjetas.forEach(tarjeta => {

            const mostrar =
                coincide(tarjeta.dataset.tema, tema) &&
                coincide(tarjeta.dataset.publico, publico);

            const estabaOculta = tarjeta.hidden;

            tarjeta.hidden = !mostrar;

            if (mostrar) visibles++;

            // Si ya se había mostrado y vuelve a aparecer,
            // repite la animación de entrada.

            if (
                mostrar &&
                estabaOculta &&
                animar &&
                tarjeta.classList.contains("visible")
            ) {

                reanimar(tarjeta, reaparecidas * ESCALONADO);

                reaparecidas++;

            }

        });

        if (vacio) vacio.hidden = visibles > 0;

    }

    if (filtroTema) filtroTema.addEventListener("change", aplicarFiltros);
    if (filtroPublico) filtroPublico.addEventListener("change", aplicarFiltros);

});
