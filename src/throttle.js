export const error = new Error("Promise was throttled");

const throttle = (fn, delay) => {
  let timeout;
  let previousReject;

  return (...args) => {
    if (timeout) {
      previousReject(error);
      clearTimeout(timeout);
    }

    return new Promise((resolve, reject) => {
      previousReject = reject;
      timeout = setTimeout(() => resolve(fn(...args)), delay);
    });
  }
}

export default throttle;