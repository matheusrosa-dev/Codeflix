import { CastMemberId } from "../../cast-member/domain/cast-member.aggregate";
import { CategoryId } from "../../category/domain/category.aggregate";
import { GenreId } from "../../genre/domain/genre.aggregate";
import { ISearchableRepository } from "../../shared/domain/repository/repository-interface";
import {
	SearchParams,
	SearchParamsConstructorProps,
} from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { Video, VideoId } from "./video.aggregate";

export type VideoSearchTerm = {
	title?: string;
	categories_id?: CategoryId[];
	genres_id?: GenreId[];
	cast_members_id?: CastMemberId[];
};

export class VideoSearchParams extends SearchParams<VideoSearchTerm> {
	private constructor(
		props: SearchParamsConstructorProps<VideoSearchTerm> = {},
	) {
		super(props);
	}

	static create(
		props: Omit<SearchParamsConstructorProps<VideoSearchTerm>, "searchTerm"> & {
			searchTerm?: {
				title?: string;
				categories_id?: CategoryId[] | string[];
				genres_id?: GenreId[] | string[];
				cast_members_id?: CastMemberId[] | string[];
			};
		} = {},
	) {
		const categories_id = props.searchTerm?.categories_id?.map((c) =>
			c instanceof CategoryId ? c : new CategoryId(c),
		);
		const genres_id = props.searchTerm?.genres_id?.map((c) =>
			c instanceof GenreId ? c : new GenreId(c),
		);
		const cast_members_id = props.searchTerm?.cast_members_id?.map((c) =>
			c instanceof CastMemberId ? c : new CastMemberId(c),
		);

		return new VideoSearchParams({
			...props,
			searchTerm: {
				title: props.searchTerm?.title,
				categories_id,
				genres_id,
				cast_members_id,
			},
		});
	}

	get searchTerm(): VideoSearchTerm | null {
		return this._searchTerm;
	}

	protected set searchTerm(value: VideoSearchTerm | null) {
		const _value =
			!value || (value as unknown) === "" || typeof value !== "object"
				? null
				: value;

		const searchTerm = {
			...(_value?.title && { title: `${_value?.title}` }),
			...(_value?.categories_id?.length && {
				categories_id: _value.categories_id,
			}),
			...(_value?.genres_id?.length && {
				genres_id: _value.genres_id,
			}),
			...(_value?.cast_members_id?.length && {
				cast_members_id: _value.cast_members_id,
			}),
		};

		this._searchTerm = Object.keys(searchTerm).length === 0 ? null : searchTerm;
	}
}

export class VideoSearchResult extends SearchResult<Video> {}

export interface IVideoRepository
	extends ISearchableRepository<
		Video,
		VideoId,
		VideoSearchTerm,
		VideoSearchParams,
		VideoSearchResult
	> {}
