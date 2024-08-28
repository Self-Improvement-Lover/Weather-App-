import { queryAllByTestId, queryByTestId } from "@testing-library/react";
import { AppTestIds } from "../../App";
import { JohnTestIds } from "../../components/John";
import { FollowingDayDataTestIds } from "../../components/FollowingDayData";
import { ElementPageObject } from "./element-page-object";
import { TextInputPageObject } from "./text-input-page-object";
import { TodaysWeatherPageObject } from "./todays-weather-page-object";
import { FollowingDaysWeatherPageObject } from "./following-days-weather-page-object";

export class AppPageObject {
  constructor(private element: HTMLElement) {}

  get cityInput() {
    return new TextInputPageObject(
      queryByTestId(this.element, AppTestIds.cityInput) as HTMLInputElement
    );
  }

  get suggestedCities() {
    return (
      queryAllByTestId(this.element, AppTestIds.suggestedCity) as HTMLElement[]
    ).map(x => new ElementPageObject(x));
  }

  get todaysWeather() {
    return new TodaysWeatherPageObject(
      queryByTestId(this.element, JohnTestIds.container) as HTMLInputElement
    );
  }

  get followingDaysWeather() {
    return (
      queryAllByTestId(
        this.element,
        FollowingDayDataTestIds.container
      ) as HTMLElement[]
    ).map(x => new FollowingDaysWeatherPageObject(x));
  }
}
