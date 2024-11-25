import { AppTestIds } from "../../App";
import { JohnTestIds } from "../../components/John";
import { FollowingDayDataTestIds } from "../../components/FollowingDayData";
import { ElementPageObject } from "./element-page-object";
import { TextInputPageObject } from "./text-input-page-object";
import { TodaysWeatherPageObject } from "./todays-weather-page-object";
import { FollowingDaysWeatherPageObject } from "./following-days-weather-page-object";
import { queryAllByTestId, queryByTestId } from "./query-by-test-id";

export class AppPageObject {
  private static get element() {
    console.log(document.body.innerHTML);
    const element = queryByTestId(document.body, AppTestIds.container);
    if (element === null) {
      throw new Error(
        `Element with test ID ${AppTestIds.container} was not found`
      );
    }
    return element;
  }

  static focus() {
    this.element!.focus();
  }

  static get cityInput() {
    return new TextInputPageObject(
      queryByTestId(this.element, AppTestIds.cityInput) as HTMLInputElement
    );
  }

  static get suggestedCities() {
    return queryAllByTestId(this.element, AppTestIds.suggestedCity).map(
      x => new ElementPageObject(x)
    );
  }

  static get todaysWeather() {
    return new TodaysWeatherPageObject(
      queryByTestId(this.element, JohnTestIds.container) as HTMLInputElement
    );
  }

  static get error() {
    return new ElementPageObject(
      queryByTestId(this.element, AppTestIds.error) as HTMLElement
    );
  }

  static get followingDaysWeather() {
    return (
      queryAllByTestId(
        this.element,
        FollowingDayDataTestIds.container
      ) as HTMLElement[]
    ).map(x => new FollowingDaysWeatherPageObject(x));
  }

  static get search() {
    return new ElementPageObject(
      queryByTestId(this.element, AppTestIds.searchButton) as HTMLInputElement
    );
  }
}
