import { ElementPageObject } from "./element-page-object";

export class TextInputPageObject extends ElementPageObject {
  constructor(protected element: HTMLInputElement) {
    super(element);
  }

  get value() {
    return this.element.value;
  }

  setValue(value: string) {
    this.element.value = value;
    this.element.dispatchEvent(new Event("input", { bubbles: true }));
    this.element.dispatchEvent(new Event("change", { bubbles: true }));

    // Dispatch an 'input' event, which React listens for
    const event = new Event("input", { bubbles: true });
    // Mimic React's event structure
    Object.defineProperty(event, "target", {
      value: { value },
      enumerable: true
    });
    this.element.dispatchEvent(event);

    const input = this.element;
    // Update the value
    input.value = "new value";

    // Create and dispatch an `input` event
    const event2 = new Event("input", { bubbles: true, cancelable: true });

    // Mimic React's event structure by defining `target.value`
    Object.defineProperty(event2, "target", { value: input, enumerable: true });

    // Dispatch the event
    input.dispatchEvent(event2);

    // Set the input's value
    input.value = "new value";

    // Force React to notice the update
    const event3 = new Event("input", { bubbles: true });
    Object.defineProperty(event3, "target", { value: input, enumerable: true });
    input.dispatchEvent(event3);





    // Dispatch an 'input' event, which React listens for
    const eventy = new Event("change", { bubbles: true });
    // Mimic React's event structure
    Object.defineProperty(eventy, "target", {
      value: { value },
      enumerable: true
    });
    this.element.dispatchEvent(eventy);

    // Update the value
    input.value = "new value";

    // Create and dispatch an `input` event
    const event2y = new Event("change", { bubbles: true, cancelable: true });

    // Mimic React's event structure by defining `target.value`
    Object.defineProperty(event2y, "target", { value: input, enumerable: true });


    

    // Dispatch the event
    input.dispatchEvent(event2y);

    // Set the input's value
    input.value = "new value";

    // Force React to notice the update
    const event3y = new Event("change", { bubbles: true });
    Object.defineProperty(event3y, "target", { value: input, enumerable: true });
    input.dispatchEvent(event3y);
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
