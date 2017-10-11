import React from "react"
import ReactDOM from "react-dom"
import Validation from "./Validation"

import "./index.css"

const match = (value) => (event) => new Promise((resolve, reject) => {
  if (event.target.value === value) {
    resolve(event);
  } else {
    reject("Must match 'drborges.cic@gmail.com'");
  }
});

const inputValidation = (
  <form onInvalid={(event) => console.log("Form is invalid!")}>
    <Validation tooltipEnabled
        onSuccess={(event) => console.log("SUCCESS!", event)}
        onFailure={(event) => console.log(event.target.validationMessage) }
    >
      <input name="username" required pattern="\d{1,2}\D{3}" />
    </Validation>

    <Validation
        rules={[ match("drborges.cic@gmail.com") ]}
        onSuccess={(event) => console.log("SUCCESS!", event)}
        onFailure={(event) => console.log(event.target.validationMessage)}
    >
      <select name="email" required>
        <option />
        <option value="drborges.cic@gmail.com">{'drborges.cic@gmail.com'}</option>
        <option value="diego.borges@powerhrg.com">{'diego.borges@powerhrg.com'}</option>
      </select>
    </Validation>

    <button>Submit!</button>
  </form>
)

ReactDOM.render(
  <div>{inputValidation}</div>,
  document.getElementById("root"),
)