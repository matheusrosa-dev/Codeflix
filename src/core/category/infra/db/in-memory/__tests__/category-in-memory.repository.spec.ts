import { SortDirection } from "../../../../../shared/domain/repository/search-params";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../category-in-memory.repository";

describe("CategoryInMemoryRepository", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));
  it("should no filter items when filter object is null", async () => {
    const items = [Category.fake().oneCategory().build()];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applySearchTerm"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      Category.fake().oneCategory().withName("test").build(),
      Category.fake().oneCategory().withName("TEST").build(),
      Category.fake().oneCategory().withName("fake").build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applySearchTerm"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", () => {
    const created_at = new Date();

    const items = [
      Category.fake()
        .oneCategory()
        .withName("test")
        .withCreatedAt(created_at)
        .build(),
      Category.fake()
        .oneCategory()
        .withName("TEST")
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      Category.fake()
        .oneCategory()
        .withName("fake")
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    const itemsSorted = repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", () => {
    const items = [
      Category.fake().oneCategory().withName("c").build(),
      Category.fake().oneCategory().withName("b").build(),
      Category.fake().oneCategory().withName("a").build(),
    ];

    let itemsSorted = repository["applySort"](items, "name", SortDirection.ASC);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = repository["applySort"](items, "name", SortDirection.DESC);
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
