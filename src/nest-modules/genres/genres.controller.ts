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
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { SearchGenreDto } from "./dto/search-genres.dto";
import { GenreCollectionPresenter, GenrePresenter } from "./genres.presenter";
import { CreateGenreUseCase } from "../../core/genre/app/use-cases/create-genre/create-genre.use-case";
import { UpdateGenreUseCase } from "../../core/genre/app/use-cases/update-genre/update-genre.use-case";
import { DeleteGenreUseCase } from "../../core/genre/app/use-cases/delete-genre/delete-genre.use-case";
import { GetGenreUseCase } from "../../core/genre/app/use-cases/get-genre/get-genre.use-case";
import { ListGenresUseCase } from "../../core/genre/app/use-cases/list-genres/list-genres.use-case";
import { UpdateGenreInput } from "../../core/genre/app/use-cases/update-genre/update-genre.input";
import { GenreOutput } from "../../core/genre/app/use-cases/common/genre-output";

@Controller("genres")
export class GenresController {
	@Inject(CreateGenreUseCase)
	private createUseCase: CreateGenreUseCase;

	@Inject(UpdateGenreUseCase)
	private updateUseCase: UpdateGenreUseCase;

	@Inject(DeleteGenreUseCase)
	private deleteUseCase: DeleteGenreUseCase;

	@Inject(GetGenreUseCase)
	private getUseCase: GetGenreUseCase;

	@Inject(ListGenresUseCase)
	private listUseCase: ListGenresUseCase;

	@Post()
	async create(@Body() createGenreDto: CreateGenreDto) {
		const output = await this.createUseCase.execute(createGenreDto);
		return GenresController.serialize(output);
	}

	@Get()
	async search(@Query() searchParams: SearchGenreDto) {
		const searchTermName = searchParams["searchTerm[name]"] as string;
		const searchTermCategoriesId: string[] = Object.keys(searchParams).reduce(
			(acc: string[], key) => {
				const isKeyValid = key.includes("searchTerm[categories_id]");

				if (isKeyValid) {
					return [...acc, searchParams[key]];
				}

				return acc;
			},
			[],
		);

		const searchTerm =
			searchTermName || searchTermCategoriesId.length
				? { name: searchTermName, categories_id: searchTermCategoriesId }
				: undefined;

		const output = await this.listUseCase.execute({
			...searchParams,
			searchTerm: searchParams?.searchTerm || searchTerm,
		});
		return new GenreCollectionPresenter(output);
	}

	@Get(":id")
	async findOne(
		@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
	) {
		const output = await this.getUseCase.execute({ id });
		return GenresController.serialize(output);
	}

	@Patch(":id")
	async update(
		@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
		@Body() updateGenreDto: UpdateGenreDto,
	) {
		const input = new UpdateGenreInput({ id, ...updateGenreDto });
		const output = await this.updateUseCase.execute(input);
		return GenresController.serialize(output);
	}

	@HttpCode(204)
	@Delete(":id")
	remove(
		@Param("id", new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
	) {
		return this.deleteUseCase.execute({ id });
	}

	static serialize(output: GenreOutput) {
		return new GenrePresenter(output);
	}
}
