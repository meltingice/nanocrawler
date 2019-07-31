import config from "../client-config.json";

class Client {
  constructor() {
    this.host = config.server;
  }

  async nodeAccount() {
    const resp = await this.fetch("account");
    return (await resp.json()).account;
  }

  async ticker() {
    const resp = await this.fetch("v2/ticker");
    return await resp.json();
  }

  async account(account) {
    const resp = await this.fetch(`v2/accounts/${account}`);
    return (await resp.json()).account;
  }

  async weight(account) {
    const resp = await this.fetch(`v2/accounts/${account}/weight`);
    return (await resp.json()).weight;
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
    const resp = await this.fetch("v2/network/peers");
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
    let url = `v2/accounts/${account}/history`;
    if (head) url += `?head=${head}`;
    const resp = await this.fetch(url);
    return await resp.json();
  }

  async pendingTransactions(account) {
    const resp = await this.fetch(`v2/accounts/${account}/pending`);
    return await resp.json();
  }

  async block(hash) {
    const resp = await this.fetch(`v2/blocks/${hash}`);
    return await resp.json();
  }

  async delegators(account) {
    const resp = await this.fetch(`v2/accounts/${account}/delegators`);
    return (await resp.json()).delegators;
  }

  async representativesOnline() {
    const resp = await this.fetch("v2/representatives/online");
    return (await resp.json()).representatives;
  }

  async officialRepresentatives() {
    const resp = await this.fetch("v2/representatives/official");
    return (await resp.json()).representatives;
  }

  async networkData() {
    const resp = await this.fetch("network_data");
    return (await resp.json()).network;
  }

  async activeDifficulty() {
    const resp = await this.fetch("v2/network/active_difficulty");
    return await resp.json();
  }

  async wealthDistribution() {
    const resp = await this.fetch("accounts/distribution");
    return (await resp.json()).distribution;
  }

  async frontierList(page = 1) {
    const resp = await this.fetch(`accounts/${page}`);
    return await resp.json();
  }

  async confirmationQuorum() {
    const resp = await this.fetch("confirmation_quorum");
    return await resp.json();
  }

  async confirmationHistory(count = 2048) {
    const resp = await this.fetch(`v2/confirmation/history?count=${count}`);
    return await resp.json();
  }

  async search(query) {
    if (query.trim().length < 2) return [];
    const resp = await this.fetch(`v2/search?q=${query}`);
    return (await resp.json()).accounts;
  }

  async fetch(endpoint) {
    const resp = await fetch(`${this.host}/${endpoint}`);
    if (resp.ok) return resp;
    const data = await resp.json();
    throw new Error(data.error);
  }
}

const apiClient = new Client();
export { apiClient };
