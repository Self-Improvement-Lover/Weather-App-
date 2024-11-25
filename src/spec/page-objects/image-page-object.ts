import { ElementPageObject } from "./element-page-object";

export class ImagePageObject extends ElementPageObject {
  constructor(protected element: HTMLImageElement) {
    super(element);
  }

  get src() {
    return this.element.src;
  }

  get alt() {
    return this.element.alt;
  }
}
