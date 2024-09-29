import { queryByTestId } from "@testing-library/react";
import { JohnTestIds } from "../../components/John";
import { ElementPageObject } from "./element-page-object";
import { ImagePageObject } from "./image-page-object";
import { UserEvent } from "@testing-library/user-event";

export class TodaysWeatherPageObject extends ElementPageObject {
  constructor(element: HTMLElement, userState: UserEvent) {
    super(element, userState);
  }

  get date() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.date) as HTMLElement,
      this.userState
    );
  }

  get icon() {
    return new ImagePageObject(
      queryByTestId(this.element, JohnTestIds.icon) as HTMLImageElement
    );
  }

  get temperature() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.temperature) as HTMLElement,
      this.userState
    );
  }

  get temperatureMax() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.temperatureMax) as HTMLElement,
      this.userState
    );
  }

  get temperatureMin() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.temperatureMin) as HTMLElement,
      this.userState
    );
  }

  get feelsLike() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.feelsLike) as HTMLElement,
      this.userState
    );
  }

  get pressure() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.pressure) as HTMLElement,
      this.userState
    );
  }

  get humidity() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.humidity) as HTMLElement,
      this.userState
    );
  }

  get windSpeed() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.windSpeed) as HTMLElement,
      this.userState
    );
  }
}
