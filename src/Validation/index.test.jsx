import React from "react";
import { mount } from "enzyme";

import Validation from "../Validation";

import { createEvent, nonZero, isEven, validIf, wait } from "../fixtures";

describe("<Validation />", () => {
  describe("#rules", () => {
    it("successfully validates textarea", () => {
      const handleValidInput = jest.fn();

      const validation = mount(
        <Validation rules={[nonZero, isEven]} onValid={handleValidInput}>
          <textarea name="password" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 } });
      return validation.find("textarea").props().onChange(event).then(() => {
        expect(handleValidInput).toHaveBeenCalledWith(event.target);
      });
    });

    it("successfully validates select element", () => {
      const handleValidInput = jest.fn();

      const validation = mount(
        <Validation rules={[nonZero, isEven]} onValid={handleValidInput}>
          <select name="password">
            <option value="1" />
            <option value="2" />
          </select>
        </Validation>
      );

      const event = createEvent({ target: { value: 2 } });
      return validation.find("select").props().onChange(event).then(() => {
        expect(handleValidInput).toHaveBeenCalledWith(event.target);
      });
    });

    it("successfully validates input field", () => {
      const handleValidInput = jest.fn();

      const validation = mount(
        <Validation rules={[nonZero, isEven]} onValid={handleValidInput}>
          <input name="password" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 } });
      return validation.find("input").props().onChange(event).then(() => {
        expect(handleValidInput).toHaveBeenCalledWith(event.target);
      });
    });

    it("fails validation of input field", () => {
      const handleInvalidInput = jest.fn();

      const validation = mount(
        <Validation rules={[nonZero, isEven]}  onInvalid={handleInvalidInput}>
          <input name="age" />
        </Validation>
      );

      const event = createEvent({ target: { value: 1 } });
      return validation.find("input").props().onChange(event).then(wait(50)).then(() => {
        expect(event.target.validationMessage).toEqual("Must be an even number");
        expect(handleInvalidInput).toHaveBeenCalledWith(event.target);
      });
    });
  });

  describe("#inputRef", () => {
    it("allows referencing underlying input element", () => {
      let input;

      const validation = mount(
        <Validation inputRef={i => input = i}>
          <input name="password" />
        </Validation>
      );

      expect(input.name).toEqual("password");
    });

    it("allows referencing multiple underlying input elements", () => {
      let checkboxes;

      const validation = mount(
        <Validation inputRefs={refs => checkboxes = refs}>
          <label htmlFor="username">* Username: </label>
          <input type="checkbox" name="username" value="1" required />drborges
          <input type="checkbox" name="username" value="2" required />diego
          <input type="checkbox" name="username" value="3" required />borges
        </Validation>
      );

      expect(checkboxes[0].value).toEqual("1");
      expect(checkboxes[1].value).toEqual("2");
      expect(checkboxes[2].value).toEqual("3");
    });
  });

  describe("#validate", () => {
    it("attaches validation API to the input element", () => {
      let input;

      const validation = mount(
        <Validation inputRef={i => input = i} rules={[nonZero, isEven]}>
          <input name="age" value={1} />
        </Validation>
      );

      return input.validate().catch(error => {
        expect(error).toEqual("Must be an even number");
      });
    });
  });

  describe("cross input validation", () => {
    it("successful", () => {
      let passwordInput, passwordConfirmationInput;
      const handleValidInput = jest.fn();

      const form = mount(
        <form>
          <Validation
              inputRef={input => passwordInput = input}
              onFinish={() => passwordConfirmationInput.validate()}
          >
            <input name="password" value="pass123" required />
          </Validation>

          <Validation
              inputRef={input => passwordConfirmationInput = input}
              rules={[ validIf(value => value === passwordInput.value) ]}
              onValid={handleValidInput}
          >
            <input name="passwordConfirmation" value="pass123" />
          </Validation>
        </form>
      );

      const event = createEvent({ target: { value: "lol123" } });
      return form.find("[name='password']").props().onChange(event).then(wait(50)).then(() => {
        expect(handleValidInput).toHaveBeenCalledWith(passwordConfirmationInput);
      });
    });
  });

  describe("#trigger", () => {
    it("overrides validation trigger event", () => {
      const handleValidInput = jest.fn();
      const validation = mount(
        <Validation rules={[nonZero, isEven]} trigger="onBlur" onValid={handleValidInput}>
          <input name="age" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 }});
      return validation.find("input").props().onBlur(event).then(() => {
        expect(handleValidInput).toHaveBeenCalledWith(event.target);
      });
    });

    it("does not override input existing event handlers", () => {
      const handleChange = jest.fn();
      const validation = mount(
        <Validation rules={[nonZero, isEven]}>
          <input name="age" onChange={handleChange} />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 }});
      return validation.find("input").props().onChange(event).then(() => {
        expect(handleChange).toHaveBeenCalledWith(event);
      });
    });
  });

  describe("#throttle", () => {
    it("throttles validation to a given delay", () => {
      const handleInvalidInput = jest.fn();
      const handleValidInput = jest.fn();
      const validation = mount(
        <Validation
            onInvalid={handleInvalidInput}
            onValid={handleValidInput}
            rules={[nonZero, isEven]}
            throttle={300}
        >
          <input name="age" />
        </Validation>
      );

      const input = validation.find("input");
      const event1 = createEvent({ target: { value: 1 }});
      const event2 = createEvent({ target: { value: 2 }});
      const event1ChangePromises = input.props().onChange(event1);
      const event2ChangePromises = input.props().onChange(event2);

      return event1ChangePromises.then(wait(50)).then(() => {
        expect(handleInvalidInput).not.toHaveBeenCalledWith(event1.target);
        expect(handleValidInput).not.toHaveBeenCalled();

        return event2ChangePromises.then(() => {
          expect(handleValidInput).toHaveBeenCalledWith(event2.target);
        });
      });
    });
  });

  describe("Validation Lifecycle", () => {
    it("executes lifecycle callbacks in order", () => {
      const executionPath = [];
      const handleValidInput = jest.fn(() => executionPath.push("onValid"));
      const handleValidationStart = jest.fn(() => executionPath.push("onStart"));
      const handleValidationFinish = jest.fn(() => executionPath.push("onFinish"));

      const validation = mount(
        <Validation rules={[nonZero, isEven]}
            onValid={handleValidInput}
            onStart={handleValidationStart}
            onFinish={handleValidationFinish}
        >
          <textarea name="password" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 } });
      return validation.find("textarea").props().onChange(event).then(() => {
        expect(executionPath).toEqual([
          "onStart",
          "onValid",
          "onFinish",
        ])
      });
    });
  });
});