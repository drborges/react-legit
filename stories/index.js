import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Validation from "../src/Validation";

import styles from "./styles.scss";

const html5RequiredInput = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="username">* Username: </label>
    <input id="username" type="text" required />
  </Validation>
);

const html5EmailInput = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="email">Email: </label>
    <input id="email" type="email" />
  </Validation>
);

const html5URLInput = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="website">Website: </label>
    <input id="website" type="url" />
  </Validation>
);

const html5NumberInput = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="age">Age (between 18 and 40): </label>
    <input id="age" type="number" min="18" max="40" step="1" />
  </Validation>
);

const html5InputPattern = () => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
    <label htmlFor="phone">Cell: </label>
    <input id="phone" type="text" pattern="\(\d\d\d\) \d\d\d-\d\d\d\d" placeholder="(ddd) ddd-dddd" />
  </Validation>
);

const debounceValidationBy = (wait) => (
  <Validation onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)} debounce={wait}>
    <label htmlFor="username">* Username: </label>
    <input id="username" type="text" minLength={3} maxLength={10} />
  </Validation>
);

const nonZeroAndEvenInput = () => {
  const nonZeroNumber = (event) => new Promise((resolve, reject) =>
    (event.target.value != 0) ?
      resolve(event) :
      reject("Cannot be zero!")
  );

  const evenNumber = (event) => new Promise((resolve, reject) =>
    (event.target.value % 2 == 0) ?
      resolve(event) :
      reject("Must be an even number!")
  );

  return (
    <Validation rules={[ nonZeroNumber, evenNumber ]} onSuccess={action("Valid!")} onFailure={(e) => action(e.target.validationMessage)(e)}>
      <label htmlFor="nonzero-even">Non-zero and even: </label>
      <input id="nonzero-even" type="number" />
    </Validation>
  );
};

storiesOf("HTML5 Validation", module)
  .add("required", () => html5RequiredInput())
  .add("email", () => html5EmailInput())
  .add("url", () => html5URLInput())
  .add("number", () => html5NumberInput())
  .add("input pattern", () => html5InputPattern());

storiesOf("Debounced Validation", module)
  .add("by 100ms", () => debounceValidationBy(100))
  .add("by 500ms", () => debounceValidationBy(500))
  .add("by 1s", () => debounceValidationBy(1000));

storiesOf("Custom Validation", module)
  .add("with multiple rules", () => nonZeroAndEvenInput());