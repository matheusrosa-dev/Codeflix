import { ListCastMembersUseCase } from "../list-cast-members.use-case";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { CastMember } from "../../../../domain/cast-member.aggregate";
import { CastMemberOutputMapper } from "../../common/cast-member-output";
import {
  CastMemberModel,
  CastMemberSequelizeRepository,
} from "../../../../infra/db/sequelize/cast-member-sequelize";
import { CastMemberTypes } from "../../../../domain/cast-member-type.vo";
import { SortDirection } from "@core/shared/domain/repository/search-params";

describe("ListCastMembersUseCase Integration Tests", () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new ListCastMembersUseCase(repository);
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    const castMembers = CastMember.fake()
      .manyCastMembers(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(castMembers);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...castMembers].reverse().map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
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

    test.each(arrange)(
      "when value is $search_params",
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      },
    );
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

    test.each(arrange)(
      "when value is $search_params",
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      },
    );
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
    await repository.bulkInsert(castMembers);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      searchTerm: { name: "TEST", type: CastMemberTypes.ACTOR },
    });
    expect(output).toEqual({
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
    expect(output).toEqual({
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
    expect(output).toEqual({
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
    expect(output).toEqual({
      items: [castMembers[3]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });
});
