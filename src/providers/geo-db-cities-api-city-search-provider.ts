import { CitySearchProvider, CitySearchResult } from "./city-search-provider";
import { HTTPError } from "./http-error";

export class GeoDBCitiesAPICitySearchProvider extends CitySearchProvider {
  async findCities(text: string): Promise<CitySearchResult[]> {
    const response = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?minPopulation=500000&namePrefix=${text}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "b7bfc95f5amsh72769eb591c6678p11ab34jsnff2a9c991c09",
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }
    );
    if (!response.ok) {
      throw new HTTPError(
        "GET",
        response.url,
        response.status,
        await response.text()
      );
    }
    const body = await response.json();

    return body.data.map((place: Suggestion) => ({
      city: place.city,
      countryCode: place.countryCode,
    }));
  }
  
}

type Suggestion = {
  id: number;
  wikiDataId: string;
  type: string;
  city: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  regionWdId: string;
  latitude: number;
  longitude: number;
  population: number;
  distance: null;
  placeType: string;
};
