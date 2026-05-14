export class MenuController {
  constructor({
    headerId,
    navId,
    toggleId,
    menuId,
    overlayId,
    breakpoint = 1024,
  }) {
    this.header = document.getElementById(headerId);
    this.nav = document.getElementById(navId);
    this.toggle = document.getElementById(toggleId);
    this.menu = document.getElementById(menuId);
    this.overlay = document.getElementById(overlayId);

    this.breakpoint = breakpoint;
    this.isOpen = false;
    this.isAnimating = false;

    this.mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleOverlay = this.handleOverlay.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleNavOnScroll = this.handleNavOnScroll.bind(this);
    this.handleWindowLoad = this.handleWindowLoad.bind(this);
  }

  init() {
    if (
      !this.header ||
      !this.nav ||
      !this.toggle ||
      !this.menu ||
      !this.overlay
    ) {
      return;
    }

    this.toggle.addEventListener("click", this.handleToggle);
    document.addEventListener("keydown", this.handleKey);
    this.overlay.addEventListener("click", this.handleOverlay);
    this.menu.addEventListener("click", this.handleLinkClick);
    this.mediaQuery.addEventListener("change", this.handleResize);

    window.addEventListener("scroll", this.handleNavOnScroll, {
      passive: true,
    });

    window.addEventListener("load", this.handleWindowLoad);

    this.resetImmediate();
    this.handleNavOnScroll();

    requestAnimationFrame(() => {
      this.handleNavOnScroll();
    });
  }

  /* ================= CORE ================= */

  open() {
    if (this.isAnimating || this.isDesktop()) return;

    this.isAnimating = true;
    this.isOpen = true;

    this.header.classList.add("is-open");
    this.overlay.hidden = false;

    requestAnimationFrame(() => {
      this.overlay.classList.add("is-active");
    });

    this.updateAria(true);
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }

  close() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.isOpen = false;

    this.header.classList.remove("is-open");
    this.overlay.classList.remove("is-active");

    this.updateAria(false);
    document.body.style.overflow = "";

    setTimeout(() => {
      this.overlay.hidden = true;
      this.isAnimating = false;
    }, 850);
  }

  toggleMenu() {
    this.isOpen ? this.close() : this.open();
  }

  reset() {
    this.close();
  }

  resetImmediate() {
    this.isOpen = false;
    this.isAnimating = false;

    this.header.classList.remove("is-open");
    this.overlay.classList.remove("is-active");
    this.overlay.hidden = true;

    document.body.style.overflow = "";

    this.updateAria(false);
  }

  /* ================= EVENTS ================= */

  handleToggle() {
    if (this.isDesktop()) return;

    this.toggleMenu();
  }

  handleOverlay() {
    this.close();
  }

  handleKey(e) {
    if (e.key === "Escape") {
      this.close();
    }
  }

  handleResize() {
    if (this.isDesktop()) {
      this.resetImmediate();
    }

    this.handleNavOnScroll();
  }

  handleLinkClick(e) {
    const internalLink = e.target.closest("[data-internal-click]");

    if (internalLink) {
      e.preventDefault();

      const targetId = internalLink.dataset.target;

      if (!targetId) return;

      const target = document.getElementById(targetId);

      if (!target) return;

      if (!this.isDesktop() && this.isOpen) {
        this.close();

        setTimeout(() => {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);

        return;
      }

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    if (e.target.closest("a")) {
      this.close();
    }
  }

  handleNavOnScroll() {
    if (!this.nav) return;

    this.nav.classList.toggle("is-scrolled", window.scrollY > 0);
  }

  handleWindowLoad() {
    this.handleNavOnScroll();

    requestAnimationFrame(() => {
      this.handleNavOnScroll();
    });
  }

  /* ================= HELPERS ================= */

  isDesktop() {
    return this.mediaQuery.matches;
  }

  updateAria(isOpen) {
    this.toggle.setAttribute("aria-expanded", String(isOpen));

    this.toggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú",
    );

    this.menu.setAttribute("aria-hidden", String(!isOpen));
  }
}
