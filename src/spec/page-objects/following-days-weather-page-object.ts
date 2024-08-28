import { queryByTestId } from "@testing-library/react";
import { FollowingDayDataTestIds } from "../../components/FollowingDayData";
import { ElementPageObject } from "./element-page-object";
import { ImagePageObject } from "./image-page-object";

export class FollowingDaysWeatherPageObject {
  constructor(private element: HTMLElement) { }

  get date() {
    return new ElementPageObject(
      queryByTestId(this.element, FollowingDayDataTestIds.date) as HTMLElement
    );
  }

  get icon() {
    return new ImagePageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.icon
      ) as HTMLImageElement
    );
  }

  get temperature() {
    return new ElementPageObject(
      queryByTestId(this.element, FollowingDayDataTestIds.temp) as HTMLElement
    );
  }

  get temperatureMax() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.maxTemp
      ) as HTMLElement
    );
  }

  get temperatureMin() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.minTemp
      ) as HTMLElement
    );
  }

  get feelsLike() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.feelsLike
      ) as HTMLElement
    );
  }

  get pressure() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.pressure
      ) as HTMLElement
    );
  }

  get humidity() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.humidity
      ) as HTMLElement
    );
  }

  get windSpeed() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.windSpeed
      ) as HTMLElement
    );
  }
}
