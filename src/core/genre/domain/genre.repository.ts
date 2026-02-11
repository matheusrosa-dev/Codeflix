import { CategoryId } from "../../category/domain/category.aggregate";
import { ISearchableRepository } from "../../shared/domain/repository/repository-interface";
import {
	SearchParams,
	SearchParamsConstructorProps,
} from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { Genre, GenreId } from "./genre.aggregate";

export type GenreSearchTerm = {
	name?: string;
	categories_id?: CategoryId[];
};

export class GenreSearchParams extends SearchParams<GenreSearchTerm> {
	private constructor(
		props: SearchParamsConstructorProps<GenreSearchTerm> = {},
	) {
		super(props);
	}

	static create(
		props: Omit<SearchParamsConstructorProps<GenreSearchTerm>, "searchTerm"> & {
			searchTerm?: {
				name?: string;
				categories_id?: CategoryId[] | string[];
			};
		} = {},
	) {
		const categories_id = props.searchTerm?.categories_id?.map((c) => {
			return c instanceof CategoryId ? c : new CategoryId(c);
		});

		return new GenreSearchParams({
			...props,
			searchTerm: {
				name: props.searchTerm?.name,
				categories_id,
			},
		});
	}

	get searchTerm(): GenreSearchTerm | null {
		return this._searchTerm;
	}

	protected set searchTerm(value: GenreSearchTerm | null) {
		const _value =
			!value || (value as unknown) === "" || typeof value !== "object"
				? null
				: value;

		const searchTerm = {
			...(_value?.name && { name: `${_value.name}` }),
			...(_value?.categories_id?.length && {
				categories_id: _value.categories_id,
			}),
		};

		this._searchTerm = Object.keys(searchTerm).length === 0 ? null : searchTerm;
	}
}

export class GenreSearchResult extends SearchResult<Genre> {}

export interface IGenreRepository
	extends ISearchableRepository<
		Genre,
		GenreId,
		GenreSearchTerm,
		GenreSearchParams,
		GenreSearchResult
	> {}
