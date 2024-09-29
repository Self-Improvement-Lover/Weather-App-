import { useState, useEffect } from "react";
import { John } from "./components/John";
import {
  CityNotFoundError,
  DayForecast,
  WeatherDataProvider
} from "./providers/weather-data-provider";
import "./App.css";
import "./components/Search.css";
import {
  CitySearchProvider,
  CitySearchResult
} from "./providers/city-search-provider";

type AppProps = {
  weatherDataProvider: WeatherDataProvider;
  citySearchProvider: CitySearchProvider;
};

export function App(props: AppProps) {
  const { citySearchProvider, weatherDataProvider } = props;

  const [celsius, setCelsius] = useState(true);
  const [forecastData, setForecastData] = useState<DayForecast[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<CitySearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [cityInputText, setCityInputText] = useState("");
  // in css, make sure to hide all data when search is empty

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (cityInputText.trim().length >= 3) {
        const suggestions = await citySearchProvider.findCities(cityInputText);
        setSuggestions(suggestions);
      } else {
        setSuggestions([]);
      }
    }, App.debounce);

    return () => clearTimeout(delayDebounceFn);
  }, [cityInputText]);

  async function handleSuggestionClick(suggestion: CitySearchResult) {
    console.log("Suggestion is clicked");

    setCityInputText(suggestion.city);

    try {
      const data = await weatherDataProvider.getWeatherData(suggestion.city);
      setForecastData(data);
      setError(null);
    } catch (e) {
      setForecastData([]);
      if (e instanceof CityNotFoundError) {
        setError(
          "The city was not found. Please check spelling and try again."
        );
      }
    }
  }

  async function handleSearch() {
    if (cityInputText.length <= 3) {
      return null;
    }
    try {
      const data = await weatherDataProvider.getWeatherData(cityInputText);
      setForecastData(data);
      setError(null);
    } catch (e) {
      setForecastData([]);
      if (e instanceof CityNotFoundError) {
        setError(
          "The city was not found. Please check spelling and try again."
        );
      }
    }
  }
  return (
    <section>
      <div className="search-container">
        <div className="search-area">
          <input
            type="text"
            value={cityInputText}
            onChange={e => setCityInputText(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => {
                console.log("Hiding suggestions");
                setShowSuggestions(false);
              }, 1000);
            }}
            placeholder="Enter city name"
            data-testid={AppTestIds.cityInput}
          />
          <button
            className="search-button"
            onClick={handleSearch}
            data-testid={AppTestIds.searchButton}
          >
            Search
          </button>
          <div className="unit-container">
            <button
              className="unit-button"
              onClick={() => setCelsius(!celsius)}
            >
              {celsius ? "°C" : "°F"}
            </button>
          </div>
        </div>
        <div className="search-response">
          <ul className="suggestions">
            {showSuggestions &&
              suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  data-testid={AppTestIds.suggestedCity}
                >{`${suggestion.city}, ${suggestion.countryCode}`}</li>
              ))}
          </ul>
        </div>
      </div>
      {error ? (
        <div className="error" data-testid={AppTestIds.error}>
          {error}
        </div>
      ) : (
        <John data={forecastData} celsius={celsius} setCelsius={setCelsius} />
      )}
    </section>
  );
}

App.debounce = 600;

export const AppTestIds = {
  cityInput: "app-test-id-city-input",
  searchButton: "app-test-id-search-button",
  suggestedCity: "app-test-id-suggested-city",
  error: "app-test-id-error"
};
