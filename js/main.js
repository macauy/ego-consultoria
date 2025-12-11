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

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("social-btn");
  const popover = document.getElementById("social-popover");

  if (!btn || !popover) return;

  function showPopover() {
    console.log("show");
    popover.hidden = false;
    popover.classList.add("show");

    // const rect = btn.getBoundingClientRect();
    // popover.style.top = rect.bottom + window.scrollY + "px";
    // popover.style.left = rect.left + "px";
  }

  function hidePopover() {
    console.log("hide");
    popover.classList.remove("show");
    popover.hidden = true;
  }

  // Toggle al hacer click en el botón
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // evita que se cierre inmediatamente

    const isVisible = popover.classList.contains("show");

    if (isVisible) {
      hidePopover();
    } else {
      showPopover();
    }
  });

  // Cerrar al hacer click afuera
  document.addEventListener("click", (e) => {
    if (!popover.contains(e.target) && !btn.contains(e.target)) {
      hidePopover();
    }
  });

  // Evitar que clicks dentro del popover lo cierren
  popover.addEventListener("click", (e) => e.stopPropagation());
});
