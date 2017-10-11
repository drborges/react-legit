import validate from "./validate";

import { createEvent, nonZero, isEven } from "./fixtures";

describe("validate", () => {
  it("resolves validation when all rules are resolved", () => {
    const event = createEvent({ target: { value: 2 } });

    return validate(event, [nonZero, isEven]).then(e => {
      expect(e).toEqual(event);
    });
  });

  it("rejects validation when at least one rule is rejected", () => {
    const event = createEvent({ target: { value: 1 } });

    return validate(event, [nonZero, isEven]).catch(event => {
      expect(event.target.validationMessage).toEqual("Must be an even number");
    });
  });
});