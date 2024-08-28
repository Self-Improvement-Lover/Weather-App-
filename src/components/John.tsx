import { useEffect, useState } from "react";
import { FollowingDayData } from "./FollowingDayData";
import {
  getCurrentDayData,
  temperatureToCorrectUnit,
  giveUnitSign
} from "../utils";
import "./John.css";
import { DayForecast } from "../providers/weather-data-provider";

export function John({ data, celsius }: JohnProps) {
  if (data.length === 0) {
    return null;
  }
  console.log(data);
  const [today, ...followingDays] = data;

  // Temp code
  celsius = true;

  return (
    <section className="current-data-container">
      <div className="todays-data" data-testid={JohnTestIds.container}>
        <div className="major-data">
          <span className="todays-date" data-testid={JohnTestIds.date}>
            {today.date}
          </span>
          <img
            src={today.icon}
            alt={today.description}
            data-testid={JohnTestIds.icon}
          />
          <div className="todays-temp">
            <span data-testid={JohnTestIds.temperature}>
              {today.temp}
              {giveUnitSign(celsius)}
            </span>
            <span className="todays-description">temperature</span>
          </div>
        </div>

        <div className="minor-data">
          <span className="temp-max">
            <span data-testid={JohnTestIds.temperatureMax}>
              {today.maxTemp}
              {giveUnitSign(celsius)}
            </span>
            <span className="description">High</span>
          </span>
          <span className="temp-min">
            <span data-testid={JohnTestIds.temperatureMin}>
              {today.minTemp}
              {giveUnitSign(celsius)}
            </span>
            <span className="description">Low</span>
          </span>
          <span className="feels-like">
            <span data-testid={JohnTestIds.feelsLike}>
              {today.feelsLike}
              {giveUnitSign(celsius)}
            </span>
            <span className="description">Feels</span>
          </span>
          <span className="pressure">
            <span data-testid={JohnTestIds.pressure}>{today.pressure}hPa</span>
            <span className="description"> Pressure</span>
          </span>
          <span className="humidity">
            <span data-testid={JohnTestIds.humidity}>{today.humidity}%</span>
            <span className="description">Humidity</span>
          </span>
          <span className="wind-speed">
            <span data-testid={JohnTestIds.windSpeed}>
              {today.windSpeed}m/s
            </span>
            <span className="description">Wind</span>
          </span>
        </div>
      </div>

      <div className="following-days-data">
        {followingDays.length > 0 ? <h2>Next 5 days:</h2> : ""}
        {followingDays.map((weather, index) => (
          <FollowingDayData
            key={index}
            daysWeather={weather}
            celsius={celsius}
          />
        ))}
      </div>
    </section>
  );
}

type JohnProps = {
  data: DayForecast[];
  celsius: boolean;
  setCelsius: React.Dispatch<React.SetStateAction<boolean>>;
};

export const JohnTestIds = {
  container: "john-test-id-container",
  date: "john-test-id-date",
  icon: "john-test-id-icon",
  temperature: "john-test-id-temperature",
  temperatureMax: "john-test-id-temperature-max",
  temperatureMin: "john-test-id-temperature-min",
  feelsLike: "john-test-id-feels-like",
  pressure: "john-test-id-pressure",
  humidity: "john-test-id-humidity",
  windSpeed: "john-test-id-wind-speed"
};
