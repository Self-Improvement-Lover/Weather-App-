import { fireEvent } from "@testing-library/react";

export class TextInputPageObject {
  constructor(private element: HTMLInputElement) {}

  get value() {
    return this.element.value;
  }

  set value(newValue: string) {
    fireEvent.change(this.element, {
      target: { value: newValue }
    });
  }

  pressEnter() {
    fireEvent.keyDown(this.element, {
      key: "Enter"
    });
  }

  /** This function does not replicate Backspace behaviour correctly
   * if the cursor is not at the end of the input.
   */
  pressBackspace() {
    fireEvent.keyDown(this.element, {
      key: "Backspace"
    });
    this.value = this.value.slice(0, this.value.length - 1);
  }
}
