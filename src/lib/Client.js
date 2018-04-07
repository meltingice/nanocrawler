export default class Client {
  constructor(config) {
    this.host = config.server;
  }

  async account() {
    const resp = await this.fetch("account");
    return (await resp.json()).account;
  }

  async weight() {
    const resp = await this.fetch("weight");
    return (await resp.json()).weight;
  }

  async blockCount() {
    const resp = await this.fetch("block_count");
    return (await resp.json()).blockCount;
  }

  async version() {
    const resp = await this.fetch("version");
    return await resp.json();
  }

  async delegatorsCount() {
    const resp = await this.fetch("delegators_count");
    return (await resp.json()).count;
  }

  async systemInfo() {
    const resp = await this.fetch("system_info");
    return await resp.json();
  }

  async balance() {
    const resp = await this.fetch("balance");
    return await resp.json();
  }

  async history() {
    const resp = await this.fetch("history");
    return await resp.json();
  }

  async delegators() {
    const resp = await this.fetch("delegators");
    return await resp.json();
  }

  fetch(endpoint) {
    return fetch(`${this.host}/${endpoint}`);
  }
}
