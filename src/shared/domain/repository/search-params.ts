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
  protected _sort: string | null;
  protected _sort_dir: SortDirection;
  protected _searchTerm: SearchTerm | null;

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
    const isValid = this.validatePage(value);

    if (!isValid) {
      this._page = 1;
      return;
    }

    this._page = parseInt(value as any);
  }

  get per_page() {
    return this._per_page;
  }

  private set per_page(value: number) {
    const isValid = this.validatePage(value);

    if (!isValid) return;

    this._per_page = value;
  }

  get sort() {
    return this._sort;
  }

  private set sort(value: string) {
    if (value === null || value === undefined || value === "") {
      this._sort = null;
      return;
    }

    this._sort = `${value}`;
  }

  get sort_dir() {
    return this._sort_dir;
  }

  private set sort_dir(value: SortDirection) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }

    if (!Object.values(SortDirection).includes(value)) {
      this._sort_dir = SortDirection.ASC;
      return;
    }

    this._sort_dir = value;
  }

  get searchTerm(): SearchTerm {
    return this._searchTerm;
  }

  protected set searchTerm(value: SearchTerm) {
    if (value === null || value === undefined || value === "") {
      this._searchTerm = null;
      return;
    }

    this._searchTerm = `${value}` as SearchTerm;
  }

  private validatePage(page: number) {
    const isValid = !Number.isNaN(page) && page > 0 && Number.isInteger(page);

    return isValid;
  }
}
