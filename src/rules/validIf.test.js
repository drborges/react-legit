import { expect } from "chai";
import validIf from "./validIf";

describe("validIf", () => {
  const validate = validIf(value => value === 2);

  describe("when value is valid", () => {
    it("resolves promise", () => {
      return validate(2).then(val => {
        expect(val).to.eq(2);
      });
    });
  });

  describe("when value is invalid", () => {
    it("resolves promise", () => {
      return validate(1).catch(hint => {
        expect(hint).to.eq("'1' does not match predicate");
      });
    });

    it("customizes hint message", () => {
      const hint = (value) => `'${value}' does not match '2'`;
      return validIf(value => value === 2, hint)(1).catch(hint => {
        expect(hint).to.eq("'1' does not match '2'");
      });
    });
  });
});
