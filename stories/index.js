import { storiesOf } from "@storybook/react";

import {
  RequiredInput,
} from "../src/Validation.stories";

import styles from "./styles.scss";

storiesOf("HTML5 Validation API", module)
  .add("required", RequiredInput)