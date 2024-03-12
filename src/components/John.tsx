import { useEffect, useState } from "react";
import { FollowingDayData } from "./FollowingDayData";
import {
  getCurrentDayData,
  temperatureToCorrectUnit,
  giveUnitSign,
} from "../utils";
import "./John.css";
import { DayForecast } from "../providers/weather-data-provider";

export function John({ data, celsius }: JohnProps) {
  if (data.length === 0) {
    return null;
  }
console.log(data)
  const [today, ...followingDays] = data;

  // Temp code
  celsius = true;

  return (
    <section className="current-data-container">
      <div className="todays-data">
        <div className="major-data">
          <span className="todays-date">{today.date}</span>
          <img src={today.icon} alt={today.description} />

          <div className="todays-temp">
            {today.temp}
            {giveUnitSign(celsius)}
            <span className="todays-description">temperature</span>
          </div>
        </div>

        <div className="minor-data">
          <span className="temp-max">
            {today.maxTemp}
            {giveUnitSign(celsius)}
            <span className="description">High</span>
          </span>
          <span className="temp-min">
            {today.minTemp}
            {giveUnitSign(celsius)}
            <span className="description">Low</span>
          </span>
          <span className="feels-like">
            {today.feelsLike}
            {giveUnitSign(celsius)}
            <span className="description">Feels</span>
          </span>
          <span className="pressure">
            {today.pressure}hPa
            <span className="description"> Pressure</span>
          </span>
          <span className="humidity">
            {today.humidity}%<span className="description">Humidity</span>
          </span>
          <span className="wind-speed">
            {today.windSpeed}m/s
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


