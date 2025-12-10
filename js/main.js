const menuBtn = document.getElementById("menu-btn");
const overlay = document.getElementById("overlay");
const panel = document.getElementById("nav-panel");
const icon = menuBtn.querySelector("img");
const firstLink = panel.querySelector("a");
const navLinks = panel.querySelectorAll("a");

const openMenu = () => {
  menuBtn.setAttribute("aria-label", "Close Menu");
  menuBtn.setAttribute("aria-expanded", "true");
  icon.src = "./assets/icons/icon-close.svg";
  panel.hidden = false;
  panel.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  firstLink.focus();
  overlay.classList.toggle("show");
};

const closeMenu = () => {
  menuBtn.setAttribute("aria-label", "Open Menu");
  menuBtn.setAttribute("aria-expanded", "false");
  icon.src = "./assets/icons/icon-menu.svg";
  panel.hidden = true;
  panel.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  menuBtn.focus();
  overlay.classList.toggle("show");
};

menuBtn.addEventListener("click", () => {
  const isOpen = menuBtn.getAttribute("aria-expanded") == "true";
  console.log("expended", menuBtn.getAttribute("aria-expanded"));
  isOpen ? closeMenu() : openMenu();
});

overlay?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
    closeMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (menuBtn.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });
});

// Animaciiones
const items = document.querySelectorAll(".servicio-item.anim");
const timelineLine = document.querySelector(".timeline-line");

// Observador para los bloques
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.25,
  }
);

items.forEach((item) => observer.observe(item));

// Activar animación de la línea cuando aparece el primer item
const firstItem = items[0];
const lineObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      timelineLine.classList.add("filled");
    }
  },
  { threshold: 0.3 }
);

lineObserver.observe(firstItem);
