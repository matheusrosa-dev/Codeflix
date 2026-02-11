import { ISearchableRepository } from "../../shared/domain/repository/repository-interface";
import { SearchParams } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { Category, CategoryId } from "./category.aggregate";

export type CategorySearchTerm = string;

export class CategorySearchParams extends SearchParams<CategorySearchTerm> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface ICategoryRepository
	extends ISearchableRepository<
		Category,
		CategoryId,
		CategorySearchTerm,
		CategorySearchParams,
		CategorySearchResult
	> {}
