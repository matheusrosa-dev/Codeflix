import { SortDirection } from "../domain/repository/search-params";

export type SearchInput<SearchTerm = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  searchTerm?: SearchTerm | null;
};
