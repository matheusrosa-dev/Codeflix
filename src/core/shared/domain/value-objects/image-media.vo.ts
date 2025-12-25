import { ValueObject } from "../value-object";

export abstract class ImageMedia extends ValueObject {
  readonly name: string;
  readonly location: string;

  constructor(params: { name: string; location: string }) {
    super();
    this.name = params.name;
    this.location = params.location;
  }

  get url(): string {
    return `${this.location}/${this.name}`;
  }

  toJSON() {
    return {
      name: this.name,
      location: this.location,
    };
  }
}
