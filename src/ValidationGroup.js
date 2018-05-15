import React from "react"
import { validationCssMapping } from "./helpers"

const isValid = (validations, expectedValidationsCount) => {
  const validationsCount = Object.values(validations).filter(valid => valid).length
  return validationsCount >= expectedValidationsCount
}

export default class ValidationGroup extends React.PureComponent {
  static contextTypes = {
    onInputValid: React.PropTypes.func,
    onInputInvalid: React.PropTypes.func,
    registerWithGroup: React.PropTypes.func,
  }

  static childContextTypes = {
    onInputValid: React.PropTypes.func,
    onInputInvalid: React.PropTypes.func,
    registerWithGroup: React.PropTypes.func,
  }

  static defaultProps = {
    propagate: false,
  }

  state = {
    valid: undefined,
    validations: {},
    expectedValidationsCount: 0
  }

  handleInputRegister = () => {
    this.setState((state) => ({
      expectedValidationsCount: state.expectedValidationsCount + 1
    }), () => {
      this.context.registerWithGroup && this.context.registerWithGroup()
    })
  }

  handleValidInput = input => {
    const validations = {...this.state.validations}
    validations[input.name] = true

    this.setState({
      validations: validations,
      valid: isValid(validations, this.state.expectedValidationsCount),
    }, () => {
      this.context.onInputValid && this.context.onInputValid(input)
    })
  }

  handleInvalidInput = input => {
    this.setState((state) => ({
      valid: false,
      validations: {
        ...state.validations,
        [input.name]: false
      }
    }), () => {
      this.context.onInputInvalid && this.context.onInputInvalid(input)
    })
  }

  getChildContext() {
    return {
      registerWithGroup: this.handleInputRegister,
      onInputValid: this.handleValidInput,
      onInputInvalid: this.handleInvalidInput,
    }
  }

  render() {
    const children = !this.props.propagate ? this.props.children : React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        valid: this.state.valid,
      })
    })

    return (
      <div className={`validation-${validationCssMapping[this.state.valid]}`}>
        {children}
      </div>
    )
  }
}