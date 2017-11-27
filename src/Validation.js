import React from "react";

import throttle, { PROMISE_THROTTLED } from "./throttle";
import validate from "./validate";

const noop = () => {};
const fncompose = (fn1 = noop, fn2 = noop) => (event) => {
  fn1(event);
  return fn2(event);
};

class Validation extends React.Component {
  state = {};

  static defaultProps = {
    onStart: noop,
    onFinish: noop,
    onValid: noop,
    onInvalid: noop,
    refPropName: "ref",
    rules: [],
    throttle: 0,
    trigger: "onChange",
  };

  throttledValidate = throttle(validate, this.props.throttle);

  handleValidationFinish = (input) => {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }

    return this.props.onFinish(input);
  };

  bindValidationApi = (input) => {
    const { rules, onStart, onValid, onValidate, onInvalid } = this.props;
    const validate = onValidate || this.throttledValidate;
    const self = this;

    input.validate = function() {
      return Promise.resolve()
        .then(() => onStart(input))
        .then(() => validate(input, rules))
        .then(() => onValid(input))
        .catch(e => (e !== PROMISE_THROTTLED) && onInvalid(input))
        .then(() => self.handleValidationFinish(input));
    };
  };

  handleValidation = (event) => {
    return event.target.validate();
  };

  componentDidMount() {
    this.bindValidationApi(this.inputRef);
  }

  render() {
    const {
      children,
      onStart,
      onFinish,
      onValid,
      onValidate,
      onInvalid,
      refPropName,
      rules,
      throttle,
      trigger,
      ...props,
    } = this.props;

    const dirtyClass = this.state.dirty ? "dirty" : "";
    const input = React.Children.only(children);

    return React.cloneElement(input, {
      ...props,
      className: `${dirtyClass} ${input.props.className || ""}`.trim(),
      [trigger]: fncompose(input.props[trigger], this.handleValidation),
      [refPropName]: (target) => {
        this.inputRef = target;
        input.ref && input.ref(target);
      },
    });
  }
}

export default Validation;
