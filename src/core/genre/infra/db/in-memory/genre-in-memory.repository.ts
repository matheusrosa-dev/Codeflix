import { Genre, GenreId } from "../../../domain/genre.aggregate";
import {
	IGenreRepository,
	GenreSearchTerm,
} from "../../../domain/genre.repository";
import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";

export class GenreInMemoryRepository
	extends InMemorySearchableRepository<Genre, GenreId, GenreSearchTerm>
	implements IGenreRepository
{
	sortableFields: string[] = ["name", "created_at"];

	getEntity(): new (...args: any[]) => Genre {
		return Genre;
	}

	protected async applySearchTerm(
		items: Genre[],
		searchTerm: GenreSearchTerm,
	): Promise<Genre[]> {
		if (!searchTerm) {
			return items;
		}

		return items.filter((genre) => {
			const containsName =
				searchTerm.name &&
				genre.name.toLowerCase().includes(searchTerm.name.toLowerCase());
			const containsCategoriesId = searchTerm.categories_id?.some((c) =>
				genre.categories_id.has(c.id),
			);
			return searchTerm.name && searchTerm.categories_id
				? containsName && containsCategoriesId
				: searchTerm.name
					? containsName
					: containsCategoriesId;
		});
	}

	protected applySort(
		items: Genre[],
		sort: string | null,
		sort_dir: SortDirection | null,
	): Genre[] {
		return !sort
			? super.applySort(items, "created_at", SortDirection.DESC)
			: super.applySort(items, sort, sort_dir);
	}
}
