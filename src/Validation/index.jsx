import React from "react";

import throttle, { error } from "../throttle";
import validate from "../validate";

const validatable = (type) => [
  "input",
  "select",
  "textarea",
].indexOf(type) >= 0;

class Validation extends React.Component {
  static defaultProps = {
    onStart: () => {},
    onFinish: () => {},
    onValid: () => {},
    onInvalid: () => {},
    inputRef: () => {},
    inputRefs: () => {},
    rules: [],
    throttle: 0,
    trigger: "onChange",
  }

  inputRefs = [];

  throttledValidate = throttle(validate, this.props.throttle);

  bindValidationApi = (input) => {
    const { rules, onStart, onFinish, onValid, onInvalid } = this.props;
    const { throttledValidate } = this;

    input.validate = function() {
      return Promise.resolve()
        .then(() => onStart(input))
        .then(() => throttledValidate(input, rules))
        .then(() => onValid(input))
        .catch((e) => (e !== error) && onInvalid(input))
        .then(() => onFinish(input));
    };
  }

  componentDidMount() {
    this.props.inputRef(this.inputRefs[0]);
    this.props.inputRefs(this.inputRefs);
    this.inputRefs.forEach(inputRef => this.bindValidationApi(inputRef));
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
      inputRef,
      inputRefs,
      onStart,
      onFinish,
      onValid,
      onInvalid,
      rules,
      throttle,
      trigger,
      ...props,
    } = this.props;

    return React.Children.map(children, (child) => !validatable(child.type) ? child : React.cloneElement(child, {
      ...props,
      [this.props.trigger]: this.handleValidation(child.props[this.props.trigger]),
      ref: (target) => this.inputRefs.push(target),
    }));
  }
}

export default Validation;