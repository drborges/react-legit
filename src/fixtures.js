const createEvent = ({ target } = { target: {}}) => ({
  persist: jest.fn(),
  preventDefault: jest.fn(),
  target: {
    ...target,
    checkValidity: function() { return this.validationMessage === "" },
    setCustomValidity: function(error) { this.validationMessage = error },
  }
});

const validIf = (predicate, hint = "Validation failed predicate") => (value) => new Promise((resolve, reject) => {
  if (predicate(value)) {
    resolve(value);
  } else {
    reject(hint);
  }
})

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