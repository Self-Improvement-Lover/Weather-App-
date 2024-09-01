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
}
