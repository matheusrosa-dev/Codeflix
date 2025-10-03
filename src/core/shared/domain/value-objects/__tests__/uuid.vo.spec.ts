import { InvalidUuidError, Uuid } from "../uuid.vo";
import { validate as validateUuid } from "uuid";

describe("Uuid Unit Tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");

  test("should create a valid uuid", () => {
    const uuid = new Uuid();
    expect(validateUuid(uuid.id)).toBe(true);

    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should throw an error when uuid is invalid", () => {
    expect(() => new Uuid("invalid-uuid")).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should accept a valid uuid", () => {
    const uuid = new Uuid("f47ac10b-58cc-4372-a567-0e02b2c3d479");
    expect(uuid.id).toBe("f47ac10b-58cc-4372-a567-0e02b2c3d479");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
