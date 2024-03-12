import { DayForecast } from "../providers/weather-data-provider";
import { giveUnitSign } from "../utils";
import "./FollowingDayData.css";

export function FollowingDayData({
  daysWeather,
  celsius,
}: FollowingDayDataProps) {
  return (
    <div className="future-day-weather">
      <div className="future-date">{daysWeather.date}</div>
      <img src={daysWeather.icon} alt={daysWeather.description} />
      <div className="temperature">
        {daysWeather.temp} {giveUnitSign(celsius)}{" "}
        <span className="description">temperature</span>
      </div>
      <div className="future-highest-temp">
        {daysWeather.maxTemp} {giveUnitSign(celsius)}
        <span className="description">high</span>
      </div>
      <div className="future-lowest-temp">
        {daysWeather.minTemp}
        {giveUnitSign(celsius)}
        <span className="description">low</span>
      </div>
      <div className="future-feels-like">
        {daysWeather.maxTemp}
        {giveUnitSign(celsius)}
        <span className="description">feels</span>
      </div>
      <div className="future-pressure">
        {daysWeather.pressure}hPa <span className="description">pressure</span>
      </div>
      <div className="future-humidity">
        {daysWeather.humidity}% <span className="description">humidity</span>
      </div>
      <div className="future-wind-speed">
        {daysWeather.windSpeed}m/s<span className="description">wind</span>
      </div>
    </div>
  );
}

type FollowingDayDataProps = {
  daysWeather: DayForecast;
  celsius: boolean;
};
