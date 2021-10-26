export const genId = () =>
  (Date.now() * Math.random() * 1000 * Math.random() * 1000 + "").slice(8);
