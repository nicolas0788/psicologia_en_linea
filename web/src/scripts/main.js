import { MenuController } from "./MenuController.js";

const menu = new MenuController({
  headerId: "site-header",
  navId: "site-nav",
  toggleId: "menu-toggle",
  menuId: "menu-mobile",
  overlayId: "menu-overlay",
});

menu.init();
