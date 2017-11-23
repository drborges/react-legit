import React from "react";

import throttle, { PROMISE_THROTTLED } from "./throttle";
import validate from "./validate";

class Validation extends React.Component {
  state = {};

  static defaultProps = {
    onStart: () => {},
    onFinish: () => {},
    onValid: () => {},
    onInvalid: () => {},
    refPropName: "ref",
    rules: [],
    throttle: 0,
    trigger: "onChange",
  }

  throttledValidate = throttle(validate, this.props.throttle);

  handleValidationFinish = (input) => {
    if (!this.state.dirty) {
      this.setState({ dirty: true });
    }

    return this.props.onFinish(input);
  }

  bindValidationApi = (input) => {
    const { rules, onStart, onValid, onValidate, onInvalid } = this.props;
    const validate = onValidate || this.throttledValidate;
    const self = this;

    input.validate = function() {
      return Promise.resolve()
        .then(() => onStart(input))
        .then(() => validate(input, rules))
        .then(() => onValid(input))
        .catch((e) => {
          if (e !== PROMISE_THROTTLED) {
            onInvalid(input);
            self.handleValidationFinish(input);
            throw input;
          }
        }).then(() => self.handleValidationFinish(input));
    };
  }

  componentDidMount() {
    this.bindValidationApi(this.inputRef);
  }

  handleValidation = (childEventHandler = () => {}) => (event) => {
    // prevents existing event handlers from being overriden
    childEventHandler(event);
    !event.target.validate && this.bindValidationApi(event.target);
    return event.target.validate();
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
      [trigger]: this.handleValidation(input.props[trigger]),
      [refPropName]: (target) => {
        this.inputRef = target;
        if (input.ref) {
          input.ref(target);
        }
      },
    });
  }
}

export default Validation;
