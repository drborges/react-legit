import { expect } from "chai";
import eq from "./eq";

describe("eq", () => {
  const validate = eq(2);

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
        expect(hint).to.eq("'1' is not equal to '2'");
      });
    });

    it("customizes hint message", () => {
      const hint = (value) => `'${value}' is not '2'`;
      return eq(2, hint)(1).catch(hint => {
        expect(hint).to.eq("'1' is not '2'");
      });
    });
  });
});
