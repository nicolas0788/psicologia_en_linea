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

    this.mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);

    this.handleToggle = this.handleToggle.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.handleOverlay = this.handleOverlay.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleNavOnScroll = this.handleNavOnScroll.bind(this);

    this.isAnimating = false;
  }

  init() {
    this.toggle.addEventListener("click", this.handleToggle);
    document.addEventListener("keydown", this.handleKey);
    window.addEventListener("scroll", this.handleNavOnScroll);
    this.overlay.addEventListener("click", this.handleOverlay);
    this.menu.addEventListener("click", this.handleLinkClick);
    this.mediaQuery.addEventListener("change", this.handleResize);
    window.addEventListener("scroll", this.handleNavOnScroll);

    this.reset();
  }

  /* ================= CORE ================= */

  open() {
    if (this.isAnimating) return;

    this.isAnimating = true;

    setTimeout(() => {
      this.isAnimating = false;
    }, 800);

    this.isOpen = true;

    this.header.classList.add("is-open");

    this.overlay.hidden = false;
    requestAnimationFrame(() => {
      this.overlay.classList.add("is-active");
    });

    this.updateAria(true);
    document.body.style.overflow = "hidden";
  }

  close() {
    if (this.isAnimating) return;

    this.isAnimating = true;

    setTimeout(() => {
      this.isAnimating = false;
    }, 890);
    this.isOpen = false;

    this.header.classList.remove("is-open");
    this.overlay.classList.remove("is-active");

    this.updateAria(false);
    document.body.style.overflow = "";

    setTimeout(() => {
      this.overlay.hidden = true;
    }, 850);
  }

  toggleMenu() {
    this.isOpen ? this.close() : this.open();
  }

  reset() {
    this.close();
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
    if (e.key === "Escape") this.close();
  }

  handleResize() {
    if (this.isDesktop()) this.reset();
  }

  handleLinkClick(e) {
    if (e.target.tagName === "A") {
      this.close();
    }
  }

  handleNavOnScroll() {
    if (window.scrollY > 0) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }

  handleNavOnScroll() {
    if (window.scrollY > 0) {
      this.nav.classList.add("is-scrolled");
    } else {
      this.nav.classList.remove("is-scrolled");
    }
  }

  /* ================= HELPERS ================= */

  isDesktop() {
    return this.mediaQuery.matches;
  }

  updateAria(isOpen) {
    this.toggle.setAttribute("aria-expanded", isOpen);
    this.toggle.setAttribute(
      "aria-label",
      isOpen ? "Cerrar menú" : "Abrir menú",
    );

    this.menu.setAttribute("aria-hidden", !isOpen);
  }
}
