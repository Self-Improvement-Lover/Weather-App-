export abstract class CitySearchProvider {
  abstract findCities(text: string): Promise<CitySearchResult[]>;
}

export type CitySearchResult = {
  city: string;
  countryCode: string;
};
