export const showHelp = () =>
  console.log(`Prometheus exporter for CMA weather

Usage:
  $ prometheus-cma-weather-exporter [--args]

Options:
  -H, --host <host>  Host to listen on (default: 0.0.0.0)
  -p, --port <port>  Port to listen on (default: 9101)
  -h, --help         Display this message and exit`);
