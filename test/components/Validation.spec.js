import React from "react"
import { expect } from "chai"
import { shallow } from "enzyme"
import Validation from "../../lib/components/Validation"

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
})
