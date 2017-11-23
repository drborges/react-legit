import React from "react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Validation from "../lib";

export const html5RequiredInput = () => (
  <div>
    <label htmlFor="username">* Username: </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input id="username" type="text" required />
    </Validation>
  </div>
);

export const html5RequiredInputCheckbox = () => (
  <div>
    <label htmlFor="username">* Username: </label>

    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input type="checkbox" name="username" value="1" required />drborges
    </Validation>

    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input type="checkbox" name="username" value="2" required />diego
    </Validation>

    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input type="checkbox" name="username" value="3" required />borges
    </Validation>
  </div>
);

export const html5RequiredInputRadio = () => (
  <div>
    <label htmlFor="username">* Username: </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input type="radio" name="username" value="1" required />drborges
    </Validation>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input type="radio" name="username" value="2" required />diego
    </Validation>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input type="radio" name="username" value="3" required />borges
    </Validation>
  </div>
);

export const html5RequiredSelect = () => (
  <div>
    <label htmlFor="username">* Username: </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <select required>
        <option />
        <option value="1">drborges</option>
        <option value="2">diego</option>
        <option value="3">borges</option>
      </select>
    </Validation>
  </div>
);

export const html5RequiredTextarea = () => (
  <div>
    <label htmlFor="username">* Username: </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <textarea required />
    </Validation>
  </div>
);

export const html5EmailInput = () => (
  <div>
    <label htmlFor="email">Email: </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input id="email" type="email" />
    </Validation>
  </div>
);

export const html5URLInput = () => (
  <div>
    <label htmlFor="website">Website: </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input id="website" type="url" />
    </Validation>
  </div>
);

export const html5NumberInput = () => (
  <div>
    <label htmlFor="age">Age (between 18 and 40): </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input id="age" type="number" min="18" max="40" step="1" />
    </Validation>
  </div>
);

export const html5InputPattern = () => (
  <div>
    <label htmlFor="phone">Cell: </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
      <input id="phone" type="text" pattern="\(\d\d\d\) \d\d\d-\d\d\d\d" placeholder="(ddd) ddd-dddd" />
    </Validation>
  </div>
);

export const throttleValidationBy = (delay) => (
  <div>
    <label htmlFor="username">* Username: </label>
    <Validation onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()} throttle={delay}>
      <input id="username" type="text" minLength={3} maxLength={10} />
    </Validation>
  </div>
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
    <div>
      <label htmlFor="nonzero-even">Non-zero and even: </label>
      <Validation rules={[ nonZeroNumber, evenNumber ]} onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
        <input id="nonzero-even" type="number" />
      </Validation>
    </div>
  );
};

export const githubUsernameInput = () => {
  const githubUsernameExists = (value) => new Promise((resolve, reject) => {
    fetch(`https://api.github.com/users/${value}`).then(response => {
      response.ok ? resolve(value) : reject(`Username '${value}' does not exist!`);
    });
  });

  return (
    <div>
      <label htmlFor="gh-username">Github Username: </label>
      <Validation rules={[ githubUsernameExists ]} throttle={700} onValid={(input) => action("Valid:", input.value)} onInvalid={(input) => action(input.validationMessage)()}>
        <input id="gh-username" type="text" />
      </Validation>
    </div>
  );
};

const validIf = (predicate) => (value) => new Promise((resolve, reject) => {
  predicate(value) ?
  resolve(value) :
  reject(`Value '${value}' does not match predicate!`);
});

export const formWithControlledState = () => {
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

export const validateOnSubmit = () => {
  class ValidationWithHint extends React.Component {
    state = {};

    handleValidInput = (input) => this.setState({ invalid: false });
    handleInvalidInput = (input) => this.setState({
      invalid: true,
      [input.name]: input.validationMessage,
    });


    render() {
      const input = React.Children.only(this.props.children);

      return (
        <span>
          <Validation rules={this.props.rules}
              onValid={this.handleValidInput}
              onInvalid={this.handleInvalidInput}
          >
            {input}
          </Validation>

          {this.state.invalid && (
            <span className="hint">{this.props.hint || this.state[input.props.name]}</span>
          )}
        </span>
      )
    }
  }

  class ValidateOnSubmit extends React.Component {
    inputRefs = [];

    handleSubmit = (event) => {
      event.preventDefault();

      const validationPromises = this.inputRefs
        .filter(input => input)
        .map(input => input.validate());

      Promise.all(validationPromises)
        .then(() => action("Submitting form...")())
        .catch((input) => action(`Form data is invalid: ${input.name}: ${input.value}`)())
    };

    render() {
      return (
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="row">
            <label>{'Username'}</label>
            <ValidationWithHint
                hint="Username must be at least 3 characters long"
                rules={[ validIf(value => value.length >= 3) ]}
            >
              <input ref={input => this.inputRefs.push(input)} type="text" name="username" />
            </ValidationWithHint>
          </div>

          <div className="row">
            <label>Password</label>
            <ValidationWithHint
                hint="Password must be at least 5 characters long"
                rules={[ validIf(value => value.length >= 5) ]}
            >
              <input ref={input => this.inputRefs.push(input)} type="password" name="password" />
            </ValidationWithHint>
          </div>

          <div className="row">
            <button type="submit">{'Save'}</button>
          </div>
        </form>
      )
    }
  }

  return (<ValidateOnSubmit />);
}
