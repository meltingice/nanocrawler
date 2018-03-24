export default class Client {
  constructor() {
    this.host = "http://localhost:3001"
  }

  async account() {
    const resp = await fetch(`${this.host}/account`);
    return (await resp.json()).account;
  }
}
