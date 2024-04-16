import Fastify, { FastifyServerOptions } from "fastify";
import { initMapping, routes } from "./utils";

export const startServer = async (
  host: string,
  port: number,
  logger: FastifyServerOptions["logger"] = true,
) => {
  const server = Fastify({
    logger,
  });

  await server.register(initMapping);
  await server.register(routes);

  try {
    await server.listen({ host, port });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
