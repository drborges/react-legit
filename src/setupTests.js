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
    return this.validity.customError === "" || this.validity.customError === undefined;
  },
});

Object.defineProperty(HTMLInputElement.prototype.__proto__, "setCustomValidity", {
  enumerable: false,
  configurable: false,
  writable: true,
  value: function(message) {
    this.validity.customError = message;
  },
});

enzyme.configure({ adapter: new Adapter() });