const date: Date = new Date();
const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-15`;

export const url = `${import.meta.env.VITE_URL_LGH}=${fullDate}`;

export const getAllData = async (url: RequestInfo | URL) => {
  let result: Object[] = [];
  while (url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    const { results, next } = await response.json();
    result.push(...results);
    url = next;
  }
  return result;
};
