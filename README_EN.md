# prometheus-cma-weather-exporter

Prometheus exporter for real-time weather from [CMA](https://weather.cma.cn/)

## Quick start

1. clone this repo
2. install dependencies and build code:

   ```sh
   pnpm install
   pnpm build
   ```

3. start the server:

   ```sh
   pnpm start
   # Server listening at http://127.0.0.1:9101
   ```

4. visit http://127.0.0.1:9101/, you should see weather metrics of Beijing

## Usage

### Query parameters

> Note: Some cities may not support real-time weather

|    name    |  type  |                                        description                                         |
| :--------: | :----: | :----------------------------------------------------------------------------------------: |
|    `id`    | number | city id, the last number of [CMA Web Weather](https://weather.cma.cn/web/weather/map.html) |
| `province` | string |                                  province name in Chinese                                  |
|   `city`   | string |                                    city name in Chinese                                    |

### Command line options

Run program with `--help` to see all options

## License

[MIT](./LICENSE)
