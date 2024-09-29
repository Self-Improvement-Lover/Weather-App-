import { queryByTestId } from "@testing-library/react";
import { FollowingDayDataTestIds } from "../../components/FollowingDayData";
import { ElementPageObject } from "./element-page-object";
import { ImagePageObject } from "./image-page-object";
import { UserEvent } from "@testing-library/user-event";

export class FollowingDaysWeatherPageObject {
  constructor(private element: HTMLElement, private userState: UserEvent) {}

  get date() {
    return new ElementPageObject(
      queryByTestId(this.element, FollowingDayDataTestIds.date) as HTMLElement,
      this.userState
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
      queryByTestId(this.element, FollowingDayDataTestIds.temp) as HTMLElement,
      this.userState
    );
  }

  get temperatureMax() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.maxTemp
      ) as HTMLElement,
      this.userState
    );
  }

  get temperatureMin() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.minTemp
      ) as HTMLElement,
      this.userState
    );
  }

  get feelsLike() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.feelsLike
      ) as HTMLElement,
      this.userState
    );
  }

  get pressure() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.pressure
      ) as HTMLElement,
      this.userState
    );
  }

  get humidity() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.humidity
      ) as HTMLElement,
      this.userState
    );
  }

  get windSpeed() {
    return new ElementPageObject(
      queryByTestId(
        this.element,
        FollowingDayDataTestIds.windSpeed
      ) as HTMLElement,
      this.userState
    );
  }
}
