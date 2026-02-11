import { SortDirection } from "@core/shared/domain/repository/search-params";
import { CastMemberType } from "../../../domain/cast-member-type.vo";
import { CastMember } from "../../../domain/cast-member.aggregate";
import { CastMemberInMemoryRepository } from "./cast-member-in-memory.repository";

describe("CastMemberInMemoryRepository", () => {
	let repository: CastMemberInMemoryRepository;

	beforeEach(() => (repository = new CastMemberInMemoryRepository()));
	it("should no filter items when searchTerm object is null", async () => {
		const items = [
			CastMember.fake().oneActor().build(),
			CastMember.fake().oneDirector().build(),
		];
		const filterSpy = jest.spyOn(items, "filter" as any);

		const itemsFiltered = await repository["applySearchTerm"](items, null);
		expect(filterSpy).not.toHaveBeenCalled();
		expect(itemsFiltered).toStrictEqual(items);
	});

	it("should filter items by name", async () => {
		const faker = CastMember.fake().oneActor();
		const items = [
			faker.withName("test").build(),
			faker.withName("TEST").build(),
			faker.withName("fake").build(),
		];
		const filterSpy = jest.spyOn(items, "filter" as any);

		const itemsFiltered = await repository["applySearchTerm"](items, {
			name: "TEST",
		});
		expect(filterSpy).toHaveBeenCalledTimes(1);
		expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
	});

	it("should filter items by type", async () => {
		const items = [
			CastMember.fake().oneActor().build(),
			CastMember.fake().oneDirector().build(),
		];
		const filterSpy = jest.spyOn(items, "filter" as any);

		let itemsFiltered = await repository["applySearchTerm"](items, {
			type: CastMemberType.createOneActor(),
		});
		expect(filterSpy).toHaveBeenCalledTimes(1);
		expect(itemsFiltered).toStrictEqual([items[0]]);

		itemsFiltered = await repository["applySearchTerm"](items, {
			type: CastMemberType.createOneDirector(),
		});
		expect(filterSpy).toHaveBeenCalledTimes(2);
		expect(itemsFiltered).toStrictEqual([items[1]]);
	});

	it("should filter items by name and type", async () => {
		const items = [
			CastMember.fake().oneActor().withName("test").build(),
			CastMember.fake().oneActor().withName("fake").build(),
			CastMember.fake().oneDirector().build(),
			CastMember.fake().oneDirector().withName("test fake").build(),
		];

		const itemsFiltered = await repository["applySearchTerm"](items, {
			name: "test",
			type: CastMemberType.createOneActor(),
		});
		expect(itemsFiltered).toStrictEqual([items[0]]);
	});

	it("should sort by created_at when sort param is null", async () => {
		const items = [
			CastMember.fake()
				.oneActor()
				.withName("test")
				.withCreatedAt(new Date())
				.build(),
			CastMember.fake()
				.oneActor()
				.withName("TEST")
				.withCreatedAt(new Date(Date.now() + 1))
				.build(),
			CastMember.fake()
				.oneActor()
				.withName("fake")
				.withCreatedAt(new Date(Date.now() + 2))
				.build(),
		];

		const itemsSorted = repository["applySort"](items, null, null);
		expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
	});

	it("should sort by name", () => {
		const items = [
			CastMember.fake().oneActor().withName("c").build(),
			CastMember.fake().oneActor().withName("b").build(),
			CastMember.fake().oneActor().withName("a").build(),
		];

		let itemsSorted = repository["applySort"](items, "name", SortDirection.ASC);
		expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

		itemsSorted = repository["applySort"](items, "name", SortDirection.DESC);
		expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
	});
});
