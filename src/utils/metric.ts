export namespace Metric {
  export abstract class Metric {
    protected labels: Record<string, string> = {};
    protected timestamp: number | undefined;

    public getLabel(key: string) {
      return this.labels[key];
    }

    public setLabel(key: string, value: string) {
      this.labels[key] = value;
      return this;
    }

    public deleteLabel(key: string) {
      delete this.labels[key];
      return this;
    }

    public getTimestamp() {
      return this.timestamp;
    }

    public setTimestamp(timestamp: number) {
      this.timestamp = timestamp;
      return this;
    }

    abstract serialize(
      name: string,
      defaultLabels: Record<string, string>,
    ): string;

    public abstract readonly type: string;

    protected static serializeLine(
      name: string,
      labels: Record<string, string>,
      value: string | number,
      timestamp?: number,
    ) {
      let str = `${name} {${Object.entries(labels)
        .map(
          ([key, value]) =>
            `${key}="${value.replace(/("|\\)/g, "\\$1").replaceAll("\n", "\\n")}"`,
        )
        .join(",")}} ${value}`;
      if (typeof timestamp === "number") str += ` ${timestamp}`;
      return str;
    }
  }

  export class Counter extends Metric {
    protected count = 0;

    public increment(v: number = 1) {
      this.count += v;
      return this;
    }

    public reset() {
      this.count = 0;
      return this;
    }

    public override serialize(
      name: string,
      defaultLabels: Record<string, string>,
    ): string {
      return Metric.serializeLine(
        name,
        { ...defaultLabels, ...this.labels },
        this.count,
        this.timestamp,
      );
    }

    public override type = "counter";
  }

  export class Gauge extends Metric {
    private value: number;

    constructor(value: number = 0) {
      super();
      this.value = value;
    }

    public getValue() {
      return this.value;
    }

    public setValue(value: number) {
      this.value = value;
      return this;
    }

    public override serialize(
      name: string,
      defaultLabels: Record<string, string>,
    ): string {
      return Metric.serializeLine(
        name,
        { ...defaultLabels, ...this.labels },
        this.value,
        this.timestamp,
      );
    }

    public override type = "gauge";
  }

  //TODO: implement Summary and Histogram
}

export class MetricRegistry {
  private prefix: string;
  private registry: Record<
    string,
    { help?: string | undefined; metrics: Metric.Metric[]; type: string }
  > = {};
  private defaultLabels: Record<string, string> = {};

  constructor(prefix?: string) {
    this.prefix = prefix ? `${prefix}_` : "";
  }

  public addMetric(id: string, metric: Metric.Metric, help?: string) {
    this.registry[id] ??= { metrics: [], type: metric.type };
    if (help) this.registry[id]!.help = help;
    if (metric.type !== this.registry[id]?.type) throw new Error("");
    this.registry[id]!.metrics.push(metric);
    return this;
  }

  public getMetrics<T extends Metric.Metric = Metric.Metric>(
    id: string,
  ): T[] | undefined {
    return this.registry[id]?.metrics as T[] | undefined;
  }

  public deleteMetrics(id: string, index?: number) {
    if (index) delete this.registry[id]?.metrics[index];
    else delete this.registry[id];
    return this;
  }

  public getLabel(name: string) {
    return this.defaultLabels[name];
  }

  public setLabel(name: string, value: string) {
    this.defaultLabels[name] = value;
    return this;
  }

  public deleteLabel(name: string) {
    delete this.defaultLabels[name];
    return this;
  }

  public setPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  public export() {
    return Object.entries(this.registry)
      .map(([id, { help, metrics, type }]) => {
        let text = "";
        if (help) text += `# HELP ${this.prefix}${id} ${help}\n`;
        text += `# TYPE ${this.prefix}${id} ${type}\n`;
        metrics.forEach(
          (metric) =>
            (text += `${metric.serialize(`${this.prefix}${id}`, this.defaultLabels)}\n`),
        );
        return text;
      })
      .join("\n");
  }
}
