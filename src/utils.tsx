import {
  WeatherForecastResponse,
  WeatherDataObject,
} from "./providers/weather-data-provider";

export function isCurrentDay(stringDate: string): boolean {
  const input = new Date(stringDate);
  const today = new Date();
  input.setHours(0, 0, 0);
  today.setHours(0, 0, 0);
  // in this scenario,considering the api and that it already gives me the same year and month is this too much?
  const isSameYear = input.getFullYear() === today.getFullYear();
  const isSameMonth = input.getMonth() === today.getMonth();
  const isSameDay = input.getDay() === today.getDay();

  return isSameYear && isSameMonth && isSameDay;
}

export function getCurrentDayData(
  data: WeatherForecastResponse
): WeatherDataObject[] {
  const currentWeather: WeatherDataObject[] = [];

  // 8 is the maximum number of objects given per day
  for (let i = 0; i <= 8; i++) {
    if (isCurrentDay(data.list[i]?.dt_txt)) {
      currentWeather.push(data.list[i]);
      console.log(currentWeather);
    }
  }

  return currentWeather;
}

export function kelvinToCelsius(tempInKelvin: number) {
  return Number((tempInKelvin - 273.15).toFixed());
}
export function kelvinToFahrenheit(tempInKelvin: number) {
  const fahrenheit = ((tempInKelvin - 273.15) * 1.8 + 32).toFixed(0);
  return Number(fahrenheit);
}
export function temperatureToCorrectUnit(
  temperature: number,
  celsius: boolean
) {
  return celsius
    ? kelvinToCelsius(temperature)
    : kelvinToFahrenheit(temperature);
}
export function giveUnitSign(celsius: boolean) {
  return celsius ? "°C" : "°F";
}
