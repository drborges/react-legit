import React from "react"
import sinon from "sinon"
import { expect } from "chai"
import { shallow } from "enzyme"
import Validation from "../../lib/Validation"
import { required } from "../../lib/validators"

describe("Validation", () => {
  describe("props.failed", () => {
    context("when present", () => {
      it("decorates all input fields with a 'validation-failed' class name", () => {
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
    })

    context("when absent", () => {
      it("does not decorate input field with a 'validation-failed' class name", () => {
        const wrapper = shallow(
          <Validation>
            <input type="text" />
          </Validation>
        )

        expect(wrapper.find("input")).to.not.have.className("validation-failed")
      })
    })

    context("when set to 'false'", () => {
      it("does not decorate input field with a 'validation-failed' class name", () => {
        const wrapper = shallow(
          <Validation failed={false}>
            <input type="text" />
          </Validation>
        )

        expect(wrapper.find("input")).to.not.have.className("validation-failed")
      })
    })
  })

  describe("props.rules", () => {
    context("when props.trigger is absent", () => {
      let handleFailure, wrapper

      beforeEach(() => {
        handleFailure = sinon.spy()
        wrapper = shallow(
          <Validation onFailure={handleFailure} rules={[ required ]}>
            <input name="username" type="text" />
          </Validation>
        )
      })

      context("when validation rule fails", () => {
        it("marks input as failed validation on 'change' event", () => {
          wrapper.find("input").simulate("change", { target: { value: "" }})
          expect(handleFailure).to.have.been.calledWith({ username: "This field is required." })
        })
      })

      context("when validation rule passes", () => {
        it("does not mark input as failed validation on 'change' event", () => {
          wrapper.find("input").simulate("change", { target: { value: "Test" }})
          expect(handleFailure).to.not.have.been.calledWith({ username: "This field is required." })
        })
      })
    })

    context("props.trigger = onBlur", () => {
      let handleFailure, wrapper

      beforeEach(() => {
        handleFailure = sinon.spy()
        wrapper = shallow(
          <Validation onFailure={handleFailure} rules={[ required ]} trigger="onBlur">
            <input name="username" type="text" />
          </Validation>
        )
      })

      context("when validation rule fails", () => {
        it("marks input as failed validation on 'blur' event", () => {
          wrapper.find("input").simulate("blur", { target: { value: "" }})
          expect(handleFailure).to.have.been.calledWith({ username: "This field is required." })
        })
      })

      context("when validation rule passes", () => {
        it("does not mark input as failed validation on 'blur' event", () => {
          wrapper.find("input").simulate("blur", { target: { value: "Test" }})
          expect(handleFailure).to.not.have.been.calledWith({ username: "This field is required." })
        })
      })
    })
  })
})
