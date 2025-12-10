// reveal.js - ANIMACIONES GENERALES SIN AFECTAR TIMELINE

document.addEventListener("DOMContentLoaded", () => {
  const animated = document.querySelectorAll(".reveal, .reveal-card, .reveal-hero");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animated.forEach((el) => observer.observe(el));
});
