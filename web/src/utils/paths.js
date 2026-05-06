export const base = import.meta.env.BASE_URL;

export const path = (url = "") => {
  return `${base}${url}`;
};
