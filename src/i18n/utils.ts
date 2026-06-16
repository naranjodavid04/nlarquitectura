// Helpers de internacionalización (i18n).
import { es } from "./es";
import { en } from "./en";

export type Idioma = "es" | "en";

export const idiomas: Idioma[] = ["es", "en"];
export const idiomaPorDefecto: Idioma = "es";

const diccionarios = { es, en };

/** Detecta el idioma a partir de la URL (/en/... -> "en", el resto -> "es"). */
export function idiomaDeUrl(url: URL): Idioma {
  const [, primero] = url.pathname.split("/");
  if (primero === "en") return "en";
  return "es";
}

/** Devuelve el diccionario de textos para un idioma. */
export function traducciones(lang: Idioma) {
  return diccionarios[lang];
}

/**
 * Construye una ruta con el prefijo de idioma correcto.
 * ruta("/proyectos/casa-i", "es") -> "/proyectos/casa-i"
 * ruta("/proyectos/casa-i", "en") -> "/en/proyectos/casa-i"
 */
export function ruta(camino: string, lang: Idioma): string {
  const limpio = "/" + camino.replace(/^\/+/, "");
  if (lang === "en") return "/en" + (limpio === "/" ? "" : limpio);
  return limpio;
}

/** Devuelve la URL equivalente en el otro idioma (para el botón de cambio). */
export function urlOtroIdioma(url: URL, otro: Idioma): string {
  const actual = idiomaDeUrl(url);
  if (actual === otro) return url.pathname;
  let camino = url.pathname;
  if (actual === "en") {
    camino = camino.replace(/^\/en/, "") || "/";
  }
  return ruta(camino, otro);
}
