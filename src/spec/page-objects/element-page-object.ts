import { UserEvent } from "@testing-library/user-event";

export class ElementPageObject {
  constructor(protected element: HTMLElement, protected userState: UserEvent) {}

  get isDisplayed() {
    return this.element !== null;
  }

  get text() {
    return this.element.textContent;
  }

  async click() {
    await this.userState.click(this.element);
  }
}
