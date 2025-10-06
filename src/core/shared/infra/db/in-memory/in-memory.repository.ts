import { InvalidArgumentError } from "@core/shared/domain/errors/invalid-argument.error";
import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import {
  IRepository,
  ISearchableRepository,
} from "../../../domain/repository/repository-interface";
import {
  SearchParams,
  SortDirection,
} from "../../../domain/repository/search-params";
import { SearchResult } from "../../../domain/repository/search-result";
import { ValueObject } from "../../../domain/value-object";

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
> implements IRepository<E, EntityId>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id),
    );

    if (index === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }

    this.items[index] = entity;
  }

  async delete(entity_id: EntityId): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id),
    );

    if (index === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }

    this.items.splice(index, 1);
  }

  async findById(entity_id: EntityId): Promise<E | null> {
    const item = this.items.find((item) => item.entity_id.equals(entity_id));

    if (!item) return null;

    return item;
  }

  async findByIds(ids: EntityId[]): Promise<E[]> {
    //avoid to return repeated items
    return this.items.filter((entity) => {
      return ids.some((id) => entity.entity_id.equals(id));
    });
  }

  async existsById(
    ids: EntityId[],
  ): Promise<{ exists: EntityId[]; not_exists: EntityId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        "ids must be an array with at least one element",
      );
    }

    if (this.items.length === 0) {
      return {
        exists: [],
        not_exists: ids,
      };
    }

    const existsId = new Set<EntityId>();
    const notExistsId = new Set<EntityId>();
    ids.forEach((id) => {
      const item = this.items.find((entity) => entity.entity_id.equals(id));

      if (item) {
        existsId.add(id);
      } else {
        notExistsId.add(id);
      }
    });
    return {
      exists: Array.from(existsId.values()),
      not_exists: Array.from(notExistsId.values()),
    };
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    SearchTerm = string,
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, SearchTerm>
{
  sortableFields: string[] = [];

  async search(props: SearchParams<SearchTerm>): Promise<SearchResult<E>> {
    const filteredItems = await this.applySearchTerm(
      this.items,
      props.searchTerm,
    );

    const sortedItems = this.applySort(
      filteredItems,
      props.sort,
      props.sort_dir,
    );

    const paginatedItems = this.applyPagination(
      sortedItems,
      props.page,
      props.per_page,
    );

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applySearchTerm(
    items: E[],
    searchTerm: SearchTerm | null,
  ): Promise<E[]>;

  protected applyPagination(items: E[], page: number, per_page: number) {
    const start = (page - 1) * per_page;
    const end = page * per_page;

    return items.slice(start, end);
  }

  protected applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      const aValue = custom_getter
        ? custom_getter(sort, a)
        : a[sort as keyof typeof a];

      const bValue = custom_getter
        ? custom_getter(sort, b)
        : b[sort as keyof typeof b];

      if (aValue < bValue) {
        return sort_dir === SortDirection.ASC ? -1 : 1;
      }

      if (aValue > bValue) {
        return sort_dir === SortDirection.ASC ? 1 : -1;
      }

      return 0;
    });
  }
}
