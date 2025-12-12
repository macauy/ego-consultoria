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
  // Popover
  const btn = document.getElementById("social-btn");
  const popover = document.getElementById("social-popover");

  if (btn && popover) {
    function showPopover() {
      popover.hidden = false;
      popover.classList.add("show");
    }

    function hidePopover() {
      popover.classList.remove("show");
      popover.hidden = true;
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = popover.classList.contains("show");
      isVisible ? hidePopover() : showPopover();
    });

    document.addEventListener("click", (e) => {
      if (!popover.contains(e.target) && !btn.contains(e.target)) hidePopover();
    });

    popover.addEventListener("click", (e) => e.stopPropagation());
  }

  //  EMAIL FORM (Formspree)

  const form = document.getElementById("email-form");
  const status = document.getElementById("email-status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = new FormData(form);

      fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            status.textContent = "¡Gracias! Te escribiré pronto 🙌";
            status.style.color = "green";
            form.reset();
          } else {
            response.json().then((data) => {
              status.textContent = data.error || "Hubo un error al enviar. Inténtalo nuevamente.";
              status.style.color = "red";
            });
          }
        })
        .catch(() => {
          status.textContent = "Error de conexión. Inténtalo más tarde.";
          status.style.color = "red";
        });
    });
  }
});
