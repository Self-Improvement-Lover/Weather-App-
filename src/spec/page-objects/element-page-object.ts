import { fireEvent } from "@testing-library/react";

export class ElementPageObject {
  constructor(protected element: HTMLElement) { }

  get isDisplayed() {
    return this.element !== null;
  }

  get text() {
    return this.element.textContent;
  }

  click() {
    fireEvent.click(this.element);
  }
}
