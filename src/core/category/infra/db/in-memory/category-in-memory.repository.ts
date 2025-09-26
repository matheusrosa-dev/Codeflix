import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../../domain/category.entity";
import {
  CategorySearchTerm,
  ICategoryRepository,
} from "../../../domain/category.repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid>
  implements ICategoryRepository
{
  sortableFields = ["name", "created_at"];

  protected async applySearchTerm(
    items: Category[],
    searchTerm: CategorySearchTerm,
  ): Promise<Category[]> {
    if (!searchTerm) return items;

    const foundItems: Category[] = await new Promise((resolve) => {
      const filtered = items.filter((i) => {
        return i.name.toLowerCase().includes(searchTerm.toLowerCase());
      });

      resolve(filtered);
    });

    return foundItems;
  }

  getEntity() {
    return Category;
  }

  protected applySort(
    items: Category[],
    sort: string,
    sort_dir: SortDirection,
  ): Category[] {
    if (sort) {
      return super.applySort(items, sort, sort_dir);
    }

    return super.applySort(items, "created_at", SortDirection.DESC);
  }
}
