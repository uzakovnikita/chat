type valueOrNest<T, K> =
  | T
  | K
  | { [key: string]: valueOrNest<T, K> }
  | valueOrNest<T, K>[];

const cloneDeep = <T extends valueOrNest<string, number>>(obj: T): T => {
  if (Array.isArray(obj)) {
    const result = obj.map((val) => {
      if (typeof val === "object") {
        return cloneDeep(val);
      }
      return val;
    });
    return result as T;
  }
  if (typeof obj === "object") {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    return values.reduce((acc, val, index) => {
      const currentKey = keys[index];
      if (typeof val === "object") {
        acc[currentKey] = cloneDeep(val);
        return acc;
      }
      acc[currentKey] = val;
      return acc;
    }, {} as Record<string, any>) as T;
  }
  return obj;
};

export default cloneDeep;
