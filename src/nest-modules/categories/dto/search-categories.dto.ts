import { ListCategoriesInput } from "@core/category/app/use-cases/list-categories/list-categories.use-case";
import { SortDirection } from "@core/shared/domain/repository/search-params";

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  search_term?: string;
}
