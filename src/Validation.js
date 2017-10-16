import React from "react";
import throttle from "./throttle";

import validate from "./validate";

class Validation extends React.Component {
  static defaultProps = {
    throttle: 0,
    trigger: "onChange",
    rules: [(event) => Promise.resolve(event)],
    tooltipEnabled: false,
    onFailure: () => {},
    onSuccess: () => {},
  }

  validatable = (type) => [
    "input",
    "select",
    "textarea",
  ].indexOf(type) >= 0;

  throttledValidate = throttle((event) => {
    return validate(event, this.props.rules)
      .then(this.props.onSuccess)
      .catch(this.props.onFailure);
  }, this.props.throttle);

  withValidation = (element) => {
    return React.cloneElement(element, {
      onInvalid: (event) => !this.props.enableTooltip && event.preventDefault(),
      [this.props.trigger]: (event) => {
        event.persist();
        return this.throttledValidate(event)
      },
    });
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