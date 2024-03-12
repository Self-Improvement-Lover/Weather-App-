import { DayForecast } from "../../providers/weather-data-provider";
import { WeatherDataProvider } from "../../providers/weather-data-provider";

export class StubWeatherDataProvider extends WeatherDataProvider {
  getWeatherData(_city: string): Promise<DayForecast[]> {
    throw new Error("Method not implemented.");
  }
}
