import { render } from "@testing-library/react";
import { App } from "../App";
import {
  DayForecast,
  WeatherDataProvider
} from "../providers/weather-data-provider";
import { CitySearchProvider } from "../providers/city-search-provider";
import { StubWeatherDataProvider } from "./stubs/stub-weather-data-provider";
import { StubCitySearchProvider } from "./stubs/stub-city-search-provider";
import { AppPageObject } from "./page-objects/app-page-object";

describe("Searching", () => {
  let weatherDataProvider: WeatherDataProvider;
  let citySearchProvider: CitySearchProvider;
  let app: AppPageObject;

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

    app = new AppPageObject(renderResult.baseElement);
  });

  describe("When I type in 3 letters in the search box (with uppercase)", () => {
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

      app.cityInput.value = "Lon";

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The suggestions provider should be called as expected to find matching cities", async () => {
      expect(citySearchProvider.findCities).toHaveBeenCalledWith("Lon");
    });

    test("I should see the city suggestions displayed", async () => {
      const suggestions = app.suggestedCities;
      expect(suggestions.length).toEqual(2);
      expect(suggestions[0].text).toEqual("London, GB");
      expect(suggestions[1].text).toEqual("Londonadra, CA");
    });

    describe("When I clear the city search box", () => {
      beforeEach(async () => {
        jest.resetAllMocks();

        app.cityInput.value = "";

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      test("The provider should not be called again", async () => {
        expect(citySearchProvider.findCities).not.toHaveBeenCalled();
      });

      test("I should not see any city suggestions displayed", async () => {
        expect(app.suggestedCities.length).toEqual(0);
      });
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

        const suggestions = app.suggestedCities;

        suggestions[0].click();

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      test("The selected city should be displayed in the search box", async () => {
        expect(app.cityInput.value).toEqual("London");
      });

      test("The suggestions should no longer show", async () => {
        expect(app.suggestedCities.length).toEqual(0);
      });

      test("The weather data for that city should be requested as expected", async () => {
        expect(weatherDataProvider.getWeatherData).toHaveBeenCalledWith(
          "London"
        );
      });

      test.skip("The find cities should not have been called again", async () => {
        expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
      });

      test("Todays weather data for that city should be displayed", async () => {
        const [todaysData] = stubForecastData;

        const today = app.todaysWeather;
        expect(today.date.text).toEqual(todaysData.date);
        expect(today.icon.src).toEqual(todaysData.icon);
        expect(today.icon.alt).toEqual(todaysData.description);
        expect(today.temperature.text).toEqual(`${todaysData.temp}°C`);
        expect(today.temperatureMax.text).toEqual(`${todaysData.maxTemp}°C`);
        expect(today.temperatureMin.text).toEqual(`${todaysData.minTemp}°C`);
        expect(today.feelsLike.text).toEqual(`${todaysData.feelsLike}°C`);
        expect(today.pressure.text).toEqual(`${todaysData.pressure}hPa`);
        expect(today.humidity.text).toEqual(`${todaysData.humidity}%`);
        expect(today.windSpeed.text).toEqual(`${todaysData.windSpeed}m/s`);
      });

      test("The following days' weather data for that city should be displayed", async () => {
        const followingDays = app.followingDaysWeather;

        expect(followingDays.length).toEqual(stubForecastData.length - 1);

        for (let i = 1; i < stubForecastData.length; i++) {
          const data = stubForecastData[i];
          const day = followingDays[i - 1];

          expect(day.date.text).toEqual(data.date);
          expect(day.icon.src).toEqual(data.icon);
          expect(day.icon.alt).toEqual(data.description);
          expect(day.temperature.text).toEqual(`${data.temp}°C`);
          expect(day.temperatureMax.text).toEqual(`${data.maxTemp}°C`);
          expect(day.temperatureMin.text).toEqual(`${data.minTemp}°C`);
          expect(day.feelsLike.text).toEqual(`${data.feelsLike}°C`);
          expect(day.pressure.text).toEqual(`${data.pressure}hPa`);
          expect(day.humidity.text).toEqual(`${data.humidity}%`);
          expect(day.windSpeed.text).toEqual(`${data.windSpeed}m/s`);
        }
      });
    });
  });

  describe("When I type in 3 letters in the location box (lowercase only)", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
        {
          city: "London",
          countryCode: "GB"
        }
      ]);

      app.cityInput.value = "lon";

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The provider should be called as expected", async () => {
      expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
      expect(citySearchProvider.findCities).toHaveBeenCalledWith("lon");
    });

    test("I should see the city suggestions displayed", async () => {
      expect(app.suggestedCities.length).toEqual(1);
    });
  });

  describe("When I type in only 2 letters in the location box", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
        {
          city: "London",
          countryCode: "GB"
        }
      ]);

      app.cityInput.value = "Lo";

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The suggestions provider should not be called", async () => {
      expect(citySearchProvider.findCities).not.toHaveBeenCalled();
    });

    test("I should not see any city suggestions displayed", async () => {
      expect(app.suggestedCities.length).toEqual(0);
    });
  });

  describe("When no suggestions are found for the text I entered", () => {
    beforeEach(async () => {
      jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([]);

      app.cityInput.value = "New City";

      await new Promise(r => setTimeout(r));
      await new Promise(r => setTimeout(r));
    });

    test("The provider should be called as expected", async () => {
      expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
      expect(citySearchProvider.findCities).toHaveBeenCalledWith("New City");
    });

    test("I should not see any suggestions", async () => {
      expect(app.suggestedCities.length).toEqual(0);
    });

    describe("When I click search anyway and weather data for the city exists", () => {
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

        app.search.click();

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      test("The city should remain in the search box", async () => {
        expect(app.cityInput.value).toEqual("New City");
      });

      test("The weather data for that city should be requested as expected", async () => {
        expect(weatherDataProvider.getWeatherData).toHaveBeenCalledWith(
          "New City"
        );
      });

      test("Todays weather data for that city should be displayed", async () => {
        const [todaysData] = stubForecastData;

        const today = app.todaysWeather;
        expect(today.date.text).toEqual(todaysData.date);
        expect(today.icon.src).toEqual(todaysData.icon);
        expect(today.icon.alt).toEqual(todaysData.description);
        expect(today.temperature.text).toEqual(`${todaysData.temp}°C`);
        expect(today.temperatureMax.text).toEqual(`${todaysData.maxTemp}°C`);
        expect(today.temperatureMin.text).toEqual(`${todaysData.minTemp}°C`);
        expect(today.feelsLike.text).toEqual(`${todaysData.feelsLike}°C`);
        expect(today.pressure.text).toEqual(`${todaysData.pressure}hPa`);
        expect(today.humidity.text).toEqual(`${todaysData.humidity}%`);
        expect(today.windSpeed.text).toEqual(`${todaysData.windSpeed}m/s`);
      });

      test("The following days' weather data for that city should be displayed", async () => {
        const followingDays = app.followingDaysWeather;

        expect(followingDays.length).toEqual(stubForecastData.length - 1);

        for (let i = 1; i < stubForecastData.length; i++) {
          const data = stubForecastData[i];
          const day = followingDays[i - 1];

          expect(day.date.text).toEqual(data.date);
          expect(day.icon.src).toEqual(data.icon);
          expect(day.icon.alt).toEqual(data.description);
          expect(day.temperature.text).toEqual(`${data.temp}°C`);
          expect(day.temperatureMax.text).toEqual(`${data.maxTemp}°C`);
          expect(day.temperatureMin.text).toEqual(`${data.minTemp}°C`);
          expect(day.feelsLike.text).toEqual(`${data.feelsLike}°C`);
          expect(day.pressure.text).toEqual(`${data.pressure}hPa`);
          expect(day.humidity.text).toEqual(`${data.humidity}%`);
          expect(day.windSpeed.text).toEqual(`${data.windSpeed}m/s`);
        }
      });
    });

    describe("When I press Enter anyway and weather data for the city exists", () => {
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

        app.cityInput.pressEnter();

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      test("The city should remain in the search box", async () => {
        expect(app.cityInput.value).toEqual("New City");
      });

      test("The weather data for that city should be requested as expected", async () => {
        expect(weatherDataProvider.getWeatherData).toHaveBeenCalledWith(
          "New City"
        );
      });

      test("Todays weather data for that city should be displayed", async () => {
        const [todaysData] = stubForecastData;

        const today = app.todaysWeather;
        expect(today.date.text).toEqual(todaysData.date);
        expect(today.icon.src).toEqual(todaysData.icon);
        expect(today.icon.alt).toEqual(todaysData.description);
        expect(today.temperature.text).toEqual(`${todaysData.temp}°C`);
        expect(today.temperatureMax.text).toEqual(`${todaysData.maxTemp}°C`);
        expect(today.temperatureMin.text).toEqual(`${todaysData.minTemp}°C`);
        expect(today.feelsLike.text).toEqual(`${todaysData.feelsLike}°C`);
        expect(today.pressure.text).toEqual(`${todaysData.pressure}hPa`);
        expect(today.humidity.text).toEqual(`${todaysData.humidity}%`);
        expect(today.windSpeed.text).toEqual(`${todaysData.windSpeed}m/s`);
      });

      test("The following days' weather data for that city should be displayed", async () => {
        const followingDays = app.followingDaysWeather;

        expect(followingDays.length).toEqual(stubForecastData.length - 1);

        for (let i = 1; i < stubForecastData.length; i++) {
          const data = stubForecastData[i];
          const day = followingDays[i - 1];

          expect(day.date.text).toEqual(data.date);
          expect(day.icon.src).toEqual(data.icon);
          expect(day.icon.alt).toEqual(data.description);
          expect(day.temperature.text).toEqual(`${data.temp}°C`);
          expect(day.temperatureMax.text).toEqual(`${data.maxTemp}°C`);
          expect(day.temperatureMin.text).toEqual(`${data.minTemp}°C`);
          expect(day.feelsLike.text).toEqual(`${data.feelsLike}°C`);
          expect(day.pressure.text).toEqual(`${data.pressure}hPa`);
          expect(day.humidity.text).toEqual(`${data.humidity}%`);
          expect(day.windSpeed.text).toEqual(`${data.windSpeed}m/s`);
        }
      });
    });
  });
});

/* 
7) Write more tests for Data etc.
8) Move Search into its own component
9) Implement a DI container (if required at that point in time)

STUFF WE WONT BOTHER WITH (for now at least)
1) Moving specs out of the src folder
*/

// When I type something
// And I press backspace
// This should happen