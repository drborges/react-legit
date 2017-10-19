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

const nonZero = (event) => new Promise((resolve, reject) => {
  if (event.target.value !== 0) {
    resolve(event);
  } else {
    reject("Cannot be zero");
  }
});

const isEven = (event) => new Promise((resolve, reject) => {
  if (event.target.value % 2 === 0) {
    resolve(event);
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