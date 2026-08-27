/**
 * IMAGE FILE POLICY
 *
 * Valida una imagen cuando el usuario selecciona un archivo mediante
 * un input type="file".
 *
 * Esta policy comprueba:
 *
 * - que se haya seleccionado un archivo;
 * - que sea JPEG, PNG o WebP;
 * - que no supere el tamaño máximo configurado.
 *
 * La validación se ejecuta automáticamente mediante el evento change.
 * No debe llamarse dentro de otro addEventListener.
 *
 * IMPORTANTE
 *
 * Esta validación mejora la experiencia del usuario, pero no garantiza
 * que el archivo sea seguro o realmente sea una imagen. El backend debe
 * volver a validar el archivo de manera definitiva.
 *
 * ============================================================
 * PARÁMETROS
 * ============================================================
 *
 * imageFilePolicy(
 *   element,
 *   maxSizeBytes,
 *   onResponse,
 * );
 *
 * element:
 *   Input HTML de tipo file que recibe la imagen.
 *
 * maxSizeBytes:
 *   Tamaño máximo permitido expresado en bytes.
 *
 * onResponse:
 *   Callback que recibe:
 *
 *   {
 *     success: boolean;
 *     message: string;
 *   }
 *
 * ============================================================
 * CONVERSIÓN DE MEGABYTES A BYTES
 * ============================================================
 *
 * 1 MB:
 *
 * 1 * 1024 * 1024
 *
 * 2 MB:
 *
 * 2 * 1024 * 1024
 *
 * 5 MB:
 *
 * 5 * 1024 * 1024
 *
 * 10 MB:
 *
 * 10 * 1024 * 1024
 *
 * Ejemplo:
 *
 * const maxImageSize =
 *   5 * 1024 * 1024;
 *
 * ============================================================
 * HTML RECOMENDADO
 * ============================================================
 *
 * <div class="form-field">
 *   <label for="dni-front-file">
 *     Frente del DNI
 *   </label>
 *
 *   <input
 *     id="dni-front-file"
 *     name="dni_frente_archivo"
 *     type="file"
 *     accept="image/jpeg,image/png,image/webp"
 *     aria-describedby="dni-front-message"
 *     required
 *   />
 *
 *   <p
 *     id="dni-front-message"
 *     role="status"
 *     aria-live="polite"
 *     hidden
 *   ></p>
 * </div>
 *
 * El atributo accept limita los formatos mostrados por el selector
 * del navegador, pero no reemplaza la validación frontend ni backend.
 *
 * ============================================================
 * USO CON FORM MANAGER
 * ============================================================
 *
 * const imageInput =
 *   formManager.registerElement(
 *     "#dni-front-file",
 *   );
 *
 * const imageMessage =
 *   formManager.registerElement(
 *     "#dni-front-message",
 *   );
 *
 * if (imageInput instanceof HTMLInputElement) {
 *   imageFilePolicy(
 *     imageInput,
 *     5 * 1024 * 1024,
 *     (response) => {
 *       if (response.success) {
 *         formManager.clearMessage(
 *           imageMessage,
 *         );
 *
 *         return;
 *       }
 *
 *       formManager.errorMessage(
 *         imageMessage,
 *         response.message,
 *       );
 *     },
 *   );
 * }
 *
 * En este ejemplo:
 *
 * - el límite es de 5 MB;
 * - los errores se muestran debajo del input;
 * - cuando la imagen es válida, se limpia el error anterior;
 * - no se muestra ningún mensaje de éxito.
 *
 * ============================================================
 * MOSTRAR TAMBIÉN EL MENSAJE DE ÉXITO
 * ============================================================
 *
 * if (imageInput instanceof HTMLInputElement) {
 *   imageFilePolicy(
 *     imageInput,
 *     5 * 1024 * 1024,
 *     (response) => {
 *       if (response.success) {
 *         formManager.successMessage(
 *           imageMessage,
 *           response.message,
 *         );
 *
 *         return;
 *       }
 *
 *       formManager.errorMessage(
 *         imageMessage,
 *         response.message,
 *       );
 *     },
 *   );
 * }
 *
 * ============================================================
 * USO SIN CONTENEDOR DE MENSAJE
 * ============================================================
 *
 * La respuesta también puede utilizarse manualmente:
 *
 * imageFilePolicy(
 *   imageInput,
 *   5 * 1024 * 1024,
 *   (response) => {
 *     if (!response.success) {
 *       return;
 *     }
 *
 *     // Continuar con otra acción.
 *   },
 * );
 *
 * ============================================================
 * VARIOS INPUTS
 * ============================================================
 *
 * La policy debe configurarse una vez para cada input:
 *
 * const imageInputs = [
 *   dniFrontInput,
 *   dniBackInput,
 *   passportInput,
 * ];
 *
 * for (const input of imageInputs) {
 *   if (input instanceof HTMLInputElement) {
 *     imageFilePolicy(
 *       input,
 *       5 * 1024 * 1024,
 *       (response) => {
 *         // Manejar la respuesta correspondiente.
 *       },
 *     );
 *   }
 * }
 *
 * ============================================================
 * USO INCORRECTO
 * ============================================================
 *
 * No debe envolverse en otro evento change:
 *
 * // Incorrecto:
 *
 * imageInput.addEventListener("change", () => {
 *   imageFilePolicy(
 *     imageInput,
 *     maxImageSize,
 *     onResponse,
 *   );
 * });
 *
 * Eso registraría un listener nuevo cada vez que cambie el input.
 *
 * Uso correcto:
 *
 * imageFilePolicy(
 *   imageInput,
 *   maxImageSize,
 *   onResponse,
 * );
 *
 * ============================================================
 * RESPUESTAS POSIBLES
 * ============================================================
 *
 * Sin archivo:
 *
 * {
 *   success: false,
 *   message: "No se seleccionó ninguna imagen."
 * }
 *
 * Formato incorrecto:
 *
 * {
 *   success: false,
 *   message: "La imagen debe estar en formato JPG, PNG o WebP."
 * }
 *
 * Archivo demasiado pesado:
 *
 * {
 *   success: false,
 *   message: "La imagen no puede superar 5 MB."
 * }
 *
 * Imagen válida:
 *
 * {
 *   success: true,
 *   message: "La imagen es válida."
 * }
 *
 * Cuando el formato o el tamaño son incorrectos, la policy limpia
 * automáticamente el valor del input para evitar que ese archivo
 * permanezca seleccionado.
 *
 * ============================================================
 * VALIDACIÓN OBLIGATORIA EN EL BACKEND
 * ============================================================
 *
 * El backend debe volver a comprobar como mínimo:
 *
 * - el código de error de subida;
 * - el tamaño real del archivo;
 * - el MIME real mediante finfo;
 * - que el formato esté permitido;
 * - que el archivo pueda interpretarse como imagen;
 * - las dimensiones máximas;
 * - que el nombre y la ruta de almacenamiento sean seguros.
 */

import type { FormResponse } from "../FormManager";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

/**
 * Valida una imagen cada vez que cambia el input.
 *
 * Esta validación es solamente para mejorar la experiencia
 * del usuario. La validación definitiva debe hacerse en PHP.
 *
 * @param element Input de tipo file.
 * @param maxSizeBytes Tamaño máximo permitido en bytes.
 * @param onResponse Función que recibe el resultado.
 */
export function imageFilePolicy(
  element: HTMLInputElement,
  maxSizeBytes: number,
  onResponse: (response: FormResponse) => void,
): void {
  if (element.type !== "file") {
    onResponse({
      success: false,
      message: "El elemento indicado no es un input de archivos.",
    });

    return;
  }

  element.accept = allowedImageTypes.join(",");

  element.addEventListener("change", () => {
    const file = element.files?.[0];

    if (!file) {
      onResponse({
        success: false,
        message: "No se seleccionó ninguna imagen.",
      });

      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      element.value = "";

      onResponse({
        success: false,
        message: "La imagen debe estar en formato JPG, PNG o WebP.",
      });

      return;
    }

    if (file.size > maxSizeBytes) {
      element.value = "";

      const maxSizeMegabytes = maxSizeBytes / (1024 * 1024);

      onResponse({
        success: false,
        message: `La imagen no puede superar ${maxSizeMegabytes} MB.`,
      });

      return;
    }

    onResponse({
      success: true,
      message: "La imagen es válida.",
    });
  });
}
