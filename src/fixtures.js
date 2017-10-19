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
const delayedRule = (delay) => (target) => wait(delay);

const nonZero = (target) => new Promise((resolve, reject) => {
  if (target.value !== 0) {
    resolve(target);
  } else {
    reject("Cannot be zero");
  }
});

const isEven = (target) => new Promise((resolve, reject) => {
  if (target.value % 2 === 0) {
    resolve(target);
  } else {
    reject("Must be an even number");
  }
});

export {
  createEvent,
  nonZero,
  isEven,
  delayedRule,
  wait,
}