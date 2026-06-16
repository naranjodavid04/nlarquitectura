# NL Arquitectura & Construcción — Sitio web

Portafolio del arquitecto **Daniel Naranjo López** (estudio *NL Arquitectura & Construcción*).
Sitio estático construido con [Astro](https://astro.build), bilingüe (Español / Inglés), con
animaciones de scroll y optimización automática de imágenes.

---

## Cómo trabajar con el sitio

Necesitas tener instalado **[Node.js](https://nodejs.org)** (versión 18 o superior).

Abre una terminal en esta carpeta y ejecuta:

```bash
npm install        # solo la primera vez: instala lo necesario
npm run dev        # arranca el sitio en modo edición
```

Luego abre **http://localhost:4321** en tu navegador. Cada vez que guardes un cambio, se
actualiza solo.

| Comando           | Qué hace                                                        |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`     | Modo edición en vivo (para trabajar).                          |
| `npm run build`   | Genera la versión final en la carpeta `dist/` (para publicar). |
| `npm run preview` | Muestra cómo quedó la versión final, antes de publicar.        |

---

## Cómo añadir un proyecto nuevo

Son 3 pasos. **No necesitas saber programar.**

### 1. Prepara las imágenes
Crea una carpeta dentro de `src/assets/proyectos/` con un nombre sencillo, por ejemplo
`casa-3`. Mete ahí los renders y nómbralos `01.jpeg`, `02.jpeg`, `03.jpeg`… (en el orden que
quieras que aparezcan). La primera suele ser la mejor para la portada.

### 2. Añade el proyecto a la lista
Abre `src/data/proyectos.ts` y **copia uno de los bloques** que ya existen (todo lo que está
entre `{` y `}`), pégalo debajo y cambia los datos:

```ts
{
  slug: "casa-iii",                 // aparece en la dirección: /proyectos/casa-iii
  orden: 3,                         // orden en la lista
  titulo: { es: "Casa III", en: "House III" },
  ubicacion: { es: "Rionegro", en: "Rionegro" },
  anio: "2025",                     // déjalo en "" si no quieres mostrarlo
  area: { es: "520 m²", en: "520 m²" },
  tipo: { es: "Residencial", en: "Residential" },
  descripcion: {
    es: "Descripción del proyecto en español...",
    en: "Project description in English...",
  },
  portada: "casa-3/01.jpeg",        // la imagen de portada
  imagenes: [                       // todas las imágenes de la galería
    "casa-3/01.jpeg",
    "casa-3/02.jpeg",
    "casa-3/03.jpeg",
  ],
},
```

### 3. Guarda
¡Listo! El proyecto aparece automáticamente en la página de inicio y tiene su propia página
de detalle. Si dejas un campo vacío (`""`), simplemente no se muestra.

> **Pendiente actual:** los dos proyectos de ejemplo (Casa I y Casa II) tienen nombres y
> descripciones provisionales, y el año y el área están vacíos. Reemplázalos con los datos
> reales cuando los tengas, en `src/data/proyectos.ts`.

---

## Cómo cambiar los datos de contacto

Todo está en un solo archivo: **`src/site.ts`**

- **WhatsApp:** cambia `whatsappNumero` (solo números, con 57 al inicio).
- **Correo:** cambia `correo`.
- **Instagram:** cuando crees el perfil, pon la dirección en `instagramUrl` y cambia
  `instagramActivo` a `true`. (Por ahora aparece como "próximamente".)

---

## Cómo cambiar los textos

- Textos de la interfaz (menú, botones, secciones, biografía, servicios):
  - Español → `src/i18n/es.ts`
  - Inglés → `src/i18n/en.ts`
  - Si cambias un texto en uno, cámbialo también en el otro para que coincidan.

---

## Logo

El logo se procesó automáticamente a versiones transparentes (dorado y marfil) para que luzca
sobre el fondo oscuro. Están en `src/assets/marca/`. Si en el futuro cambias el logo original,
reemplaza la imagen en la carpeta `NL Arquitectura & Construcción/` y vuelve a ejecutar:

```bash
node scripts/procesar-logo.mjs
```

Eso regenera los logos, el favicon y la imagen para compartir en redes.

---

## Cómo publicar el sitio (gratis)

La forma más fácil es **[Netlify](https://www.netlify.com)** o **[Vercel](https://vercel.com)**:

1. Crea una cuenta gratuita.
2. Sube esta carpeta (o conéctala a GitHub).
3. Configuración de compilación:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Antes de publicar, abre `astro.config.mjs` y cambia `site` por tu dominio real
   (ej. `https://nlarquitectura.com`). Eso hace que los enlaces y las etiquetas de idioma
   queden correctos.

---

## Estructura del proyecto

```
src/
  assets/            Imágenes (renders, foto, logos procesados)
  components/        Piezas reutilizables (nav, hero, tarjetas, galería…)
  data/proyectos.ts  ← LA LISTA DE PROYECTOS (lo que más vas a editar)
  i18n/              Textos en español e inglés
  layouts/           Plantilla base de todas las páginas
  pages/             Las páginas (inicio y detalle de proyecto, ES y EN)
  scripts/           Animaciones (scroll suave + revelados)
  site.ts            ← DATOS DE CONTACTO
  styles/global.css  Colores, tipografía y estilo general
public/              Favicon, imagen para redes, robots.txt
```

---

Hecho con Astro · Tipografías Sora, Inter y Cormorant Garamond · Animaciones con GSAP y Lenis.
