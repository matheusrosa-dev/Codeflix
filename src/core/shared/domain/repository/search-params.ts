import { ValueObject } from "../value-object";

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export type SearchParamsConstructorProps<SearchTerm = string> = {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  searchTerm?: SearchTerm;
};

export class SearchParams<SearchTerm = string> extends ValueObject {
  protected _page: number;
  protected _per_page: number = 15;
  protected _sort: string;
  protected _sort_dir: SortDirection;
  protected _searchTerm: SearchTerm;

  constructor(props = {} as SearchParamsConstructorProps<SearchTerm>) {
    super();
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.searchTerm = props.searchTerm;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1;
    }

    this._page = _page;
  }

  get per_page() {
    return this._per_page;
  }

  private set per_page(value: number) {
    let _per_page = value === (true as any) ? this._per_page : +value;

    if (
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(_per_page as any) !== _per_page
    ) {
      _per_page = this._per_page;
    }

    this._per_page = _per_page;
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === "" ? null : `${value}`;
  }

  get sort_dir() {
    return this._sort_dir;
  }

  private set sort_dir(value: SortDirection | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }
    const dir = `${value}`.toLowerCase() as SortDirection;
    this._sort_dir =
      dir !== SortDirection.ASC && dir !== SortDirection.DESC
        ? SortDirection.ASC
        : dir;
  }

  get searchTerm(): SearchTerm {
    return this._searchTerm;
  }

  protected set searchTerm(value: SearchTerm) {
    this._searchTerm =
      value === null || value === undefined || (value as unknown) === ""
        ? null
        : (`${value}` as any);
  }
}
