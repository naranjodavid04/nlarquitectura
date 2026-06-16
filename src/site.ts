// ============================================================================
//  CONFIGURACIÓN DEL SITIO  ·  datos de contacto y enlaces.
//  Cambia aquí el WhatsApp, el correo o el Instagram y se actualiza en todo
//  el sitio automáticamente.
// ============================================================================

export const sitio = {
  // Nombre del estudio (marca principal)
  nombre: "NL Arquitectura & Construcción",
  // Arquitecto a cargo
  arquitecto: "Daniel Naranjo López",

  // WhatsApp: solo dígitos con el indicativo del país (57 = Colombia).
  whatsappNumero: "573186963066",
  // Texto que se autocompleta al abrir el chat (puedes cambiarlo).
  whatsappMensaje: "Hola Daniel, vi tu portafolio y me gustaría hablar sobre un proyecto.",

  // Correo electrónico de contacto.
  correo: "dnaranjo2707@gmail.com",

  // Instagram. Cuando crees el perfil, pon aquí la URL (ej: https://instagram.com/tuusuario)
  // y pon  instagramActivo: true.
  instagramActivo: false,
  instagramUrl: "#",
} as const;

/** Construye el enlace de WhatsApp con el mensaje predefinido. */
export function whatsappUrl(): string {
  const msg = encodeURIComponent(sitio.whatsappMensaje);
  return `https://wa.me/${sitio.whatsappNumero}?text=${msg}`;
}

/** Construye el enlace mailto del correo. */
export function correoUrl(): string {
  return `mailto:${sitio.correo}`;
}

/** Formatea el número para mostrarlo legible: +57 318 696 3066 */
export function whatsappLegible(): string {
  const n = sitio.whatsappNumero;
  // 57 318 696 3066
  return `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;
}
