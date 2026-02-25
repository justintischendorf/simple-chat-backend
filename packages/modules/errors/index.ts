export class MissingArgumentsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingArgumentsError";
    Object.setPrototypeOf(this, MissingArgumentsError.prototype);
  }
}
