import React from "react";

import throttle, { PROMISE_THROTTLED } from "../throttle";
import validate from "../validate";

class Validation extends React.Component {
  state = {};

  static defaultProps = {
    onStart: () => {},
    onFinish: () => {},
    onValid: () => {},
    onInvalid: () => {},
    include: [],
    inputRef: () => {},
    inputRefs: () => {},
    refPropName: "ref",
    rules: [],
    throttle: 0,
    trigger: "onChange",
  }

  validatables = [
    "input",
    "select",
    "textarea",
  ].concat(this.props.include);

  inputRefs = [];

  throttledValidate = throttle(validate, this.props.throttle);

  isValidatable = (type) => this.validatables.indexOf(type) >= 0;

  bindValidationApi = (input) => {
    const { rules, onStart, onFinish, onValid, onValidate, onInvalid } = this.props;
    const validate = onValidate || this.throttledValidate;
    const self = this;

    input.validate = function() {
      if (!self.state.dirty) {
        self.setState({ dirty: true });
      }

      return Promise.resolve()
        .then(() => onStart(input))
        .then(() => validate(input, rules))
        .then(() => onValid(input))
        .catch((e) => (e !== PROMISE_THROTTLED) && onInvalid(input))
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
      include,
      inputRef,
      inputRefs,
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

    return React.Children.map(children, (child) => !this.isValidatable(child.type) ? child : React.cloneElement(child, {
      ...props,
      className: `${dirtyClass} ${child.props.className || ""}`.trim(),
      [trigger]: this.handleValidation(child.props[trigger]),
      [refPropName]: (target) => this.inputRefs.push(target),
    }));
  }
}

export default Validation;