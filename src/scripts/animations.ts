// ============================================================================
//  Animaciones del sitio: scroll suave (Lenis) + revelados/parallax (GSAP).
//  Compatible con las View Transitions de Astro (se re-inicializa en cada
//  navegación) y respeta "prefers-reduced-motion".
// ============================================================================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Scroll suave (una sola vez) -------------------------------------------
let lenis: Lenis | null = null;

function iniciarLenis() {
  if (sinMovimiento || lenis) return;
  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// --- Estado del nav al hacer scroll (listener único en window) -------------
function vigilarNav() {
  const actualizar = () => {
    const nav = document.querySelector("[data-nav]");
    if (nav) nav.classList.toggle("desplazado", window.scrollY > 24);
  };
  actualizar();
  window.addEventListener("scroll", actualizar, { passive: true });
}

// --- Revelados al entrar en pantalla ---------------------------------------
function iniciarRevelados() {
  const elementos = document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-img]");
  if (sinMovimiento) {
    elementos.forEach((el) => el.classList.add("es-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("es-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  elementos.forEach((el) => io.observe(el));
}

// --- Parallax suave sobre imágenes marcadas --------------------------------
function iniciarParallax() {
  if (sinMovimiento) return;
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const intensidad = parseFloat(el.dataset.parallax || "12");
    const medio = el.querySelector<HTMLElement>("[data-parallax-medio]") ?? el;
    gsap.fromTo(
      medio,
      { yPercent: -intensidad },
      {
        yPercent: intensidad,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

// --- Intro del héroe --------------------------------------------------------
function iniciarHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;
  const items = hero.querySelectorAll("[data-hero-item]");
  if (sinMovimiento || items.length === 0) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }
  gsap.fromTo(
    items,
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07, delay: 0.1 },
  );
}

// --- Video de fondo global controlado por scroll (scrub de página completa) --
//  El avance del video se ata al scroll de TODA la página: al bajar avanza, al
//  subir retrocede. Nunca se reproduce solo. Móvil usa un archivo más ligero.
//  Movimiento reducido: se queda el póster estático (fondo CSS), sin scrub.
function iniciarVideoScrub() {
  const video = document.querySelector<HTMLVideoElement>("[data-fondo-media]");
  if (!video) return;

  // Nota: el avance lo controla el propio scroll del usuario (no es autoplay),
  // así que se mantiene incluso con "reducir movimiento"; en ese caso usamos un
  // scrub directo (sin la inercia extra) para no añadir movimiento propio.
  const scrub = sinMovimiento ? true : 1;

  // El elemento persiste entre navegaciones (transition:persist): el scroll se
  // re-vincula cada vez, pero la fuente solo se carga una vez.
  const esTactil = window.matchMedia("(pointer: coarse)").matches;
  const esEstrecho = window.matchMedia("(max-width: 920px)").matches;
  const fuente = esTactil || esEstrecho ? video.dataset.srcMovil : video.dataset.srcScrub;

  if (!video.src && fuente) {
    video.preload = "auto";
    video.src = fuente;
    video.load();

    // "Prime": fuerza el primer decode para que actualizar currentTime pinte
    // frames (necesario en Safari y con position:fixed). Silencioso.
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    if (video.readyState >= 2) prime();
    else video.addEventListener("loadeddata", prime, { once: true });
  }

  const arrancarScrub = () => {
    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1,
      ease: "none",
      scrollTrigger: {
        start: 0, // tope de la página
        end: "max", // fondo de la página (todas las secciones)
        scrub,
      },
      onUpdate: () => {
        const d = video.duration;
        if (d && isFinite(d)) video.currentTime = Math.min(proxy.t * d, d - 0.001);
      },
    });
    ScrollTrigger.refresh();
  };

  // Necesitamos la duración antes de mapear el scroll → currentTime.
  if (video.readyState >= 1 && isFinite(video.duration)) {
    arrancarScrub();
  } else {
    video.addEventListener("loadedmetadata", arrancarScrub, { once: true });
  }
}

// --- Menú móvil -------------------------------------------------------------
function iniciarMenu() {
  const nav = document.querySelector("[data-nav]");
  const boton = document.querySelector<HTMLButtonElement>("[data-menu-boton]");
  const menu = document.querySelector<HTMLElement>("[data-menu]");
  if (!nav || !boton || !menu) return;

  const abrir = () => {
    menu.hidden = false;
    requestAnimationFrame(() => nav.classList.add("menu-abierto"));
    boton.setAttribute("aria-expanded", "true");
    lenis?.stop();
    document.body.style.overflow = "hidden";
  };
  const cerrar = () => {
    nav.classList.remove("menu-abierto");
    boton.setAttribute("aria-expanded", "false");
    lenis?.start();
    document.body.style.overflow = "";
    window.setTimeout(() => (menu.hidden = true), 450);
  };
  boton.addEventListener("click", () => {
    if (nav.classList.contains("menu-abierto")) cerrar();
    else abrir();
  });
  menu.querySelectorAll("[data-menu-cerrar]").forEach((a) => a.addEventListener("click", cerrar));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("menu-abierto")) cerrar();
  });
}

// --- Inicialización por página ---------------------------------------------
function iniciarPagina() {
  iniciarRevelados();
  iniciarParallax();
  iniciarHero();
  iniciarVideoScrub();
  iniciarMenu();
  ScrollTrigger.refresh();
}

// Limpieza antes de cambiar de página (View Transitions)
document.addEventListener("astro:before-swap", () => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  document.body.style.overflow = "";
});

// Primera carga + después de cada navegación
document.addEventListener("astro:page-load", () => {
  iniciarLenis();
  lenis?.scrollTo(0, { immediate: true });
  iniciarPagina();
});

// El listener de scroll del nav se registra una sola vez
vigilarNav();

// Reajustar al cargar todas las imágenes
window.addEventListener("load", () => ScrollTrigger.refresh());
