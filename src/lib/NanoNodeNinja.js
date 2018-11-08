import config from "client-config.json";

export default class NanoNodeNinja {
  constructor(account) {
    this.account = account;
    this.fetched = false;
    this.data = null;

    this.cacheKey = `myNanoNinja/${this.account}`;
  }

  async fetch() {
    if (!config.currency.supportsMyNanoNinja) return;
    if (!this.account) return;
    if (this.knownMissing()) return;

    try {
      const resp = await fetch(
        `https://mynano.ninja/api/accounts/${this.account}`,
        { mode: "cors" }
      );

      if (resp.ok) {
        this.data = await resp.json();
      } else {
        this.cacheMissing();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.fetched = true;
    }
  }

  hasAccount() {
    return this.data !== null && !this.data.error;
  }

  knownMissing() {
    if (window.sessionStorage) {
      try {
        return window.sessionStorage.getItem(this.cacheKey) === "false";
      } catch (e) {
        console.log(e);
      }
    }

    return false;
  }

  cacheMissing() {
    if (window.sessionStorage) {
      try {
        sessionStorage.setItem(this.cacheKey, "false");
      } catch (e) {
        console.log(e);
      }
    }
  }
}
