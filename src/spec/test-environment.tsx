import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "../App";
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
          <App
            citySearchProvider={citySearchProvider}
            weatherDataProvider={weatherDataProvider}
          />
        );
      },
      citySearchProvider,
      weatherDataProvider
    };
  }

  static async delay() {
    await new Promise<void>(resolve => {
      let timeout: any;
      const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        startTimeout();
      });
      function startTimeout() {
        timeout = setTimeout(() => {
          resolve();
          observer.disconnect();
        }, 25);
      }
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
      });
      startTimeout();
    });
  }
}
