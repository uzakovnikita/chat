import omit from "./omit";

describe("Test utils: omit", () => {
  const object = { a: 1, b: 2, c: 3, d: 4 };
  const nested = { a: 1, b: { c: 2, d: 3 } };
  it("Should work with single property", () => {
    const expected = { b: 2, c: 3, d: 4 };
    const expectedNest = { b: { c: 2, d: 3 } };
    const result = omit(object, "a");
    const resultNest = omit(nested, "a");
    expect(result).toEqual(expected);
    expect(resultNest).toEqual(expectedNest);
  });
  it("Should support deep omit", () => {
    const result = omit(nested, ["b", "c"]);
    const expected = { a: 1, b: { d: 3 } };
    expect(result).toEqual(expected);

    const result2 = omit(nested, ["b", "d"]);
    const expected2 = { a: 1, b: { c: 2 } };
    expect(result2).toEqual(expected2);
  });
});
