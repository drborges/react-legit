import { expect } from "chai";
import validate from "./validate";
import { createEvent, nonZero, isEven } from "./test.fixtures";

describe("validate", () => {
  it("resolves validation when all rules are resolved", () => {
    const event = createEvent({ target: { value: 2 } });

    return validate(event.target, [nonZero, isEven]).then(value => {
      expect(value).to.eq(2);
    });
  });

  it("rejects validation when at least one rule is rejected", () => {
    const event = createEvent({ target: { value: 1 } });

    return validate(event.target, [nonZero, isEven]).catch(hint => {
      expect(hint).to.eq("Must be an even number");
    });
  });
});
