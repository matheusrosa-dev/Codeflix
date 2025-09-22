import { SortDirection } from "../../../shared/domain/repository/search-params";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../domain/category.entity";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  Category,
  Uuid
> {
  sortableFields = ["name", "created_at"];

  protected async applySearchTerm(
    items: Category[],
    searchTerm: string | null
  ): Promise<Category[]> {
    if (!searchTerm) return items;

    return items.filter((i) => {
      return i.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  getEntity() {
    return Category;
  }

  protected applySort(
    items: Category[],
    sort: string,
    sort_dir: SortDirection
  ): Category[] {
    if (sort) {
      return super.applySort(items, sort, sort_dir);
    }

    return super.applySort(items, "created_at", SortDirection.DESC);
  }
}
