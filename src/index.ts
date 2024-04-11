import Fastify from "fastify";
import minimist, { type ParsedArgs } from "minimist";
import { routes, showHelp } from "./utils";

/*
 * CLI
 */
const { help, host, port } = minimist(process.argv.slice(2), {
  alias: {
    h: "help",
    H: "host",
    p: "port",
  },
  default: {
    help: false,
    host: "127.0.0.1",
    port: 9101,
  },
}) as ParsedArgs & { help: boolean; host: string; port: number };

if (help) {
  showHelp();
  process.exit(0);
}

/*
 * Server
 */

const server = Fastify({
  logger: true,
});

await server.register(routes);

try {
  await server.listen({ host, port });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
