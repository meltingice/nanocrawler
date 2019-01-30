import config from "client-config.json";

class AliasStore {
  static loading = false;
  static _aliases = {};
  static _subscribers = [];

  static async fetch() {
    if (Object.keys(this._aliases).length > 0) return this._aliases;
    if (this.loading) {
      return new Promise((resolve, reject) => {
        this._subscribers.push(aliases => resolve(aliases));
      });
    }

    this.loading = true;
    try {
      const resp = await fetch("https://mynano.ninja/api/accounts/aliases");
      if (resp.ok) {
        const data = await resp.json();
        data.forEach(a => {
          this._aliases[a.account] = a.alias;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
      this.onLoaded();
    }

    return this._aliases;
  }

  static onLoaded() {
    this._subscribers.forEach(sub => sub(this._aliases));
    this._subscribers = [];
  }
}

export default class NanoNodeNinja {
  constructor(account) {
    this.account = account;
    this.data = null;
  }

  async getAlias() {
    if (!config.currency.supportsMyNanoNinja) return;
    if (!this.account) return;

    const aliases = await AliasStore.fetch();
    return aliases[this.account];
  }

  async fetch() {
    if (!config.currency.supportsMyNanoNinja) return;
    if (!this.account) return;

    try {
      const resp = await fetch(
        `https://mynano.ninja/api/accounts/${this.account}`,
        { mode: "cors" }
      );

      if (resp.ok) {
        this.data = await resp.json();
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
}
