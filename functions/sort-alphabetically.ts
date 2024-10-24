export const sortAlphabetically = (a: string, b: string) => {
  return a.localeCompare(b, 'en', { sensitivity: 'base', numeric: true });
};
