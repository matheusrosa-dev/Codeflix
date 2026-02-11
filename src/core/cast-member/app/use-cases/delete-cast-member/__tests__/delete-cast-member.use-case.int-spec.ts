import { DeleteCastMemberUseCase } from "../delete-cast-member.use-case";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
	CastMember,
	CastMemberId,
} from "../../../../domain/cast-member.aggregate";
import { CastMemberSequelizeRepository } from "../../../../infra/db/sequelize/cast-member-sequelize.repository";
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model";

describe("DeleteCastMemberUseCase Integration Tests", () => {
	let useCase: DeleteCastMemberUseCase;
	let repository: CastMemberSequelizeRepository;

	setupSequelize({ models: [CastMemberModel] });

	beforeEach(() => {
		repository = new CastMemberSequelizeRepository(CastMemberModel);
		useCase = new DeleteCastMemberUseCase(repository);
	});

	it("should throws error when entity not found", async () => {
		const castMemberId = new CastMemberId();
		await expect(() =>
			useCase.execute({ id: castMemberId.id }),
		).rejects.toThrow(new NotFoundError(castMemberId.id, CastMember));
	});

	it("should delete a cast member", async () => {
		const castMember = CastMember.fake().oneActor().build();
		await repository.insert(castMember);
		await useCase.execute({
			id: castMember.cast_member_id.id,
		});
		const noHasModel = await CastMemberModel.findByPk(
			castMember.cast_member_id.id,
		);
		expect(noHasModel).toBeNull();
	});
});
