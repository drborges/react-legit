# react-legit
A composable and component driven validation library for your forms :heart:

# Installation

npm install react-legit

# Usage

Validations in `react-legit` are nothing but regular components that hold the validation rules and automatically hooks itself up with the field being validated. The whole library is built on top of 2 main concepts:

  1. `Validation`: The React component used to wrap input fields with their corresponding validation rules.
  2. `Rule`: a function that implements a validation rule. This function takes the current input field's value as argument and return a *promise* which is either rejected in case of a validation failure or resolved in case of a successful resolution.

In case of a failure, the `onFailure` callback receives the validation result as argument represented by an object with the format of `{ <field's name>: <validation error message> }` and the `Validation` component will add to the corresponding input the css class `validation-failed` (will eventually be customizable so we can leverage Twitter Bootstrap's validation mechanism for example). Similarly, in case of a successful validation, the `onSuccess` callback receives an object in the format of `{ <field's name>: <field's value> }`

```js
import Validation from "react-legit"
import {required, minLength, email } from "react-legit/rules"

const handleSuccess = (result) => {
  console.log("Validation successed:", result)
  // Ex. { username: "John" }
}

const handleFailure = (result) => {
  console.log("Validation failed:", result)
  // Ex. { username: "This field is required" }
}

const App = () => (
  <Validation
    onFailure={handleFailure}
    onSuccess={handleSuccess}
    rules={[ required, minLength(3) ]}
    trigger="onBlur"
  >
    <input name="username" type="text" />
  </Validation>

  <Validation
    onFailure={handleFailure}
    onSuccess={handleSuccess}
    rules={[ required, email ]}
  >
    <input name="email" type="email" />
  </Validation>
)
```

# Composition = DRYer Code

Often times you will find yourself reusing the same validation rules throughout your application. Take the `email` field from the previous example for instance. In order to reduce boilerplate and centralize the email validation rules within a single component to ease maintenance, one may achieve that by creating a more specialized validation component, as follows:

```js
const EmailValidation = ({ children, ...props }) => (
  <Validation {...props} rules={[ required, email ]}>
    {children}
  </Validation>
)

<EmailValidation onFailure={handleFailure} onSuccess={handleSuccess}>
  <input name="email" type="email" />
</EmailValidation>
```

# Contributing

TODO
