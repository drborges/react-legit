const validIf = (predicate, hint = (value) => `'${value}' does not match predicate`) => (value) => new Promise((resolve, reject) => {
  if (predicate(value)) {
    resolve(value);
  } else {
    reject(hint(value));
  }
});

export default validIf;
