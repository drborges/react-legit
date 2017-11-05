import React from "react";

import validate from "./validate";

class Validation extends React.Component {
  static defaultProps = {
    onFinish: () => {},
    onValid: () => {},
    onInvalid: () => {},
    inputRef: () => {},
    rules: [],
    trigger: "onChange",
  }

  componentDidMount() {
    const { rules } = this.props;
    const { handleValidInput, handleInvalidInput } = this;

    this.props.inputRef(this.input);
    this.input.validate = function(input = this) {
      return validate(input, rules)
        .then(handleValidInput)
        .catch(handleInvalidInput);
    }
  }

  handleValidInput = (value) => {
    this.props.onValid(value);
    this.props.onFinish();
    return value;
  }

  handleInvalidInput = (hint) => {
    this.props.onInvalid(hint);
    this.props.onFinish();
    return hint;
  }

  handleValidation = (childEventHandler) => (event) => {
    // prevents existing event handlers from being overriden
    childEventHandler && childEventHandler(event);
    return this.input.validate(event.target);
  }

  render() {
    const { children, inputRef, onFinish, onValid, ...props } = this.props;
    return React.Children.map(children, (child) => React.cloneElement(child, {
      ...props,
      [this.props.trigger]: this.handleValidation(child.props[this.props.trigger]),
      ref: (target) => this.input = target,
    }));
  }
}

export default Validation;