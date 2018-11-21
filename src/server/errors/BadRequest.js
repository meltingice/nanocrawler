export default class BadRequest extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, BadRequest);

    this.status = 400;
  }
}
