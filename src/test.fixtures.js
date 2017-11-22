import sinon from "sinon";
import validIf from "./rules/validIf";

const createEvent = ({ target } = { target: {}}) => ({
  persist: sinon.spy(),
  preventDefault: sinon.spy(),
  target: {
    ...target,
    checkValidity: function() { return this.validationMessage === "" },
    setCustomValidity: function(error) { this.validationMessage = error },
  }
});

const isEven = validIf(value => value % 2 === 0, "Must be an even number");
const nonZero = validIf(value => value !== 0, "Cannot be zero");
const wait = (delay) => new Promise(resolve => setTimeout(resolve, delay));
const delayedRule = (delay) => (event) => wait(delay);

export {
  createEvent,
  validIf,
  nonZero,
  isEven,
  wait,
  delayedRule,
}
