import axios, { AxiosResponse } from "axios";

const APIEndpoint = "https://weather.cma.cn/api/now/";
const refererPrefix = "https://weather.cma.cn/web/weather/";
const UserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

export interface APIResponse {
  code: number;
  msg: string;
  data:
    | {
        lastUpdate: string;
        location: {
          id: string;
          name: string;
          path: string;
        };
        now: {
          humidity: number;
          precipitation: number;
          pressure: number;
          temperature: number;
          windDirection: string;
          windDirectionDegree: number;
          windScale: string;
          windSpeed: number;
        };
      }
    | string; // data may be ""
}

export interface WeatherInfo {
  country: string;
  province: string;
  city: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  pressure: number;
  windDirection: string;
  windDirectionDegree: number;
  windScale: string;
  windSpeed: number;
  lastUpdate: Date;
}

export const weatherHelps: Record<string, string> = {
  temperature: "Current temperature in Celsius",
  humidity: "Current humidity percentage",
  precipitation: "Current precipitation in mm",
  pressure: "Current pressure in hPa",
  windDirectionDegree: "Current wind direction degrees",
  windSpeed: "Current wind speed in metres per second",
};

export const getWeather = async (cityId: number) => {
  let response: AxiosResponse<APIResponse>;
  try {
    response = await axios.get<APIResponse>(`${APIEndpoint}${cityId}`, {
      headers: {
        referer: `${refererPrefix}${cityId}`,
        "User-Agent": UserAgent,
      },
    });
    if (response.data.code !== 0)
      throw new Error(`${response.data.msg}(${response.data.code})`);
  } catch (err) {
    throw new Error(
      `Failed to get weather info${err instanceof Error ? `: ${err.message}` : ""}`,
    );
  }

  const { data } = response;
  if (typeof data.data === "string")
    throw new Error(`Failed to get weather info: invaild city id ${cityId}`);
  const [country, province, city] = <[string, string, string]>(
    data.data.location.path.split(", ")
  );
  const lastUpdate = new Date(
    `${data.data.lastUpdate.replaceAll("/", "-").replace(" ", "T")}+08:00`,
  ); // convert 2024/04/10 21:00 to 2024-04-10T21:00+08:00(ISO8601)
  return { ...data.data.now, country, province, city, lastUpdate };
};
