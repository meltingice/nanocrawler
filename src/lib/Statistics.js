import _ from "lodash";
import Ring from "ringjs";
import { TimeEvent, TimeSeries } from "pondjs";

export default class Statistics {
  constructor(client) {
    this.client = client;
    this.data = {};
  }

  async fetch() {
    const resp = await this.client.statistics("samples");
    resp.entries.forEach(entry => {
      const key = `${entry.type}.${entry.detail}.${entry.dir}`;
      if (!this.data[key]) this.data[key] = new Ring(200);

      entry[entry.dir] = entry.value;
      const event = new TimeEvent(this.timeToDate(entry.time), entry);
      this.data[key].push(event);
      // this.data[key] = _.uniqBy(this.data[key], "time");
      // this.data[key].sort((a, b) => {
      //   if (a.date < b.date) return -1;
      //   if (a.date > b.date) return 1;
      //   return 0;
      // });
    });

    return this.data;
  }

  getTimeSeries(name, event) {
    if (!this.data[event]) return new TimeSeries({ name, events: [] });
    return new TimeSeries({ name, events: this.data[event].toArray() });
  }

  timeToDate(time) {
    const [hours, minutes, seconds] = time.split(":");
    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date;
  }
}
