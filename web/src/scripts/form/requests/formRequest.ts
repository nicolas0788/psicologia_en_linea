import type { ApiRequestConfig } from "../types";

export function createFormRequest(
  form: HTMLFormElement,
  url: string,
): ApiRequestConfig {
  return {
    method: "POST",
    url,
    body: new FormData(form),
  };
}
