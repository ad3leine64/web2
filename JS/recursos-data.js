
/* ==================================================
   INFANCIA SANA
   RECURSOS: LISTA DE DESCARGABLES

   Para publicar un recurso:
     1. Copiá el archivo en assets/recursos/
     2. Completá "archivo" con su nombre (y "peso", si querés)

   Mientras "archivo" esté vacío, la tarjeta muestra
   "PRÓXIMAMENTE" y el botón queda desactivado.

   Campos:
     titulo     título de la tarjeta
     texto      descripción corta
     tema       educacion-digital | violencia-digital | esi
     publico    uno o más: docentes familias ninos
     formato    texto que se ve en la tarjeta (Guía, Infografía...)
     archivo    nombre del archivo en assets/recursos/
     peso       opcional, por ejemplo "1,2 MB"

   OJO: los títulos y textos de abajo son un MODELO para
   mostrar cómo queda. Reemplazalos por los reales.
================================================== */

window.InfanciaSana = window.InfanciaSana || {};

window.InfanciaSana.recursos = [

    {
        titulo: "Guía de navegación segura para familias",
        texto:
            "Pautas simples para acompañar a niños, niñas y " +
            "adolescentes en el uso responsable de internet.",
        tema: "educacion-digital",
        publico: "familias",
        formato: "Guía",
        archivo: "",
        peso: ""
    },

    {
        titulo: "Privacidad en redes sociales",
        texto:
            "Cómo configurar cuentas y dispositivos para cuidar " +
            "los datos personales y la identidad digital.",
        tema: "educacion-digital",
        publico: "familias docentes ninos",
        formato: "Infografía",
        archivo: "",
        peso: ""
    },

    {
        titulo: "Ciberbullying: cómo reconocerlo y actuar",
        texto:
            "Señales de alerta, pasos a seguir y recursos de " +
            "ayuda frente a situaciones de acoso en entornos digitales.",
        tema: "violencia-digital",
        publico: "docentes familias",
        formato: "Guía",
        archivo: "",
        peso: ""
    },

    {
        titulo: "Grooming: señales de alerta",
        texto:
            "Información para detectar y prevenir el contacto " +
            "con fines de abuso a través de internet.",
        tema: "violencia-digital",
        publico: "docentes familias",
        formato: "Infografía",
        archivo: "",
        peso: ""
    },

    {
        titulo: "Cuidado del cuerpo y consentimiento",
        texto:
            "Actividades y orientaciones para conversar sobre " +
            "límites, respeto y vínculos saludables.",
        tema: "esi",
        publico: "docentes familias ninos",
        formato: "Cuaderno de actividades",
        archivo: "",
        peso: ""
    },

    {
        titulo: "Propuestas para trabajar en el aula",
        texto:
            "Ideas y secuencias para abordar la Educación Sexual " +
            "Integral con distintos grupos y edades.",
        tema: "esi",
        publico: "docentes",
        formato: "Material para docentes",
        archivo: "",
        peso: ""
    }

];
