export default class NotFound extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NotFound);

    this.status = 404;
  }
}
