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
        redirect: "manual",
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

  /*
  CONTENEDORES DE MENSAJES DEBEN INICIAR ASI:

  <p
    id="contact-message"
    class="contact-form-message"
    role="status"
    aria-live="polite"
    hidden >
  </p>
  */

  /**
   * Muestra un mensaje de éxito.
   */
  public successMessage(container: HTMLElement | null, message: string): void {
    if (!container) {
      logger.warn(
        "No se pudo mostrar el mensaje de éxito porque el contenedor no existe.",
      );

      return;
    }

    container.textContent = message;
    container.classList.remove("is-error");
    container.classList.add("is-success");
    container.hidden = false;
  }

  /**
   * Muestra un mensaje de error.
   */
  public errorMessage(container: HTMLElement | null, message: string): void {
    if (!container) {
      logger.warn(
        "No se pudo mostrar el mensaje de error porque el contenedor no existe.",
      );

      return;
    }

    container.textContent = message;
    container.classList.remove("is-success");
    container.classList.add("is-error");
    container.hidden = false;
  }

  /**
   * Limpia y oculta el contenedor de mensajes.
   */
  public clearMessage(container: HTMLElement | null): void {
    if (!container) {
      logger.warn(
        "No se pudo limpiar el mensaje porque el contenedor no existe.",
      );

      return;
    }

    container.textContent = "";
    container.classList.remove("is-success", "is-error");
    container.hidden = true;
  }
}
