import React from "react"
import Validate from "./Validate"
import ValidationGroup from "./ValidationGroup"

import { validationCssMapping } from "./helpers"

const noop = () => {}

export default class Form extends React.PureComponent {
  static ValidationGroup = ValidationGroup
  static Validate = Validate
  static defaultProps = {
    onGroupValid: noop,
    onGroupInvalid: noop,
    onInputValid: noop,
    onInputInvalid: noop
  }

  static childContextTypes = {
    onInputValid: React.PropTypes.func,
    onInputInvalid: React.PropTypes.func,
    onGroupValid: React.PropTypes.func,
    onGroupInvalid: React.PropTypes.func,
  }

  getChildContext() {
    return {
      onInputValid: this.props.onInputValid,
      onInputInvalid: this.props.onInputInvalid,
      onGroupValid: this.props.onGroupValid,
      onGroupInvalid: this.props.onGroupInvalid,
    }
  }

  render() {
    const {
      children,
      onInputValid,
      onInputInvalid,
      onGroupValid,
      onGroupInvalid,
      ...props
    } = this.props
    return <form {...props}>{children}</form>
  }
}
