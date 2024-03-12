import { OpenWeatherMapWeatherDataProvider } from "../../providers/open-weather-map-weather-data-provider";
import { WeatherDataProvider } from "../../providers/weather-data-provider";

describe.skip("Open Weather Map Weather Data Provider", () => {
  let provider: WeatherDataProvider;

  beforeEach(async () => {
    provider = new OpenWeatherMapWeatherDataProvider();
  });

  it("Should return data as expected", async () => {
    const result = await provider.getWeatherData("London");
    expect(result).toEqual([]);
  });
});
