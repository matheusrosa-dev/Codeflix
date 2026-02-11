import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Inject,
	ParseUUIDPipe,
	HttpCode,
	Query,
} from "@nestjs/common";
import { SearchCastMemberDto } from "./dto/search-cast-members.dto";
import {
	CastMemberCollectionPresenter,
	CastMemberPresenter,
} from "./cast-members.presenter";
import { CreateCastMemberUseCase } from "@core/cast-member/app/use-cases/create-cast-member/create-cast-member.use-case";
import { UpdateCastMemberUseCase } from "@core/cast-member/app/use-cases/update-cast-member/update-cast-member.use-case";
import { DeleteCastMemberUseCase } from "@core/cast-member/app/use-cases/delete-cast-member/delete-cast-member.use-case";
import { GetCastMemberUseCase } from "@core/cast-member/app/use-cases/get-cast-member/get-cast-member.use-case";
import { ListCastMembersUseCase } from "@core/cast-member/app/use-cases/list-cast-members/list-cast-members.use-case";
import { CreateCastMemberDto } from "./dto/create-cast-member.dto";
import { UpdateCastMemberDto } from "./dto/update-cast-member.dto";
import { UpdateCastMemberInput } from "@core/cast-member/app/use-cases/update-cast-member/update-cast-member.input";
import { CastMemberOutput } from "@core/cast-member/app/use-cases/common/cast-member-output";
import { CastMemberTypes } from "@core/cast-member/domain/cast-member-type.vo";

@Controller("cast-members")
export class CastMembersController {
	@Inject(CreateCastMemberUseCase)
	private createUseCase: CreateCastMemberUseCase;

	@Inject(UpdateCastMemberUseCase)
	private updateUseCase: UpdateCastMemberUseCase;

	@Inject(DeleteCastMemberUseCase)
	private deleteUseCase: DeleteCastMemberUseCase;

	@Inject(GetCastMemberUseCase)
	private getUseCase: GetCastMemberUseCase;

	@Inject(ListCastMembersUseCase)
	private listUseCase: ListCastMembersUseCase;

	@Post()
	async create(@Body() createCastMemberDto: CreateCastMemberDto) {
		const output = await this.createUseCase.execute(createCastMemberDto);
		return CastMembersController.serialize(output);
	}

	@Get()
	async search(@Query() searchParams: SearchCastMemberDto) {
		const searchTermName = searchParams["searchTerm[name]"] as string;
		const searchTermType = searchParams["searchTerm[type]"] as CastMemberTypes;

		const searchTerm =
			searchTermName || searchTermType
				? { name: searchTermName, type: searchTermType }
				: undefined;

		const output = await this.listUseCase.execute({
			...searchParams,
			searchTerm: searchParams?.searchTerm || searchTerm,
		});
		return new CastMemberCollectionPresenter(output);
	}

	@Get(":id")
	async findOne(
		@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
	) {
		const output = await this.getUseCase.execute({ id });
		return CastMembersController.serialize(output);
	}

	@Patch(":id")
	async update(
		@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
		@Body() updateCastMemberDto: UpdateCastMemberDto,
	) {
		const input = new UpdateCastMemberInput({ id, ...updateCastMemberDto });
		const output = await this.updateUseCase.execute(input);
		return CastMembersController.serialize(output);
	}

	@HttpCode(204)
	@Delete(":id")
	remove(
		@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
	) {
		return this.deleteUseCase.execute({ id });
	}

	static serialize(output: CastMemberOutput) {
		return new CastMemberPresenter(output);
	}
}
