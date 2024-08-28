import { fireEvent } from "@testing-library/react";


export class ElementPageObject {
  constructor(private element: HTMLElement) { }

  get text() {
    return this.element.textContent;
  }

  click() {
    fireEvent.click(this.element);
  }
}
