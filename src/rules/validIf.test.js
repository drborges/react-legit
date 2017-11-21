import validIf from "./validIf";

describe("validIf", () => {
  const validate = validIf(value => value === 2);

  describe("when value is valid", () => {
    it("resolves promise", () => {
      return validate(2).then(val => {
        expect(val).toEqual(2);
      });
    });
  });

  describe("when value is invalid", () => {
    it("resolves promise", () => {
      return validate(1).catch(hint => {
        expect(hint).toEqual("does not match predicate");
      });
    });

    it("customizes hint message", () => {
      return validIf(value => value === 2, "1 does not match 2")(1).catch(hint => {
        expect(hint).toEqual("1 does not match 2");
      });
    });
  });
});