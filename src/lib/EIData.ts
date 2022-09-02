const date: Date = new Date();
const fullDate = `${date.getFullYear()}-0${date.getMonth()}-15`;
export const url = `${import.meta.env.VITE_OG_URL}=${fullDate}`;

export const getAllData = async (url: RequestInfo | URL) => {
  const results: Object[] = [];
  while (url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    const { results, next } = await response.json();
    results.push(...results);
    url = next;
  }
  return results;
};
