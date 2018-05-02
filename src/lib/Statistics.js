import Ring from "ringjs";

export default class Statistics {
  constructor(client) {
    this.client = client;
    this.data = {};
  }

  async fetch() {
    const resp = await this.client.statistics("samples");
    resp.entries.forEach(entry => {
      const key = `${entry.type}.${entry.detail}.${entry.dir}`;
      if (!this.data[key]) this.data[key] = new Ring(60);
      this.data[key].push({ x: entry.time, y: parseInt(entry.value, 10) });
    });
  }

  timeToDate(time) {
    const [hours, minutes, seconds] = time.split(":");
    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(0);

    return date;
  }
}
