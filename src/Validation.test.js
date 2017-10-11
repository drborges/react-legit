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

  describe("feedback delay", () => {});
  describe("throtteling", () => {});
  describe("traversing subtree", () => {});

  describe("activation", () => {
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

  describe("native tooltip", () => {
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
          <Validation rules={[nonZero, isEven]} onSuccess={handleSuccess} debounce={200}>
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
    });
  });
});