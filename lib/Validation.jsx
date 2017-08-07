import React from "react"

const markAsValidationFailed = (child) => React.cloneElement(child, {
  className: `${child.props.className} validation-failed`
})

const bindValidationRules = (rules, trigger, onFailure, onSuccess) => (child) => React.cloneElement(child, {
  [trigger]: (event) => {
    rules.forEach((rule) => rule(event.target.value)
      .then(value => onSuccess({ [child.props.name]: value }))
      .catch(error => onFailure({ [child.props.name]: error }))
    )
  }
})

const Validation = ({ children, failed, rules, onFailure, onSuccess, trigger = "onChange" }) => {
  children = !failed ? children : React.Children.map(children, markAsValidationFailed)
  children = React.Children.map(children, bindValidationRules(rules, trigger, onFailure, onSuccess))

  return (
    <div className="Validation">{children}</div>
  )
}

export default Validation
