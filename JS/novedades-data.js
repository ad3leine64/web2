
/* ==================================================
   INFANCIA SANA
   NOVEDADES: DATOS Y TARJETAS COMPARTIDAS

   Este archivo es la ÚNICA fuente de las novedades.
   Se usa en:
     - novedades.html  (grilla con paginación)
     - index.html      (carrusel de novedades del home)

   Para agregar una novedad, sumá un objeto a la lista.
   Campos:
     tipo       recursos | programas | capacitaciones | noticias | sitio
     etiqueta   texto de la píldora verde
     titulo     título de la tarjeta
     texto      descripción corta
     imagen     nombre del archivo dentro de assets/images/
                (si no existe, se muestra un color de fondo)
     logo       true = en vez de foto usa el logo a color
     enlace     a dónde lleva "VER MÁS"
     en         dónde se muestra: ["home", "novedades"]
================================================== */

window.InfanciaSana = window.InfanciaSana || {};

(function (IS) {

    IS.novedades = [

        // NOVEDAD INICIAL: la propia página de Infancia Sana
        {
            tipo: "sitio",
            etiqueta: "Infancia Sana",
            titulo: "Ya estamos online: conocé Infancia Sana",
            texto:
                "Un espacio para informar, concientizar y proteger " +
                "los derechos de niños, niñas y adolescentes " +
                "en el entorno digital.",
            logo: true,
            enlace: "nosotros.html",
            en: ["home", "novedades"]
        },

        {
            tipo: "recursos",
            etiqueta: "Recursos",
            titulo: "Herramientas para una navegación segura",
            texto:
                "Descubrí recursos y materiales para promover el uso " +
                "responsable de internet y acompañar a las infancias " +
                "en el entorno digital.",
            imagen: "novedad_recursos.jpg",
            enlace: "recursos.html",
            en: ["home", "novedades"]
        },

        {
            tipo: "programas",
            etiqueta: "Programas",
            titulo: "Acompañamos el crecimiento de las infancias",
            texto:
                "Conocé nuestros programas e iniciativas para informar, " +
                "concientizar y proteger los derechos de niños, niñas " +
                "y adolescentes.",
            imagen: "novedad_programas.jpg",
            enlace: "programas.html",
            en: ["home", "novedades"]
        },

        {
            tipo: "capacitaciones",
            etiqueta: "Capacitaciones",
            titulo: "Aprender para prevenir",
            texto:
                "Proponemos espacios de formación para familias, " +
                "docentes y referentes, brindando herramientas para " +
                "afrontar los desafíos del mundo digital.",
            imagen: "capacitacion_educacion_digital.jpg",
            enlace: "capacitaciones.html",
            en: ["home", "novedades"]
        },

        {
            tipo: "noticias",
            etiqueta: "Noticias",
            titulo: "Por una infancia más protegida",
            texto:
                "Conocé nuestras últimas novedades, campañas y " +
                "actividades para promover el bienestar y la " +
                "protección de las infancias.",
            imagen: "novedad_noticias.jpg",
            enlace: "#",
            en: ["home", "novedades"]
        }

    ];


    /* ==============================================
       NOVEDADES PARA UN LUGAR (home / novedades)
    ============================================== */

    IS.novedadesPara = function (lugar) {

        return IS.novedades.filter(
            novedad => novedad.en.includes(lugar)
        );

    };


    /* ==============================================
       TARJETA
    ============================================== */

    function escapar(texto) {

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    }

    const FLECHA =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="12" r="10.2" fill="none" ' +
        'stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M7 12h9m-3.5-3.8L16.3 12l-3.8 3.8" fill="none" ' +
        'stroke="currentColor" stroke-width="1.7" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';

    IS.crearTarjetaNovedad = function (novedad, clasesExtra = "") {

        const tarjeta = document.createElement("article");

        tarjeta.className =
            `nv-card nv-tipo-${novedad.tipo} ${clasesExtra}`.trim();

        const media = novedad.logo
            ? `<div class="nv-media nv-media-logo">
                   <img class="nv-logo"
                        src="assets/images/logo-infancia-sana-color.svg"
                        alt="Logo de Infancia Sana">
               </div>`
            : `<div class="nv-media">
                   <div class="nv-foto"
                        data-imagen="${escapar(novedad.imagen || "")}"
                        role="img"
                        aria-label="${escapar(novedad.titulo)}"></div>
               </div>`;

        tarjeta.innerHTML = `
            <a class="nv-enlace" href="${escapar(novedad.enlace)}">
                ${media}
                <div class="nv-cuerpo">
                    <span class="nv-tag">${escapar(novedad.etiqueta)}</span>
                    <h3 class="nv-titulo">${escapar(novedad.titulo)}</h3>
                    <p class="nv-texto">${escapar(novedad.texto)}</p>
                    <span class="nv-vermas">VER MÁS ${FLECHA}</span>
                </div>
            </a>`;

        cargarFoto(tarjeta.querySelector(".nv-foto"));

        return tarjeta;

    };


    // Carga la foto solo si existe; si no, queda el color del tipo.

    function cargarFoto(foto) {

        if (!foto) return;

        const nombre = foto.dataset.imagen;

        if (!nombre) {
            foto.classList.add("nv-foto-vacia");
            return;
        }

        const ruta = nombre.includes("/")
            ? nombre
            : `assets/images/${nombre}`;

        const prueba = new Image();

        prueba.onload = () => {
            foto.style.backgroundImage = `url("${ruta}")`;
            foto.classList.add("nv-foto-cargada");
        };

        prueba.onerror = () => {
            foto.classList.add("nv-foto-vacia");
        };

        prueba.src = ruta;

    }


    /* ==============================================
       HOME: LLENAR EL CARRUSEL
       Se ejecuta antes que script.js, que lee las
       tarjetas .novedad-card para armar el carrusel.
    ============================================== */

    function llenarCarruselHome() {

        const track = document.querySelector(".novedades-track");

        if (!track) return;

        track.innerHTML = "";

        IS.novedadesPara("home").forEach(novedad => {

            track.appendChild(
                IS.crearTarjetaNovedad(
                    novedad,
                    "novedad-card novedad-lateral"
                )
            );

        });

    }

    llenarCarruselHome();

})(window.InfanciaSana);
