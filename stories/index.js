import { storiesOf } from "@storybook/react";

import {
  html5EmailInput,
  html5URLInput,
  html5NumberInput,
  html5InputPattern,
  nonZeroAndEvenInput,
  githubUsernameInput,
  html5RequiredInput,
  html5RequiredInputCheckbox,
  html5RequiredInputRadio,
  html5RequiredSelect,
  html5RequiredTextarea,
  throttleValidationBy,
  formWithControlledState,
} from "../src/Validation/stories.jsx";

import styles from "./styles.scss";

storiesOf("Validation/HTML5", module)
  .add("required", () => html5RequiredInput())
  .add("email", () => html5EmailInput())
  .add("url", () => html5URLInput())
  .add("number", () => html5NumberInput())
  .add("input pattern", () => html5InputPattern());

storiesOf("Validation/Custom", module)
  .add("with multiple rules", () => nonZeroAndEvenInput())
  .add("Github API validation", () => githubUsernameInput());

storiesOf("Validation/Supported Fields", module)
  .add("input", () => html5RequiredInput())
  .add("checkbox", () => html5RequiredInputCheckbox())
  .add("radio", () => html5RequiredInputRadio())
  .add("select", () => html5RequiredSelect())
  .add("textarea", () => html5RequiredTextarea());

storiesOf("Validation/Throtteled", module)
  .add("by 100ms", () => throttleValidationBy(100))
  .add("by 500ms", () => throttleValidationBy(500))
  .add("by 1s", () => throttleValidationBy(1000));

storiesOf("Validation/Use Cases", module)
  .add("Password Confirmation", () => formWithControlledState());