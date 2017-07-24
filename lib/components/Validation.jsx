import React from "react"

const markAsValidationFailed = (child) => React.cloneElement(child, {
  className: `${child.props.className} validation-failed`
})

const Validation = ({ children, failed }) => {
  children = !failed ? children : React.Children.map(children, markAsValidationFailed)

  return (
    <div>{children}</div>
  )
}

export default Validation
