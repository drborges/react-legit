import "jest-enzyme";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Object.defineProperty(HTMLInputElement.prototype.__proto__, "validity", {
  enumerable: false,
  configurable: false,
  writable: true,
  value: {
    customError: false,
  },
});

Object.defineProperty(HTMLInputElement.prototype.__proto__, "checkValidity", {
  enumerable: false,
  configurable: false,
  writable: true,
  value: function() {
    const valid = this.validity.customError === "" || this.validity.customError === undefined;
    !valid && this.onInvalid && this.onInvalid(this);
    return valid;
  },
});

Object.defineProperty(HTMLInputElement.prototype.__proto__, "setCustomValidity", {
  enumerable: false,
  configurable: false,
  writable: true,
  value: function(message) {
    this.validity.customError = message;
    this.validationMessage = message;
  },
});

enzyme.configure({ adapter: new Adapter() });