import { queryByTestId } from "@testing-library/react";
import { JohnTestIds } from "../../components/John";
import { ElementPageObject } from "./element-page-object";
import { ImagePageObject } from "./image-page-object";

export class TodaysWeatherPageObject {
  constructor(private element: HTMLElement) { }

  get date() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.date) as HTMLElement
    );
  }

  get icon() {
    return new ImagePageObject(
      queryByTestId(this.element, JohnTestIds.icon) as HTMLImageElement
    );
  }

  get temperature() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.temperature) as HTMLElement
    );
  }

  get temperatureMax() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.temperatureMax) as HTMLElement
    );
  }

  get temperatureMin() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.temperatureMin) as HTMLElement
    );
  }

  get feelsLike() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.feelsLike) as HTMLElement
    );
  }

  get pressure() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.pressure) as HTMLElement
    );
  }

  get humidity() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.humidity) as HTMLElement
    );
  }

  get windSpeed() {
    return new ElementPageObject(
      queryByTestId(this.element, JohnTestIds.windSpeed) as HTMLElement
    );
  }
}
