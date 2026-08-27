type DisableableElement =
  | HTMLButtonElement
  | HTMLFieldSetElement
  | HTMLInputElement
  | HTMLOptGroupElement
  | HTMLOptionElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const disableableSelector = [
  "button",
  "fieldset",
  "input",
  "optgroup",
  "option",
  "select",
  "textarea",
].join(",");

function supportsDisabled(element: Element): element is DisableableElement {
  return "disabled" in element;
}

function getDisableableElements(element: HTMLElement): DisableableElement[] {
  const controls: DisableableElement[] = [];

  if (supportsDisabled(element)) {
    controls.push(element);
  }

  controls.push(
    ...element.querySelectorAll<DisableableElement>(disableableSelector),
  );

  return controls;
}

/**
 * Oculta un elemento y desactiva sus controles.
 */
export function deactivateElementAction(element: HTMLElement): void {
  element.hidden = true;
  element.inert = true;
  element.setAttribute("aria-hidden", "true");

  for (const control of getDisableableElements(element)) {
    control.disabled = true;
  }
}

/**
 * Muestra un elemento y activa sus controles.
 */
export function activateElementAction(element: HTMLElement): void {
  element.hidden = false;
  element.inert = false;
  element.removeAttribute("aria-hidden");

  for (const control of getDisableableElements(element)) {
    control.disabled = false;
  }
}

/**
 * Alterna entre el estado activo y desactivado.
 */
export function toggleElementAction(element: HTMLElement): void {
  if (element.hidden) {
    activateElementAction(element);
    return;
  }

  deactivateElementAction(element);
}
