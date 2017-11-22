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
        expect(hint).to.eq("not equal to 2");
      });
    });

    it("customizes hint message", () => {
      return eq(2, "1 is not 2")(1).catch(hint => {
        expect(hint).to.eq("1 is not 2");
      });
    });
  });
});
