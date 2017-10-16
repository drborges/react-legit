import React from "react";
import { mount } from "enzyme";

import Validation from "./Validation";

import { createEvent, nonZero, isEven } from "./fixtures";

describe("Validation", () => {
  it("renders without crashing", () => {
    mount(
      <Validation>
        <input />
        <span>A non-input node</span>
      </Validation>
    );
  });

  describe("#disabled", () => {
    it("disables validation", () => {
      const validation = mount(
        <Validation disabled>
          <input type="text" />
        </Validation>
      );

      const input = validation.find("input");

      expect(input.props().onChange).toBeUndefined();
      expect(input.props().onInvalid).toBeUndefined();
    });
  });

  describe("#enableTooltip", () => {
    it("disables tooltip by default", () => {
      const validation = mount(
        <Validation>
          <input type="text" />
        </Validation>
      );

      const event = createEvent();
      validation.find("input").props().onInvalid(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("#enableTooltip", () => {
      const validation = mount(
        <Validation enableTooltip>
          <input type="text" />
        </Validation>
      );

      const event = createEvent();
      validation.find("input").props().onInvalid(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    describe("#onSuccess", () => {
      it("calls success handler callback", () => {
        const handleSuccess = jest.fn();
        const event = createEvent({ target: { value: 2 } });

        const validation = mount(
          <Validation rules={[nonZero, isEven]} onSuccess={handleSuccess}>
            <input type="text" />
          </Validation>
        );

        return validation.find("input").props().onChange(event).then(() => {
          expect(handleSuccess).toHaveBeenCalledWith(event);
        });
      });
    });

    describe("#onFailure", () => {
      it("calls failure handler callback", () => {
        const handleFailure = jest.fn();
        const event = createEvent({ target: { value: 1 } });

        const validation = mount(
          <Validation rules={[nonZero, isEven]} onFailure={handleFailure}>
            <input type="text" />
          </Validation>
        );

        return validation.find("input").props().onChange(event).then(() => {
          expect(handleFailure).toHaveBeenCalledWith(event);
          expect(event.target.validationMessage).toEqual("Must be an even number")
        });
      });
    });


    describe("#trigger", () => {
      it("overrides validation trigger to be onBlur", () => {
        const handleSuccess = jest.fn();
        const event = createEvent({ target: { value: 2 } });

        const validation = mount(
          <Validation rules={[nonZero, isEven]} onSuccess={handleSuccess} trigger="onBlur">
            <input type="text" />
          </Validation>
        );

        return validation.find("input").props().onBlur(event).then(() => {
          expect(handleSuccess).toHaveBeenCalledWith(event);
        });
      });

      it("does not override input event handlers", () => {
        const handleChange = jest.fn();
        const handleSuccess = jest.fn();
        const event = createEvent({ target: { value: 2 } });

        const validation = mount(
          <Validation rules={[nonZero, isEven]} onSuccess={handleSuccess}>
            <input type="text" value="" onChange={handleChange} />
          </Validation>
        );

        return validation.find("input").props().onChange(event).then(() => {
          expect(handleChange).toHaveBeenCalledWith(event);
          expect(handleSuccess).toHaveBeenCalledWith(event);
        });
      })
    });

    describe("#throttle", () => {
      it("ratelimits validation by throttling the trigger event", () => {
        const handleSuccess = jest.fn((event) => event.target.value);
        const event1 = createEvent({ target: { value: 2 } });
        const event2 = createEvent({ target: { value: 4 } });

        const validation = mount(
          <Validation rules={[nonZero, isEven]} onSuccess={handleSuccess} throttle={20}>
            <input type="text" />
          </Validation>
        );

        const triggerValidation = validation.find("input").props().onChange;
        const validation1 = triggerValidation(event1);
        const validation2 = triggerValidation(event2);

        return validation1.catch((reason) => {
          expect(reason).toEqual("");

          return validation2.then((event) => {
            expect(event).toEqual(event2.target.value);
            expect(handleSuccess).toHaveBeenCalledWith(event2);
            expect(handleSuccess).not.toHaveBeenCalledWith(event1);
          });
        });
      });
    });

    describe("feedback delay", () => {});
    describe("traversing subtree", () => {});
  });
});