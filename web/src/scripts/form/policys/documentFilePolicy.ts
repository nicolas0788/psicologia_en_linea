/**
 * DOCUMENT FILE POLICY
 *
 * Valida un documento cuando el usuario selecciona un archivo mediante
 * un input type="file".
 *
 * Esta policy está pensada para documentación que puede recibirse como:
 *
 * - JPEG;
 * - PNG;
 * - WebP;
 * - PDF.
 *
 * Por ejemplo:
 *
 * - DNI;
 * - pasaporte;
 * - matrícula;
 * - certificados;
 * - constancias;
 * - documentación escaneada.
 *
 * Esta policy comprueba:
 *
 * - que se haya seleccionado un archivo;
 * - que sea JPEG, PNG, WebP o PDF;
 * - que no supere el tamaño máximo configurado.
 *
 * La validación se ejecuta automáticamente mediante el evento change.
 * No debe llamarse dentro de otro addEventListener.
 *
 * IMPORTANTE
 *
 * Esta validación mejora la experiencia del usuario, pero no garantiza
 * que el archivo sea seguro ni que su contenido coincida realmente con
 * su extensión o MIME declarado.
 *
 * El backend debe volver a validar el archivo de manera definitiva.
 *
 * ============================================================
 * PARÁMETROS
 * ============================================================
 *
 * documentFilePolicy(
 *   element,
 *   maxSizeBytes,
 *   onResponse,
 * );
 *
 * element:
 *   Input HTML de tipo file que recibe el documento.
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
 * FORMATOS PERMITIDOS
 * ============================================================
 *
 * La policy permite:
 *
 * - image/jpeg
 * - image/png
 * - image/webp
 * - application/pdf
 *
 * Esto permite recibir tanto fotografías realizadas desde un celular
 * como imágenes escaneadas o documentos almacenados en PDF.
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
 * const maxDocumentSize =
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
 *     accept="image/jpeg,image/png,image/webp,application/pdf"
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
 * La propia policy también establece automáticamente el atributo
 * accept con los formatos permitidos.
 *
 * ============================================================
 * USO CON FORM MANAGER
 * ============================================================
 *
 * const documentInput =
 *   formManager.registerElement(
 *     "#dni-front-file",
 *   );
 *
 * const documentMessage =
 *   formManager.registerElement(
 *     "#dni-front-message",
 *   );
 *
 * if (documentInput instanceof HTMLInputElement) {
 *   documentFilePolicy(
 *     documentInput,
 *     5 * 1024 * 1024,
 *     (response) => {
 *       if (response.success) {
 *         formManager.clearMessage(
 *           documentMessage,
 *         );
 *
 *         return;
 *       }
 *
 *       formManager.errorMessage(
 *         documentMessage,
 *         response.message,
 *       );
 *     },
 *   );
 * }
 *
 * En este ejemplo:
 *
 * - el límite es de 5 MB;
 * - se permiten JPG, PNG, WebP y PDF;
 * - los errores se muestran debajo del input;
 * - cuando el documento es válido, se limpia el error anterior;
 * - no se muestra ningún mensaje de éxito.
 *
 * ============================================================
 * MOSTRAR TAMBIÉN EL MENSAJE DE ÉXITO
 * ============================================================
 *
 * if (documentInput instanceof HTMLInputElement) {
 *   documentFilePolicy(
 *     documentInput,
 *     5 * 1024 * 1024,
 *     (response) => {
 *       if (response.success) {
 *         formManager.successMessage(
 *           documentMessage,
 *           response.message,
 *         );
 *
 *         return;
 *       }
 *
 *       formManager.errorMessage(
 *         documentMessage,
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
 * documentFilePolicy(
 *   documentInput,
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
 * const documentInputs = [
 *   dniFrontInput,
 *   dniBackInput,
 *   passportInput,
 * ];
 *
 * for (const input of documentInputs) {
 *   if (input instanceof HTMLInputElement) {
 *     documentFilePolicy(
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
 * documentInput.addEventListener("change", () => {
 *   documentFilePolicy(
 *     documentInput,
 *     maxDocumentSize,
 *     onResponse,
 *   );
 * });
 *
 * Eso registraría un listener nuevo cada vez que cambie el input.
 *
 * Uso correcto:
 *
 * documentFilePolicy(
 *   documentInput,
 *   maxDocumentSize,
 *   onResponse,
 * );
 *
 * ============================================================
 * RESPUESTAS POSIBLES
 * ============================================================
 *
 * Elemento incorrecto:
 *
 * {
 *   success: false,
 *   message: "El elemento indicado no es un input de archivos."
 * }
 *
 * Sin archivo:
 *
 * {
 *   success: false,
 *   message: "No se seleccionó ningún documento."
 * }
 *
 * Formato incorrecto:
 *
 * {
 *   success: false,
 *   message: "El documento debe estar en formato JPG, PNG, WebP o PDF."
 * }
 *
 * Archivo demasiado pesado:
 *
 * {
 *   success: false,
 *   message: "El documento no puede superar 5 MB."
 * }
 *
 * Documento válido:
 *
 * {
 *   success: true,
 *   message: "El documento es válido."
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
 * - que el MIME esté dentro de los formatos permitidos;
 * - que el nombre del archivo generado sea seguro;
 * - que la ruta de almacenamiento sea segura;
 * - que el archivo no pueda ejecutarse como código;
 * - que el archivo se almacene fuera de ubicaciones ejecutables,
 *   cuando corresponda.
 *
 * IMPORTANTE PARA IMÁGENES
 *
 * Si el archivo es JPEG, PNG o WebP, el backend puede realizar
 * comprobaciones adicionales propias de imágenes, por ejemplo:
 *
 * - que pueda interpretarse realmente como imagen;
 * - dimensiones máximas;
 * - ancho y alto;
 * - formato real.
 *
 * IMPORTANTE PARA PDF
 *
 * Un PDF no debe validarse como si fuera una imagen.
 *
 * Las comprobaciones específicas de imágenes, como dimensiones
 * mediante getimagesize(), solamente deben ejecutarse cuando el MIME
 * detectado corresponda a una imagen.
 *
 * Para PDF debe verificarse específicamente:
 *
 * - que el MIME real sea application/pdf;
 * - que el tamaño esté permitido;
 * - que el archivo pueda ser tratado como PDF;
 * - que se almacene de manera segura.
 */

import type { FormResponse } from "../FormManager";

const allowedDocumentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

/**
 * Valida un documento cada vez que cambia el input.
 *
 * Permite imágenes JPEG, PNG y WebP, además de documentos PDF.
 *
 * Esta validación es solamente para mejorar la experiencia
 * del usuario. La validación definitiva debe hacerse en PHP.
 *
 * @param element Input de tipo file.
 * @param maxSizeBytes Tamaño máximo permitido en bytes.
 * @param onResponse Función que recibe el resultado.
 */
export function documentFilePolicy(
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

  element.accept = allowedDocumentTypes.join(",");

  element.addEventListener("change", () => {
    const file = element.files?.[0];

    if (!file) {
      onResponse({
        success: false,
        message: "No se seleccionó ningún documento.",
      });

      return;
    }

    if (!allowedDocumentTypes.includes(file.type)) {
      element.value = "";

      onResponse({
        success: false,
        message: "El documento debe estar en formato JPG, PNG, WebP o PDF.",
      });

      return;
    }

    if (file.size > maxSizeBytes) {
      element.value = "";

      const maxSizeMegabytes = maxSizeBytes / (1024 * 1024);

      onResponse({
        success: false,
        message: `El documento no puede superar ${maxSizeMegabytes} MB.`,
      });

      return;
    }

    onResponse({
      success: true,
      message: "El documento es válido.",
    });
  });
}
