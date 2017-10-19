import React from "react";
import ReactDOM from "react-dom";
import throttle from "./throttle";

import validate from "./validate";

class Validation extends React.Component {
  static defaultProps = {
    eager: false,
    throttle: 0,
    disabled: false,
    trigger: "onChange",
    rules: [(event) => Promise.resolve(event)],
    enableTooltip: false,
    onFailure: () => {},
    onSuccess: () => {},
    onBegin: () => {},
    onEnd: () => {},
  }

  validatable = (type) => [
    "input",
    "select",
    "textarea",
  ].indexOf(type) >= 0;

  throttledValidate = throttle((target) => {
    return validate(target, this.props.rules)
      .then(this.props.onSuccess)
      .catch(this.props.onFailure);
  }, this.props.throttle);

  begin = (target) => {
    this.props.onBegin(target);
  }

  end = (target) => () => {
    this.props.onEnd(target);
    return target;
  }

  performValidation = (target) => {
    this.begin(target);
    return this.throttledValidate(target)
      .then(this.end(target))
      .catch(this.end(target));
  }

  withValidation = (element) => {
    return React.cloneElement(element, {
      ref: (target) => this.target = target,
      onInvalid: (event) => !this.props.enableTooltip && event.preventDefault(),
      [this.props.trigger]: (event) => {
        // Make sure existing trigger event handler isn't overriden.
        (element.props[this.props.trigger] || (() => {}))(event);
        return this.performValidation(event.target);
      },
    });
  }

  componentDidMount() {
    if (!this.props.disabled && this.props.eager && this.target) {
      this.performValidation(this.target);
    }
  }

  render() {
    const children = this.props.disabled ? this.props.children : React.Children.map(this.props.children, (child) =>
      this.validatable(child.type) ?
      this.withValidation(child) :
      child
    );

    return (
      <span>{children}</span>
    );
  }
}

export default Validation;