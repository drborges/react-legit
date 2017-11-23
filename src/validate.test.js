import { expect } from "chai";
import validate from "./validate";
import { createFakeInput, nonZero, isEven } from "./test.fixtures";

describe("validate", () => {
  it("resolves validation when all rules are resolved", () => {
    const input = createFakeInput({ value: 2 });

    return validate(input, [nonZero, isEven]).then(value => {
      expect(value).to.eq(2);
    });
  });

  it("rejects validation when at least one rule is rejected", () => {
    const input = createFakeInput({ value: 1 });

    return validate(input, [nonZero, isEven]).catch(hint => {
      expect(hint).to.eq("Must be an even number");
    });
  });
});
