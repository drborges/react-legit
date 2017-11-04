const createEvent = ({ target } = { target: {}}) => ({
  persist: jest.fn(),
  preventDefault: jest.fn(),
  target: {
    ...target,
    checkValidity: function() { return this.validationMessage === "" },
    setCustomValidity: function(error) { this.validationMessage = error },
  }
});

const wait = (delay) => new Promise(resolve => setTimeout(resolve, delay));
const delayedRule = (delay) => (event) => wait(delay);

const nonZero = (value) => new Promise((resolve, reject) => {
  if (value !== 0) {
    resolve(value);
  } else {
    reject("Cannot be zero");
  }
});

const isEven = (value) => new Promise((resolve, reject) => {
  if (value % 2 === 0) {
    resolve(value);
  } else {
    reject("Must be an even number");
  }
});

export {
  createEvent,
  nonZero,
  isEven,
  delayedRule,
}