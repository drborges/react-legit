# react-legit
A composable and component driven validation library for your forms :heart:

# Installation

npm install react-legit

# Usage

```js
import Validation from "react-legit"
import {required, minLength, email } from "react-legit/validators"

const handleSuccess = (result) => {
  console.log("Validation successed:", result)
  // Ex. { username: "John" }
}

const handleFailure = (result) => {
  console.log("Validation failed:", result)
  // Ex. { username: "This field is required" }
}

const App = () => (
  <Validation onFailure={handleFailure} onSuccess={handleSuccess} rules={[ required, minLength(3) ]} trigger="onBlur">
    <input name="username" type="text" />
  </Validation>

  <Validation onFailure={handleFailure} onSuccess={handleSuccess} rules={[ required, email ]} trigger="onChange">
    <input name="email" type="email" />
  </Validation>
)
```

# Contributing

TODO
