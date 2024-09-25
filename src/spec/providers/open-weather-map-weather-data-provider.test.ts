import { OpenWeatherMapWeatherDataProvider } from "../../providers/open-weather-map-weather-data-provider";
import {
  CityNotFoundError,
  WeatherDataProvider
} from "../../providers/weather-data-provider";

describe.skip("Open Weather Map Weather Data Provider", () => {
  let provider: WeatherDataProvider;

  beforeEach(async () => {
    provider = new OpenWeatherMapWeatherDataProvider();
  });

  it("Should return data as expected", async () => {
    const result = await provider.getWeatherData("London");
    expect(result).toBeInstanceOf(Array);
  });

  it("Should throw a CityNotFound error when the city is not found", async () => {
    // await expect(provider.getWeatherData("dasdasdasdasdasd")).rejects.toBeInstanceOf(CityNotFoundError)
    try {
      provider.getWeatherData("dasdasdasdasdasd");
      throw new Error("Should have rejected");
    } catch (error) {
      expect(error).toBeInstanceOf(CityNotFoundError);
    }
  });
});
