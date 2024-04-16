import _axios from "axios";
import { defaultHeaders } from "./consts";
import { CityMapping } from "./mapping";

// custom axios instance
export const axios = _axios.create({ headers: defaultHeaders });

export const getCityId = (
  { city, province, id }: { city?: string; province?: string; id?: string },
  mapping: CityMapping,
) => {
  let cityId: number | undefined;
  if (id) {
    cityId = +id;
  } else if (province && city) {
    cityId = mapping[province]?.[city];
  } else if (city) {
    const matchedCities = Object.values(mapping).reduce(
      (acc: number[], val) => (val[city] ? [...acc, val[city]!] : acc),
      [],
    );
    if (matchedCities.length > 1)
      throw new Error("Multiple cities found, please specify the province");
    else cityId = matchedCities[0];
  }
  if (cityId === undefined) {
    throw new Error("Could not find any city matching the parameters");
  }
  return cityId;
};
