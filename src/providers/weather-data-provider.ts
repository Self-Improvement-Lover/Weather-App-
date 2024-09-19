export abstract class WeatherDataProvider {
  abstract getWeatherData(city: string): Promise<DayForecast[]>;
}

export type DayForecast = {
  // TODO - Do date formatting inside our own app
  date: string;
  /*** Celsius */
  minTemp: number;
  /*** Celsius */
  maxTemp: number;
  /*** Celsius */
  temp: number;
  /*** Celsius */
  feelsLike: number;
  windSpeed: number;
  pressure: number;
  humidity: number;
  icon: string;
  description: string;
};

export class CityNotFoundError extends Error {}
