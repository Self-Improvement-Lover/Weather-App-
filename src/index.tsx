import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import { GeoDBCitiesAPICitySearchProvider } from "./providers/geo-db-cities-api-city-search-provider";
import { OpenWeatherMapWeatherDataProvider } from "./providers/open-weather-map-weather-data-provider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App
      citySearchProvider={new GeoDBCitiesAPICitySearchProvider()}
      weatherDataProvider={new OpenWeatherMapWeatherDataProvider()}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
