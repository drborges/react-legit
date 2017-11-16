import throttle, { PROMISE_THROTTLED } from "./throttle";

describe("throttle", () => {
  it("throttles function to a given delay", () => {
    const throttledSum = throttle((a, b) => a + b, 100);

    const sumResult1 = throttledSum(1, 1);
    const sumResult2 = throttledSum(2, 2);

    return sumResult1.catch(error => {
      expect(error).toEqual(PROMISE_THROTTLED);
      return sumResult2.then(sum => {
        expect(sum).toEqual(4);
      });
    });
  });
});