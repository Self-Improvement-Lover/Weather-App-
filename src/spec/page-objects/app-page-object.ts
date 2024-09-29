import { queryAllByTestId, queryByTestId } from "@testing-library/react";
import { AppTestIds } from "../../App";
import { JohnTestIds } from "../../components/John";
import { FollowingDayDataTestIds } from "../../components/FollowingDayData";
import { ElementPageObject } from "./element-page-object";
import { TextInputPageObject } from "./text-input-page-object";
import { TodaysWeatherPageObject } from "./todays-weather-page-object";
import { FollowingDaysWeatherPageObject } from "./following-days-weather-page-object";
import userEvent, { UserEvent } from "@testing-library/user-event";

export class AppPageObject {
  private userState: UserEvent;

  constructor(private element: HTMLElement) {
    this.userState = userEvent.setup();
  }

  async focus() {
    await this.userState.click(this.element);
  }

  get cityInput() {
    return new TextInputPageObject(
      queryByTestId(this.element, AppTestIds.cityInput) as HTMLInputElement,
      this.userState
    );
  }

  get suggestedCities() {
    return (
      queryAllByTestId(this.element, AppTestIds.suggestedCity) as HTMLElement[]
    ).map(x => new ElementPageObject(x, this.userState));
  }

  get todaysWeather() {
    return new TodaysWeatherPageObject(
      queryByTestId(this.element, JohnTestIds.container) as HTMLInputElement, this.userState
    );
  }

  get error() {
    return new ElementPageObject(
      queryByTestId(this.element, AppTestIds.error) as HTMLElement,
      this.userState
    );
  }

  get followingDaysWeather() {
    return (
      queryAllByTestId(
        this.element,
        FollowingDayDataTestIds.container
      ) as HTMLElement[]
    ).map(x => new FollowingDaysWeatherPageObject(x, this.userState));
  }

  get search() {
    return new ElementPageObject(
      queryByTestId(this.element, AppTestIds.searchButton) as HTMLInputElement,
      this.userState
    );
  }
}
