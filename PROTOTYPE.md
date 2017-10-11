### Config

```jsx
import { Validation, Feedback } from "react-legit"

Validation.config.eager = true // triggers validation upon rendering
Validation.config.delay = 300 // Sets a delay to which Legit will wait for before triggering any validation feedback
Validation.config.traverse = true // Traverse children looking for input fields to bind validation rules to.

Validation.config.messages = {
  valueMissing: (input) => "is required!",
  typeMismatch: (input) => `must be of type ${input.type}`,
  patternMismatch: (input) => `does not match pattern ${input.pattern}!`,
}

Validation.config.selectors = {
  success: "success",
  failure: "failure",
  validating: "validating",
  feedback: "feedback-message",
}
```

### Legit.Validation: Single Input Field

```jsx
<Validation rules={[ greaterThan(18) ]} onFailure={...} onSuccess={...}>
  <input type="number" name="age" required />
  <Feedback />
</Validation>
```

### Legit.Validation: Across Input Fields

```jsx
<Validation rules={[ strongPassword ]} onFailure={...} onSuccess={...}>
  <input type="password" name="password" required />
  <Feedback />
</Validation>

<Validation rules={[ match(() => this.state.password) ]} onFailure={...} onSuccess={...}>
  <input type="password" name="password_confirm" required />
  <Feedback message="Password confirmation does not match" />
</Validation>
```

### Legit.Validation: Validation rules bound to the context

```jsx
<Validation rules={[ requiredIf(() => this.state.waiverResponse) ]} onFailure={...} onSuccess={...}>
  <input type="number" name="grantor_id" />
  <Feedback message="Grantor ID must be informed when a waiver response is provided" />
</Validation>
```

### Legit.Validation: Disabling Validation

```jsx
<Validation disabled>
  <input type="number" name="grantor_id" required />
  <Feedback message="Grantor ID must be informed when a waiver response is provided" />
</Validation>
```

### Legit.Validation: Feedback Delay

```jsx
<Validation delay={500}>
  <input type="number" name="grantor_id" required />
  <Feedback message="Grantor ID must be informed when a waiver response is provided" />
</Validation>
```

### Legit.Validation: traverse

Traverses the children elements (ignoring `Feedback`) looking for an input element to bind validation rules to.

```jsx
<Validation traverse>
  <MyInputWrapper />
  <Feedback message="Grantor ID must be informed when a waiver response is provided" />
</Validation>
```

```jsx
<Validation traverse={(elem) => elem.name === "username"}>
  <MyUsernameInput />
  <Feedback message="Username is required" />
</Validation>
```

### Legit.Validation: trigger

Override the default `onChange` validation trigger.

```jsx
<Validation trigger={["onFocus", "onBlur"]}>
  <MyInputWrapper />
  <Feedback message="Grantor ID must be informed when a waiver response is provided" />
</Validation>
```

### Legit.Feedback

```jsx
<Feedback message="is required!" template={(message) => <span>{message}</span>} />
```
### Legit Message Resolvers

```js
Validation.config.messages = {
  valueMissing: (input) => "is required!",
  typeMismatch: (input) => `must be of type ${input.type}`,
  patternMismatch: (input) => `does not match pattern ${input.pattern}!`,
}
```