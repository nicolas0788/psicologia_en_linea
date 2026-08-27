/**
 * RADIO CONTROLLED ELEMENTS ACTION
 *
 * Controla la visibilidad y obligatoriedad de distintos contenedores
 * mediante un grupo de inputs radio.
 *
 * REQUISITOS DEL HTML
 *
 * 1. Los radios deben estar dentro de un mismo contenedor, normalmente
 *    un fieldset.
 *
 * 2. Cada radio debe tener un atributo aria-controls.
 *
 * 3. El valor de aria-controls debe coincidir exactamente con el id
 *    del contenedor relacionado.
 *
 * 4. Uno de los radios debe comenzar seleccionado mediante checked.
 *
 * 5. El contenedor inicialmente inactivo debe tener hidden y sus
 *    controles deben comenzar con disabled.
 *
 * EJEMPLO HTML
 *
 * <fieldset id="document-type-options">
 *   <legend>Tipo de documento</legend>
 *
 *   <label>
 *     <input
 *       type="radio"
 *       name="document_type"
 *       value="dni"
 *       aria-controls="dni-fields"
 *       checked
 *       required
 *     />
 *
 *     DNI
 *   </label>
 *
 *   <label>
 *     <input
 *       type="radio"
 *       name="document_type"
 *       value="passport"
 *       aria-controls="passport-fields"
 *       required
 *     />
 *
 *     Pasaporte
 *   </label>
 * </fieldset>
 *
 * <div id="dni-fields">
 *   <input
 *     type="file"
 *     name="dni_front"
 *     required
 *   />
 *
 *   <input
 *     type="file"
 *     name="dni_back"
 *     required
 *   />
 * </div>
 *
 * <div id="passport-fields" hidden>
 *   <input
 *     type="file"
 *     name="passport"
 *     disabled
 *   />
 * </div>
 *
 * USO
 *
 * const documentTypeOptions =
 *   formManager.registerElement(
 *     "#document-type-options",
 *   );
 *
 * if (documentTypeOptions) {
 *   radioControlledElementsAction(
 *     documentTypeOptions,
 *   );
 * }
 *
 * FUNCIONAMIENTO
 *
 * Al inicializarse:
 *
 * - detecta el radio que contiene checked;
 * - muestra y activa su contenedor;
 * - aplica required a sus input, select y textarea;
 * - oculta los demás contenedores;
 * - elimina required de sus controles;
 * - desactiva sus controles.
 *
 * Después escucha automáticamente el evento change y actualiza todos
 * los contenedores cada vez que cambia la opción seleccionada.
 *
 * No es necesario agregar manualmente otro addEventListener:
 *
 * // Incorrecto:
 * radioGroup.addEventListener("change", () => {
 *   radioControlledElementsAction(radioGroup);
 * });
 *
 * // Correcto:
 * radioControlledElementsAction(radioGroup);
 *
 * IMPORTANTE
 *
 * Todos los input, select y textarea del contenedor seleccionado pasan
 * a ser obligatorios. Esta action está pensada para situaciones donde
 * todos los controles del contenedor activo deben completarse.
 */

import { logger } from "../../logger/Logger";

import {
  activateElementAction,
  deactivateElementAction,
} from "./deactivateElementAction";

import {
  addRequiredAction,
  removeRequiredAction,
} from "./RequiredHTMLElementAction";

import type { RequiredHTMLElement } from "./RequiredHTMLElementAction";

function getRequiredElements(container: HTMLElement): RequiredHTMLElement[] {
  return Array.from(
    container.querySelectorAll<RequiredHTMLElement>("input, select, textarea"),
  );
}

/**
 * Controla contenedores mediante un grupo de radios.
 *
 * Cada radio debe tener un atributo aria-controls cuyo valor
 * coincida con el id del contenedor que controla.
 *
 * El contenedor correspondiente al radio seleccionado:
 * - se muestra;
 * - se activa;
 * - convierte sus controles en obligatorios.
 *
 * Los demás contenedores:
 * - dejan de ser obligatorios;
 * - se desactivan;
 * - se ocultan.
 *
 * La acción también sincroniza el estado inicial.
 */
export function radioControlledElementsAction(radioGroup: HTMLElement): void {
  const radios = Array.from(
    radioGroup.querySelectorAll<HTMLInputElement>(
      'input[type="radio"][aria-controls]',
    ),
  );

  if (radios.length === 0) {
    logger.warn("No se encontraron radios con aria-controls.");

    return;
  }

  const controlledElements = radios.map((radio) => {
    const controlledId = radio.getAttribute("aria-controls")?.trim();

    if (!controlledId) {
      logger.warn("Se encontró un radio sin aria-controls válido.");

      return null;
    }

    const container = document.getElementById(controlledId);

    if (!(container instanceof HTMLElement)) {
      logger.warn(`No se encontró el elemento controlado "${controlledId}".`);

      return null;
    }

    return {
      radio,
      container,
    };
  });

  if (controlledElements.some((item) => item === null)) {
    logger.warn("No se pudo inicializar el control de elementos por radio.");

    return;
  }

  const validControlledElements = controlledElements.filter(
    (
      item,
    ): item is {
      radio: HTMLInputElement;
      container: HTMLElement;
    } => item !== null,
  );

  const updateElements = (): void => {
    const selectedRadio = radios.find((radio) => radio.checked);

    if (!selectedRadio) {
      logger.warn("No hay ningún radio seleccionado.");

      return;
    }

    for (const { radio, container } of validControlledElements) {
      const requiredElements = getRequiredElements(container);

      if (radio === selectedRadio) {
        activateElementAction(container);

        for (const element of requiredElements) {
          addRequiredAction(element);
        }

        continue;
      }

      for (const element of requiredElements) {
        removeRequiredAction(element);
      }

      deactivateElementAction(container);
    }
  };

  radioGroup.addEventListener("change", updateElements);

  /*
   * Sincroniza los contenedores con el radio que comienza
   * seleccionado mediante checked.
   */
  updateElements();

  logger.debug("Control de elementos por radio inicializado.");
}
