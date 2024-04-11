import { type FastifyInstance } from "fastify";
import { getWeather, weatherHelps } from "./weather";
import { Metric, MetricRegistry } from "./metric";

//eslint-disable-next-line @typescript-eslint/require-await
export const routes = async (server: FastifyInstance) => {
  server.get("/", (_request, reply) =>
    reply.redirect(301, `/metrics?city=54511`),
  ); // Beijing
  server.get<{ Querystring: { city: string } }>("/metrics", async (request) => {
    const cityId = +request.query.city;
    const {
      country,
      province,
      city,
      lastUpdate,
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      windDirection,
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      windScale,
      ...weathers
    } = await getWeather(cityId);

    const registry = new MetricRegistry("cmaweather");
    registry.setLabel("country", country);
    registry.setLabel("province", province);
    registry.setLabel("city", city);
    for (const [key, value] of Object.entries(weathers)) {
      registry.addMetric(
        key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`),
        new Metric.Gauge(value).setTimestamp(lastUpdate.getTime()),
        weatherHelps[key],
      );
    }
    return registry.export();
  });
};
