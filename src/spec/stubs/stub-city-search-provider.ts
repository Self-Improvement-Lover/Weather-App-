import {
  CitySearchProvider,
  CitySearchResult,
} from "../../providers/city-search-provider";

export class StubCitySearchProvider extends CitySearchProvider {
  findCities(_text: string): Promise<CitySearchResult[]> {
    throw new Error("Method not implemented.");
  }
}
