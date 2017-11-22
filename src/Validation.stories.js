import React from "react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Validation from "../lib";

export const html5RequiredInput = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="username">* Username: </label>
    <input id="username" type="text" required />
  </Validation>
);

export const html5RequiredInputCheckbox = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="username">* Username: </label>
    <input type="checkbox" name="username" value="1" required />drborges
    <input type="checkbox" name="username" value="2" required />diego
    <input type="checkbox" name="username" value="3" required />borges
  </Validation>
);

export const html5RequiredInputRadio = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="username">* Username: </label>
    <input type="radio" name="username" value="1" required />drborges
    <input type="radio" name="username" value="2" required />diego
    <input type="radio" name="username" value="3" required />borges
  </Validation>
);

export const html5RequiredSelect = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="username">* Username: </label>
    <select required>
      <option />
      <option value="1">drborges</option>
      <option value="2">diego</option>
      <option value="3">borges</option>
    </select>
  </Validation>
);

export const html5RequiredTextarea = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="username">* Username: </label>
    <textarea required />
  </Validation>
);

export const html5EmailInput = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="email">Email: </label>
    <input id="email" type="email" />
  </Validation>
);

export const html5URLInput = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="website">Website: </label>
    <input id="website" type="url" />
  </Validation>
);

export const html5NumberInput = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="age">Age (between 18 and 40): </label>
    <input id="age" type="number" min="18" max="40" step="1" />
  </Validation>
);

export const html5InputPattern = () => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
    <label htmlFor="phone">Cell: </label>
    <input id="phone" type="text" pattern="\(\d\d\d\) \d\d\d-\d\d\d\d" placeholder="(ddd) ddd-dddd" />
  </Validation>
);

export const throttleValidationBy = (delay) => (
  <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()} throttle={delay}>
    <label htmlFor="username">* Username: </label>
    <input id="username" type="text" minLength={3} maxLength={10} />
  </Validation>
);

export const nonZeroAndEvenInput = () => {
  const nonZeroNumber = (value) => new Promise((resolve, reject) =>
    (value != 0) ?
      resolve(value) :
      reject("Cannot be zero!")
  );

  const evenNumber = (value) => new Promise((resolve, reject) =>
    (value % 2 == 0) ?
      resolve(value) :
      reject("Must be an even number!")
  );

  return (
    <Validation rules={[ nonZeroNumber, evenNumber ]} onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <label htmlFor="nonzero-even">Non-zero and even: </label>
      <input id="nonzero-even" type="number" />
    </Validation>
  );
};

export const githubUsernameInput = () => {
  const githubUsernameExists = (value) => new Promise(async (resolve, reject) => {
    const response = await fetch(`https://api.github.com/users/${value}`);
    response.ok ?
      resolve(value) :
      reject(`Username '${value}' does not exist!`);
  });

  return (
    <Validation rules={[ githubUsernameExists ]} throttle={700} onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <label htmlFor="gh-username">Github Username: </label>
      <input id="gh-username" type="text" required />
    </Validation>
  );
};

export const formWithControlledState = () => {
  const validIf = (predicate) => (value) => new Promise((resolve, reject) => {
    predicate(value) ?
      resolve(value) :
      reject(`Value '${value}' does not match predicate!`);
  });

  class Form extends React.Component {
    state = {
      password: "pass123",
      passwordConfirmation: "pass123",
    }

    inputRefs = {
      passwordInput: null,
      passwordConfirmation: null,
    }

    handleChange = (event) => {
      this.setState({
        [event.target.name]: event.target.type === "checkbox" ?
          event.target.checked : event.target.value,
      })
    }

    render() {
      return (
        <form>
          <Validation
              inputRef={input => this.inputRefs.passwordInput = input}
              onFinish={() => this.inputRefs.passwordConfirmation.validate()}
            >
            <input name="password" value={this.state.password} onChange={this.handleChange} required />
          </Validation>

          <Validation
              inputRef={input => this.inputRefs.passwordConfirmation = input}
              rules={[ validIf(value => value === this.state.password) ]}
          >
            <input name="passwordConfirmation" value={this.state.passwordConfirmation} onChange={this.handleChange} />
          </Validation>

          <div className="row">
            <button type="submit">Submit</button>
          </div>
        </form>
      )
    }
  }

  return (
    <Form />
  );
};
