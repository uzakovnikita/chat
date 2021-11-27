const omit = <
  T extends { [key: string]: any },
  R extends string | string[],
  K extends R extends string ? Omit<T, R> : Record<string, any>
>(
  object: T,
  prop: R | string[]
): K => {
  const keys = Object.keys(object);
  const currentProp = Array.isArray(prop) ? prop[0] : prop;

  return keys.reduce((acc, key) => {
    if (key !== currentProp) {
      acc[key] = object[key];

      return acc;
    }
    if (prop.length === 1) {
      return acc;
    }
    acc[key] = omit(object[key], prop.slice(1));

    return acc;
  }, {} as Record<string, any>) as K;
};

export default omit;
