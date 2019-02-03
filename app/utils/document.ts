import document from "document";

export const getElementById = (id: string) => {
  const element = document.getElementById(id);
  if (!element) {
    throw Error(`Element #${id} not found`);
  }

  return element;
};
