import { render, fireEvent, queryByTestId } from "@testing-library/react";
import { App, AppTestIds } from "../App";
import {
  DayForecast,
  WeatherDataProvider
} from "../providers/weather-data-provider";
import { CitySearchProvider } from "../providers/city-search-provider";
import { StubWeatherDataProvider } from "./stubs/stub-weather-data-provider";
import { StubCitySearchProvider } from "./stubs/stub-city-search-provider";
import { JohnTestIds } from "../components/John";
import { FollowingDayDataTestIds } from "../components/FollowingDayData";

describe("Searching", () => {
  let queryByTestIdApp: ReturnType<typeof render>["queryByTestId"],
    queryAllByTestIdApp: ReturnType<typeof render>["queryAllByTestId"];
  let weatherDataProvider: WeatherDataProvider;
  let citySearchProvider: CitySearchProvider;

  beforeEach(() => {
    weatherDataProvider = new StubWeatherDataProvider();
    citySearchProvider = new StubCitySearchProvider();

    App.debounce = 0;

    const renderResult = render(
      <App
        weatherDataProvider={weatherDataProvider}
        citySearchProvider={citySearchProvider}
      />
    );

    queryByTestIdApp = renderResult.queryByTestId;
    queryAllByTestIdApp = renderResult.queryAllByTestId;
  });

  describe("When I type in 3 letters to search for a city (with uppercase)", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
        {
          city: "London",
          countryCode: "GB"
        },
        {
          city: "Londonadra",
          countryCode: "CA"
        }
      ]);

      fireEvent.change(queryByTestIdApp(AppTestIds.cityInput)!, {
        target: { value: "Lon" }
      });

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The provider should be called as expected to find matching cities", async () => {
      expect(citySearchProvider.findCities).toHaveBeenCalledWith("Lon");
    });

    test("I should see the city suggestions displayed", async () => {
      const suggestions = queryAllByTestIdApp(AppTestIds.suggestedCity);
      expect(suggestions.length).toEqual(2);
      expect(suggestions[0].textContent).toEqual("London, GB");
      expect(suggestions[1].textContent).toEqual("Londonadra, CA");
    });

    describe("When I click on a suggestion", () => {
      let stubForecastData: DayForecast[];

      beforeEach(async () => {
        stubForecastData = [
          {
            date: "2024-03-13",
            description: "Getting hot boy!",
            feelsLike: 24,
            humidity: 55,
            icon: "https://test.com/good-weather-icon.png",
            maxTemp: 25,
            minTemp: 17,
            pressure: 10,
            temp: 23,
            windSpeed: 5
          },
          {
            date: "2024-03-14",
            description: "Snowing",
            feelsLike: -2,
            humidity: 80,
            icon: "https://test.com/super-cold-weather-icon.png",
            maxTemp: -1,
            minTemp: -46,
            pressure: 100,
            temp: -20,
            windSpeed: 17
          },
          {
            date: "2024-03-15",
            description: "Raining",
            feelsLike: 10,
            humidity: 100,
            icon: "https://test.com/raining-weather-icon.png",
            maxTemp: 11,
            minTemp: 2,
            pressure: 20,
            temp: 10,
            windSpeed: 3
          }
        ];
        jest
          .spyOn(weatherDataProvider, "getWeatherData")
          .mockResolvedValue(stubForecastData);

        const suggestions = queryAllByTestIdApp(AppTestIds.suggestedCity);
        fireEvent.click(suggestions[0]);

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      test("The selected city should be displayed in the search box", async () => {
        expect(
          (queryByTestIdApp(AppTestIds.cityInput) as HTMLInputElement).value
        ).toEqual("London");
      });

      test("The suggestions should no longer show", async () => {
        const suggestions = queryAllByTestIdApp(AppTestIds.suggestedCity);
        expect(suggestions.length).toEqual(0);
      });

      test("The weather data for that city should be requested as expected", async () => {
        expect(weatherDataProvider.getWeatherData).toHaveBeenCalledWith(
          "London"
        );
      });

      test("Todays weather data for that city should be displayed", async () => {
        const [todaysData] = stubForecastData;

        expect(
          (queryByTestIdApp(JohnTestIds.date) as HTMLElement).textContent
        ).toEqual(todaysData.date);

        const icon = queryByTestIdApp(JohnTestIds.icon) as HTMLImageElement;
        expect(icon.src).toEqual(todaysData.icon);
        expect(icon.alt).toEqual(todaysData.description);

        expect(
          (queryByTestIdApp(JohnTestIds.temperature) as HTMLElement).textContent
        ).toEqual(`${todaysData.temp}°C`);

        expect(
          (queryByTestIdApp(JohnTestIds.temperatureMax) as HTMLElement)
            .textContent
        ).toEqual(`${todaysData.maxTemp}°C`);

        expect(
          (queryByTestIdApp(JohnTestIds.temperatureMin) as HTMLElement)
            .textContent
        ).toEqual(`${todaysData.minTemp}°C`);

        expect(
          (queryByTestIdApp(JohnTestIds.feelsLike) as HTMLElement).textContent
        ).toEqual(`${todaysData.feelsLike}°C`);

        expect(
          (queryByTestIdApp(JohnTestIds.pressure) as HTMLElement).textContent
        ).toEqual(`${todaysData.pressure}hPa`);

        expect(
          (queryByTestIdApp(JohnTestIds.humidity) as HTMLElement).textContent
        ).toEqual(`${todaysData.humidity}%`);

        expect(
          (queryByTestIdApp(JohnTestIds.windSpeed) as HTMLElement).textContent
        ).toEqual(`${todaysData.windSpeed}m/s`);
      });

      test("The following days' weather data for that city should be displayed", async () => {
        const followingDays = queryAllByTestIdApp(
          FollowingDayDataTestIds.container
        );

        expect(followingDays.length).toEqual(stubForecastData.length - 1);

        for (let i = 1; i < stubForecastData.length; i++) {
          const data = stubForecastData[i];
          const dayElement = followingDays[i - 1];

          expect(
            (
              queryByTestId(
                dayElement,
                FollowingDayDataTestIds.date
              ) as HTMLElement
            ).textContent
          ).toEqual(data.date);

          const icon = queryByTestId(
            dayElement,
            FollowingDayDataTestIds.icon
          ) as HTMLImageElement;
          expect(icon.src).toEqual(data.icon);
          expect(icon.alt).toEqual(data.description);

          expect(
            (
              queryByTestId(
                dayElement,
                FollowingDayDataTestIds.temp
              ) as HTMLElement
            ).textContent
          ).toEqual(`${data.temp} °C`);

          expect(
            (
              queryByTestId(
                dayElement,
                FollowingDayDataTestIds.maxTemp
              ) as HTMLElement
            ).textContent
          ).toEqual(`${data.maxTemp} °C`);

          expect(
            (
              queryByTestId(
                dayElement,
                FollowingDayDataTestIds.minTemp
              ) as HTMLElement
            ).textContent
          ).toEqual(`${data.minTemp}°C`);

          expect(
            (
              queryByTestId(
                dayElement,
                FollowingDayDataTestIds.feelsLike
              ) as HTMLElement
            ).textContent
          ).toEqual(`${data.feelsLike}°C`);

          expect(
            (
              queryByTestId(
                dayElement,
                FollowingDayDataTestIds.pressure
              ) as HTMLElement
            ).textContent
          ).toEqual(`${data.pressure}hPa`);

          expect(
            (
              queryByTestId(
                dayElement,
                FollowingDayDataTestIds.humidity
              ) as HTMLElement
            ).textContent
          ).toEqual(`${data.humidity}%`);

          expect(
            (
              queryByTestId(
                dayElement,
                FollowingDayDataTestIds.windSpeed
              ) as HTMLElement
            ).textContent
          ).toEqual(`${data.windSpeed}m/s`);
        }
      });
    });
  });

  describe("When I type in 3 letters to search for a city (lowercase only)", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
        {
          city: "London",
          countryCode: "GB"
        }
      ]);

      fireEvent.change(queryByTestIdApp(AppTestIds.cityInput)!, {
        target: { value: "lon" }
      });

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The provider should be called as expected", async () => {
      expect(citySearchProvider.findCities).toHaveBeenCalledWith("lon");
    });

    test("I should see the city suggestions displayed", async () => {
      const suggestions = queryAllByTestIdApp(AppTestIds.suggestedCity);
      expect(suggestions.length).toEqual(1);
    });
  });

  describe("When I type in only 2 letters to search for a city", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
        {
          city: "London",
          countryCode: "GB"
        }
      ]);

      fireEvent.change(queryByTestIdApp(AppTestIds.cityInput)!, {
        target: { value: "Lo" }
      });

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The provider should not be called", async () => {
      expect(citySearchProvider.findCities).not.toHaveBeenCalled();
    });

    test("I should not see any city suggestions displayed", async () => {
      const suggestions = queryAllByTestIdApp(AppTestIds.suggestedCity);
      expect(suggestions.length).toEqual(0);
    });
  });
});

/* 
3B) Convert to use page objects
5) Check the app still runs (it probably wont)
6) Implement poor man's DI so that the App can run, as well as the tests.
7) Write more tests for Data etc.
8) Move Search into its own component
9) Implement a DI container (if required at that point in time)

STUFF WE WONT BOTHER WITH (for now at least)
1) Moving specs out of the src folder
*/

// projects specifically that you want me to do?
