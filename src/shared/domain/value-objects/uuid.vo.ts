import { v4 as uuid, validate as validateUuid } from "uuid";

import { ValueObject } from "../value-object";

export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || "ID must be a valid uuid");
    this.name = "InvalidUuidError";
  }
}

export class Uuid extends ValueObject {
  readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id || uuid();
    this.validate();
  }

  private validate() {
    const isValid = validateUuid(this.id);

    if (!isValid) {
      throw new InvalidUuidError();
    }
  }

  toString() {
    return this.id;
  }
}
