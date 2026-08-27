// src/scripts/utils/Logger.ts

/**
 * Niveles de mensajes admitidos por el logger.
 */
type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Información adicional que puede acompañar a un mensaje.
 */
type LogContext = unknown;

/**
 * Logger centralizado para el frontend.
 *
 * En desarrollo:
 * - muestra mensajes en la consola.
 *
 * En producción:
 * - no muestra ni envía información.
 *
 * Uso:
 *
 * import { logger } from "@/scripts/utils/Logger";
 *
 * logger.debug("Formulario inicializado.");
 * logger.info("Envío iniciado.");
 * logger.warn("Respuesta inesperada.", { status: 429 });
 * logger.error("Falló el envío.", error);
 */
class Logger {
  /**
   * Indica si la aplicación se está ejecutando en desarrollo.
   */
  private readonly enabled: boolean;

  /**
   * Nombre que identifica los mensajes de la aplicación.
   */
  private readonly namespace: string;

  public constructor(namespace = "App") {
    this.enabled = import.meta.env.DEV;
    this.namespace = namespace;
  }

  /**
   * Registra información detallada de depuración.
   */
  public debug(message: string, context?: LogContext): void {
    this.write("debug", message, context);
  }

  /**
   * Registra información general sobre el flujo de la aplicación.
   */
  public info(message: string, context?: LogContext): void {
    this.write("info", message, context);
  }

  /**
   * Registra una situación inesperada pero controlada.
   */
  public warn(message: string, context?: LogContext): void {
    this.write("warn", message, context);
  }

  /**
   * Registra un error técnico.
   */
  public error(message: string, context?: LogContext): void {
    this.write("error", message, context);
  }

  /**
   * Envía el mensaje al método correspondiente de la consola.
   */
  private write(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.enabled) {
      return;
    }

    const normalizedMessage = message.trim();

    if (!normalizedMessage) {
      return;
    }

    const prefix = `[${this.namespace}] [${level.toUpperCase()}]`;
    const output = `${prefix} ${normalizedMessage}`;

    if (context === undefined) {
      console[level](output);
      return;
    }

    console[level](output, context);
  }
}

/**
 * Instancia general compartida por la aplicación.
 *
 * Los módulos ES se evalúan una sola vez, por lo que todos los archivos
 * que importen esta instancia utilizarán el mismo logger.
 */
export const logger = new Logger();

/**
 * Exportación de la clase para crear loggers especializados.
 */
export { Logger };
