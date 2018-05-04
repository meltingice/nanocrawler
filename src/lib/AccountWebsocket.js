export default class AccountWebsocket {
  constructor(host) {
    this.websocketHost = host;
    this.keepalivePing = 60 * 1000;
    this.reconnectTimeout = 5 * 1000;
    this.keepaliveTimeout = null;
    this.queuedCommands = [];

    this.subscribers = [];

    this.socket = {
      connected: false,
      ws: null
    };

    this.subscribedAccounts = [];
  }

  async connect() {
    if (!this.websocketHost) return;
    if (this.socket.connected && this.socket.ws) return;

    this.socket.ws = new WebSocket(`wss://${this.websocketHost}`);
    this.socket.ws.onopen = this.onOpen.bind(this);
    this.socket.ws.onerror = this.onError.bind(this);
    this.socket.ws.onclose = this.onClose.bind(this);
    this.socket.ws.onmessage = this.onMessage.bind(this);
  }

  disconnect() {
    if (!this.socket.connected || !this.socket.ws) return;

    if (this.keepaliveTimeout) clearTimeout(this.keepaliveTimeout);

    this.socket.ws.close();
    this.socket.connected = false;
    this.socket.ws = null;

    this.subscribers = [];
    this.subscribedAccounts = [];
    this.queuedCommands = [];
  }

  subscribeAll(subscriber) {
    this.subscribeAccounts(["all"], subscriber);
  }

  subscribeAccount(account, subscriber) {
    this.subscribeAccounts([account], subscriber);
  }

  subscribeAccounts(accounts, subscriber) {
    const event = { event: "subscribe", data: accounts };
    this.subscribers.push(subscriber);

    accounts.forEach(account => {
      if (!this.subscribedAccounts.includes(account)) {
        this.subscribedAccounts.push(account);
      }
    });

    if (!this.socket.connected) {
      this.queuedCommands.push(event);
      if (this.queuedCommands.length >= 3) {
        this.queuedCommands.shift();
      }

      return;
    }

    this.socket.ws.send(JSON.stringify(event));
  }

  unsubscribeAccount(account) {
    this.unsubscribeAccounts([account]);
  }

  unsubscribeAccounts(accounts) {
    const event = { event: "unsubscribe", data: accounts };
    accounts.forEach(account => {
      const existingIndex = this.subscribedAccounts.indexOf(account);
      if (existingIndex !== -1) {
        this.subscribedAccounts.splice(existingIndex, 1); // Remove from our internal subscription list
      }
    });

    if (this.socket.connected) {
      this.socket.ws.send(JSON.stringify(event));
    }
  }

  async serviceAvailable() {
    try {
      const resp = fetch(`https://${this.websocketHost}/health-check`, {
        mode: "cors"
      });
      return resp.ok;
    } catch (e) {
      return false;
    }
  }

  onOpen(event) {
    // console.log("Socket opened!");
    this.socket.connected = true;

    this.queuedCommands.forEach(event =>
      this.socket.ws.send(JSON.stringify(event))
    );
    this.queuedCommands = [];

    if (this.keepaliveTimeout) clearTimeout(this.keepaliveTimeout);
    this.keepalive();
  }

  onError(event) {
    console.log("Socket error", event);
  }

  onClose(event) {
    this.socket.connected = false;
    // console.log("Socket closed", event);

    setTimeout(this.attemptReconnect.bind(this), this.reconnectTimeout);
  }

  onMessage(event) {
    try {
      const newEvent = JSON.parse(event.data);

      if (newEvent.event === "newTransaction") {
        this.subscribers.forEach(sub => sub(newEvent.data));
      }
    } catch (e) {
      console.log("Error parsing message", e);
    }
  }

  attemptReconnect() {
    this.connect();
    if (this.reconnectTimeout < 30 * 1000) {
      this.reconnectTimeout += 5 * 1000; // Slowly increase the timeout up to 30 seconds
    }
  }

  keepalive() {
    if (this.socket.connected) {
      this.socket.ws.send(JSON.stringify({ event: "keepalive" }));
    }

    setTimeout(this.keepalive.bind(this), this.keepalivePing);
  }
}
