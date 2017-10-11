const setCustomValidity = (event) => (error) => {
  event.target.setCustomValidity(error);
  return event;
};

const checkValidity = (event) => () => new Promise((resolve, reject) => {
  if (event.target.checkValidity()) {
    resolve(event);
  } else {
    reject(event);
  }
});

const apply = (event, rules) => {
  event.target.setCustomValidity("");
  return Promise.all(rules.map(rule => rule(event)));
};

const validate = (event, rules) => apply(event, rules)
  .catch(setCustomValidity(event))
  .then(checkValidity(event));

export default validate;