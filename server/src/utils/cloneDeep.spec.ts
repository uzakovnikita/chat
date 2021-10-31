import cloneDeep from "./cloneDeep";

type ValueOrArray<T> = T | ValueOrArray<T>[];

describe("Test utils: cloneDeep", () => {
  it("Should work with flat array", () => {
    const arr1 = [1, 2, 3];
    const clonedArr = cloneDeep(arr1);
    const expected = [1, 2, 3];
    arr1.push(4);
    expect(clonedArr).toEqual(expected);
  });
  it("Should work with nested array", () => {
    const arr1: ValueOrArray<number> = [1, [2, [3]]];
    const clonedArr = cloneDeep(arr1);
    const expected = [1, [2, [3]]];
    if (Array.isArray(arr1[1])) {
      arr1[1].push(4);
    }
    expect(clonedArr).toEqual(expected);
  });
  it("Should work with flat object", () => {
    const obj1 = { a: "b", c: "d" };
    const clonedObj = cloneDeep(obj1);
    const expected = { a: "b", c: "d" };
    obj1.a = "c";
    expect(clonedObj).toEqual(expected);
  });
  it("Should work with nested object", () => {
    const obj1 = { a: { b: { c: "d" } } };
    const clonedObj = cloneDeep(obj1);
    const expected = { a: { b: { c: "d" } } };
    obj1.a.b.c = "f";
    expect(clonedObj).toEqual(expected);
  });
  it("Should work with array and object", () => {
    const obj1 = {
      a: [1, 2, { b: "d" }],
    };
    const clonedObj = cloneDeep(obj1);
    const expected = {
      a: [1, 2, { b: "d" }],
    };
    if (typeof obj1.a[2] === "object" && "b" in obj1.a[2]) {
      obj1.a[2].b = "c";
    }
    expect(clonedObj).toEqual(expected);
  });
});
