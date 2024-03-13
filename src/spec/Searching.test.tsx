import { render, fireEvent, waitFor } from "@testing-library/react";
import { App } from "../App";
import {
  DayForecast,
  WeatherDataProvider
} from "../providers/weather-data-provider";
import { CitySearchProvider } from "../providers/city-search-provider";
import { StubWeatherDataProvider } from "./stubs/stub-weather-data-provider";
import { StubCitySearchProvider } from "./stubs/stub-city-search-provider";
import { JohnTestIds } from "../components/John";

describe("Searching", () => {
  let getByPlaceholderText: ReturnType<typeof render>["getByPlaceholderText"],
    queryByText: ReturnType<typeof render>["queryByText"],
    queryByTestId: ReturnType<typeof render>["queryByTestId"],
    input: HTMLInputElement;
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

    getByPlaceholderText = renderResult.getByPlaceholderText;
    queryByText = renderResult.queryByText;
    queryByTestId = renderResult.queryByTestId;
    input = renderResult.getByPlaceholderText("Enter City") as HTMLInputElement;
  });

  describe("When I type in 3 letters to search for a city (with uppercase)", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
        {
          city: "London",
          countryCode: "GB"
        }
      ]);

      fireEvent.change(input, { target: { value: "Lon" } });

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The provider should be called as expected to find matching cities", async () => {
      expect(citySearchProvider.findCities).toHaveBeenCalledWith("Lon");
    });

    test("I should see the city suggestions displayed", async () => {
      const suggestion = queryByText("London, GB");
      expect(suggestion).not.toEqual(null);
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

        const suggestion = queryByText("London, GB")!;
        fireEvent.click(suggestion);

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      test("The selected city should be displayed in the search box", async () => {
        expect(input.value).toEqual("London");
      });

      test("The suggestion should no longer show", async () => {
        const suggestion = queryByText("London, GB");
        expect(suggestion).toEqual(null);
      });

      test("The weather data for that city should be requested as expected", async () => {
        expect(weatherDataProvider.getWeatherData).toHaveBeenCalledWith(
          "London"
        );
      });

      test.only("The weather data for that city should be displayed", async () => {
        const [todaysData] = stubForecastData;
        
        expect(
          (queryByTestId(JohnTestIds.date) as HTMLElement).textContent
        ).toEqual(todaysData.date);
        
        const icon = queryByTestId(JohnTestIds.icon) as HTMLImageElement;
        expect(icon.src).toEqual(todaysData.icon);
        expect(icon.alt).toEqual(todaysData.description);
        
        expect(
          (queryByTestId(JohnTestIds.temperature) as HTMLElement).textContent
        ).toEqual(`${todaysData.temp}°C`);

        // TODO - Finish writing these expectations
        // TODO - Finish writing these expectations
        // TODO - Finish writing these expectations
        // TODO - Finish writing these expectations
        // TODO - Finish writing these expectations
        // TODO - Finish writing these expectations
        // TODO - Finish writing these expectations
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

      fireEvent.change(input, { target: { value: "lon" } });

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The provider should be called as expected", async () => {
      expect(citySearchProvider.findCities).toHaveBeenCalledWith("lon");
    });

    test("I should see the city suggestions displayed", async () => {
      const suggestion = queryByText("London, GB");
      expect(suggestion).not.toEqual(null);
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

      fireEvent.change(input, { target: { value: "Lo" } });

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The provider should not be called", async () => {
      expect(citySearchProvider.findCities).not.toHaveBeenCalled();
    });

    test("I should not see any city suggestions displayed", async () => {
      const suggestion = queryByText("London, GB");
      expect(suggestion).toEqual(null);
    });
  });
});

/* 
3) Write more tests for Search (including what happens when you click a result)
3B) Convert to use page objects
4) Start mocking the stuff in the tests.
5) Check the app still runs (it probably wont)
6) Implement poor man's DI so that the App can run, as well as the tests.
7) Write more tests for Data etc.
8) Move Search into its own component
9) Implement a DI container (if required at that point in time)

STUFF WE WONT BOTHER WITH (for now at least)
1) Moving specs out of the src folder
*/

// projects specifically that you want me to do?
