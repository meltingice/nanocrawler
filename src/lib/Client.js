export default class Client {
  constructor() {
    this.host = "http://localhost:3001"
  }

  async account() {
    const resp = await this.fetch('account');
    return (await resp.json()).account;
  }

  async blockCount() {
    const resp = await this.fetch('block_count');
    return (await resp.json()).blockCount;
  }

  async version() {
    const resp = await this.fetch('version');
    return (await resp.json());
  }

  async delegatorsCount() {
    const resp = await this.fetch('delegators_count');
    return (await resp.json()).count;
  }

  async systemInfo() {
    const resp = await this.fetch('system_info');
    return (await resp.json());
  }

  fetch(endpoint) {
    return fetch(`${this.host}/${endpoint}`);
  }
}
