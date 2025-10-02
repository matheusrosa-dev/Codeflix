import { SortDirection } from "@core/shared/domain/repository/search-params";
import { CategoryId } from "../../../../../category/domain/category.aggregate";
import { Genre } from "../../../../domain/genre.aggregate";
import { GenreInMemoryRepository } from "../genre-in-memory.repository";

describe("GenreInMemoryRepository", () => {
  let repository: GenreInMemoryRepository;

  beforeEach(() => (repository = new GenreInMemoryRepository()));
  it("should no filter items when filter object is null", async () => {
    const items = [
      Genre.fake().oneGenre().build(),
      Genre.fake().oneGenre().build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applySearchTerm"](items, null!);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items by name", async () => {
    const faker = Genre.fake().oneGenre();
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

  it("should filter items by categories_id", async () => {
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const categoryId3 = new CategoryId();
    const categoryId4 = new CategoryId();
    const items = [
      Genre.fake()
        .oneGenre()
        .addCategoryId(categoryId1)
        .addCategoryId(categoryId2)
        .build(),
      Genre.fake()
        .oneGenre()
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

  it("should filter items by name and categories_id", async () => {
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const categoryId3 = new CategoryId();
    const categoryId4 = new CategoryId();
    const items = [
      Genre.fake()
        .oneGenre()
        .withName("test")
        .addCategoryId(categoryId1)
        .addCategoryId(categoryId2)
        .build(),
      Genre.fake()
        .oneGenre()
        .withName("fake")
        .addCategoryId(categoryId3)
        .addCategoryId(categoryId4)
        .build(),
      Genre.fake()
        .oneGenre()
        .withName("test fake")
        .addCategoryId(categoryId1)
        .build(),
    ];

    let itemsFiltered = await repository["applySearchTerm"](items, {
      name: "test",
      categories_id: [categoryId1],
    });
    expect(itemsFiltered).toStrictEqual([items[0], items[2]]);

    itemsFiltered = await repository["applySearchTerm"](items, {
      name: "test",
      categories_id: [categoryId3],
    });
    expect(itemsFiltered).toStrictEqual([]);

    itemsFiltered = await repository["applySearchTerm"](items, {
      name: "fake",
      categories_id: [categoryId4],
    });
    expect(itemsFiltered).toStrictEqual([items[1]]);
  });

  it("should sort by created_at when sort param is null", () => {
    const items = [
      Genre.fake().oneGenre().withCreatedAt(new Date()).build(),
      Genre.fake()
        .oneGenre()
        .withCreatedAt(new Date(new Date().getTime() + 1))
        .build(),
      Genre.fake()
        .oneGenre()
        .withCreatedAt(new Date(new Date().getTime() + 2))
        .build(),
    ];

    const itemsSorted = repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", () => {
    const items = [
      Genre.fake().oneGenre().withName("c").build(),
      Genre.fake().oneGenre().withName("b").build(),
      Genre.fake().oneGenre().withName("a").build(),
    ];

    let itemsSorted = repository["applySort"](items, "name", SortDirection.ASC);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = repository["applySort"](items, "name", SortDirection.DESC);
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
