import { validateSync } from "class-validator";
import { CastMemberTypes } from "../../../../domain/cast-member-type.vo";
import {
	ListCastMembersSearchTerm,
	ListCastMembersInput,
} from "../list-cast-members.input";
import { SortDirection } from "@core/shared/domain/repository/search-params";

describe("ListCastMembersInput Unit Tests", () => {
	test("validate", () => {
		const input = new ListCastMembersInput();
		input.page = 1;
		input.per_page = 10;
		input.sort = "name";
		input.sort_dir = SortDirection.ASC;
		const searchTerm = new ListCastMembersSearchTerm();
		searchTerm.name = "name";
		searchTerm.type = CastMemberTypes.ACTOR;
		input.searchTerm = searchTerm;

		const errors = validateSync(input);
		expect(errors.length).toBe(0);
	});

	test("invalidate", () => {
		const input = new ListCastMembersInput();
		input.page = 1;
		input.per_page = 10;
		input.sort = "name";
		input.sort_dir = SortDirection.ASC;
		const searchTerm = new ListCastMembersSearchTerm();
		searchTerm.name = "name";
		searchTerm.type = "a" as any;
		input.searchTerm = searchTerm;

		const errors = validateSync(input);
		expect(errors.length).toBe(1);
	});
});
