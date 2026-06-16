// ============================================================================
//  PROYECTOS  ·  Aquí vive toda la información de los proyectos del portafolio.
// ============================================================================
//
//  CÓMO AÑADIR UN PROYECTO NUEVO (3 pasos):
//   1. Crea una carpeta en  src/assets/proyectos/  (ej: "casa-3") y mete ahí
//      tus renders nombrados 01.jpeg, 02.jpeg, 03.jpeg...
//   2. Copia uno de los bloques { ... } de la lista de abajo y pégalo.
//   3. Cambia los textos y la lista de "imagenes". ¡Listo!
//
//  Los campos vacíos ("") simplemente no se muestran en la página, así que
//  puedes dejar el año o el área en blanco hasta que los tengas.
// ============================================================================

import type { ImageMetadata } from "astro";

// --- Texto bilingüe: izquierda español, derecha inglés -----------------------
export interface Bilingue {
  es: string;
  en: string;
}

export interface Proyecto {
  /** Identificador para la URL, ej: "casa-i" -> /proyectos/casa-i */
  slug: string;
  /** Número con el que se ordena y se muestra en la galería (01, 02, ...) */
  orden: number;
  titulo: Bilingue;
  /** Frase corta que se muestra en la tarjeta de la página de inicio. */
  resumen: Bilingue;
  /** Ubicación, ej: "Oriente Antioqueño". Déjalo en "" si aún no la defines. */
  ubicacion: Bilingue;
  /** Año del proyecto, ej: "2025". Déjalo en "" para ocultarlo. */
  anio: string;
  /** Área construida, ej: "480 m²". Déjalo en "" para ocultarlo. */
  area: Bilingue;
  /** Tipo de proyecto, ej: "Residencial". */
  tipo: Bilingue;
  /** Descripción larga que aparece en la página de detalle. */
  descripcion: Bilingue;
  /** Imagen de portada (ruta relativa dentro de src/assets/proyectos/). */
  portada: string;
  /** Todas las imágenes de la galería, en orden. */
  imagenes: string[];
  /**
   * Ponlo en `true` para mostrar la tarjeta como "Próximamente" (sin imágenes
   * ni página de detalle). Útil para dejar listo un proyecto que aún no tienes.
   * Cuando lo tengas: añade sus imágenes, completa los campos y quita esta línea.
   */
  proximamente?: boolean;
}

// --- Cargador de imágenes (no tocar) ----------------------------------------
// Importa automáticamente cualquier imagen que pongas en src/assets/proyectos/
const archivos = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/proyectos/**/*.{jpeg,jpg,png,webp,avif}",
  { eager: true },
);

/** Convierte una ruta como "casa-1/01.jpeg" en una imagen optimizable por Astro. */
export function imagenProyecto(ruta: string): ImageMetadata {
  const clave = `../assets/proyectos/${ruta}`;
  const modulo = archivos[clave];
  if (!modulo) {
    throw new Error(
      `No se encontró la imagen "${ruta}". Verifica que el archivo exista en ` +
        `src/assets/proyectos/${ruta}`,
    );
  }
  return modulo.default;
}

// ============================================================================
//  LISTA DE PROYECTOS  ·  edita / añade aquí
// ============================================================================
export const proyectos: Proyecto[] = [
  {
    slug: "casa-i",
    orden: 1,
    // ↓ PON AQUÍ EL NOMBRE REAL DEL PROYECTO
    titulo: { es: "Casa I", en: "House I" },
    resumen: {
      es: "Vivienda unifamiliar contemporánea abierta al paisaje, en piedra, madera y vidrio.",
      en: "Contemporary single-family home opening to the landscape, in stone, timber and glass.",
    },
    ubicacion: { es: "Oriente Antioqueño", en: "Eastern Antioquia" },
    anio: "", // ej: "2025"
    area: { es: "", en: "" }, // ej: "480 m²"
    tipo: { es: "Residencial", en: "Residential" },
    descripcion: {
      es: "Una vivienda contemporánea donde la piedra, la madera y el vidrio se entrelazan alrededor de un acceso a doble altura. El volumen se abre por completo al paisaje: grandes paños de cristal disuelven el límite entre el interior y la naturaleza, y una piscina de borde infinito prolonga la arquitectura hacia el horizonte al atardecer.",
      en: "A contemporary home where stone, timber and glass interweave around a double-height entrance. The volume opens fully to the landscape: large panes of glass dissolve the boundary between inside and nature, while an infinity-edge pool extends the architecture toward the horizon at dusk.",
    },
    portada: "casa-1/06.jpeg",
    imagenes: [
      "casa-1/06.jpeg",
      "casa-1/02.jpeg",
      "casa-1/01.jpeg",
      "casa-1/03.jpeg",
      "casa-1/04.jpeg",
      "casa-1/05.jpeg",
    ],
  },
  {
    slug: "casa-ii",
    orden: 2,
    // ↓ PON AQUÍ EL NOMBRE REAL DEL PROYECTO
    titulo: { es: "Casa II", en: "House II" },
    resumen: {
      es: "Residencia de varios niveles en ladrillo y madera, asentada sobre la ladera.",
      en: "Multi-level brick-and-timber residence set on the hillside.",
    },
    ubicacion: { es: "Antioquia, Colombia", en: "Antioquia, Colombia" },
    anio: "",
    area: { es: "", en: "" },
    tipo: { es: "Residencial", en: "Residential" },
    descripcion: {
      es: "Una residencia de varios niveles asentada sobre la ladera, con fachadas en ladrillo y madera que capturan la luz cálida del paisaje de montaña. Las terrazas voladas y los grandes ventanales enmarcan las vistas, mientras un zócalo pétreo ancla la casa al terreno.",
      en: "A multi-level residence set on the hillside, with brick and timber façades that capture the warm light of the mountain landscape. Cantilevered terraces and full-height windows frame the views, while a stone base anchors the house to the terrain.",
    },
    portada: "casa-2/01.jpeg",
    imagenes: [
      "casa-2/01.jpeg",
      "casa-2/05.jpeg",
      "casa-2/02.jpeg",
      "casa-2/03.jpeg",
      "casa-2/04.jpeg",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  //  SLOTS "PRÓXIMAMENTE"  ·  proyectos por venir.
  //  Para convertir uno en proyecto real: añade sus imágenes en
  //  src/assets/proyectos/, llena "portada" e "imagenes", completa los
  //  textos y BORRA la línea  proximamente: true.
  //  Puedes editar los nombres, añadir más o borrar los que no quieras.
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "proyecto-comercial",
    orden: 3,
    proximamente: true,
    titulo: { es: "Proyecto Comercial", en: "Commercial Project" },
    resumen: {
      es: "Espacio comercial de usos mixtos en zona urbana consolidada.",
      en: "Mixed-use commercial space in a consolidated urban area.",
    },
    ubicacion: { es: "", en: "" },
    anio: "",
    area: { es: "", en: "" },
    tipo: { es: "Comercial", en: "Commercial" },
    descripcion: { es: "", en: "" },
    portada: "",
    imagenes: [],
  },
  {
    slug: "conjunto-residencial",
    orden: 4,
    proximamente: true,
    titulo: { es: "Conjunto Residencial", en: "Residential Complex" },
    resumen: {
      es: "Desarrollo habitacional con espacios comunes de calidad.",
      en: "Housing development with quality shared spaces.",
    },
    ubicacion: { es: "", en: "" },
    anio: "",
    area: { es: "", en: "" },
    tipo: { es: "Residencial", en: "Residential" },
    descripcion: { es: "", en: "" },
    portada: "",
    imagenes: [],
  },
  {
    slug: "oficinas-corporativas",
    orden: 5,
    proximamente: true,
    titulo: { es: "Oficinas Corporativas", en: "Corporate Offices" },
    resumen: {
      es: "Diseño de interiores y fachada para una sede corporativa.",
      en: "Interior and façade design for a corporate headquarters.",
    },
    ubicacion: { es: "", en: "" },
    anio: "",
    area: { es: "", en: "" },
    tipo: { es: "Corporativo", en: "Corporate" },
    descripcion: { es: "", en: "" },
    portada: "",
    imagenes: [],
  },
];

/** Devuelve TODOS los proyectos ordenados (incluye los "próximamente"). */
export function proyectosOrdenados(): Proyecto[] {
  return [...proyectos].sort((a, b) => a.orden - b.orden);
}

/** Solo los proyectos reales (con página de detalle), ordenados. */
export function proyectosReales(): Proyecto[] {
  return proyectosOrdenados().filter((p) => !p.proximamente);
}

/** Busca un proyecto por su slug. */
export function proyectoPorSlug(slug: string): Proyecto | undefined {
  return proyectos.find((p) => p.slug === slug);
}
