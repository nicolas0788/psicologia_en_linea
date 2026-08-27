export type RequiredHTMLElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/**
 * Hace obligatorio un control.
 */
export function addRequiredAction(element: RequiredHTMLElement): void {
  element.required = true;
}

/**
 * Hace opcional un control.
 */
export function removeRequiredAction(element: RequiredHTMLElement): void {
  element.required = false;
}

/**
 * Alterna el estado required de un control.
 */
export function toggleRequiredAction(element: RequiredHTMLElement): void {
  element.required = !element.required;
}
