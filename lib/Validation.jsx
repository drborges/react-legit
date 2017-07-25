import React from "react"

const markAsValidationFailed = (child) => React.cloneElement(child, {
  className: `${child.props.className} validation-failed`
})

const bindValidationRules = (rules, onFailure) => (child) => React.cloneElement(child, {
  onChange: (event) => {
    rules.forEach((rule) => {
      const error = rule(event.target.value)
      error && onFailure({ [child.props.name]: error })
    })
  }
})

const Validation = ({ children, failed, rules, onFailure }) => {
  children = !failed ? children : React.Children.map(children, markAsValidationFailed)
  children = React.Children.map(children, bindValidationRules(rules, onFailure))

  return (
    <div className="Validation">{children}</div>
  )
}

export default Validation
