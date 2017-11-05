const throttle = (fn, delay) => {
  let timeout;
  let previousReject;

  return (...args) => {
    if (timeout) {
      previousReject();
      clearTimeout(timeout);
    }

    return new Promise((resolve, reject) => {
      previousReject = reject;
      timeout = setTimeout(() => resolve(fn(...args)), delay);
    });
  }
}

export default throttle;