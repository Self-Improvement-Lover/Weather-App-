import { DayForecast, WeatherDataProvider } from "./weather-data-provider";

export class OpenWeatherMapWeatherDataProvider extends WeatherDataProvider {
  async getWeatherData(city: string): Promise<DayForecast[]> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
    );
    if (!response.ok) {
      throw Error("An error occurred whilst trying to fetch the data");
    }
    const data: OpenWeatherMapWeatherForecastResponse = await response.json();
    const dataForDays = new Map<string, OpenWeatherMapWeatherDataObject[]>([]);

    // Group the periods by the day they apply to
    // periods is just an object with info
    for (const period of data.list) {
      const localDate = getLocalDateString(period, data.city.timezone);
      const dayData = dataForDays.get(localDate);
      if (dayData) {
        dayData.push(period);
      } else {
        dataForDays.set(localDate, [period]);
      }
    }

    function getMostRepeatedValue(values: string[]) {
      const counts = new Map<string, number>();
      for (const value of values) {
        const existingCount = counts.get(value) ?? 0;
        counts.set(value, existingCount + 1);
      }
      return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0];
    }

    // Aggregate the data for each day
    const forecasts: DayForecast[] = [];
    for (const [date, periods] of dataForDays.entries()) {
      forecasts.push({
        date,
        description: getMostRepeatedValue(
          periods.map((x) => x.weather[0].description)
        ),
        icon: `https://openweathermap.org/img/w/${getMostRepeatedValue(
          periods.map((x) => x.weather[0].icon)
        )}.png`,
        maxTemp: to2DP(
          kelvinToCelsius(Math.max(...periods.map((x) => x.main.temp_max)))
        ),
        minTemp: to2DP(
          kelvinToCelsius(Math.min(...periods.map((x) => x.main.temp_min)))
        ),
        feelsLike: to2DP(
          kelvinToCelsius(getAverage(periods.map((x) => x.main.feels_like)))
        ),
        humidity: to2DP(getAverage(periods.map((x) => x.main.humidity))),
        pressure: to2DP(getAverage(periods.map((x) => x.main.pressure))),
        temp: to2DP(
          kelvinToCelsius(getAverage(periods.map((x) => x.main.temp)))
        ),
        windSpeed: to2DP(getAverage(periods.map((x) => x.wind.speed))),
      });
    }
    return forecasts;
  }
}

function getAverage(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function to2DP(value: number) {
  return Math.round(value * 100) / 100;
}

function kelvinToCelsius(value: number) {
  return value - 273.15;
}

function getLocalDateString(
  data: OpenWeatherMapWeatherDataObject,
  timezone: number
): string {
  return new Date((data.dt + timezone) * 1000).toISOString().slice(0, 10);
}

interface OpenWeatherMapWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: OpenWeatherMapWeatherDataObject[];
  city: City;
}

interface OpenWeatherMapWeatherDataObject {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  sys: Sys;
  dt_txt: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Rain {
  "3h": number;
}

interface Sys {
  pod: string;
}

interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Coord {
  lat: number;
  lon: number;
}
