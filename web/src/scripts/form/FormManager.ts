import { logger } from "../logger/Logger";

export interface FormResponse {
  success: boolean;
  message: string;
}

export type FormPolicy = (...params: any[]) => FormResponse;

function isFormResponse(value: unknown): value is FormResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof value.success === "boolean" &&
    "message" in value &&
    typeof value.message === "string"
  );
}

export class FormManager {
  public readonly form: HTMLFormElement;

  public constructor(formId: string) {
    const form = document.getElementById(formId.trim());

    if (!(form instanceof HTMLFormElement)) {
      const error = new Error(`No se encontró el formulario "${formId}".`);

      logger.error("No se pudo inicializar FormManager.", error);

      throw error;
    }

    this.form = form;

    logger.info("FormManager inicializado.");
  }

  /**
   * Busca y devuelve un elemento del documento.
   */
  public registerElement(selector: string): HTMLElement | null {
    try {
      const element = document.querySelector(selector.trim());

      if (!(element instanceof HTMLElement)) {
        logger.warn(`No se encontró el elemento "${selector}".`);

        return null;
      }

      return element;
    } catch (error) {
      logger.error(`El selector "${selector}" no es válido.`, error);

      return null;
    }
  }

  /**
   * Envía FormData al backend y devuelve su respuesta.
   */
  public async sendFormData(
    url: string,
    formData: FormData,
  ): Promise<FormResponse> {
    const normalizedUrl = url.trim();

    if (!normalizedUrl) {
      logger.warn("No se configuró la URL de envío.");

      return {
        success: false,
        message: "No se configuró la URL de envío.",
      };
    }

    try {
      const response = await fetch(normalizedUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data: unknown = await response.json();

      if (!isFormResponse(data)) {
        logger.warn("El backend devolvió una respuesta no válida.");

        return {
          success: false,
          message: "El servidor devolvió una respuesta no válida.",
        };
      }

      return data;
    } catch (error) {
      logger.error("No se pudo enviar el formulario.", error);

      return {
        success: false,
        message: "No se pudo establecer comunicación con el servidor.",
      };
    }
  }

  /**
   * Activa el estado pending de un elemento.
   *
   * Puede recibir opcionalmente un mensaje.
   *
   * Si se proporciona un mensaje:
   * - se asigna como textContent;
   * - el elemento se hace visible.
   *
   * Si el elemento es un botón:
   * - se deshabilita para evitar múltiples envíos.
   *
   * Ejemplos:
   *
   * formManager.startPending(submitButton);
   *
   * formManager.startPending(
   *   messageElement,
   *   "Enviando consulta...",
   * );
   */
  public startPending(element: HTMLElement | null, message?: string): void {
    if (!element) {
      logger.warn(
        "No se pudo activar el estado pending porque el elemento no existe.",
      );

      return;
    }

    /*
     * Limpia estados anteriores.
     */
    element.classList.remove("is-success", "is-error");

    /*
     * Activa pending.
     */
    element.classList.add("is-pending");

    element.setAttribute("aria-busy", "true");

    /*
     * Si se recibió un mensaje, se utiliza el elemento
     * también como contenedor visual del estado pending.
     */
    if (typeof message === "string" && message.trim() !== "") {
      element.textContent = message.trim();
      element.hidden = false;
    }

    /*
     * Si es un botón, se bloquea mientras dure
     * la operación.
     */
    if (element instanceof HTMLButtonElement) {
      element.disabled = true;
    }
  }

  /**
   * Desactiva el estado pending de un elemento.
   *
   * Si el elemento es un botón, vuelve a habilitarlo.
   *
   * No modifica el texto ni oculta el elemento porque
   * posteriormente puede recibir un estado success o error.
   */
  public stopPending(element: HTMLElement | null): void {
    if (!element) {
      logger.warn(
        "No se pudo desactivar el estado pending porque el elemento no existe.",
      );

      return;
    }

    element.classList.remove("is-pending");

    element.removeAttribute("aria-busy");

    if (element instanceof HTMLButtonElement) {
      element.disabled = false;
    }
  }

  /*
  CONTENEDORES DE MENSAJES DEBEN INICIAR ASI:

  <p
    id="contact-message"
    class="contact-form-message"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    hidden>
  </p>
  */

  /**
   * Muestra un mensaje de éxito.
   *
   * Elimina previamente cualquier estado pending o error.
   */
  public successMessage(container: HTMLElement | null, message: string): void {
    if (!container) {
      logger.warn(
        "No se pudo mostrar el mensaje de éxito porque el contenedor no existe.",
      );

      return;
    }

    container.textContent = message;

    container.classList.remove("is-pending", "is-error");

    container.classList.add("is-success");

    container.removeAttribute("aria-busy");

    container.hidden = false;
  }

  /**
   * Muestra un mensaje de error.
   *
   * Elimina previamente cualquier estado pending o success.
   */
  public errorMessage(container: HTMLElement | null, message: string): void {
    if (!container) {
      logger.warn(
        "No se pudo mostrar el mensaje de error porque el contenedor no existe.",
      );

      return;
    }

    container.textContent = message;

    container.classList.remove("is-pending", "is-success");

    container.classList.add("is-error");

    container.removeAttribute("aria-busy");

    container.hidden = false;
  }

  /**
   * Limpia completamente el contenedor de mensajes.
   *
   * Elimina:
   * - pending;
   * - success;
   * - error;
   * - aria-busy;
   * - contenido.
   *
   * Finalmente vuelve a ocultar el elemento.
   */
  public clearMessage(container: HTMLElement | null): void {
    if (!container) {
      logger.warn(
        "No se pudo limpiar el mensaje porque el contenedor no existe.",
      );

      return;
    }

    container.textContent = "";

    container.classList.remove("is-pending", "is-success", "is-error");

    container.removeAttribute("aria-busy");

    container.hidden = true;
  }
}
