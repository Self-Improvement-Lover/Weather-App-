export class ElementPageObject {
  constructor(protected element: HTMLElement) {}

  get isDisplayed() {
    return this.element !== null;
  }

  get text() {
    return this.element.textContent;
  }

  click() {
    this.element.click();
  }

  focus() {
    this.element.focus();
  }
}
