import { storiesOf } from "@storybook/react";

import {
  html5EmailInput,
  html5URLInput,
  html5NumberInput,
  html5InputPattern,
  CustomRulesForm,
  GithubUsernameValidationForm,
  html5RequiredInput,
  throttleValidationBy,
  PasswordConfirmationForm,
  ValidationWithHintForm,
  OnSubmitValidationForm,
  ImperativeValidationForm,
} from "../src/Validation.stories";

import styles from "./styles.scss";

storiesOf("HTML5 Validation API", module)
  .add("required", () => html5RequiredInput())
  .add("email", () => html5EmailInput())
  .add("url", () => html5URLInput())
  .add("number", () => html5NumberInput())
  .add("input pattern", () => html5InputPattern());

storiesOf("Custom Validation", module)
  .add("with multiple rules", () => CustomRulesForm());

storiesOf("Throttling", module)
  .add("by 100ms", () => throttleValidationBy(100))
  .add("by 500ms", () => throttleValidationBy(500))
  .add("by 1s", () => throttleValidationBy(1000));

storiesOf("Use Cases", module)
  .add("Password Confirmation", () => PasswordConfirmationForm())
  .add("Validation With Hint", () => ValidationWithHintForm())
  .add("On Submit Validation", () => OnSubmitValidationForm())
  .add("Imperative Validation", () => ImperativeValidationForm())
  .add("Remote Validation", () => GithubUsernameValidationForm());
