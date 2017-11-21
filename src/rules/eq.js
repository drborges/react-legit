import validIf from "./validIf";

const eq = (expectedValue, hint = `not equal to ${expectedValue}`) =>
  validIf(value => value === expectedValue, hint);

export default eq;