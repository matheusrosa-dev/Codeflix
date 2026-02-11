import { SearchInput } from "../../../../shared/app/search-input";
import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { IsArray, IsUUID, ValidateNested, validateSync } from "class-validator";

export class ListGenresSearchTerm {
	name?: string;
	@IsUUID("4", { each: true })
	@IsArray()
	categories_id?: string[];
}

export class ListGenresInput implements SearchInput<ListGenresSearchTerm> {
	page?: number;
	per_page?: number;
	sort?: string;
	sort_dir?: SortDirection;
	@ValidateNested()
	searchTerm?: ListGenresSearchTerm;
}

export class ValidateListGenresInput {
	static validate(input: ListGenresInput) {
		return validateSync(input);
	}
}
