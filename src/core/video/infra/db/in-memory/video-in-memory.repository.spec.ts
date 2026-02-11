import { SortDirection } from "@core/shared/domain/repository/search-params";
import { CategoryId } from "../../../../category/domain/category.aggregate";
import { GenreId } from "../../../../genre/domain/genre.aggregate";
import { Video } from "../../../domain/video.aggregate";
import { VideoInMemoryRepository } from "./video-in-memory.repository";

describe("VideoInMemoryRepository", () => {
	let repository: VideoInMemoryRepository;

	beforeEach(() => (repository = new VideoInMemoryRepository()));

	it("should no filter items when searchTerm object is null", async () => {
		const items = [
			Video.fake().oneVideoWithoutMedias().build(),
			Video.fake().oneVideoWithoutMedias().build(),
		];
		const filterSpy = jest.spyOn(items, "filter");

		const itemsFiltered = await repository["applySearchTerm"](items, null);
		expect(filterSpy).not.toHaveBeenCalled();
		expect(itemsFiltered).toStrictEqual(items);
	});

	it("should filter items by title", async () => {
		const faker = Video.fake().oneVideoWithAllMedias();
		const items = [
			faker.withTitle("test").build(),
			faker.withTitle("TEST").build(),
			faker.withTitle("fake").build(),
		];
		const filterSpy = jest.spyOn(items, "filter");

		const itemsFiltered = await repository["applySearchTerm"](items, {
			title: "TEST",
		});
		expect(filterSpy).toHaveBeenCalledTimes(1);
		expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
	});

	it("should filter items by categories_id", async () => {
		const categoryId1 = new CategoryId();
		const categoryId2 = new CategoryId();
		const categoryId3 = new CategoryId();
		const categoryId4 = new CategoryId();
		const items = [
			Video.fake()
				.oneVideoWithoutMedias()
				.addCategoryId(categoryId1)
				.addCategoryId(categoryId2)
				.build(),
			Video.fake()
				.oneVideoWithoutMedias()
				.addCategoryId(categoryId3)
				.addCategoryId(categoryId4)
				.build(),
		];
		const filterSpy = jest.spyOn(items, "filter" as any);

		let itemsFiltered = await repository["applySearchTerm"](items, {
			categories_id: [categoryId1],
		});
		expect(filterSpy).toHaveBeenCalledTimes(1);
		expect(itemsFiltered).toStrictEqual([items[0]]);

		itemsFiltered = await repository["applySearchTerm"](items, {
			categories_id: [categoryId2],
		});
		expect(filterSpy).toHaveBeenCalledTimes(2);
		expect(itemsFiltered).toStrictEqual([items[0]]);

		itemsFiltered = await repository["applySearchTerm"](items, {
			categories_id: [categoryId1, categoryId2],
		});
		expect(filterSpy).toHaveBeenCalledTimes(3);
		expect(itemsFiltered).toStrictEqual([items[0]]);

		itemsFiltered = await repository["applySearchTerm"](items, {
			categories_id: [categoryId1, categoryId3],
		});
		expect(filterSpy).toHaveBeenCalledTimes(4);
		expect(itemsFiltered).toStrictEqual([...items]);

		itemsFiltered = await repository["applySearchTerm"](items, {
			categories_id: [categoryId3, categoryId1],
		});
		expect(filterSpy).toHaveBeenCalledTimes(5);
		expect(itemsFiltered).toStrictEqual([...items]);
	});

	it("should filter items by title and categories_id", async () => {
		const categoryId1 = new CategoryId();
		const categoryId2 = new CategoryId();
		const categoryId3 = new CategoryId();
		const categoryId4 = new CategoryId();
		const items = [
			Video.fake()
				.oneVideoWithoutMedias()
				.withTitle("test")
				.addCategoryId(categoryId1)
				.addCategoryId(categoryId2)
				.build(),
			Video.fake()
				.oneVideoWithoutMedias()
				.withTitle("fake")
				.addCategoryId(categoryId3)
				.addCategoryId(categoryId4)
				.build(),
			Video.fake()
				.oneVideoWithoutMedias()
				.withTitle("test fake")
				.addCategoryId(categoryId1)
				.build(),
		];

		let itemsFiltered = await repository["applySearchTerm"](items, {
			title: "test",
			categories_id: [categoryId1],
		});
		expect(itemsFiltered).toStrictEqual([items[0], items[2]]);

		itemsFiltered = await repository["applySearchTerm"](items, {
			title: "test",
			categories_id: [categoryId3],
		});
		expect(itemsFiltered).toStrictEqual([]);

		itemsFiltered = await repository["applySearchTerm"](items, {
			title: "fake",
			categories_id: [categoryId4],
		});
		expect(itemsFiltered).toStrictEqual([items[1]]);
	});

	it("should filter items by title and categories_id and genres_id", async () => {
		const categoryId1 = new CategoryId();
		const categoryId2 = new CategoryId();
		const categoryId3 = new CategoryId();
		const categoryId4 = new CategoryId();

		const genreId1 = new GenreId();
		const items = [
			Video.fake()
				.oneVideoWithoutMedias()
				.withTitle("test")
				.addCategoryId(categoryId1)
				.addCategoryId(categoryId2)
				.build(),
			Video.fake()
				.oneVideoWithoutMedias()
				.withTitle("fake")
				.addCategoryId(categoryId3)
				.addCategoryId(categoryId4)
				.build(),
			Video.fake()
				.oneVideoWithoutMedias()
				.withTitle("test fake")
				.addCategoryId(categoryId1)
				.addGenreId(genreId1)
				.build(),
		];

		const itemsFiltered = await repository["applySearchTerm"](items, {
			title: "test",
			categories_id: [categoryId1],
			genres_id: [genreId1],
		});
		expect(itemsFiltered).toStrictEqual([items[2]]);
	});

	it("should sort by created_at when sort param is null", () => {
		const items = [
			Video.fake().oneVideoWithoutMedias().withCreatedAt(new Date()).build(),
			Video.fake()
				.oneVideoWithoutMedias()
				.withCreatedAt(new Date(Date.now() + 1))
				.build(),
			Video.fake()
				.oneVideoWithoutMedias()
				.withCreatedAt(new Date(Date.now() + 2))
				.build(),
		];

		const itemsSorted = repository["applySort"](items, null, null);
		expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
	});

	it("should sort by title", () => {
		const items = [
			Video.fake().oneVideoWithoutMedias().withTitle("c").build(),
			Video.fake().oneVideoWithoutMedias().withTitle("b").build(),
			Video.fake().oneVideoWithoutMedias().withTitle("a").build(),
		];

		let itemsSorted = repository["applySort"](
			items,
			"title",
			SortDirection.ASC,
		);
		expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

		itemsSorted = repository["applySort"](items, "title", SortDirection.DESC);
		expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
	});
});
