import React from "react";
import throttle from "./throttle";

import validate from "./validate";

class Validation extends React.Component {
  static defaultProps = {
    throttle: 0,
    disabled: false,
    trigger: "onChange",
    rules: [(event) => Promise.resolve(event)],
    tooltipEnabled: false,
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

  throttledValidate = throttle(value => {
    return validate(value, this.props.rules)
      .then(this.props.onSuccess)
      .catch(this.props.onFailure);
  }, this.props.throttle);

  withValidation = (element) => {
    return React.cloneElement(element, {
      ref: (elem) => this.element = elem,
      onInvalid: (event) => !this.props.enableTooltip && event.preventDefault(),
      [this.props.trigger]: (event) => {
        // Make sure existing trigger event handler isn't overriden.
        (element.props[this.props.trigger] || (() => {}))(event);

        this.props.onBegin(event.target);

        return this.throttledValidate(event.target.value)
          .then(() => {
            this.props.onEnd(event.target);
            return event.target;
          })
          .catch((error) => {
            this.props.onEnd(event.target);
            return event.target;
          });
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