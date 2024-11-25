import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "../App";
import { GeoDBCitiesAPICitySearchProvider } from "../providers/geo-db-cities-api-city-search-provider";
import { OpenWeatherMapWeatherDataProvider } from "../providers/open-weather-map-weather-data-provider";
import "./index.css";
import { StubCitySearchProvider } from "./stubs/stub-city-search-provider";
import { StubWeatherDataProvider } from "./stubs/stub-weather-data-provider";

export class TestEnvironment {
  static setup() {
    document.body.innerHTML = "";
    const root = document.createElement("div");
    document.body.appendChild(root);

    App.debounce = 0;

    const citySearchProvider = new StubCitySearchProvider();
    const weatherDataProvider = new StubWeatherDataProvider();

    return {
      render: () => {
        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <App
              citySearchProvider={citySearchProvider}
              weatherDataProvider={weatherDataProvider}
            />
          </React.StrictMode>
        );
      },
      citySearchProvider,
      weatherDataProvider
    };
  }
}
