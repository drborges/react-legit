import validIf from "./validIf";

const eq = (expectedValue, hint = (value) => `'${value}' is not equal to '${expectedValue}'`) =>
  validIf(value => value === expectedValue, hint);

export default eq;
