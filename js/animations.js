// animation.js - CON LA CORRECCIÓN PARA EL PRIMER PUNTO
document.addEventListener("DOMContentLoaded", function () {
  // 1. LÍNEA DE TIEMPO QUE CRECE CON EL SCROLL
  const timelineContainer = document.querySelector(".timeline-container");
  const timelineLine = document.querySelector(".timeline-line");
  let isMobile = window.innerWidth < 768;
  let isSmallMobile = window.innerWidth < 480;

  // Función para actualizar tamaños de pantalla
  function updateScreenSizes() {
    isMobile = window.innerWidth < 768;
    isSmallMobile = window.innerWidth < 480;
  }

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

  // Función para obtener valores de escala según dispositivo
  function getScaleValues() {
    if (isSmallMobile) {
      return { minScale: 0.9, maxScale: 1.2 };
    } else if (isMobile) {
      return { minScale: 1.0, maxScale: 1.4 };
    } else {
      return { minScale: 1.2, maxScale: 1.8 }; // Desktop más pequeño también
    }
  }

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

    const scrollPosition = window.scrollY + window.innerHeight * 0.8;
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
        firstDotActivated = true;

        const firstDot = firstItem.querySelector(".dot");
        if (firstDot) {
          const rect = firstItem.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const elementCenterY = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const distanceFromCenter = Math.abs(elementCenterY - viewportCenter);
          const normalized = Math.max(0, 1 - distanceFromCenter / (windowHeight / 2));

          const { minScale, maxScale } = getScaleValues();
          const scale = minScale + normalized * (maxScale - minScale);

          requestAnimationFrame(() => {
            firstDot.style.transform = `translateX(calc(-50% + 2px)) scale(${scale})`;
            firstDot.style.opacity = "1";
            firstDot.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.2)";
          });
        }
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
            dot.style.transform = "translateX(calc(-50% + 2px)) scale(0.7)";
            dot.style.opacity = "0.3";
          }
          return;
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
          requestAnimationFrame(() => {
            entry.target.classList.add("visible");
          });

          // ESCALA: Usar valores adaptados al dispositivo
          const { minScale, maxScale } = getScaleValues();
          const scale = minScale + normalized * (maxScale - minScale);

          if (dot) {
            dot.style.transform = `translateX(calc(-50% + 2px)) scale(${scale})`;
            dot.style.opacity = "1";
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
            // Tamaños más pequeños cuando no están visibles
            if (isSmallMobile) {
              dot.style.transform = "translateX(calc(-50% + 2px)) scale(0.6)";
            } else if (isMobile) {
              dot.style.transform = "translateX(calc(-50% + 2px)) scale(0.7)";
            } else {
              dot.style.transform = "translateX(calc(-50% + 2px)) scale(0.8)";
            }
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
      threshold: 0,
      rootMargin: "-30% 0px -30% 0px",
    }
  );

  // Observar todos los items
  servicioItems.forEach((item) => itemObserver.observe(item));

  // 3. FUNCIÓN PARA ACTUALIZAR TODOS LOS PUNTOS VISIBLES
  function updateAllDots() {
    servicioItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        const dot = item.querySelector(".dot");
        if (dot) {
          const windowHeight = window.innerHeight;
          const elementCenterY = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const distanceFromCenter = Math.abs(elementCenterY - viewportCenter);
          const normalized = Math.max(0, 1 - distanceFromCenter / (windowHeight / 2));

          const { minScale, maxScale } = getScaleValues();
          const scale = minScale + normalized * (maxScale - minScale);

          dot.style.transform = `translateX(calc(-50% + 2px)) scale(${scale})`;
          dot.style.opacity = "1";
        }
      }
    });
  }

  // 4. EVENT LISTENERS
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateTimelineLine();
        updateAllDots();
        ticking = false;
      });
      ticking = true;
    }
  }

  function handleResize() {
    updateScreenSizes();
    handleScroll();
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);

  // Inicializar
  updateTimelineLine();
  updateAllDots();
});
