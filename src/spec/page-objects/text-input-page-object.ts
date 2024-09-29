import { fireEvent } from "@testing-library/react";
import { UserEvent } from "@testing-library/user-event";

export class TextInputPageObject {
  constructor(
    private element: HTMLInputElement,
    private userState: UserEvent
  ) {}

  get value() {
    return this.element.value;
  }

  async setValue(value: string) {
    await this.userState.clear(this.element);
    if (value !== "") {
      await this.userState.type(this.element, value);
    }
  }

  async pressEnter() {
    await this.userState.type(this.element, "{Enter}");
  }

  /** This function does not replicate Backspace behaviour correctly
   * if the cursor is not at the end of the input.
   */
  async pressBackspace() {
    await this.userState.type(this.element, "{Backspace}");
  }

  async focus() {
    await this.userState.click(this.element);
  }
}
