import React from "react"
import sinon from "sinon"
import { expect } from "chai"
import { shallow } from "enzyme"
import Validation from "../../lib/Validation"
import { required } from "../../lib/validators"

describe("Validation", () => {
  describe("props.failed", () => {
    it("when present, decorates all input fields with a 'validation-failed' class name", () => {
      const wrapper = shallow(
        <Validation failed>
          <input type="text" className="input-1" />
          <input type="text" className="input-2" />
        </Validation>
      )

      const firstInput = wrapper.find(".input-1")
      const secondInput = wrapper.find(".input-2")

      expect(firstInput).to.have.className("input-1 validation-failed")
      expect(secondInput).to.have.className("input-2 validation-failed")
    })

    it("when not present, does not decorate input field with a 'validation-failed' class name", () => {
      const wrapper = shallow(
        <Validation>
          <input type="text" />
        </Validation>
      )

      expect(wrapper.find("input")).to.not.have.className("validation-failed")
    })

    it("when set to false, does not decorate input field with a 'validation-failed' class name", () => {
      const wrapper = shallow(
        <Validation failed={false}>
          <input type="text" />
        </Validation>
      )

      expect(wrapper.find("input")).to.not.have.className("validation-failed")
    })
  })

  describe("props.rules", () => {
    describe("trigger: on change", () => {
      it("marks input as failed validation when a validation rule fails", () => {
        const handleFailure = sinon.spy()
        const wrapper = shallow(
          <Validation onFailure={handleFailure} rules={[ required ]}>
            <input name="username" type="text" />
          </Validation>
        )

        wrapper.find("input").simulate("change", { target: { value: "" }})

        expect(handleFailure).to.have.been.calledWith({ username: "This field is required." })
      })

      it("does not mark input as failed validation when no validation rule fails", () => {
        const handleFailure = sinon.spy()
        const wrapper = shallow(
          <Validation onFailure={handleFailure} rules={[ required ]}>
            <input name="username" type="text" />
          </Validation>
        )

        wrapper.find("input").simulate("change", { target: { value: "Test" }})

        expect(handleFailure).to.not.have.been.calledWith({ username: "This field is required." })
      })
    })
  })
})
