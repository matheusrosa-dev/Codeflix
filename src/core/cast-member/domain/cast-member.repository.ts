import { Either } from "../../shared/domain/either";
import { ISearchableRepository } from "../../shared/domain/repository/repository-interface";
import {
  SearchParams as DefaultSearchParams,
  SearchParamsConstructorProps,
} from "../../shared/domain/repository/search-params";
import { SearchResult as DefaultSearchResult } from "../../shared/domain/repository/search-result";
import { SearchValidationError } from "../../shared/domain/validators/validation.error";
import {
  CastMemberType,
  CastMemberTypes,
  InvalidCastMemberTypeError,
} from "./cast-member-type.vo";
import { CastMember, CastMemberId } from "./cast-member.aggregate";

export type CastMemberSearchTerm = {
  name?: string | null;
  type?: CastMemberType | null;
};

export class CastMemberSearchParams extends DefaultSearchParams<CastMemberSearchTerm> {
  private constructor(
    props: SearchParamsConstructorProps<CastMemberSearchTerm> = {},
  ) {
    super(props);
  }

  static create(
    props: Omit<
      SearchParamsConstructorProps<CastMemberSearchTerm>,
      "searchTerm"
    > & {
      searchTerm?: {
        name?: string | null;
        type?: CastMemberTypes | null;
      };
    } = {},
  ) {
    const [type, errorCastMemberType] = Either.of(props.searchTerm?.type)
      .map((type) => type || null)
      .chain<CastMemberType | null, InvalidCastMemberTypeError>((type) =>
        type ? CastMemberType.create(type) : Either.of(null),
      )
      .asArray();

    if (errorCastMemberType) {
      const error = new SearchValidationError([
        { type: [errorCastMemberType.message] },
      ]);
      throw error;
    }

    return new CastMemberSearchParams({
      ...props,
      searchTerm: {
        name: props.searchTerm?.name,
        type: type,
      },
    });
  }

  get searchTerm(): CastMemberSearchTerm | null {
    return this._searchTerm;
  }

  protected set searchTerm(value: CastMemberSearchTerm | null) {
    const _value =
      !value || (value as unknown) === "" || typeof value !== "object"
        ? null
        : value;

    const searchTerm = {
      ...(_value?.name && { name: `${_value.name}` }),
      ...(_value?.type && { type: _value.type }),
    };

    this._searchTerm = Object.keys(searchTerm).length === 0 ? null : searchTerm;
  }
}

export class CastMemberSearchResult extends DefaultSearchResult<CastMember> {}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberSearchTerm,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
