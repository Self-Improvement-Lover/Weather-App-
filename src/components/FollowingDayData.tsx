import { DayForecast } from "../providers/weather-data-provider";
import { giveUnitSign } from "../utils";
import "./FollowingDayData.css";

export function FollowingDayData({
  daysWeather,
  celsius
}: FollowingDayDataProps) {
  return (
    <div
      className="future-day-weather"
      data-testid={FollowingDayDataTestIds.container}
    >
      <div className="future-date" data-testid={FollowingDayDataTestIds.date}>
        {daysWeather.date}
      </div>
      <img
        src={daysWeather.icon}
        alt={daysWeather.description}
        data-testid={FollowingDayDataTestIds.icon}
      />
      <div className="temperature">
        <span data-testid={FollowingDayDataTestIds.temp}>
          {daysWeather.temp}
          {giveUnitSign(celsius)}
        </span>
        <span className="description">temperature</span>
      </div>
      <div className="future-highest-temp">
        <span data-testid={FollowingDayDataTestIds.maxTemp}>
          {daysWeather.maxTemp}
          {giveUnitSign(celsius)}
        </span>
        <span className="description">high</span>
      </div>
      <div className="future-lowest-temp">
        <span data-testid={FollowingDayDataTestIds.minTemp}>
          {daysWeather.minTemp}
          {giveUnitSign(celsius)}
        </span>
        <span className="description">low</span>
      </div>
      <div className="future-feels-like">
        <span data-testid={FollowingDayDataTestIds.feelsLike}>
          {daysWeather.feelsLike}
          {giveUnitSign(celsius)}
        </span>
        <span className="description">feels</span>
      </div>
      <div className="future-pressure">
        <span data-testid={FollowingDayDataTestIds.pressure}>
          {daysWeather.pressure}hPa
        </span>
        <span className="description">pressure</span>
      </div>
      <div className="future-humidity">
        <span data-testid={FollowingDayDataTestIds.humidity}>
          {daysWeather.humidity}%
        </span>
        <span className="description">humidity</span>
      </div>
      <div className="future-wind-speed">
        <span data-testid={FollowingDayDataTestIds.windSpeed}>
          {daysWeather.windSpeed}m/s
        </span>
        <span className="description">wind</span>
      </div>
    </div>
  );
}

type FollowingDayDataProps = {
  daysWeather: DayForecast;
  celsius: boolean;
};

export const FollowingDayDataTestIds = {
  container: "following-day-data-test-id",
  date: "following-day-data-test-id-date",
  icon: "following-day-data-test-id-icon",
  temp: "following-day-data-test-id-temp",
  maxTemp: "following-day-data-test-id-max-temp",
  minTemp: "following-day-data-test-id-min-temp",
  feelsLike: "following-day-data-test-id-feels-like",
  pressure: "following-day-data-test-id-pressure",
  humidity: "following-day-data-test-id-humidity",
  windSpeed: "following-day-data-test-id-wind-speed"
};
