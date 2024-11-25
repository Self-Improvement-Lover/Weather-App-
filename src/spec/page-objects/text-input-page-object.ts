import { ElementPageObject } from "./element-page-object";

export class TextInputPageObject extends ElementPageObject {
  constructor(protected element: HTMLInputElement) {
    super(element);
  }

  get value() {
    return this.element.value;
  }

  setValue(value: string) {
    const input = this.element;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(input, value);

    this.element.dispatchEvent(new Event("input", { bubbles: true }));
    this.element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  pressEnter() {
    throw new Error("Not implemented (Enter)");
    // await this.userState.type(this.element, "{Enter}");
  }

  /** This function does not replicate Backspace behaviour correctly
   * if the cursor is not at the end of the input.
   */
  pressBackspace() {
    throw new Error("Not implemented (Backspace)");
    // await this.userState.type(this.element, "{Backspace}");
  }
}
