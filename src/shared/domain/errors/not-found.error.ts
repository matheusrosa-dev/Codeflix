import { Entity } from "../entity";

export class NotFoundError extends Error {
  constructor(id: any, entityClass: new (...args: any[]) => Entity) {
    const idsMessage = Array.isArray(id) ? id.join(", ") : id;

    super(`${entityClass.name} Not found using IDs: ${idsMessage}`);

    this.name = "NotFoundError";
  }
}
