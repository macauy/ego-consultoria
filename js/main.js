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
