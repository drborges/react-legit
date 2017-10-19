import validate from "./validate";

import { createEvent, nonZero, isEven } from "./fixtures";

describe("validate", () => {
  it("resolves validation when all rules are resolved", () => {
    const event = createEvent({ target: { value: 2 } });

    return validate(event.target, [nonZero, isEven]).then(target => {
      expect(target).toEqual(event.target);
    });
  });

  it("rejects validation when at least one rule is rejected", () => {
    const event = createEvent({ target: { value: 1 } });

    return validate(event.target, [nonZero, isEven]).catch(target => {
      expect(target.validationMessage).toEqual("Must be an even number");
    });
  });
});