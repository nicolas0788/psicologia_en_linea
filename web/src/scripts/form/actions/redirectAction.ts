/**
 * REDIRECT ACTION
 *
 * Redirige a una URL absoluta o relativa, de forma inmediata
 * o después de una demora opcional.
 *
 * Uso básico:
 *
 * await redirectAction({
 *   url: "/gracias",
 * });
 *
 * Redirección después de 5 segundos:
 *
 * await redirectAction({
 *   url: "/gracias",
 *   delayMilliseconds: 5_000,
 * });
 *
 * Reemplazar la página actual en el historial:
 *
 * await redirectAction({
 *   url: "/gracias",
 *   replaceHistory: true,
 * });
 *
 * Abrir en una pestaña nueva:
 *
 * await redirectAction({
 *   url: "/gracias",
 *   newTab: true,
 * });
 *
 * Opciones:
 *
 * - url: URL de destino. Es obligatoria.
 * - delayMilliseconds: demora en milisegundos. Por defecto: 0.
 * - newTab: abre el destino en otra pestaña. Por defecto: false.
 * - replaceHistory: evita regresar a la página actual mediante
 *   el botón Atrás. Solo se aplica en la pestaña actual.
 *
 * La función devuelve Promise<void> y debe utilizarse con await.
 */

import { logger } from "../../logger/Logger";

export interface RedirectOptions {
  url: string;
  delayMilliseconds?: number;
  newTab?: boolean;
  replaceHistory?: boolean;
}

/**
 * Redirige a otra URL después de una demora opcional.
 */
export async function redirectAction({
  url,
  delayMilliseconds = 0,
  newTab = false,
  replaceHistory = false,
}: RedirectOptions): Promise<void> {
  const destination = url.trim();

  if (!destination) {
    const error = new Error("La URL de redirección no puede estar vacía.");

    logger.error("No se pudo realizar la redirección.", error);

    throw error;
  }

  if (!Number.isFinite(delayMilliseconds) || delayMilliseconds < 0) {
    const error = new RangeError("La demora debe ser un número no negativo.");

    logger.error("No se pudo realizar la redirección.", error);

    throw error;
  }

  if (delayMilliseconds > 0) {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, delayMilliseconds);
    });
  }

  try {
    if (newTab) {
      const openedWindow = window.open(
        destination,
        "_blank",
        "noopener,noreferrer",
      );

      if (!openedWindow) {
        throw new Error("El navegador bloqueó la nueva pestaña.");
      }

      return;
    }

    if (replaceHistory) {
      window.location.replace(destination);
      return;
    }

    window.location.assign(destination);
  } catch (error) {
    logger.error("No se pudo completar la redirección.", error);

    throw error;
  }
}
