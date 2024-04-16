#!/usr/bin/env node

import cac from "cac";
import { version } from "../package.json";
import { startServer } from "./server";

const cli = cac("prometheus-cma-weather-exporter");

cli
  .version(version)
  .option("-H, --host <host>", "host to listen on", { default: "127.0.0.1" })
  .option("-p, --port <port>", "port to listen on", { default: 9101 });

// default command
cli
  .command("")
  .option("-l, --log-level", "set the log level", { default: "info" })
  .action((options: { host: string; port: number; logLevel: string }) =>
    startServer(options.host, options.port, { level: options.logLevel }),
  );

cli
  .command("start", "Start the exporter")
  .option("-l --log-level", "set the log level", { default: "info" })
  .action((options: { host: string; port: number; logLevel: string }) =>
    startServer(options.host, options.port, { level: options.logLevel }),
  );

cli
  .command("dev", "Start the exporter in development mode")
  .action((options: { host: string; port: number }) =>
    startServer(options.host, options.port, {
      level: "debug",
      transport: {
        target: "pino-pretty",
      },
    }),
  );

cli.help().parse();
