import { Entity } from "../entity";

export class NotFoundError extends Error {
  constructor(id: any, entityClass: new (...args: any[]) => Entity) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const idsMessage = Array.isArray(id) ? id.join(", ") : id;

    super(`${entityClass.name} Not found using IDs: ${idsMessage}`);

    this.name = "NotFoundError";
  }
}
