import { axios } from "./utils";
import fastifyPlugin from "fastify-plugin";
import { CityAPIEndpoint, ProvinceAPIEndpoint, RefererPrefix } from "./consts";

export type CityMapping = Record<string, Record<string, number>>;

declare module "fastify" {
  interface FastifyInstance {
    cityMapping: CityMapping;
  }
}

interface ProvinceAPIResponse {
  code: number;
  msg: string;
  data: string;
}

interface CityAPIResponse {
  code: number;
  msg: string;
  data: string;
}

export const getCityMapping = async (): Promise<CityMapping> => {
  const { data } = await axios.get<ProvinceAPIResponse>(ProvinceAPIEndpoint, {
    headers: { referer: `${RefererPrefix}/54511` },
  });
  if (data.code !== 0)
    throw new Error(`failed to get province list: ${data.msg}(${data.code})`);

  const provinces: [string, string][] = data.data
    .split("|")
    .map((str) => str.split(",") as [string, string]);

  const cities: Record<string, Record<string, number>> = {};
  for (const [code, province] of provinces) {
    const { data } = await axios.get<CityAPIResponse>(
      `${CityAPIEndpoint}${code}`,
      {
        headers: { referer: `${RefererPrefix}/54511` },
      },
    );
    if (data.code !== 0)
      throw new Error(
        `failed to get cities of ${province}: ${data.msg}(${data.code})`,
      );

    cities[province] = {};
    data.data.split("|").forEach((str) => {
      const [id, city] = str.split(",") as [string, string];
      cities[province]![city] = +id;
    });
  }
  return cities;
};

export const initMapping = fastifyPlugin(async (server) => {
  server.log.info("Initialize city mapping...");
  try {
    server.decorate("cityMapping", await getCityMapping());
  } catch (err) {
    if (err instanceof Error)
      throw new Error(`Failed to init city mapping: ${err.message}`);
  }
});
