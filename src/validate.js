const setCustomValidity = (input) => (error) => {
  input.setCustomValidity(error);
  throw error;
};

const checkValidity = (input) => () => new Promise((resolve, reject) => {
  if (input.checkValidity()) {
    resolve(input.value);
  } else {
    reject(input.validationMessage);
  }
});

const apply = (input, rules) => {
  input.setCustomValidity("");
  return Promise.all(rules.map(rule => rule(input.value)));
};

const validate = (input, rules) => apply(input, rules)
  .catch(setCustomValidity(input))
  .then(checkValidity(input));

export default validate;