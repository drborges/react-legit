const setCustomValidity = (target) => (error) => {
  target.setCustomValidity(error);
  return target;
};

const checkValidity = (target) => () => new Promise((resolve, reject) => {
  if (target.checkValidity()) {
    resolve(target);
  } else {
    reject(target);
  }
});

const apply = (target, rules) => {
  target.setCustomValidity("");
  return Promise.all(rules.map(rule => rule(target)));
};

const validate = (target, rules) => apply(target, rules)
  .catch(setCustomValidity(target))
  .then(checkValidity(target));

export default validate;