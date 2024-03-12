import { CitySearchProvider } from "../../providers/city-search-provider";
import { GeoDBCitiesAPICitySearchProvider } from "../../providers/geo-db-cities-api-city-search-provider";

describe.skip("Geo DB Cities API City Search Provider", () => {
  let provider: CitySearchProvider;

  beforeEach(async () => {
    provider = new GeoDBCitiesAPICitySearchProvider();
    // Added due to rate limit per second on this API
    await new Promise((r) => setTimeout(r, 1500));
  });

  it("Should return suggestions when nothing is provided", async () => {
    const suggestions = await provider.findCities("");
    expect(suggestions).toEqual([
      { city: "Abu Dhabi", countryCode: "AE" },
      { city: "Al Ain", countryCode: "AE" },
      { city: "Dubai", countryCode: "AE" },
      { city: "Sharjah", countryCode: "AE" },
      { city: "Herat", countryCode: "AF" },
    ]);
  });

  it("Should return relevant suggestions when text is provided", async () => {
    const suggestions = await provider.findCities("Lond");
    expect(suggestions).toEqual([
      { city: "Londrina", countryCode: "BR" },
      { city: "Londrina", countryCode: "BR" },
      { city: "Greater London", countryCode: "GB" },
      { city: "London", countryCode: "GB" },
    ]);
  });

  it("Should return no suggestions when nothing is relevant", async () => {
    const suggestions = await provider.findCities("dlaksudklashdkaljlk");
    expect(suggestions).toEqual([]);
  });
});
