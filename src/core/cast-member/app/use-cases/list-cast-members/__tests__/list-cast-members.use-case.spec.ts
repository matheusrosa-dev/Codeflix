import { SortDirection } from "../../../../../shared/domain/repository/search-params";
import { CastMemberTypes } from "../../../../domain/cast-member-type.vo";
import { CastMember } from "../../../../domain/cast-member.aggregate";
import { CastMemberSearchResult } from "../../../../domain/cast-member.repository";
import { CastMemberInMemoryRepository } from "../../../../infra/db/in-memory/cast-member-in-memory.repository";
import { CastMemberOutputMapper } from "../../common/cast-member-output";
import { ListCastMembersUseCase } from "../list-cast-members.use-case";

describe("ListCastMembersUseCase Unit Tests", () => {
	let useCase: ListCastMembersUseCase;
	let repository: CastMemberInMemoryRepository;

	beforeEach(() => {
		repository = new CastMemberInMemoryRepository();
		useCase = new ListCastMembersUseCase(repository);
	});

	test("toOutput method", () => {
		let result = new CastMemberSearchResult({
			items: [],
			total: 1,
			current_page: 1,
			per_page: 2,
		});
		let output = useCase["toOutput"](result);
		expect(output).toStrictEqual({
			items: [],
			total: 1,
			current_page: 1,
			per_page: 2,
			last_page: 1,
		});

		const entity = CastMember.fake().oneActor().build();
		result = new CastMemberSearchResult({
			items: [entity],
			total: 1,
			current_page: 1,
			per_page: 2,
		});

		output = useCase["toOutput"](result);
		expect(output).toStrictEqual({
			items: [entity].map(CastMemberOutputMapper.toOutput),
			total: 1,
			current_page: 1,
			per_page: 2,
			last_page: 1,
		});
	});

	it("should search sorted by created_at when input param is empty", async () => {
		const items = [
			CastMember.fake().oneActor().build(),
			CastMember.fake()
				.oneActor()
				.withCreatedAt(new Date(Date.now() + 100))
				.build(),
		];
		repository.items = items;

		const output = await useCase.execute({});
		expect(output).toStrictEqual({
			items: [...items].reverse().map(CastMemberOutputMapper.toOutput),
			total: 2,
			current_page: 1,
			per_page: 15,
			last_page: 1,
		});
	});

	it("should search applying paginate and filter by name", async () => {
		const created_at = new Date();
		const castMembers = [
			CastMember.fake()
				.oneActor()
				.withName("test")
				.withCreatedAt(created_at)
				.build(),
			CastMember.fake()
				.oneActor()
				.withName("a")
				.withCreatedAt(created_at)
				.build(),
			CastMember.fake()
				.oneActor()
				.withName("TEST")
				.withCreatedAt(created_at)
				.build(),
			CastMember.fake()
				.oneActor()
				.withName("TeSt")
				.withCreatedAt(created_at)
				.build(),
		];
		await repository.bulkInsert(castMembers);

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			searchTerm: { name: "TEST" },
		});
		expect(output).toStrictEqual({
			items: [castMembers[0], castMembers[2]].map(
				CastMemberOutputMapper.toOutput,
			),
			total: 3,
			current_page: 1,
			per_page: 2,
			last_page: 2,
		});

		output = await useCase.execute({
			page: 2,
			per_page: 2,
			searchTerm: { name: "TEST" },
		});
		expect(output).toStrictEqual({
			items: [castMembers[3]].map(CastMemberOutputMapper.toOutput),
			total: 3,
			current_page: 2,
			per_page: 2,
			last_page: 2,
		});
	});

	it("should search applying paginate and searchTerm by type", async () => {
		const created_at = new Date();
		const castMembers = [
			CastMember.fake()
				.oneActor()
				.withName("actor1")
				.withCreatedAt(created_at)
				.build(),
			CastMember.fake()
				.oneActor()
				.withName("actor2")
				.withCreatedAt(created_at)
				.build(),
			CastMember.fake()
				.oneActor()
				.withName("actor3")
				.withCreatedAt(created_at)
				.build(),
			CastMember.fake()
				.oneDirector()
				.withName("director1")
				.withCreatedAt(created_at)
				.build(),
			CastMember.fake()
				.oneDirector()
				.withName("director2")
				.withCreatedAt(created_at)
				.build(),
			CastMember.fake()
				.oneDirector()
				.withName("director3")
				.withCreatedAt(created_at)
				.build(),
		];
		await repository.bulkInsert(castMembers);

		const arrange = [
			{
				input: {
					page: 1,
					per_page: 2,
					searchTerm: { type: CastMemberTypes.ACTOR },
				},
				output: {
					items: [castMembers[0], castMembers[1]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 3,
					current_page: 1,
					per_page: 2,
					last_page: 2,
				},
			},
			{
				input: {
					page: 2,
					per_page: 2,
					searchTerm: { type: CastMemberTypes.ACTOR },
				},
				output: {
					items: [castMembers[2]].map(CastMemberOutputMapper.toOutput),
					total: 3,
					current_page: 2,
					per_page: 2,
					last_page: 2,
				},
			},
			{
				input: {
					page: 1,
					per_page: 2,
					searchTerm: { type: CastMemberTypes.DIRECTOR },
				},
				output: {
					items: [castMembers[3], castMembers[4]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 3,
					current_page: 1,
					per_page: 2,
					last_page: 2,
				},
			},
		];

		for (const item of arrange) {
			const output = await useCase.execute(item.input);
			expect(output).toStrictEqual(item.output);
		}
	});

	it("should search applying paginate and sort", async () => {
		expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

		const castMembers = [
			CastMember.fake().oneActor().withName("b").build(),
			CastMember.fake().oneActor().withName("a").build(),
			CastMember.fake().oneActor().withName("d").build(),
			CastMember.fake().oneActor().withName("e").build(),
			CastMember.fake().oneActor().withName("c").build(),
		];
		await repository.bulkInsert(castMembers);

		const arrange = [
			{
				input: {
					page: 1,
					per_page: 2,
					sort: "name",
				},
				output: {
					items: [castMembers[1], castMembers[0]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 5,
					current_page: 1,
					per_page: 2,
					last_page: 3,
				},
			},
			{
				input: {
					page: 2,
					per_page: 2,
					sort: "name",
				},
				output: {
					items: [castMembers[4], castMembers[2]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 5,
					current_page: 2,
					per_page: 2,
					last_page: 3,
				},
			},
			{
				input: {
					page: 1,
					per_page: 2,
					sort: "name",
					sort_dir: SortDirection.DESC,
				},
				output: {
					items: [castMembers[3], castMembers[2]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 5,
					current_page: 1,
					per_page: 2,
					last_page: 3,
				},
			},
			{
				input: {
					page: 2,
					per_page: 2,
					sort: "name",
					sort_dir: SortDirection.DESC,
				},
				output: {
					items: [castMembers[4], castMembers[0]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 5,
					current_page: 2,
					per_page: 2,
					last_page: 3,
				},
			},
		];

		for (const item of arrange) {
			const output = await useCase.execute(item.input);
			expect(output).toStrictEqual(item.output);
		}
	});

	describe("should search applying searchTerm by name, sort and paginate", () => {
		const castMembers = [
			CastMember.fake().oneActor().withName("test").build(),
			CastMember.fake().oneActor().withName("a").build(),
			CastMember.fake().oneActor().withName("TEST").build(),
			CastMember.fake().oneActor().withName("e").build(),
			CastMember.fake().oneDirector().withName("TeSt").build(),
		];

		const arrange = [
			{
				input: {
					page: 1,
					per_page: 2,
					sort: "name",
					searchTerm: { name: "TEST" },
				},
				output: {
					items: [castMembers[2], castMembers[4]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 3,
					current_page: 1,
					per_page: 2,
					last_page: 2,
				},
			},
			{
				input: {
					page: 2,
					per_page: 2,
					sort: "name",
					searchTerm: { name: "TEST" },
				},
				output: {
					items: [castMembers[0]].map(CastMemberOutputMapper.toOutput),
					total: 3,
					current_page: 2,
					per_page: 2,
					last_page: 2,
				},
			},
		];

		beforeEach(async () => {
			await repository.bulkInsert(castMembers);
		});

		test.each(arrange)("when value is $search_params", async ({
			input,
			output: expectedOutput,
		}) => {
			const output = await useCase.execute(input);
			expect(output).toStrictEqual(expectedOutput);
		});
	});

	describe("should search applying searchTerm by type, sort and paginate", () => {
		const castMembers = [
			CastMember.fake().oneActor().withName("test").build(),
			CastMember.fake().oneDirector().withName("a").build(),
			CastMember.fake().oneActor().withName("TEST").build(),
			CastMember.fake().oneDirector().withName("e").build(),
			CastMember.fake().oneActor().withName("TeSt").build(),
			CastMember.fake().oneDirector().withName("b").build(),
		];

		const arrange = [
			{
				input: {
					page: 1,
					per_page: 2,
					sort: "name",
					searchTerm: { type: CastMemberTypes.ACTOR },
				},
				output: {
					items: [castMembers[2], castMembers[4]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 3,
					current_page: 1,
					per_page: 2,
					last_page: 2,
				},
			},
			{
				input: {
					page: 2,
					per_page: 2,
					sort: "name",
					searchTerm: { type: CastMemberTypes.ACTOR },
				},
				output: {
					items: [castMembers[0]].map(CastMemberOutputMapper.toOutput),
					total: 3,
					current_page: 2,
					per_page: 2,
					last_page: 2,
				},
			},
			{
				input: {
					page: 1,
					per_page: 2,
					sort: "name",
					searchTerm: { type: CastMemberTypes.DIRECTOR },
				},
				output: {
					items: [castMembers[1], castMembers[5]].map(
						CastMemberOutputMapper.toOutput,
					),
					total: 3,
					current_page: 1,
					per_page: 2,
					last_page: 2,
				},
			},
			{
				input: {
					page: 2,
					per_page: 2,
					sort: "name",
					searchTerm: { type: CastMemberTypes.DIRECTOR },
				},
				output: {
					items: [castMembers[3]].map(CastMemberOutputMapper.toOutput),
					total: 3,
					current_page: 2,
					per_page: 2,
					last_page: 2,
				},
			},
		];

		beforeEach(async () => {
			await repository.bulkInsert(castMembers);
		});

		test.each(arrange)("when value is $search_params", async ({
			input,
			output: expectedOutput,
		}) => {
			const output = await useCase.execute(input);
			expect(output).toStrictEqual(expectedOutput);
		});
	});

	it("should search using searchTerm by name and type, sort and paginate", async () => {
		const castMembers = [
			CastMember.fake().oneActor().withName("test").build(),
			CastMember.fake().oneDirector().withName("a director").build(),
			CastMember.fake().oneActor().withName("TEST").build(),
			CastMember.fake().oneDirector().withName("e director").build(),
			CastMember.fake().oneActor().withName("TeSt").build(),
			CastMember.fake().oneDirector().withName("b director").build(),
		];
		repository.items = castMembers;

		let output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: "name",
			searchTerm: { name: "TEST", type: CastMemberTypes.ACTOR },
		});
		expect(output).toStrictEqual({
			items: [castMembers[2], castMembers[4]].map(
				CastMemberOutputMapper.toOutput,
			),
			total: 3,
			current_page: 1,
			per_page: 2,
			last_page: 2,
		});

		output = await useCase.execute({
			page: 2,
			per_page: 2,
			sort: "name",
			searchTerm: { name: "TEST", type: CastMemberTypes.ACTOR },
		});
		expect(output).toStrictEqual({
			items: [castMembers[0]].map(CastMemberOutputMapper.toOutput),
			total: 3,
			current_page: 2,
			per_page: 2,
			last_page: 2,
		});

		output = await useCase.execute({
			page: 1,
			per_page: 2,
			sort: "name",
			sort_dir: SortDirection.ASC,
			searchTerm: { name: "director", type: CastMemberTypes.DIRECTOR },
		});
		expect(output).toStrictEqual({
			items: [castMembers[1], castMembers[5]].map(
				CastMemberOutputMapper.toOutput,
			),
			total: 3,
			current_page: 1,
			per_page: 2,
			last_page: 2,
		});

		output = await useCase.execute({
			page: 2,
			per_page: 2,
			sort: "name",
			sort_dir: SortDirection.ASC,
			searchTerm: { name: "director", type: CastMemberTypes.DIRECTOR },
		});
		expect(output).toStrictEqual({
			items: [castMembers[3]].map(CastMemberOutputMapper.toOutput),
			total: 3,
			current_page: 2,
			per_page: 2,
			last_page: 2,
		});
	});
});
