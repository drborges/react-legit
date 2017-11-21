const validIf = (predicate, hint = "does not match predicate") => (value) => new Promise((resolve, reject) => {
  if (predicate(value)) {
    resolve(value);
  } else {
    reject(hint);
  }
});

export default validIf;