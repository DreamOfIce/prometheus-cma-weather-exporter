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

### Get city id

> Note: Some cities may not support real-time weather

Visit https://weather.cma.cn/web/weather/map.html and choose a city, the last number is the city id

### Command line options

```
  -H, --host <host>  Host to listen on (default: 0.0.0.0)
  -p, --port <port>  Port to listen on (default: 9101)
  -h, --help         Display helps and exit
```

## License

[MIT](./LICENSE)
