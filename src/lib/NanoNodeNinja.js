export default class NanoNodeNinja {
  constructor(account) {
    this.account = account;
    this.fetched = false;
    this.data = null;
  }

  async fetch() {
    if (!this.account) return;

    try {
      const data = await fetch(
        `https://nanonode.ninja/api/accounts/${this.account}`,
        { mode: "cors" }
      );

      this.data = await data.json();
    } catch (e) {
      console.log(e);
    } finally {
      this.fetched = true;
    }
  }

  hasAccount() {
    return this.data !== null && !this.data.error;
  }
}
