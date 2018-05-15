import React from "react"
import { validationCssMapping } from "./helpers"

export default class ValidationGroup extends React.PureComponent {
  static contextTypes = {
    onGroupValid: React.PropTypes.func,
    onGroupInvalid: React.PropTypes.func,
    onInputValid: React.PropTypes.func,
    onInputInvalid: React.PropTypes.func
  }

  static childContextTypes = {
    onInputValid: React.PropTypes.func,
    onInputInvalid: React.PropTypes.func,
    registerWithGroup: React.PropTypes.func,
  }

  static defaultProps = {
    expectedValidInputs: 0
  }

  state = {
    valid: undefined,
    validations: {},
    expectedValidationsCount: 0
  }

  isValid = () => {
    const validationsCount = Object.values(this.state.validations).filter(valid => valid).length
    return validationsCount >= this.state.expectedValidationsCount
  }

  getChildContext() {
    return {
      registerWithGroup: validationId => {
        this.setState((state) => ({
          expectedValidationsCount: state.expectedValidationsCount + 1
        }))
      },
      onInputValid: input => {
        this.setState((state) => ({
            valid: this.isValid(),
            validations: {
              ...state.validations,
              [input.name]: true
            }
          }),
          () => {
            this.context.onInputValid(input)

            // trigger ValidationGroup valid only if all grouped inputs are valid
            if (this.state.valid) {
              this.context.onGroupValid(this.props.name)
            } else {
              this.context.onGroupInvalid(this.props.name)
            }
          }
        )
      },
      onInputInvalid: input => {
        this.setState((state) => ({
            valid: this.isValid(),
            validations: {
              ...state.validations,
              [input.name]: false
            }
          }),
          () => {
            this.context.onGroupInvalid(this.props.name)
            this.context.onInputInvalid(input)
          }
        )
      }
    }
  }

  render() {
    return (
      <div className={`validation-${validationCssMapping[this.state.valid]}`}>
        {this.props.children}
      </div>
    )
  }
}