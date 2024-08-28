import { useState, useEffect } from "react";
import { John } from "./components/John";
import {
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
  const [getWeatherError, setGetWeatherError] = useState<string>("");

  const [autoSuggestions, setAutoSuggestions] = useState<CitySearchResult[]>(
    []
  );
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestionsError, setSuggestionsError] = useState("");
  const [search, setSearch] = useState("");
  // in css, make sure to hide all data when search is empty
  async function getAutoSuggestions() {
    try {
      const suggestions = await citySearchProvider.findCities(search);
      setAutoSuggestions(suggestions);
      setSuggestionsError("");
    } catch (error: any) {
      console.error("AutoComplete Fetch Error:" + error);
      setSuggestionsError(error.message + ". Please try again");
      setAutoSuggestions([]);
      setForecastData([]);
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim().length >= 3) {
        getAutoSuggestions();
      } else {
        setAutoSuggestions([]);
        setForecastData([]);
      }
    }, App.debounce);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  async function handleSuggestionClick(suggestion: CitySearchResult) {
    setSearch(suggestion.city);
    setSelectedSuggestion(suggestion.city);
    setShowSuggestions(false);

    try {
      const data = await weatherDataProvider.getWeatherData(suggestion.city);
      console.log(data);
      setForecastData(data);
      setGetWeatherError("");
    } catch (e) {
      setForecastData([]);
      setGetWeatherError(
        "There was an Error getting the data, please check spelling and try again"
      );
    }
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (selectedSuggestion && e.key === "Backspace") {
      setShowSuggestions(true);
    }
    if (e.key === "Enter") {
      setShowSuggestions(false);
      handleSearch();
    }
    if (e.currentTarget?.value.length <= 3 && e.key === "Enter") {
      setSuggestionsError("Please enter a city with more than 3 characters");
    } else {
      setSuggestionsError("");
    }
    setSelectedSuggestion("");
    setSearch(e.currentTarget?.value);
    setGetWeatherError("");
  }

  async function handleSearch() {
    if (search.length <= 3) {
      return null;
    }
    setShowSuggestions(false);

    try {
      const data = await weatherDataProvider.getWeatherData(search);
      setForecastData(data);
      setGetWeatherError("");
    } catch (e) {
      setForecastData([]);
      setGetWeatherError(
        "There was an Error getting the data, please check spelling and try again"
      );
    }
  }
  return (
    <section>
      <article className="search-container">
        <div className="search-area">
          <input
            type="text"
            value={selectedSuggestion ? selectedSuggestion : search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter City"
            data-testid={AppTestIds.cityInput}
          />
          <button className="search-button" onClick={handleSearch}>
            <i className="fa-solid fa-magnifying-glass"></i>
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
          {suggestionsError && <div className="error">{suggestionsError}</div>}
          <ul className="suggestions">
            {showSuggestions &&
              autoSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  data-testid={AppTestIds.suggestedCity}
                >{`${suggestion.city}, ${suggestion.countryCode}`}</li>
              ))}
          </ul>
        </div>
      </article>
      {getWeatherError ? (
        <div className="error">{getWeatherError}</div>
      ) : (
        <John data={forecastData} celsius={celsius} setCelsius={setCelsius} />
      )}
    </section>
  );
}

App.debounce = 600;

export const AppTestIds = {
  cityInput: "app-test-id-city-input",
  suggestedCity: "app-test-id-suggested-city"
};
