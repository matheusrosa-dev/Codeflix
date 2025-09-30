import { SearchInput } from "../../../../shared/app/search-input";
import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { CastMemberTypes } from "../../../domain/cast-member-type.vo";
import { IsEnum, ValidateNested, validateSync } from "class-validator";

export class ListCastMembersSearchTerm {
  name?: string | null;
  @IsEnum(CastMemberTypes)
  type?: CastMemberTypes | null;
}

export class ListCastMembersInput
  implements SearchInput<ListCastMembersSearchTerm>
{
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  @ValidateNested()
  searchTerm?: ListCastMembersSearchTerm;
}

export class ValidateListCastMembersInput {
  static validate(input: ListCastMembersInput) {
    return validateSync(input);
  }
}
