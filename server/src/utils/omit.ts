type Primitive =
  | string
  | Function
  | number
  | boolean
  | Symbol
  | undefined
  | null;
type DeepOmitHelper<T, K extends keyof T> = {
  [P in K]: T[P] extends infer TP //extra level of indirection needed to trigger homomorhic behavior // distribute over unions
    ? TP extends Primitive
      ? TP // leave primitives and functions alone
      : TP extends any[]
      ? DeepOmitArray<TP, K> // Array special handling
      : DeepOmit<TP, K>
    : never;
};

type DeepOmit<T, K> = T extends Primitive
  ? T
  : DeepOmitHelper<T, Exclude<keyof T, K>>;

type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>;
};


const omit = <
  T extends { [key: string]: any },
  R extends string,
  K extends Omit<T, R>
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
