import React from "react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Validation, {
  validate,
} from "../lib";

const handleValidInput = (input) => action("Valid:", input.value)();
const handleInvalidInput = (input) => action(input.validationMessage)();
const validIf = (predicate, hint) => (value) => new Promise((resolve, reject) => {
  predicate(value) ?
  resolve(value) :
  reject(hint || `'${value}' is not a valid value`);
});

class ValidationWithHint extends React.Component {
  state = {};

  static defaultProps = {
    onValid: () => {},
    onInvalid: () => {},
  }

  handleValidInput = (input) => {
    this.setState({ invalid: false });
    this.props.onValid(input);
  };

  handleInvalidInput = (input) => {
    this.setState({
      invalid: true,
      [input.name]: input.validity.customError ? this.props.hint || input.validationMessage : input.validationMessage,
    });

    this.props.onInvalid(input);
  }

  render() {
    const input = React.Children.only(this.props.children);

    return (
      <div className="input-with-hint">
        <Validation rules={this.props.rules} throttle={this.props.throttle} onValid={this.handleValidInput} onInvalid={this.handleInvalidInput}>
          {input}
        </Validation>

        {this.state.invalid && (
          <div className="hint">{this.state[input.props.name]}</div>
        )}
      </div>
    )
  }
}

export const html5RequiredInput = () => (
  <div>
    <label>{'* Username: '}</label>
    <Validation onValid={handleValidInput} onInvalid={handleInvalidInput}>
      <input type="text" required />
    </Validation>
  </div>
);

export const html5EmailInput = () => (
  <div>
    <label htmlFor="email">Email: </label>
    <Validation onValid={handleValidInput} onInvalid={handleInvalidInput}>
      <input id="email" type="email" />
    </Validation>
  </div>
);

export const html5URLInput = () => (
  <div>
    <label htmlFor="website">Website: </label>
    <Validation onValid={handleValidInput} onInvalid={handleInvalidInput}>
      <input id="website" type="url" />
    </Validation>
  </div>
);

export const html5NumberInput = () => (
  <div>
    <label htmlFor="age">Age (between 18 and 40): </label>
    <Validation onValid={handleValidInput} onInvalid={handleInvalidInput}>
      <input id="age" type="number" min="18" max="40" step="1" />
    </Validation>
  </div>
);

export const html5InputPattern = () => (
  <div>
    <label htmlFor="phone">Cell: </label>
    <Validation onValid={handleValidInput} onInvalid={handleInvalidInput}>
      <input id="phone" type="text" pattern="\(\d\d\d\) \d\d\d-\d\d\d\d" placeholder="(ddd) ddd-dddd" />
    </Validation>
  </div>
);

export const throttleValidationBy = (delay) => (
  <form className="row">
    <label>{'Username: '}</label>
    <ValidationWithHint throttle={delay} onValid={handleValidInput} onInvalid={handleInvalidInput}>
      <input name="username" type="text" minLength={5} maxLength={10} required autoComplete="off" />
    </ValidationWithHint>
  </form>
);

export const CustomRulesForm = () => {
  const nonZeroNumber = validIf(value => value != 0);
  const evenNumber = validIf(value => value % 2 == 0);

  return (
    <div>
      <label htmlFor="nonzero-even">Non-zero and even: </label>
      <Validation rules={[ nonZeroNumber, evenNumber ]} onValid={handleValidInput} onInvalid={handleInvalidInput}>
        <input id="nonzero-even" type="number" />
      </Validation>
    </div>
  );
};

export const GithubUsernameValidationForm = () => {
  const availableGithubUsername = (value) => new Promise((resolve, reject) => {
    fetch(`https://api.github.com/users/${value}`).then(response => {
      if (response.ok) {
        reject(`Username '${value}' has already been taken`);
      } else {
        resolve(value);
      }
    });
  });

  return (
    <form className="row">
      <label>{'Username: '}</label>
      <ValidationWithHint
          rules={[ availableGithubUsername ]}
          throttle={700}
          onValid={handleValidInput}
          onInvalid={handleInvalidInput}
      >
        <input type="text" name="gh-username" required autoComplete="off" placeholder="Type your Github username" />
      </ValidationWithHint>
    </form>
  );
};

export const PasswordConfirmationForm = () => {
  class Form extends React.Component {
    state = {
      password: "",
      passwordConfirmation: "",
    };

    inputRefs = {
      passwordInput: null,
      passwordConfirmation: null,
    };

    handleChange = (event) => {
      this.setState({
        [event.target.name]: event.target.value,
      });
    };

    render() {
      return (
        <form>
          <div className="row">
            <label>{'Password: '}</label>
            <Validation onFinish={() => this.inputRefs.passwordConfirmation.validate()}>
              <input type="password"
                  ref={input => this.inputRefs.passwordInput = input}
                  name="password" value={this.state.password}
                  onChange={this.handleChange}
                  required
              />
            </Validation>
          </div>

          <div className="row">
            <label>{'Confirm Password: '}</label>
            <Validation rules={[ validIf(value => value === this.state.password) ]}>
              <input type="password"
                  ref={input => this.inputRefs.passwordConfirmation = input}
                  name="passwordConfirmation"
                  value={this.state.passwordConfirmation}
                  onChange={this.handleChange}
              />
            </Validation>
          </div>

          <div className="row">
            <button type="button">{'Submit'}</button>
          </div>
        </form>
      )
    }
  }

  return (
    <Form />
  );
};

export const OnSubmitValidationForm = () => {
  class Form extends React.Component {
    inputRefs = [];

    handleSubmit = (event) => {
      event.preventDefault();

      const validationPromises = this.inputRefs
        .filter(input => input)
        .map(input => input.validate());

      Promise.all(validationPromises)
        .then(action("Submitting form..."))
        .catch((input) => action(`Form data is invalid: ${input.name}: ${input.value}`)())
    };

    render() {
      return (
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="row">
            <label>{'Username:'}</label>
            <Validation rules={[ validIf(value => value.length >= 3) ]}>
              <input ref={input => this.inputRefs.push(input)} type="text" name="username" />
            </Validation>
          </div>

          <div className="row">
            <label>{'Password:'}</label>
            <Validation rules={[ validIf(value => value.length >= 5) ]}>
              <input ref={input => this.inputRefs.push(input)} type="password" name="password" />
            </Validation>
          </div>

          <div className="row">
            <button type="submit">{'Submit'}</button>
          </div>
        </form>
      )
    }
  }

  return <Form />;
};

export const ValidationWithHintForm = () => {
  class Form extends React.Component {
    render() {
      return (
        <form>
          <div className="row">
            <label>{'Username:'}</label>
            <ValidationWithHint
                hint="Username must be 'drborges'"
                rules={[ validIf(value => value === "" || value === "drborges") ]}
            >
              <input type="text" name="username" autoComplete="off" required />
            </ValidationWithHint>
          </div>

          <div className="row">
            <label>{'Password:'}</label>
            <ValidationWithHint
                hint="Password must be at least 5 characters long"
                rules={[ validIf(value => value === "" || value.length >= 5) ]}
            >
              <input type="password" name="password" autoComplete="off" required />
            </ValidationWithHint>
          </div>

          <div className="row">
            <button type="button">{'Submit'}</button>
          </div>
        </form>
      )
    }
  }

  return <Form />;
}

export const ImperativeValidationForm = () => {
  class Form extends React.Component {
    state = {};
    inputs = {};

    validation = {
      username: [ validIf(value => value === "drborges", "Username must be 'drborges'") ],
      password: [ validIf(value => value.length > 4, "Password must be at least 5 characters long") ],
    };

    triggerValidation = (input, rules) => validate(input, rules)
      .then((value) => action(`${value} is a valid entry`)())
      .catch((hint) => action(`Form data is invalid: ${hint}`)());

    handleChange = (event) => {
      this.triggerValidation(event.target, this.validation[event.target.name]);
      this.setState({
        [event.target.name]: event.target.value,
      });
    };

    handleSubmit = (event) => {
      event.preventDefault();
      const validations = Object.values(this.inputs)
        .filter(input => input)
        .map(input => this.triggerValidation(input, this.validation[input.name]));

      Promise.all(validations)
        .then(action("Form is valid!"))
        .catch(action("Form is invalid!"));
    };

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <label>{'Username: '}</label>
            <input
                ref={input => input && (this.inputs[input.name] = input)}
                className={this.state.username && "dirty"}
                name="username"
                onChange={this.handleChange}
            />
          </div>

          <div className="row">
            <label>{'Password: '}</label>
            <input
                ref={input => input && (this.inputs[input.name] = input)}
                className={this.state.password && "dirty"}
                name="password"
                onChange={this.handleChange}
            />
          </div>

          <div className="row">
            <button>{'Submit'}</button>
          </div>
        </form>
      );
    }
  }

  return <Form />;
}
