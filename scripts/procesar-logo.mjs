// Procesa el logo original (JPEG sobre fondo blanco) y genera versiones
// transparentes recoloreadas para usar sobre el fondo oscuro del sitio.
//
//   node scripts/procesar-logo.mjs
//
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const ORIGEN = "NL Arquitectura & Construcción/WhatsApp Image 2026-06-14 at 9.18.20 PM.jpeg";

const MARFIL = { r: 237, g: 232, b: 224 };
const ORO = { r: 201, g: 168, b: 106 };
const NEGRO = { r: 10, g: 9, b: 8 };

// Construye un canal alfa a partir de la luminancia: el fondo claro se vuelve
// transparente y las líneas del logo (oscuras y doradas) quedan opacas.
async function mascaraAlfa(pipeline) {
  return pipeline
    .clone()
    .grayscale()
    .toColourspace("b-w")
    .linear(-8, 1800) // alfa = -8*luminancia + 1800  → fondo→0, marca→255
    .raw()
    .toBuffer({ resolveWithObject: true });
}

// Recolorea la marca con un color sólido y fondo transparente, recortando el
// borde sobrante.
async function recolorear(pipeline, color, salida) {
  const { data: alfa, info } = await mascaraAlfa(pipeline);
  const solido = await sharp({
    create: { width: info.width, height: info.height, channels: 3, background: color },
  })
    .raw()
    .toBuffer();

  await sharp(solido, { raw: { width: info.width, height: info.height, channels: 3 } })
    .joinChannel(alfa, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png()
    .trim({ threshold: 10 }) // recorta el borde transparente
    .toFile(salida);
  console.log("✓", salida);
}

async function main() {
  await mkdir("src/assets/marca", { recursive: true });
  await mkdir("public", { recursive: true });

  const meta = await sharp(ORIGEN).metadata();
  const W = meta.width ?? 1536;
  const H = meta.height ?? 1024;

  // --- Lockup completo (marca + texto) ---
  await recolorear(sharp(ORIGEN), MARFIL, "src/assets/marca/logo-lockup-ivory.png");
  await recolorear(sharp(ORIGEN), ORO, "src/assets/marca/logo-lockup-oro.png");

  // --- Solo el monograma (edificios), recortando la franja de texto inferior ---
  const region = {
    left: Math.round(W * 0.26),
    top: Math.round(H * 0.18),
    width: Math.round(W * 0.5),
    height: Math.round(H * 0.52),
  };
  await recolorear(sharp(ORIGEN).extract(region), ORO, "src/assets/marca/logo-mark-oro.png");
  await recolorear(sharp(ORIGEN).extract(region), MARFIL, "src/assets/marca/logo-mark-ivory.png");

  // --- Favicon (monograma dorado, transparente, cuadrado 256x256) ---
  const monogramaBuf = await sharp("src/assets/marca/logo-mark-oro.png").toBuffer();
  const transparente = { r: 0, g: 0, b: 0, alpha: 0 };

  await sharp(monogramaBuf)
    .resize(220, 220, { fit: "contain", background: transparente })
    .extend({ top: 18, bottom: 18, left: 18, right: 18, background: transparente })
    .png()
    .toFile("public/favicon.png");
  console.log("✓ public/favicon.png");

  // Apple touch icon (monograma dorado sobre fondo oscuro 180x180)
  await sharp(monogramaBuf)
    .resize(140, 140, { fit: "contain", background: transparente })
    .extend({ top: 20, bottom: 20, left: 20, right: 20, background: transparente })
    .flatten({ background: NEGRO })
    .png()
    .toFile("public/apple-touch-icon.png");
  console.log("✓ public/apple-touch-icon.png");

  // --- Imagen para compartir en redes (OG, 1200x630) ---
  const fondo = await sharp("src/assets/proyectos/casa-1/06.jpeg")
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.5 })
    .toBuffer();
  const velo = Buffer.from(
    `<svg width="1200" height="630"><rect width="1200" height="630" fill="rgba(10,9,8,0.45)"/></svg>`,
  );
  const lockupOro = await sharp("src/assets/marca/logo-lockup-oro.png")
    .resize({ width: 560 })
    .toBuffer();
  await sharp(fondo)
    .composite([
      { input: velo, top: 0, left: 0 },
      { input: lockupOro, gravity: "center" },
    ])
    .jpeg({ quality: 86 })
    .toFile("public/og.jpg");
  console.log("✓ public/og.jpg");

  console.log("\nListo. Logo procesado.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
