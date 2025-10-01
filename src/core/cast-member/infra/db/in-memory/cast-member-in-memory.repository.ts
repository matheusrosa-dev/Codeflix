import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { SortDirection } from "../../../../shared/domain/repository/search-params";
import {
  CastMember,
  CastMemberId,
} from "../../../domain/cast-member.aggregate";
import {
  ICastMemberRepository,
  CastMemberSearchTerm,
} from "../../../domain/cast-member.repository";

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberSearchTerm
  >
  implements ICastMemberRepository
{
  sortableFields: string[] = ["name", "created_at"];

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }

  protected async applySearchTerm(
    items: CastMember[],
    searchTerm: CastMemberSearchTerm | null,
  ): Promise<CastMember[]> {
    if (!searchTerm) {
      return items;
    }

    return items.filter((i) => {
      const containsName =
        searchTerm.name &&
        i.name.toLowerCase().includes(searchTerm.name.toLowerCase());
      const hasType = searchTerm.type && i.type.equals(searchTerm.type);
      return searchTerm.name && searchTerm.type
        ? containsName && hasType
        : searchTerm.name
          ? containsName
          : hasType;
    });
  }

  protected applySort(
    items: CastMember[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): CastMember[] {
    return !sort
      ? super.applySort(items, "created_at", SortDirection.DESC)
      : super.applySort(items, sort, sort_dir);
  }
}
