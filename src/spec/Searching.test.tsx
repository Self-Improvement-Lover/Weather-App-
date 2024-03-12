import { render, fireEvent, waitFor } from "@testing-library/react";
import { App } from "../App";
import { WeatherDataProvider } from "../providers/weather-data-provider";
import { CitySearchProvider } from "../providers/city-search-provider";
import { StubWeatherDataProvider } from "./stubs/stub-weather-data-provider";
import { StubCitySearchProvider } from "./stubs/stub-city-search-provider";

describe("Searching", () => {
  let getByPlaceholderText, queryByText: any, input: HTMLInputElement;
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
    input = renderResult.getByPlaceholderText("Enter City");
  });

  describe("When I type in 3 letters to search for a city (with uppercase)", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
        {
          city: "London",
          countryCode: "GB",
        },
      ]);

      fireEvent.change(input, { target: { value: "Lon" } });

      await new Promise((r) => setTimeout(r));
      await new Promise((r) => setTimeout(r));
    });

    test("The provider should be called as expected", async () => {
      expect(citySearchProvider.findCities).toHaveBeenCalledWith("Lon");
    });

    test("I should see the city suggestions displayed", async () => {
      const suggestion = queryByText("London, GB");
      expect(suggestion).not.toEqual(null);
    });

    describe("When I click on a suggestion", () => {
      beforeEach(async () => {
        jest.spyOn(weatherDataProvider, "getWeatherData").mockResolvedValue([]);

        const suggestion = queryByText("London, GB");
        fireEvent.click(suggestion);

        await new Promise((r) => setTimeout(r));
        await new Promise((r) => setTimeout(r));
      });

      test("The selected city should be displayed in the search box", async () => {
        expect(input.value).toEqual("London");
      });

      // TODO
      test("The provider should be called as expected", async () => {
        expect(citySearchProvider.findCities).toHaveBeenCalledWith("Lon");
      });

      // TODO - shouldnt this be equal to null, since London, GB would not be in the suggestions box
      test("The suggestion should no longer show", async () => {
        const suggestion = queryByText("London, GB");
        expect(suggestion).not.toEqual(null);
      });
    });
  });

  describe("When I type in 3 letters to search for a city (lowercase only)", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
        {
          city: "London",
          countryCode: "GB",
        },
      ]);

      fireEvent.change(input, { target: { value: "lon" } });

      await new Promise((r) => setTimeout(r));
      await new Promise((r) => setTimeout(r));
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
          countryCode: "GB",
        },
      ]);

      fireEvent.change(input, { target: { value: "Lo" } });

      await new Promise((r) => setTimeout(r));
      await new Promise((r) => setTimeout(r));
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

