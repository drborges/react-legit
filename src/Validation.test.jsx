import React from "react";
import { mount } from "enzyme";

import Validation from "./Validation";

import { createEvent, nonZero, isEven, validIf, wait } from "./fixtures";

describe("<Validation />", () => {
  describe("#rules", () => {
    it("successfully validates input field", () => {
      const handleValidInput = jest.fn();
      const handleValidationFinish = jest.fn();
      const event = createEvent({ target: { value: 2 } });

      const validation = mount(
        <Validation rules={[nonZero, isEven]} onValid={handleValidInput} onFinish={handleValidationFinish}>
          <input name="password" />
        </Validation>
      );

      return validation.find("input").props().onChange(event).then(value => {
        expect(value).toEqual(2);
        expect(handleValidInput).toHaveBeenCalledWith(2);
        expect(handleValidationFinish).toHaveBeenCalled();
      });
    });

    it("fails validation of input field", () => {
      const handleInvalidInput = jest.fn();
      const handleValidationFinish = jest.fn();

      const validation = mount(
        <Validation rules={[nonZero, isEven]}  onInvalid={handleInvalidInput} onFinish={handleValidationFinish}>
          <input name="age" />
        </Validation>
      );

      const event = createEvent({ target: { value: 1 } });
      return validation.find("input").props().onChange(event).then(hint => {
        const expectedHint = "Must be an even number";
        expect(hint).toEqual(expectedHint);
        return wait(50).then(() => {
          expect(handleInvalidInput).toHaveBeenCalledWith(expectedHint);
          expect(handleValidationFinish).toHaveBeenCalled();
        });
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
      let passwordInput, passwordConfirmationChange;
      const handleSuccess = jest.fn();

      const form = mount(
        <form>
          <Validation
              inputRef={input => passwordInput = input}
              onFinish={() => passwordConfirmationChange.validate()}
          >
            <input name="password" value="pass123" required />
          </Validation>

          <Validation
              inputRef={input => passwordConfirmationChange = input}
              rules={[ validIf(value => value === passwordInput.value) ]}
              onValid={handleSuccess}
          >
            <input name="passwordConfirmation" value="pass123" />
          </Validation>
        </form>
      );

      const event = createEvent({ target: { value: "lol123" } });
      return form.find("[name='password']").props().onChange(event).then(val => {
        return wait(50).then(() => {
          expect(handleSuccess).toHaveBeenCalledWith("pass123");
        });
      });
    });
  });

  describe("#trigger", () => {
    it("overrides validation trigger event", () => {
      const validation = mount(
        <Validation rules={[nonZero, isEven]} trigger="onBlur">
          <input name="age" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 }});
      return validation.find("input").props().onBlur(event).then(value => {
        expect(value).toEqual(2);
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

      return event1ChangePromises.then(error => {
        expect(error).toBeUndefined();
        expect(handleInvalidInput).toHaveBeenCalledWith(undefined);
        expect(handleValidInput).not.toHaveBeenCalled();

        return event2ChangePromises.then(value => {
          expect(value).toEqual(2);
          expect(handleValidInput).toHaveBeenCalledWith(2);
        })
      });
    });
  });
});