export default class Client {
  constructor(config) {
    this.host = config.server;
  }

  async account(account = "") {
    const resp = await this.fetch(`account/${account}`);
    return (await resp.json()).account;
  }

  async weight(account) {
    const resp = await this.fetch(`account/${account}/weight`);
    return parseFloat((await resp.json()).weight, 10);
  }

  async blockCount() {
    const resp = await this.fetch("block_count");
    return (await resp.json()).blockCount;
  }

  async blockCountByType() {
    const resp = await this.fetch("block_count_by_type");
    return await resp.json();
  }

  async networkTps(period) {
    const resp = await this.fetch(`tps/${period}`);
    return (await resp.json()).tps;
  }

  async peers() {
    const resp = await this.fetch("peers");
    return (await resp.json()).peers;
  }

  async peerCount() {
    const resp = await this.fetch("peer_count");
    return (await resp.json()).peerCount;
  }

  async version() {
    const resp = await this.fetch("version");
    return await resp.json();
  }

  async systemInfo() {
    const resp = await this.fetch("system_info");
    return await resp.json();
  }

  async history(account, head = null) {
    let url = `account/${account}/history`;
    if (head) url += `?head=${head}`;
    const resp = await this.fetch(url);
    return await resp.json();
  }

  async pendingTransactions(account) {
    const resp = await this.fetch(`account/${account}/pending`);
    return await resp.json();
  }

  async block(hash) {
    const resp = await this.fetch(`block/${hash}`);
    return await resp.json();
  }

  async delegators(account) {
    const resp = await this.fetch(`account/${account}/delegators`);
    return await resp.json();
  }

  async representativesOnline() {
    const resp = await this.fetch("representatives_online");
    return (await resp.json()).representatives;
  }

  async officialRepresentatives() {
    const resp = await this.fetch("official_representatives");
    return (await resp.json()).representatives;
  }

  async networkData() {
    const resp = await this.fetch("network_data");
    return (await resp.json()).network;
  }

  async richList() {
    const resp = await this.fetch("rich_list");
    return (await resp.json()).richList;
  }

  async fetch(endpoint) {
    const resp = await fetch(`${this.host}/${endpoint}`);
    if (resp.ok) return resp;
    const data = await resp.json();
    throw new Error(data.error);
  }
}
