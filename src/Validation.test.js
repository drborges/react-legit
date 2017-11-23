import React from "react";
import sinon from "sinon";
import { expect } from "chai";
import { mount } from "enzyme";

import Validation from "./Validation";

import { createEvent, nonZero, isEven, validIf, wait } from "./test.fixtures";

describe("<Validation />", () => {
  describe("#rules", () => {
    it("successfully validates textarea", () => {
      const handleValidInput = sinon.spy();

      const validation = mount(
        <Validation rules={[nonZero, isEven]} onValid={handleValidInput}>
          <textarea name="password" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 } });
      return validation.find("textarea").props().onChange(event).then(() => {
        expect(handleValidInput).to.have.been.calledWith(event.target);
      });
    });

    it("successfully validates select element", () => {
      const handleValidInput = sinon.spy();

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
        expect(handleValidInput).to.have.been.calledWith(event.target);
      });
    });

    it("successfully validates input field", () => {
      const handleValidInput = sinon.spy();

      const validation = mount(
        <Validation rules={[nonZero, isEven]} onValid={handleValidInput}>
          <input name="password" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 } });
      return validation.find("input").props().onChange(event).then(() => {
        expect(handleValidInput).to.have.been.calledWith(event.target);
      });
    });

    it("fails validation of input field", () => {
      const handleInvalidInput = sinon.spy();

      const validation = mount(
        <Validation rules={[nonZero, isEven]}  onInvalid={handleInvalidInput}>
          <input name="age" />
        </Validation>
      );

      const event = createEvent({ target: { value: 1 } });
      return validation.find("input").props().onChange(event).then(wait(50)).then(() => {
        expect(event.target.validationMessage).to.eq("Must be an even number");
        expect(handleInvalidInput).to.have.been.calledWith(event.target);
      });
    });
  });

  describe("#ref", () => {
    it("allows referencing underlying input element", () => {
      let input;

      const validation = mount(
        <Validation>
          <input ref={i => input = i} name="password" />
        </Validation>
      );

      expect(input.name).to.eq("password");
    });
  });

  describe("#validate", () => {
    it("attaches validation API to the input element", () => {
      let input;

      const validation = mount(
        <Validation rules={[nonZero, isEven]}>
          <input ref={i => input = i} name="age" value={1} />
        </Validation>
      );

      return input.validate().catch(error => {
        expect(error).to.eq("Must be an even number");
      });
    });
  });

  describe("cross input validation", () => {
    it("successful", () => {
      let passwordInput, passwordConfirmationInput;
      const handleValidInput = sinon.spy();

      const form = mount(
        <form>
          <Validation onFinish={() => passwordConfirmationInput.validate()}>
            <input ref={input => passwordInput = input} name="password" value="pass123" required />
          </Validation>

          <Validation rules={[ validIf(value => value === passwordInput.value) ]} onValid={handleValidInput}>
            <input ref={input => passwordConfirmationInput = input} name="passwordConfirmation" value="pass123" />
          </Validation>
        </form>
      );

      const event = createEvent({ target: { value: "lol123" } });
      return form.find("[name='password']").props().onChange(event).then(() => {
        expect(handleValidInput).to.have.been.calledWith(passwordConfirmationInput);
      });
    });
  });

  describe("#trigger", () => {
    it("overrides validation trigger event", () => {
      const handleValidInput = sinon.spy();
      const validation = mount(
        <Validation rules={[nonZero, isEven]} trigger="onBlur" onValid={handleValidInput}>
          <input name="age" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 }});
      return validation.find("input").props().onBlur(event).then(() => {
        expect(handleValidInput).to.have.been.calledWith(event.target);
      });
    });

    it("does not override input existing event handlers", () => {
      const handleChange = sinon.spy();
      const validation = mount(
        <Validation rules={[nonZero, isEven]}>
          <input name="age" onChange={handleChange} />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 }});
      return validation.find("input").props().onChange(event).then(() => {
        expect(handleChange).to.have.been.calledWith(event);
      });
    });
  });

  describe("#throttle", () => {
    it("throttles validation to a given delay", () => {
      const handleInvalidInput = sinon.spy();
      const handleValidInput = sinon.spy();
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
        expect(handleInvalidInput).to.have.not.been.calledWith(event1.target);
        expect(handleValidInput).to.have.not.been.called;

        return event2ChangePromises.then(() => {
          expect(handleValidInput).to.have.been.calledWith(event2.target);
        });
      });
    });
  });

  describe("#onValidate", () => {
    it("allows overriding validation execution logic", () => {
      const handleValidInput = sinon.spy();
      const validation = mount(
        <Validation
            onValid={handleValidInput}
            onValidate={(input, rules) => Promise.resolve("always valid")}
            rules={[nonZero, isEven]}
        >
          <input name="age" />
        </Validation>
      );

      const event = createEvent({ target: { value: 1 }});
      validation.find("input").props().onChange(event).then(() => {
        expect(handleValidInput).to.have.been.calledWith(event.target);
      });
    });
  });

  describe("#refPropName", () => {
    class MyInput extends React.Component {
      render() {
        const { inputRef, ...props } = this.props;
        return (
          <input ref={inputRef} {...props} />
        );
      }
    }

    it("allows overriding the input ref key used to propate input ref callbacks", () => {
      const handleValidInput = sinon.spy();
      const validation = mount(
        <Validation rules={[nonZero, isEven]}
            onValid={handleValidInput}
            refPropName="inputRef"
        >
          <MyInput name="age" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 }});
      validation.find("input").props().onChange(event).then(() => {
        expect(handleValidInput).to.have.been.calledWith(event.target);
      });
    });
  });

  describe("Validation Lifecycle", () => {
    it("marks input field as dirty", () => {
      const validation = mount(
        <Validation rules={[nonZero, isEven]}>
          <input name="password" />
        </Validation>
      );

      const event = createEvent({ target: { value: 2 } });
      const input = validation.find("input");

      expect(input.className).to.be.undefined;

      return input.props().onChange(event).then(() => {
        validation.update();
        expect(validation.find("input").props().className).to.eq("dirty");
      });
    });

    it("executes lifecycle callbacks in order", () => {
      const executionPath = [];
      const handleValidInput = sinon.spy(() => executionPath.push("onValid"));
      const handleValidationStart = sinon.spy(() => executionPath.push("onStart"));
      const handleValidationFinish = sinon.spy(() => executionPath.push("onFinish"));

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
        expect(executionPath).to.deep.eq([
          "onStart",
          "onValid",
          "onFinish",
        ])
      });
    });
  });
});
