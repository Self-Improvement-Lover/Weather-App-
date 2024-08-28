
export class ImagePageObject {
  constructor(private element: HTMLImageElement) { }

  get src() {
    return this.element.src;
  }

  get alt() {
    return this.element.alt;
  }
}
