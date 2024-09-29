import { render } from "@testing-library/react";
import { App } from "../App";
import { WeatherDataProvider } from "../providers/weather-data-provider";
import { CitySearchProvider } from "../providers/city-search-provider";
import { StubWeatherDataProvider } from "./stubs/stub-weather-data-provider";
import { StubCitySearchProvider } from "./stubs/stub-city-search-provider";
import { AppPageObject } from "./page-objects/app-page-object";

describe("Suggestions", () => {
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

  it("No suggestions should be shown", async () => {
    expect(app.suggestedCities.length).toEqual(0);
  });

  describe("When I focus on the search box", () => {
    beforeEach(async () => {
      await app.cityInput.focus();
      await new Promise(r => setTimeout(r, 0));
    });

    it("No suggestions should be shown", async () => {
      expect(app.suggestedCities.length).toEqual(0);
    });

    describe("When I enter some text into the search box for which suggestions are returned", () => {
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

        await app.cityInput.setValue("London");

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      it("The provider should be called as expected", async () => {
        expect(citySearchProvider.findCities).toHaveBeenCalledWith("London");
      });

      it("The city suggestions should be displayed", async () => {
        const suggestions = app.suggestedCities;
        expect(suggestions.length).toEqual(2);
        expect(suggestions[0].text).toEqual("London, GB");
        expect(suggestions[1].text).toEqual("Londonadra, CA");
      });

      describe("When I clear the search box", () => {
        beforeEach(async () => {
          await app.cityInput.setValue("");

          await new Promise(r => setTimeout(r));
          await new Promise(r => setTimeout(r));
        });

        it("The provider should not be called again", async () => {
          expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
        });

        it("The suggestions should no longer be displayed", async () => {
          const suggestions = app.suggestedCities;
          expect(suggestions.length).toEqual(0);
        });
      });

      describe("When I am no longer focused on the search box", () => {
        beforeEach(async () => {
          await app.focus();

          await new Promise(r => setTimeout(r));
          await new Promise(r => setTimeout(r));
        });

        it("The provider should not be called again", async () => {
          expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
        });

        it("The suggestions should no longer be displayed", async () => {
          const suggestions = app.suggestedCities;
          expect(suggestions.length).toEqual(0);
        });

        describe("When I refocus on the search box", () => {
          beforeEach(async () => {
            await app.cityInput.focus();

            await new Promise(r => setTimeout(r));
            await new Promise(r => setTimeout(r));
          });

          it("The provider should not be called again", async () => {
            expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
          });

          it("The suggestions should be displayed again", async () => {
            const suggestions = app.suggestedCities;
            expect(suggestions.length).toEqual(2);
            expect(suggestions[0].text).toEqual("London, GB");
            expect(suggestions[1].text).toEqual("Londonadra, CA");
          });
        });
      });

      describe("When I change the text to a value for which other suggestions are found", () => {
        beforeEach(async () => {
          jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([
            {
              city: "New York",
              countryCode: "US"
            },
            {
              city: "New Fish",
              countryCode: "CA"
            }
          ]);

          await app.cityInput.setValue("New");

          await new Promise(r => setTimeout(r));
          await new Promise(r => setTimeout(r));
        });

        it("The provider should be called again, this time with the new value", async () => {
          expect(citySearchProvider.findCities).toHaveBeenCalledTimes(2);
          expect(citySearchProvider.findCities).toHaveBeenCalledWith("New");
        });

        it("The city suggestions should be displayed", async () => {
          const suggestions = app.suggestedCities;
          expect(suggestions.length).toEqual(2);
          expect(suggestions[0].text).toEqual("New York, US");
          expect(suggestions[1].text).toEqual("New Fish, CA");
        });
      });

      describe("When I change the text to a value for which no suggestions are found", () => {
        beforeEach(async () => {
          jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([]);

          await app.cityInput.setValue("Blahblah");

          await new Promise(r => setTimeout(r));
          await new Promise(r => setTimeout(r));
        });

        it("The provider should be called as expected", async () => {
          expect(citySearchProvider.findCities).toHaveBeenCalledTimes(2);
          expect(citySearchProvider.findCities).toHaveBeenCalledWith(
            "Blahblah"
          );
        });

        it("The city suggestions should not be displayed", async () => {
          const suggestions = app.suggestedCities;
          expect(suggestions.length).toEqual(0);
        });
      });

      describe("When I click on a suggestion that fully matches the search text", () => {
        beforeEach(async () => {
          jest
            .spyOn(weatherDataProvider, "getWeatherData")
            .mockResolvedValue([]);
          await app.suggestedCities[0].click();

          await new Promise(r => setTimeout(r));
          await new Promise(r => setTimeout(r));
        });

        it("The input should not be updated", async () => {
          expect(app.cityInput.value).toEqual("London");
        });

        it("The suggestion provider should not be called again", async () => {
          expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
        });

        it("The weather data should be retrieved for that city", async () => {
          expect(weatherDataProvider.getWeatherData).toHaveBeenCalledTimes(1);
          expect(weatherDataProvider.getWeatherData).toHaveBeenCalledWith(
            "London"
          );
        });

        it("The suggestions should no longer be displayed", async () => {
          const suggestions = app.suggestedCities;
          expect(suggestions.length).toEqual(0);
        });

        describe("When I refocus on the search box", () => {
          beforeEach(async () => {
            await app.cityInput.focus();

            await new Promise(r => setTimeout(r));
            await new Promise(r => setTimeout(r));
          });

          it("The provider should not be called again", async () => {
            expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
          });

          it("The suggestions should be displayed again", async () => {
            const suggestions = app.suggestedCities;
            expect(suggestions.length).toEqual(2);
            expect(suggestions[0].text).toEqual("London, GB");
            expect(suggestions[1].text).toEqual("Londonadra, CA");
          });
        });
      });

      describe("When I click on a suggestion that does not fully match the search text", () => {
        beforeEach(async () => {
          jest
            .spyOn(weatherDataProvider, "getWeatherData")
            .mockResolvedValue([]);
          console.log("Clicking");
          await app.suggestedCities[1].click();

          await new Promise(r => setTimeout(r));
          await new Promise(r => setTimeout(r, 100));
        });

        it("The input should be updated to match the suggestion clicked", async () => {
          console.log("Asserting");
          expect(app.cityInput.value).toEqual("Londonadra");
        });

        it("The suggestion provider should not be called again", async () => {
          expect(citySearchProvider.findCities).toHaveBeenCalledTimes(1);
        });

        it("The weather data should be retrieved for that city", async () => {
          expect(weatherDataProvider.getWeatherData).toHaveBeenCalledTimes(1);
          expect(weatherDataProvider.getWeatherData).toHaveBeenCalledWith(
            "Londonadra"
          );
        });

        it("The suggestions should no longer be displayed", async () => {
          const suggestions = app.suggestedCities;
          expect(suggestions.length).toEqual(0);
        });

        describe("When I refocus on the search box", () => {
          beforeEach(async () => {
            jest
              .spyOn(citySearchProvider, "findCities")
              .mockImplementation(async () => {
                await new Promise(r => setTimeout(r, 10));
                return [
                  {
                    city: "Londonadra",
                    countryCode: "CA"
                  },
                  {
                    city: "Londonalia",
                    countryCode: "IT"
                  }
                ];
              });

            await app.cityInput.focus();

            await new Promise(r => setTimeout(r));
          });

          it("The suggestion provider should be called again", async () => {
            expect(citySearchProvider.findCities).toHaveReturnedTimes(2);
            expect(citySearchProvider.findCities).toHaveBeenCalledWith(
              "Londonadra"
            );
          });

          it("The suggestions should not be displayed immediately", async () => {
            const suggestions = app.suggestedCities;
            expect(suggestions.length).toEqual(0);
          });

          it("The suggestions should eventually be displayed with the new suggestions", async () => {
            await new Promise(r => setTimeout(r, 15));
            const suggestions = app.suggestedCities;
            expect(suggestions.length).toEqual(2);
            expect(suggestions[0].text).toEqual("Londonadra, CA");
            expect(suggestions[1].text).toEqual("Londonalia, IT");
          });
        });
      });
    });

    describe("When I enter some text into the search box for which no suggestions are returned", () => {
      beforeEach(async () => {
        jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([]);

        await app.cityInput.setValue("something not found");

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      it("The provider should be called as expected", async () => {
        expect(citySearchProvider.findCities).toHaveBeenCalledWith(
          "something not found"
        );
      });

      it("The city suggestions should not be displayed", async () => {
        const suggestions = app.suggestedCities;
        expect(suggestions.length).toEqual(0);
      });
    });

    describe("When I enter less than 3 characters into the search box", () => {
      beforeEach(async () => {
        jest.spyOn(citySearchProvider, "findCities").mockResolvedValue([]);

        await app.cityInput.setValue("so");

        await new Promise(r => setTimeout(r));
        await new Promise(r => setTimeout(r));
      });

      it("The provider should not be called", async () => {
        expect(citySearchProvider.findCities).not.toHaveBeenCalled();
      });
    });
  });
});
