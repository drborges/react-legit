import sinon from "sinon";
import validIf from "./rules/validIf";

const createFakeInput = (props) => ({
  ...props,
  checkValidity: function() { return this.validationMessage === "" },
  setCustomValidity: function(error) { this.validationMessage = error },
});

const isEven = validIf(value => value % 2 === 0, (value) => `'${value}' must be an even number`);
const nonZero = validIf(value => value !== 0, (value) => "Cannot be zero");
const wait = (delay) => new Promise(resolve => setTimeout(resolve, delay));
const delayedRule = (delay) => (event) => wait(delay);

export {
  createFakeInput,
  nonZero,
  isEven,
  wait,
  delayedRule,
}
