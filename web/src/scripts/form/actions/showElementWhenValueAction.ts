/**
 * SHOW ELEMENT WHEN VALUE ACTION
 *
 * Muestra u oculta un elemento según el value seleccionado en:
 *
 * - un select;
 * - un grupo de radios;
 * - un grupo de checkboxes;
 * - un radio o checkbox individual.
 *
 * Cuando coincide alguno de los values configurados:
 *
 * - muestra el elemento controlado;
 * - habilita sus controles;
 * - opcionalmente agrega required.
 *
 * Cuando ningún value coincide:
 *
 * - elimina required;
 * - deshabilita los controles;
 * - oculta el elemento.
 *
 * La action registra internamente el evento change y sincroniza
 * automáticamente el estado inicial. No debe llamarse dentro de
 * otro addEventListener.
 *
 * ============================================================
 * HTML CON RADIOS
 * ============================================================
 *
 * <fieldset id="modality-options">
 *   <legend>Modalidad</legend>
 *
 *   <label>
 *     <input
 *       type="radio"
 *       name="modality"
 *       value="Virtual"
 *       checked
 *       required
 *     />
 *     Virtual
 *   </label>
 *
 *   <label>
 *     <input
 *       type="radio"
 *       name="modality"
 *       value="Presencial"
 *       required
 *     />
 *     Presencial
 *   </label>
 *
 *   <label>
 *     <input
 *       type="radio"
 *       name="modality"
 *       value="Indistinto"
 *       required
 *     />
 *     Indistinto
 *   </label>
 * </fieldset>
 *
 * <div id="location-field" hidden>
 *   <label for="location-input">
 *     Zona de referencia
 *   </label>
 *
 *   <input
 *     id="location-input"
 *     type="text"
 *     name="location"
 *     disabled
 *   />
 * </div>
 *
 * IMPORTANTE:
 *
 * El elemento inicialmente oculto debe tener hidden y sus controles
 * deben comenzar con disabled.
 *
 * Si alguna clase CSS aplica display al elemento controlado, se debe
 * conservar el funcionamiento de hidden:
 *
 * [hidden] {
 *   display: none !important;
 * }
 *
 * ============================================================
 * USO CON UN ÚNICO VALUE
 * ============================================================
 *
 * const modality =
 *   formManager.registerElement(
 *     "#modality-options",
 *   );
 *
 * const locationField =
 *   formManager.registerElement(
 *     "#location-field",
 *   );
 *
 * if (modality && locationField) {
 *   showElementWhenValueAction(
 *     modality,
 *     "Presencial",
 *     locationField,
 *     true,
 *   );
 * }
 *
 * En este caso, locationField solamente aparece cuando el value
 * seleccionado es exactamente "Presencial".
 *
 * ============================================================
 * USO CON VARIOS VALUES
 * ============================================================
 *
 * if (modality && locationField) {
 *   showElementWhenValueAction(
 *     modality,
 *     [
 *       "Presencial",
 *       "Indistinto",
 *     ],
 *     locationField,
 *     true,
 *   );
 * }
 *
 * En este caso, locationField aparece al seleccionar "Presencial"
 * o "Indistinto".
 *
 * ============================================================
 * CAMPO OPCIONAL
 * ============================================================
 *
 * Para mostrar el campo sin volverlo obligatorio:
 *
 * showElementWhenValueAction(
 *   modality,
 *   "Presencial",
 *   locationField,
 *   false,
 * );
 *
 * El último parámetro indica:
 *
 * - true: aplica required cuando el campo está visible.
 * - false: mantiene el campo opcional.
 *
 * ============================================================
 * HTML CON SELECT
 * ============================================================
 *
 * <select id="reason-options" name="reason">
 *   <option value="Consulta">Consulta</option>
 *   <option value="Presupuesto">Presupuesto</option>
 *   <option value="Otro">Otro</option>
 * </select>
 *
 * <div id="other-reason-field" hidden>
 *   <label for="other-reason-input">
 *     Especificá el motivo
 *   </label>
 *
 *   <input
 *     id="other-reason-input"
 *     type="text"
 *     name="other_reason"
 *     disabled
 *   />
 * </div>
 *
 * const reasonOptions =
 *   formManager.registerElement(
 *     "#reason-options",
 *   );
 *
 * const otherReasonField =
 *   formManager.registerElement(
 *     "#other-reason-field",
 *   );
 *
 * if (reasonOptions && otherReasonField) {
 *   showElementWhenValueAction(
 *     reasonOptions,
 *     "Otro",
 *     otherReasonField,
 *     true,
 *   );
 * }
 *
 * ============================================================
 * USO INCORRECTO
 * ============================================================
 *
 * optionsElement.addEventListener("change", () => {
 *   showElementWhenValueAction(...);
 * });
 *
 * Esto agregaría un listener nuevo en cada change.
 *
 * La forma correcta es llamarla una sola vez:
 *
 * showElementWhenValueAction(...);
 *
 * Los values se comparan exactamente. Se distinguen mayúsculas,
 * minúsculas, espacios internos y acentos.
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

type ExpectedValue = string | readonly string[];

function supportsRequired(
  element: HTMLElement,
): element is RequiredHTMLElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  );
}

function getRequiredElements(element: HTMLElement): RequiredHTMLElement[] {
  const controls: RequiredHTMLElement[] = [];

  if (supportsRequired(element)) {
    controls.push(element);
  }

  controls.push(
    ...element.querySelectorAll<RequiredHTMLElement>("input, select, textarea"),
  );

  return controls;
}

/**
 * Devuelve los valores seleccionados de un select,
 * grupo de radios o grupo de checkboxes.
 */
function getSelectedValues(optionsElement: HTMLElement): string[] {
  if (optionsElement instanceof HTMLSelectElement) {
    return Array.from(optionsElement.selectedOptions, (option) => option.value);
  }

  if (optionsElement instanceof HTMLInputElement) {
    if (optionsElement.type === "radio" || optionsElement.type === "checkbox") {
      return optionsElement.checked ? [optionsElement.value] : [];
    }

    return [optionsElement.value];
  }

  const selectedInputs = optionsElement.querySelectorAll<HTMLInputElement>(
    'input[type="radio"]:checked, input[type="checkbox"]:checked',
  );

  return Array.from(selectedInputs, (input) => input.value);
}

/**
 * Normaliza un único value o una lista de values.
 */
function normalizeExpectedValues(expectedValue: ExpectedValue): Set<string> {
  const values = Array.isArray(expectedValue) ? expectedValue : [expectedValue];

  return new Set(values.map((value) => value.trim()).filter(Boolean));
}

/**
 * Muestra un elemento cuando alguno de los values configurados
 * se encuentra seleccionado.
 *
 * @param optionsElement
 * Select, radio, checkbox o contenedor de opciones.
 *
 * @param expectedValue
 * Un value o una lista de values que muestran el elemento.
 *
 * @param controlledElement
 * Elemento que se muestra u oculta.
 *
 * @param required
 * Indica si sus controles deben ser obligatorios cuando
 * estén visibles. Por defecto: false.
 */
export function showElementWhenValueAction(
  optionsElement: HTMLElement,
  expectedValue: ExpectedValue,
  controlledElement: HTMLElement,
  required = false,
): void {
  const expectedValues = normalizeExpectedValues(expectedValue);

  if (expectedValues.size === 0) {
    logger.warn(
      "No se configuraron values válidos para controlar el elemento.",
    );

    return;
  }

  const requiredElements = getRequiredElements(controlledElement);

  const updateElement = (): void => {
    const selectedValues = getSelectedValues(optionsElement);

    const shouldShow = selectedValues.some((value) =>
      expectedValues.has(value),
    );

    if (shouldShow) {
      activateElementAction(controlledElement);

      for (const element of requiredElements) {
        if (required) {
          addRequiredAction(element);
        } else {
          removeRequiredAction(element);
        }
      }

      return;
    }

    for (const element of requiredElements) {
      removeRequiredAction(element);
    }

    deactivateElementAction(controlledElement);
  };

  optionsElement.addEventListener("change", updateElement);

  updateElement();

  logger.debug("Control condicional por value inicializado.");
}
