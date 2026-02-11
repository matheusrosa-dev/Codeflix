import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
	constructor(public value: string) {
		super();
	}
}

class ComplexValueObject extends ValueObject {
	constructor(
		public value1: string,
		public value2: number,
	) {
		super();
	}
}

describe("ValueObject Unit Tests", () => {
	test("should be equal", () => {
		const valueObject = new StringValueObject("test");
		const valueObject2 = new StringValueObject("test");
		expect(valueObject.equals(valueObject2)).toBe(true);

		const complexValueObject = new ComplexValueObject("test", 1);
		const complexValueObject2 = new ComplexValueObject("test", 1);
		expect(complexValueObject.equals(complexValueObject2)).toBe(true);
	});

	test("should not be equal", () => {
		const valueObject = new StringValueObject("test");
		const valueObject2 = new StringValueObject("test2");
		expect(valueObject.equals(valueObject2)).toBe(false);
		expect(valueObject.equals(null!)).toBe(false);
		expect(valueObject.equals(undefined!)).toBe(false);

		const complexValueObject = new ComplexValueObject("test", 1);
		const complexValueObject2 = new ComplexValueObject("test2", 2);
		expect(complexValueObject.equals(complexValueObject2)).toBe(false);
		expect(valueObject.equals(null!)).toBe(false);
		expect(valueObject.equals(undefined!)).toBe(false);
	});
});
