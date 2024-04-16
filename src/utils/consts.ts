export const ProjectName = "prometheus-cma-weather-exporter";
export const MetricPrefix = "cmaweather";

// API endpoints
export const WeatherAPIEndpoint = "https://weather.cma.cn/api/now/";
export const ProvinceAPIEndpoint = "https://weather.cma.cn/api/dict/province";
export const CityAPIEndpoint = "https://weather.cma.cn/api/dict/province/";

// Request configs
export const defaultHeaders = {
  UserAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "X-Requested-With": "XMLHttpRequest",
};
export const RefererPrefix = "https://weather.cma.cn/web/weather";
