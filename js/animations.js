// animation.js - CON LOS CAMBIOS INTEGRADOS
document.addEventListener("DOMContentLoaded", function () {
  // 1. LÍNEA DE TIEMPO QUE CRECE CON EL SCROLL
  const timelineContainer = document.querySelector(".timeline-container");
  const timelineLine = document.querySelector(".timeline-line");

  if (!timelineContainer || !timelineLine) return;

  let isTimelineActive = false;
  let firstDotActivated = false;
  let lineGrowthStarted = false;

  // Observer para saber cuándo estamos en la sección timeline
  const timelineSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isTimelineActive = entry.isIntersecting;
        if (isTimelineActive) {
          timelineLine.style.transition = "height 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)";
        }
      });
    },
    { threshold: 0.1 }
  );

  timelineSectionObserver.observe(timelineContainer);

  // Función para actualizar la línea
  function updateTimelineLine() {
    if (!isTimelineActive) {
      timelineLine.style.height = "0px";
      firstDotActivated = false;
      lineGrowthStarted = false;
      return;
    }

    if (!lineGrowthStarted) {
      lineGrowthStarted = true;
      timelineLine.style.transition = "height 0.8s cubic-bezier(0.22, 0.61, 0.36, 1)";
    }

    const scrollPosition = window.scrollY + window.innerHeight * 0.8; // 80% del viewport
    const containerTop = timelineContainer.offsetTop;
    const containerBottom = containerTop + timelineContainer.offsetHeight;

    // Si estamos antes de la sección
    if (scrollPosition < containerTop) {
      timelineLine.style.height = "0px";
      return;
    }

    // Si estamos después de la sección
    if (scrollPosition > containerBottom) {
      timelineLine.style.height = `${containerBottom - containerTop}px`;
      return;
    }

    // Si estamos dentro
    const currentHeight = scrollPosition - containerTop;
    timelineLine.style.height = `${currentHeight}px`;

    // Controlar activación del primer punto
    const firstItem = document.querySelector(".servicio-item:nth-child(2)");
    if (firstItem) {
      const firstItemTop = firstItem.offsetTop;
      const itemRelativeTop = firstItemTop - containerTop;

      if (currentHeight >= itemRelativeTop - 50) {
        // 50px de margen
        firstDotActivated = true;
      } else {
        firstDotActivated = false;
      }
    }
  }

  // 2. PUNTOS QUE CRECEN/DECRECEN AL CENTRARSE
  const servicioItems = document.querySelectorAll(".servicio-item");
  const separadores = document.querySelectorAll(".separador");

  const itemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // CHECKEAR SI ES EL PRIMER PUNTO Y SI LA LÍNEA AÚN NO LLEGÓ
        const isFirstItem = entry.target === document.querySelector(".servicio-item:nth-child(2)");
        if (isFirstItem && !firstDotActivated) {
          const dot = entry.target.querySelector(".dot");
          if (dot) {
            dot.style.transform = "translateX(calc(-50% + 2px)) scale(0.8)";
            dot.style.opacity = "0.3";
          }
          return; // Salir temprano, no procesar más
        }

        const dot = entry.target.querySelector(".dot");
        const rect = entry.boundingClientRect;
        const windowHeight = window.innerHeight;

        // Calcular posición relativa al centro
        const elementCenterY = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = Math.abs(elementCenterY - viewportCenter);

        const normalized = Math.max(0, 1 - distanceFromCenter / (windowHeight / 2));

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // ESCALA: DE 1.2 A 2.0 (¡GRANDOTES!)
          const minScale = 1.2;
          const maxScale = 2.0;
          const scale = minScale + normalized * (maxScale - minScale);

          // OPACIDAD: SIEMPRE 1
          const opacity = 1;

          if (dot) {
            dot.style.transform = `translateX(calc(-50% + 2px)) scale(${scale})`;
            dot.style.opacity = `${opacity}`;
            dot.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.2)";
          }

          // Separador
          if (entry.target.previousElementSibling && entry.target.previousElementSibling.classList.contains("separador")) {
            const sepDot = entry.target.previousElementSibling.querySelector(".dot-separador");
            if (sepDot) {
              sepDot.style.opacity = "1";
              sepDot.style.transform = `scale(${0.9 + normalized * 0.3})`;
            }
          }
        } else {
          // Cuando NO es visible
          entry.target.classList.remove("visible");
          if (dot) {
            dot.style.transform = "translateX(calc(-50% + 2px)) scale(0.8)";
            dot.style.opacity = "0.3";
          }

          // Reset separador
          if (entry.target.previousElementSibling && entry.target.previousElementSibling.classList.contains("separador")) {
            const sepDot = entry.target.previousElementSibling.querySelector(".dot-separador");
            if (sepDot) {
              sepDot.style.opacity = "0.3";
              sepDot.style.transform = "scale(0.8)";
            }
          }
        }
      });
    },
    {
      threshold: 0, // Observar siempre
      rootMargin: "-30% 0px -30% 0px", // Reducido de -40% a -30%
    }
  );

  // Observar todos los items
  servicioItems.forEach((item) => itemObserver.observe(item));

  // 3. EVENT LISTENERS
  window.addEventListener("scroll", () => {
    updateTimelineLine();
  });

  window.addEventListener("resize", updateTimelineLine);

  // Inicializar
  updateTimelineLine();
});
